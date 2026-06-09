import { SupabaseClient } from "@supabase/supabase-js";
import { getDeployments } from "../db/deployments";
import { getAccounts } from "../db/accounts";
import { getLiabilities } from "../db/liabilities";
import { getIncomeStreams } from "../db/income";
import { getGoals } from "../db/goals";
import { getStrategicObjectives } from "../db/objectives";
import { getOperationalBaseline } from "../db/baseline";
import { getUserSettings } from "../db/settings";
import { getInsights, saveInsight } from "../db/insights";
import { generateSummary } from "../analytics";
import { generateKairosAIInsight, type KairosInsight } from "../ai/kairos";
import { DashboardSnapshot } from "../dashboard/types";
import {
  Deployment,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
  StrategicObjective,
  OperationalBaseline,
} from "../analytics/types";

export interface SnapshotQueryResult {
  snapshot: DashboardSnapshot;
  volatileState: {
    requiresPersistence: boolean;
  };
}

export const SnapshotService = {
  /**
   * Orchestrates the construction of a complete DashboardSnapshot.
   * Gather data, computes analytics, evaluates AI insights.
   * STRICT CQRS: This is a pure query. No database writes allowed.
   */
  async getSnapshot(
    supabase: SupabaseClient,
    userId: string,
    options: { forceInsightEvaluation?: boolean } = {},
  ): Promise<SnapshotQueryResult> {
    console.log("GENERATING SNAPSHOT FOR USER:", userId);

    const [
      deploymentsData,
      accountsData,
      liabilitiesData,
      incomeStreamsData,
      goalsData,
      objectivesData,
      baselineData,
      settings,
    ] = await Promise.all([
      getDeployments(supabase),
      getAccounts(supabase),
      getLiabilities(supabase),
      getIncomeStreams(supabase),
      getGoals(supabase),
      getStrategicObjectives(supabase),
      getOperationalBaseline(supabase),
      getUserSettings(supabase, userId),
    ]);

    const deployments = (deploymentsData || []) as Deployment[];
    const accounts = (accountsData || []) as Account[];
    const liabilities = (liabilitiesData || []) as Liability[];
    const incomeStreams = (incomeStreamsData || []) as IncomeStream[];
    const goals = (goalsData || []) as FinancialGoal[];
    const objectives = (objectivesData || []) as StrategicObjective[];
    const baseline = (baselineData || []) as OperationalBaseline[];
    const liquidity = Number(settings?.total_liquidity || 0);

    const analytics = generateSummary(
      deployments,
      liquidity,
      accounts,
      liabilities,
      incomeStreams,
      goals,
      objectives,
      baseline,
    );

    const savedInsights = await getInsights(supabase, 1);
    const previousInsight =
      savedInsights && savedInsights.length > 0
        ? normalizeSavedInsight(savedInsights[0] as Record<string, unknown>)
        : null;

    let kairosInsight: KairosInsight | null = null;
    let requiresPersistence = false;

    if (!options.forceInsightEvaluation && previousInsight) {
      // Re-use existing signal if no fresh evaluation is requested
      kairosInsight = previousInsight;
    } else {
      // Trigger Kairos Strategic Evaluation (Volatile)
      kairosInsight = await generateKairosAIInsight({
        deployments,
        liquidity,
        previousInsight,
        objectives,
        accounts,
        liabilities,
        incomeStreams,
        goals,
        baseline,
      });

      requiresPersistence = Boolean(kairosInsight.is_new_signal);
    }

    return {
      snapshot: {
        authenticated: true,
        deployments,
        accounts,
        liabilities,
        incomeStreams,
        goals,
        objectives,
        baseline,
        analytics,
        liquidity,
        kairosInsight,
      },
      volatileState: {
        requiresPersistence,
      },
    };
  },

  /**
   * Produces an empty snapshot for unauthenticated sessions.
   */
  unauthenticated(): DashboardSnapshot {
    return {
      authenticated: false,
      deployments: [],
      accounts: [],
      liabilities: [],
      incomeStreams: [],
      goals: [],
      objectives: [],
      baseline: [],
      analytics: null,
      liquidity: 0,
      kairosInsight: null,
    };
  },
};

/**
 * Normalizes database insight rows into KairosInsight domain objects.
 */
function normalizeSavedInsight(row: Record<string, unknown>): KairosInsight {
  const metadata =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};

  return {
    type: row.type as KairosInsight["type"],
    severity: (metadata.severity as KairosInsight["severity"]) || "observation",
    category: row.category as KairosInsight["category"],
    message: String(row.message || ""),
    supportingSignals: Array.isArray(metadata.supporting_signals)
      ? (metadata.supporting_signals as string[])
      : metadata.supporting_signal
        ? [String(metadata.supporting_signal)]
        : [],
    timestamp: String(
      metadata.timestamp || row.created_at || new Date().toISOString(),
    ),
    runway: metadata.runway !== undefined ? Number(metadata.runway) : null,
    capitalEfficiency:
      metadata.capital_efficiency !== undefined
        ? Number(metadata.capital_efficiency)
        : 100,
    isSilent: Boolean(metadata.is_silent),
    metadataQuality:
      metadata.metadata_quality && typeof metadata.metadata_quality === "object"
        ? (metadata.metadata_quality as KairosInsight["metadataQuality"])
        : undefined,
    is_new_signal: false,
  };
}
