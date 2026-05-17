"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/lib/db/deployments";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/lib/db/accounts";
import {
  getLiabilities,
  createLiability,
  updateLiability,
  deleteLiability,
} from "@/lib/db/liabilities";
import {
  getIncomeStreams,
  createIncomeStream,
  updateIncomeStream,
  deleteIncomeStream,
} from "@/lib/db/income";
import { getGoals, createGoal, updateGoal, deleteGoal } from "@/lib/db/goals";
import {
  getStrategicObjectives,
  createStrategicObjective,
  updateStrategicObjective,
  deleteStrategicObjective,
} from "@/lib/db/objectives";
import { getUserSettings, updateLiquidity } from "@/lib/db/settings";
import { getInsights, saveInsight } from "@/lib/db/insights";
import { generateKairosAIInsight, type KairosInsight } from "@/lib/ai/kairos";
import { generateSummary, type AnalyticsSummary } from "@/lib/analytics";
import type {
  Deployment,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
  StrategicObjective,
} from "@/lib/analytics/types";
import type { DeploymentAdvancedContextInput } from "@/lib/finance/deploymentContext";

export interface DashboardSnapshot {
  authenticated: boolean;
  deployments: Deployment[];
  accounts: Account[];
  liabilities: Liability[];
  incomeStreams: IncomeStream[];
  goals: FinancialGoal[];
  objectives: StrategicObjective[];
  analytics: AnalyticsSummary | null;
  liquidity: number;
  kairosInsight: KairosInsight | null;
}

export interface CreateDeploymentActionInput {
  title: string;
  amount: number;
  category: string;
  advancedContext?: DeploymentAdvancedContextInput;
  accountId?: string;
}

export interface UpdateDeploymentActionInput {
  title: string;
  amount: number;
  category: string;
  accountId?: string;
}

export interface CreateAccountActionInput {
  account_name: string;
  account_type: string;
  current_balance: number;
  institution?: string;
}

export interface CreateLiabilityActionInput {
  liability_name: string;
  liability_type: string;
  outstanding_balance: number;
  interest_rate?: number;
  minimum_payment?: number;
  due_date?: string | null;
  institution?: string;
}

export interface CreateIncomeActionInput {
  income_name: string;
  income_type: string;
  amount: number;
  cadence: string;
  is_recurring?: boolean;
  source?: string;
  start_date?: string;
  end_date?: string | null;
}

export interface CreateGoalActionInput {
  goal_name: string;
  goal_type: string;
  target_amount: number;
  current_progress?: number;
  target_date?: string | null;
  priority: string;
  status: string;
  notes?: string;
}

export interface CreateObjectiveActionInput {
  objective_name: string;
  objective_type: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string | null;
  priority_level: string;
  status: string;
  notes?: string;
}

function unauthenticatedSnapshot(): DashboardSnapshot {
  return {
    authenticated: false,
    deployments: [],
    accounts: [],
    liabilities: [],
    incomeStreams: [],
    goals: [],
    objectives: [],
    analytics: null,
    liquidity: 0,
    kairosInsight: null,
  };
}

function normalizeSavedInsight(row: Record<string, unknown>): KairosInsight {
  const metadata =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};

  return {
    type: row.type as KairosInsight["type"],
    severity: (metadata.severity as KairosInsight["severity"]) || "observation",
    category: row.category as KairosInsight["category"],
    confidence: Number(row.confidence),
    message: String(row.message || ""),
    supportingSignal: String(metadata.supporting_signal || ""),
    timestamp: String(
      metadata.timestamp || row.created_at || new Date().toISOString(),
    ),
    metadataQuality:
      metadata.metadata_quality && typeof metadata.metadata_quality === "object"
        ? (metadata.metadata_quality as KairosInsight["metadataQuality"])
        : undefined,
    related_ids: Array.isArray(metadata.related_ids)
      ? (metadata.related_ids as string[])
      : [],
    is_new_signal: false,
  };
}

async function buildDashboardSnapshot(
  options: { forceInsightEvaluation?: boolean } = {},
): Promise<DashboardSnapshot> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  const [
    deploymentsData,
    accountsData,
    liabilitiesData,
    incomeStreamsData,
    goalsData,
    objectivesData,
    settings,
  ] = await Promise.all([
    getDeployments(supabase),
    getAccounts(supabase),
    getLiabilities(supabase),
    getIncomeStreams(supabase),
    getGoals(supabase),
    getStrategicObjectives(supabase),
    getUserSettings(supabase),
  ]);

  const deployments = (deploymentsData || []) as Deployment[];
  const accounts = (accountsData || []) as Account[];
  const liabilities = (liabilitiesData || []) as Liability[];
  const incomeStreams = (incomeStreamsData || []) as IncomeStream[];
  const goals = (goalsData || []) as FinancialGoal[];
  const objectives = (objectivesData || []) as StrategicObjective[];
  const liquidity = Number(settings.total_liquidity);
  const analytics = generateSummary(
    deployments,
    liquidity,
    accounts,
    liabilities,
    incomeStreams,
    goals,
  );
  const savedInsights = await getInsights(supabase, 1);
  const previousInsight =
    savedInsights && savedInsights.length > 0
      ? normalizeSavedInsight(savedInsights[0] as Record<string, unknown>)
      : null;

  if (!options.forceInsightEvaluation && previousInsight) {
    return {
      authenticated: true,
      deployments,
      accounts,
      liabilities,
      incomeStreams,
      goals,
      objectives,
      analytics,
      liquidity,
      kairosInsight: previousInsight,
    };
  }

  const kairosInsight = await generateKairosAIInsight(
    deployments,
    liquidity,
    previousInsight,
  );

  if (kairosInsight.is_new_signal) {
    await saveInsight(supabase, kairosInsight, user.id);
  }

  return {
    authenticated: true,
    deployments,
    accounts,
    liabilities,
    incomeStreams,
    goals,
    objectives,
    analytics,
    liquidity,
    kairosInsight,
  };
}

export async function getDashboardSnapshotAction() {
  return buildDashboardSnapshot();
}

export async function createDeploymentAction(
  input: CreateDeploymentActionInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createDeployment(
      supabase,
      input.title,
      input.amount,
      user.id,
      input.category,
      0,
      input.advancedContext,
    );
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create deployment:", error);
    throw error;
  }
}

export async function updateDeploymentAction(
  id: string,
  input: UpdateDeploymentActionInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateDeployment(supabase, id, {
      title: input.title,
      amount: input.amount,
      category: input.category,
    });
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update deployment:", error);
    throw error;
  }
}

export async function deleteDeploymentAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteDeployment(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete deployment:", error);
    throw error;
  }
}

export async function updateLiquidityAction(amount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateLiquidity(supabase, amount);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update liquidity:", error);
    throw error;
  }
}

export async function createAccountAction(input: CreateAccountActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createAccount(supabase, user.id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create account:", error);
    throw error;
  }
}

export async function updateAccountAction(
  id: string,
  input: Partial<CreateAccountActionInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateAccount(supabase, id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update account:", error);
    throw error;
  }
}

export async function deleteAccountAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteAccount(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    throw error;
  }
}

export async function createLiabilityAction(input: CreateLiabilityActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createLiability(supabase, user.id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create liability:", error);
    throw error;
  }
}

export async function updateLiabilityAction(
  id: string,
  input: Partial<CreateLiabilityActionInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateLiability(supabase, id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update liability:", error);
    throw error;
  }
}

export async function deleteLiabilityAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteLiability(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete liability:", error);
    throw error;
  }
}

export async function createIncomeAction(input: CreateIncomeActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createIncomeStream(supabase, user.id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create income stream:", error);
    throw error;
  }
}

export async function updateIncomeAction(
  id: string,
  input: Partial<CreateIncomeActionInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateIncomeStream(supabase, id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update income stream:", error);
    throw error;
  }
}

export async function deleteIncomeAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteIncomeStream(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete income stream:", error);
    throw error;
  }
}

export async function createGoalAction(input: CreateGoalActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createGoal(supabase, user.id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw error;
  }
}

export async function updateGoalAction(
  id: string,
  input: Partial<CreateGoalActionInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateGoal(supabase, id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update goal:", error);
    throw error;
  }
}

export async function deleteGoalAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteGoal(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete goal:", error);
    throw error;
  }
}

export async function createStrategicObjectiveAction(
  input: CreateObjectiveActionInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await createStrategicObjective(supabase, user.id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to create strategic objective:", error);
    throw error;
  }
}

export const createObjectiveAction = createStrategicObjectiveAction;

export async function updateStrategicObjectiveAction(
  id: string,
  input: Partial<CreateObjectiveActionInput>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await updateStrategicObjective(supabase, id, input);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to update strategic objective:", error);
    throw error;
  }
}

export const updateObjectiveAction = updateStrategicObjectiveAction;

export async function deleteStrategicObjectiveAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  try {
    await deleteStrategicObjective(supabase, id);
    revalidatePath("/dashboard");
    return buildDashboardSnapshot({ forceInsightEvaluation: true });
  } catch (error) {
    console.error("Failed to delete strategic objective:", error);
    throw error;
  }
}

export const deleteObjectiveAction = deleteStrategicObjectiveAction;
