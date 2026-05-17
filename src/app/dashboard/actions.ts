"use server";

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
import { getUserSettings, updateLiquidity } from "@/lib/db/settings";
import { getInsights, saveInsight } from "@/lib/db/insights";
import { generateKairosAIInsight, type KairosInsight } from "@/lib/ai/kairos";
import { generateSummary, type AnalyticsSummary } from "@/lib/analytics";
import type {
  Deployment,
  Account,
  Liability,
  IncomeStream,
} from "@/lib/analytics/types";
import type { DeploymentAdvancedContextInput } from "@/lib/finance/deploymentContext";

export interface DashboardSnapshot {
  authenticated: boolean;
  deployments: Deployment[];
  accounts: Account[];
  liabilities: Liability[];
  incomeStreams: IncomeStream[];
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

function unauthenticatedSnapshot(): DashboardSnapshot {
  return {
    authenticated: false,
    deployments: [],
    accounts: [],
    liabilities: [],
    incomeStreams: [],
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
    settings,
  ] = await Promise.all([
    getDeployments(supabase),
    getAccounts(supabase),
    getLiabilities(supabase),
    getIncomeStreams(supabase),
    getUserSettings(supabase),
  ]);

  const deployments = (deploymentsData || []) as Deployment[];
  const accounts = (accountsData || []) as Account[];
  const liabilities = (liabilitiesData || []) as Liability[];
  const incomeStreams = (incomeStreamsData || []) as IncomeStream[];
  const liquidity = Number(settings.total_liquidity);
  const analytics = generateSummary(
    deployments,
    liquidity,
    accounts,
    liabilities,
    incomeStreams,
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

  await createDeployment(
    supabase,
    input.title,
    input.amount,
    user.id,
    input.category,
    0,
    input.advancedContext,
  );

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
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

  await updateDeployment(supabase, id, {
    title: input.title,
    amount: input.amount,
    category: input.category,
  });

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function deleteDeploymentAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await deleteDeployment(supabase, id);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function updateLiquidityAction(amount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await updateLiquidity(supabase, amount);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function createAccountAction(input: CreateAccountActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await createAccount(supabase, user.id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
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

  await updateAccount(supabase, id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function deleteAccountAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await deleteAccount(supabase, id);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function createLiabilityAction(input: CreateLiabilityActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await createLiability(supabase, user.id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
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

  await updateLiability(supabase, id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function deleteLiabilityAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await deleteLiability(supabase, id);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function createIncomeAction(input: CreateIncomeActionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await createIncomeStream(supabase, user.id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
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

  await updateIncomeStream(supabase, id, input);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function deleteIncomeAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await deleteIncomeStream(supabase, id);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}
