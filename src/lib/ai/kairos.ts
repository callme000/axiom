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
  AnalyticsSummary,
} from "../analytics/types";
import { MetadataQualitySummary } from "../finance/metadataQuality";

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

/**
 * Deterministic Strategic Interpretation Logic
 * Transform analytics truth into restrained operational intelligence.
 */
export function interpretStrategicState(
  analytics: AnalyticsSummary,
): KairosInsight {
  const { strategicAlignment, runwayDays, adjustedDailyBurn, netWorth } =
    analytics;
  const {
    alignmentPressure,
    liquiditySufficiency,
    objectiveStarvationSignals,
    strategicAllocationSignals,
  } = strategicAlignment;

  const supportingSignals: string[] = [];
  let primaryAssessment = "";
  let severity: InsightSeverity = "observation";
  let category: KairosInsight["category"] = "strategic_alignment";

  // 1. Severity Calibration
  if (
    alignmentPressure >= 80 ||
    (runwayDays !== null && runwayDays < 14) ||
    netWorth < 0
  ) {
    severity = "critical";
  } else if (
    alignmentPressure >= 50 ||
    !liquiditySufficiency.isSufficient ||
    (runwayDays !== null && runwayDays < 30)
  ) {
    severity = "warning";
  } else if (alignmentPressure >= 20 || objectiveStarvationSignals.length > 0) {
    severity = "advisory";
  }

  // 2. Primary Assessment & Signal Prioritization
  if (!liquiditySufficiency.isSufficient) {
    category = "solvency_pressure";
    primaryAssessment =
      "Liquidity reserves are insufficient to satisfy all critical strategic obligations.";
    supportingSignals.push(liquiditySufficiency.message);
  } else if (objectiveStarvationSignals.length > 0) {
    category = "objective_starvation";
    primaryAssessment = objectiveStarvationSignals[0];
    if (objectiveStarvationSignals.length > 1) {
      supportingSignals.push(objectiveStarvationSignals[1]);
    }
  } else if (strategicAllocationSignals.length > 0) {
    category = "capital_efficiency";
    primaryAssessment = strategicAllocationSignals[0];
  } else if (alignmentPressure > 0) {
    primaryAssessment =
      "Structural alignment pressure detected in current capital deployment patterns.";
    supportingSignals.push(
      `Alignment Pressure Score: ${alignmentPressure}/100`,
    );
  } else {
    primaryAssessment =
      "No material structural deterioration detected since previous evaluation.";
  }

  // 3. Additional Supporting Signals (Deterministic Telemetry)
  if (runwayDays !== null && runwayDays < 90) {
    supportingSignals.push(
      `Operational runway contraction: ${Math.round(runwayDays)} days remaining at current velocity.`,
    );
  }

  if (adjustedDailyBurn > 0) {
    supportingSignals.push(
      `Daily burn rate: ${Math.round(adjustedDailyBurn).toLocaleString()} KSh (adjusted for income).`,
    );
  }

  // Limit supporting signals to 3
  const finalSupportingSignals = supportingSignals.slice(0, 3);

  // 4. Silence State Behavior
  const hasSignals =
    objectiveStarvationSignals.length > 0 ||
    strategicAllocationSignals.length > 0 ||
    !liquiditySufficiency.isSufficient;

  const isSilent =
    severity === "observation" && alignmentPressure === 0 && !hasSignals;

  if (isSilent) {
    primaryAssessment =
      "No material structural deterioration detected since previous evaluation.";
  }

  return {
    type:
      severity === "critical" || severity === "warning" ? "warning" : "info",
    severity,
    category,
    message: primaryAssessment,
    supportingSignals: finalSupportingSignals,
    timestamp: new Date().toISOString(),
    runway: runwayDays,
    capitalEfficiency: Math.max(0, 100 - alignmentPressure),
    isSilent,
    metadataQuality: analytics.metadataQuality,
    is_new_signal: true,
  };
}

/**
 * SERVER-SIDE ORCHESTRATOR: generateSystemInsights
 * Safely hydrates the Kairos AI layer with analytical context.
 */
export async function generateSystemInsights(): Promise<KairosInsight> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required for Kairos hydration.");
  }

  // 1. Retrieve Canonical Context (Read-Only)
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

  // 2. Build Deterministic Analytics
  const analytics = generateSummary(
    deployments,
    liquidity,
    accounts,
    liabilities,
    incomeStreams,
    goals,
    objectives,
  );

  // 3. Interpret Strategic State (Phase 5E: Deterministic)
  return interpretStrategicState(analytics);
}

/**
 * Legacy support for deterministic logic.
 */
export async function generateKairosAIInsight(
  _deployments?: unknown,
  _balance?: number,
  _previousInsight?: KairosInsight | null,
): Promise<KairosInsight> {
  return generateSystemInsights();
}
