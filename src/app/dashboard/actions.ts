"use server";

// revalidatePath removed by refactoring
import { createClient } from "@/lib/supabase/server";
import {
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/lib/db/deployments";
import { createAccount, updateAccount, deleteAccount } from "@/lib/db/accounts";
import {
  createLiability,
  updateLiability,
  deleteLiability,
} from "@/lib/db/liabilities";
import {
  createIncomeStreams,
  updateIncomeStream,
  deleteIncomeStream,
} from "@/lib/db/income";
import { createGoal, updateGoal, deleteGoal } from "@/lib/db/goals";
import {
  createStrategicObjective,
  updateStrategicObjective,
  deleteStrategicObjective,
} from "@/lib/db/objectives";
import {
  createOperationalBaseline,
  updateOperationalBaseline,
  deleteOperationalBaseline,
} from "@/lib/db/baseline";
import { updateLiquidity } from "@/lib/db/settings";
import { LiquidityService } from "@/lib/finance/liquidity";
import { getDeletedLedgerRecords } from "@/lib/db/audit";
// saveInsight removed by refactoring
import { SnapshotService } from "@/lib/services/snapshot";
// DashboardSnapshot removed by refactoring
import type {
  OperationalBaseline,
  BaselineCadence,
} from "@/lib/analytics/types";
import type { DeploymentAdvancedContextInput } from "@/lib/finance/deploymentContext";
import { executeFinancialMutation } from "@/lib/services/mutation";

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
  is_paid_in_cadences?: boolean;
  cadence?: string | null;
  cadence_day_date?: string | null;
  cadence_amount?: number | null;
}

export interface CreateIncomeActionInput {
  income_name: string;
  income_type: string;
  amount: number;
  cadence: string;
  execution_day?: number | null;
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

const requireAuth = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized mutation attempt.");
  return { userId: user.id, supabase };
};

export async function getDashboardSnapshotAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return SnapshotService.unauthenticated();

  const { snapshot } = await SnapshotService.getSnapshot(supabase, user.id);
  return snapshot;
}

export async function checkOnboardingStatusAction() {
  const { userId, supabase } = await requireAuth();

  const [accounts, baseline] = await Promise.all([
    supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("operational_baseline")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    isOnboarded: (accounts.count ?? 0) > 0 || (baseline.count ?? 0) > 0,
  };
}

export async function createDeploymentAction(
  input: CreateDeploymentActionInput,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      // 1. Create the deployment record (The database trigger handles account balance deduction)
      await createDeployment(
        supabase,
        input.title,
        input.amount,
        userId,
        input.category,
        0,
        input.advancedContext,
        input.accountId,
      );

      // 2. Synchronize global liquidity (The database trigger handles account balance deduction)
      if (input.accountId) {
        await LiquidityService.sync(supabase, userId);
      }
    });
  } catch (error) {
    console.error("Failed to create deployment:", error);
    throw error;
  }
}

export async function updateDeploymentAction(
  id: string,
  input: UpdateDeploymentActionInput,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateDeployment(supabase, id, userId, {
        title: input.title,
        amount: input.amount,
        category: input.category,
      });
    });
  } catch (error) {
    console.error("Failed to update deployment:", error);
    throw error;
  }
}

export async function deleteDeploymentAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteDeployment(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete deployment:", error);
    throw error;
  }
}

export async function updateLiquidityAction(amount: number) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateLiquidity(supabase, userId, amount);
    });
  } catch (error) {
    console.error("Failed to update liquidity:", error);
    throw error;
  }
}

export async function createAccountAction(input: CreateAccountActionInput) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createAccount(supabase, userId, input);
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to create account:", error);
    throw error;
  }
}

export async function updateAccountAction(
  id: string,
  input: Partial<CreateAccountActionInput>,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateAccount(supabase, id, userId, input);
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to update account:", error);
    throw error;
  }
}

export async function deleteAccountAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteAccount(supabase, id, userId);
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to delete account:", error);
    throw error;
  }
}

export async function createLiabilityAction(input: CreateLiabilityActionInput) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createLiability(supabase, userId, input);
    });
  } catch (error) {
    console.error("Failed to create liability:", error);
    throw error;
  }
}

export async function updateLiabilityAction(
  id: string,
  input: Partial<CreateLiabilityActionInput>,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateLiability(supabase, id, userId, input);
    });
  } catch (error) {
    console.error("Failed to update liability:", error);
    throw error;
  }
}

export async function deleteLiabilityAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteLiability(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete liability:", error);
    throw error;
  }
}

export async function createIncomeAction(inputs: CreateIncomeActionInput[]) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createIncomeStreams(supabase, userId, inputs);
    });
  } catch (error) {
    console.error("Failed to create income streams:", error);
    throw error;
  }
}

export async function updateIncomeAction(
  id: string,
  input: Partial<CreateIncomeActionInput>,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateIncomeStream(supabase, id, userId, input);
    });
  } catch (error) {
    console.error("Failed to update income stream:", error);
    throw error;
  }
}

export async function deleteIncomeAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteIncomeStream(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete income stream:", error);
    throw error;
  }
}

export async function resolvePendingInflowAction(payload: {
  incomeId: string;
  accountId: string;
  amount: number;
}) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      // 1. Get current account balance
      const { data: account, error: accError } = await supabase
        .from("accounts")
        .select("current_balance")
        .eq("id", payload.accountId)
        .eq("user_id", userId)
        .single();

      if (accError || !account) throw new Error("Target account not found.");

      // 2. Update the target account balance
      const newBalance = Number(account.current_balance) + payload.amount;
      await updateAccount(supabase, payload.accountId, userId, {
        current_balance: newBalance,
      });

      // 3. Update the income stream last_executed_at
      await updateIncomeStream(supabase, payload.incomeId, userId, {
        last_executed_at: new Date().toISOString(),
      });

      // 4. Synchronize global liquidity
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to resolve pending income:", error);
    throw error;
  }
}

export async function resolvePendingLiabilityAction(payload: {
  liabilityId: string;
  accountId: string;
  amount: number;
}) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      // 1. Get current account and liability state
      const [accountRes, liabRes] = await Promise.all([
        supabase
          .from("accounts")
          .select("current_balance")
          .eq("id", payload.accountId)
          .eq("user_id", userId)
          .single(),
        supabase
          .from("liabilities")
          .select("outstanding_balance")
          .eq("id", payload.liabilityId)
          .eq("user_id", userId)
          .single(),
      ]);

      if (accountRes.error || !accountRes.data)
        throw new Error("Source account not found.");
      if (liabRes.error || !liabRes.data)
        throw new Error("Liability record not found.");

      // 2. Update balances
      const newAccBalance =
        Number(accountRes.data.current_balance) - payload.amount;
      const newLiabBalance = Math.max(
        0,
        Number(liabRes.data.outstanding_balance) - payload.amount,
      );

      await Promise.all([
        updateAccount(supabase, payload.accountId, userId, {
          current_balance: newAccBalance,
        }),
        updateLiability(supabase, payload.liabilityId, userId, {
          outstanding_balance: newLiabBalance,
          last_executed_at: new Date().toISOString(),
        }),
      ]);

      // 3. Synchronize global liquidity
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to resolve pending liability:", error);
    throw error;
  }
}

export async function resolvePendingBaselineAction(payload: {
  baselineId: string;
  accountId: string;
  amount: number;
  title: string;
}) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      // 1. Get current account balance
      const { data: account, error: accError } = await supabase
        .from("accounts")
        .select("current_balance")
        .eq("id", payload.accountId)
        .eq("user_id", userId)
        .single();

      if (accError || !account) throw new Error("Source account not found.");

      // 2. Deduct from account
      const newBalance = Number(account.current_balance) - payload.amount;
      await updateAccount(supabase, payload.accountId, userId, {
        current_balance: newBalance,
      });

      // 3. Log Deployment (Maintenance Expense)
      await createDeployment(
        supabase,
        payload.title,
        payload.amount,
        userId,
        "Maintenance",
        0,
        undefined,
        payload.accountId,
      );

      // 4. Update the baseline last_executed_at
      await updateOperationalBaseline(supabase, payload.baselineId, userId, {
        last_executed_at: new Date().toISOString(),
      });

      // 5. Synchronize global liquidity
      await LiquidityService.sync(supabase, userId);
    });
  } catch (error) {
    console.error("Failed to resolve pending baseline:", error);
    throw error;
  }
}

export async function createGoalAction(input: CreateGoalActionInput) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createGoal(supabase, userId, input);
    });
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw error;
  }
}

export async function updateGoalAction(
  id: string,
  input: Partial<CreateGoalActionInput>,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateGoal(supabase, id, userId, input);
    });
  } catch (error) {
    console.error("Failed to update goal:", error);
    throw error;
  }
}

export async function deleteGoalAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteGoal(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete goal:", error);
    throw error;
  }
}

export async function createStrategicObjectiveAction(
  input: CreateObjectiveActionInput,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createStrategicObjective(supabase, userId, input);
    });
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
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateStrategicObjective(supabase, id, userId, input);
    });
  } catch (error) {
    console.error("Failed to update strategic objective:", error);
    throw error;
  }
}

export const updateObjectiveAction = updateStrategicObjectiveAction;

export async function deleteStrategicObjectiveAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteStrategicObjective(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete strategic objective:", error);
    throw error;
  }
}

export const deleteObjectiveAction = deleteStrategicObjectiveAction;

export async function createOperationalBaselineAction(
  data: Omit<
    OperationalBaseline,
    "id" | "user_id" | "created_at" | "updated_at"
  >,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await createOperationalBaseline(supabase, userId, data);
    });
  } catch (error) {
    console.error("Failed to create operational baseline:", error);
    throw error;
  }
}

export async function updateOperationalBaselineAction(
  id: string,
  updates: Partial<
    Omit<OperationalBaseline, "id" | "user_id" | "created_at" | "updated_at">
  >,
) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await updateOperationalBaseline(supabase, id, userId, updates);
    });
  } catch (error) {
    console.error("Failed to update operational baseline:", error);
    throw error;
  }
}

export async function deleteOperationalBaselineAction(id: string) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      await deleteOperationalBaseline(supabase, id, userId);
    });
  } catch (error) {
    console.error("Failed to delete operational baseline:", error);
    throw error;
  }
}

export async function submitDayZeroOnboardingAction(payload: {
  accounts: {
    account_name: string;
    account_type: string;
    current_balance: string;
    institution?: string;
  }[];
  incomes: {
    income_name: string;
    income_type: string;
    amount: string;
    cadence: string;
    execution_day: string;
    is_recurring: boolean;
    source?: string;
  }[];
  liabilities: {
    liability_name: string;
    liability_type: string;
    outstanding_balance: string;
    interest_rate: string;
    institution?: string;
    is_paid_in_cadences: boolean;
    cadence: string;
    cadence_day_date: string;
    cadence_amount: string;
  }[];
  baselines: {
    title: string;
    amount: string;
    cadence: string;
    execution_day: string;
    is_recurring: boolean;
    category: string;
  }[];
}) {
  const { userId, supabase } = await requireAuth();

  try {
    return await executeFinancialMutation({ userId, supabase }, async () => {
      // 1. Insert Accounts
      for (const acc of payload.accounts) {
        await createAccount(supabase, userId, {
          ...acc,
          current_balance: Number(acc.current_balance),
        });
      }

      // 2. Insert Incomes (if any)
      if (payload.incomes.length > 0) {
        await createIncomeStreams(
          supabase,
          userId,
          payload.incomes.map((inc) => ({
            income_name: inc.income_name,
            income_type: inc.income_type,
            amount: Number(inc.amount),
            cadence: inc.is_recurring ? inc.cadence : "irregular",
            execution_day:
              inc.is_recurring &&
              (inc.cadence === "monthly" ||
                inc.cadence === "weekly" ||
                inc.cadence === "biweekly")
                ? Number(inc.execution_day)
                : null,
            is_recurring: inc.is_recurring,
            source: inc.source || undefined,
          })),
        );
      }

      // 3. Insert Liabilities (if any)
      for (const liab of payload.liabilities) {
        const balance = Number(liab.outstanding_balance);
        if (balance > 0) {
          await createLiability(supabase, userId, {
            liability_name: liab.liability_name,
            liability_type: liab.liability_type,
            outstanding_balance: balance,
            interest_rate: Number(liab.interest_rate) || 0,
            institution: liab.institution || undefined,
            is_paid_in_cadences: liab.is_paid_in_cadences,
            cadence: liab.is_paid_in_cadences ? liab.cadence : null,
            cadence_day_date: liab.is_paid_in_cadences
              ? String(liab.cadence_day_date)
              : null,
            cadence_amount: liab.is_paid_in_cadences
              ? Number(liab.cadence_amount)
              : null,
          });
        }
      }

      // 4. Insert Operational Baselines
      for (const item of payload.baselines) {
        await createOperationalBaseline(supabase, userId, {
          title: item.title || "Core Survival Baseline",
          amount: Number(item.amount),
          category: item.category || "Maintenance",
          cadence: (item.is_recurring
            ? item.cadence
            : "monthly") as BaselineCadence,
          execution_day:
            item.is_recurring &&
            (item.cadence === "monthly" ||
              item.cadence === "weekly" ||
              item.cadence === "biweekly")
              ? Number(item.execution_day)
              : null,
          is_recurring: item.is_recurring,
          baseline_type: "expense",
          is_active: true,
        });
      }

      // 5. Synchronize initial liquidity pool with account balances
      await LiquidityService.sync(supabase, userId);
    }, { revalidateType: "layout" });
  } catch (error) {
    console.error("[Onboarding] Submission failed:", error);
    throw error;
  }
}

export const submitDayZeroBaselineAction = submitDayZeroOnboardingAction;

export async function fetchHistoricalAuditAction() {
  const { userId, supabase } = await requireAuth();
  return getDeletedLedgerRecords(supabase, userId);
}

export interface AuditLog {
  id: string;
  rule_id: string;
  severity: string;
  evaluation_time_ms: number;
  created_at: string;
}

export interface TelemetrySummary {
  logs: AuditLog[];
  averageLatency: number;
  matchRate: number;
  totalCycles: number;
  ruleHits: Record<string, number>;
}

export async function fetchTelemetryLogsAction(): Promise<TelemetrySummary> {
  const { userId, supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("kairos_insights")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[Telemetry] Fetch failed:", error.message);
    return {
      logs: [],
      averageLatency: 0,
      matchRate: 0,
      totalCycles: 0,
      ruleHits: {},
    };
  }

  const logs = (data || []) as AuditLog[];
  const totalLogs = logs.length;

  if (totalLogs === 0) {
    return {
      logs: [],
      averageLatency: 0,
      matchRate: 0,
      totalCycles: 0,
      ruleHits: {},
    };
  }

  const totalLatency = logs.reduce(
    (sum, log) => sum + (log.evaluation_time_ms || 0),
    0,
  );
  const averageLatency = totalLatency / totalLogs;

  const matches = logs.filter((log) => log.severity !== "none").length;
  const matchRate = (matches / totalLogs) * 100;

  const ruleHits: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.severity && log.severity !== "none") {
      ruleHits[log.rule_id] = (ruleHits[log.rule_id] || 0) + 1;
    }
  });

  return {
    logs,
    averageLatency: Math.round(averageLatency * 100) / 100,
    matchRate: Math.round(matchRate * 10) / 10,
    totalCycles: totalLogs,
    ruleHits,
  };
}
