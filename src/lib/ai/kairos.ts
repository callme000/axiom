import { createClient } from "../supabase/server";
import { getDeployments } from "../db/deployments";
import { getAccounts } from "../db/accounts";
import { getLiabilities } from "../db/liabilities";
import { getIncomeStreams } from "../db/income";
import { getGoals } from "../db/goals";
import { getStrategicObjectives } from "../db/objectives";
import { getUserSettings } from "../db/settings";
import { generateSummary } from "../analytics/engine";
import {
  Deployment,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
  StrategicObjective,
} from "../analytics/types";
import { MetadataQualitySummary } from "../finance/metadataQuality";
import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { evaluateInsights } from "../insights/generateInsights";

export type InsightSeverity =
  | "observation"
  | "advisory"
  | "warning"
  | "critical";

export interface KairosInsight {
  type: "warning" | "info" | "pattern" | "opportunity";
  severity: InsightSeverity;
  category:
    | "capital_efficiency"
    | "solvency_pressure"
    | "strategic_alignment"
    | "objective_starvation";
  message: string;
  supportingSignals: string[];
  timestamp: string;
  runway: number | null;
  capitalEfficiency: number;
  isSilent: boolean;
  metadataQuality?: MetadataQualitySummary;
  is_new_signal?: boolean;
}

export interface KairosTelemetry {
  deployments?: Deployment[];
  liquidity?: number;
  accounts?: Account[];
  liabilities?: Liability[];
  incomeStreams?: IncomeStream[];
  goals?: FinancialGoal[];
  objectives?: StrategicObjective[];
  previousInsight?: KairosInsight | null;
}

/**
 * SERVER-SIDE ORCHESTRATOR: generateSystemInsights
 * Safely hydrates the Kairos AI layer with analytical context.
 */
export async function generateSystemInsights(
  telemetry: KairosTelemetry = {},
): Promise<KairosInsight> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required for Kairos hydration.");
  }

  // 1. Retrieve Canonical Context (Fallback Fetch Pipeline)
  const needsFetch =
    !telemetry.deployments ||
    telemetry.liquidity === undefined ||
    !telemetry.accounts ||
    !telemetry.liabilities ||
    !telemetry.incomeStreams ||
    !telemetry.goals ||
    !telemetry.objectives;

  let deps = telemetry.deployments;
  let accounts = telemetry.accounts;
  let liabilities = telemetry.liabilities;
  let income = telemetry.incomeStreams;
  let goals = telemetry.goals;
  let objectives = telemetry.objectives;
  let liquidity = telemetry.liquidity;

  if (needsFetch) {
    const [
      depsData,
      accountsData,
      liabilitiesData,
      incomeData,
      goalsData,
      objectivesData,
      settings,
    ] = await Promise.all([
      deps ? Promise.resolve(deps) : getDeployments(supabase),
      accounts ? Promise.resolve(accounts) : getAccounts(supabase),
      liabilities ? Promise.resolve(liabilities) : getLiabilities(supabase),
      income ? Promise.resolve(income) : getIncomeStreams(supabase),
      goals ? Promise.resolve(goals) : getGoals(supabase),
      objectives
        ? Promise.resolve(objectives)
        : getStrategicObjectives(supabase),
      liquidity !== undefined
        ? Promise.resolve({ total_liquidity: liquidity })
        : getUserSettings(supabase),
    ]);

    deps = (depsData || []) as Deployment[];
    accounts = (accountsData || []) as Account[];
    liabilities = (liabilitiesData || []) as Liability[];
    income = (incomeData || []) as IncomeStream[];
    goals = (goalsData || []) as FinancialGoal[];
    objectives = (objectivesData || []) as StrategicObjective[];
    liquidity =
      liquidity !== undefined
        ? liquidity
        : Number(
            (settings as { total_liquidity: number | string }).total_liquidity,
          );
  }

  // 2. Build Deterministic Analytics (Full Context Pass-Through)
  const analytics = generateSummary(
    deps!,
    liquidity!,
    accounts!,
    liabilities!,
    income!,
    goals!,
    objectives!,
  );

  // 3. Build Behavioral Context for Insight Engine
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    deps!.map((d) => Number(d.amount)),
  );

  // 4. Evaluate Insights via Rule Registry (V1.1)
  console.log("KAIROS TELEMETRY:", {
    deploymentsCount: deps!.length,
    runwayDays: analytics.runwayDays,
    alignmentPressure: analytics.strategicAlignment.alignmentPressure,
    netWorth: analytics.netWorth,
  });

  const { primaryInsight } = evaluateInsights(context);

  const previousInsight = telemetry.previousInsight;
  const isMessageChanged = primaryInsight.message !== previousInsight?.message;
  const isSeverityChanged =
    primaryInsight.severity !== previousInsight?.severity;
  const isSilentChanged = primaryInsight.isSilent !== previousInsight?.isSilent;

  const isNewSignal = isMessageChanged || isSeverityChanged || isSilentChanged;

  return {
    ...primaryInsight,
    is_new_signal: isNewSignal,
  };
}

/**
 * Bridge support for streamed telemetry from Dashboard Actions.
 */
export async function generateKairosAIInsight(
  telemetry: KairosTelemetry,
): Promise<KairosInsight> {
  return generateSystemInsights(telemetry);
}
