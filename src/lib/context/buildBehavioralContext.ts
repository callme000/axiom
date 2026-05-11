import { BehavioralContext, ContextInput } from "./contextTypes";

import {
  calculateTrendState,
  calculateVolatility,
  inferDiscipline,
} from "./trendAnalysis";
import {
  generateBehavioralFlags,
  calculateConcentrationScore,
} from "./behavioralFlags";
import { isValidCategory } from "../finance/taxonomy";

/**
 * Axiom Behavioral Context Builder
 * Transforms analytics signals into a stable behavioral state for Kairos.
 */
export const buildBehavioralContext = (
  input: ContextInput,
  deploymentAmounts: number[],
): BehavioralContext => {
  const { currentAnalytics, historicalMetrics } = input;

  // 1. Calculate Trends
  const burnTrend = calculateTrendState(
    currentAnalytics.dailyBurnRate,
    historicalMetrics?.previousBurnRate || 0,
  );

  const runwayDelta =
    currentAnalytics.runwayDays !== null &&
    historicalMetrics?.previousRunwayDays !== undefined
      ? currentAnalytics.runwayDays -
        (historicalMetrics.previousRunwayDays || 0)
      : 0;

  // 2. Allocation Analysis
  // 2. Allocation Analysis
  const total = currentAnalytics.totalDeployed || 1;
  const distribution: Record<string, number> = {};
  let dominantCategory = "None";
  let maxAmt = -1;

  let unclassifiedTotal = 0;

  Object.entries(currentAnalytics.categoryBreakdown).forEach(([cat, amt]) => {
    if (!isValidCategory(cat)) {
      unclassifiedTotal += amt;
    } else {
      distribution[cat] = amt / total;
      if (amt > maxAmt) {
        maxAmt = amt;
        dominantCategory = cat;
      }
    }
  });

  // Add the merged 'Unclassified' group
  if (unclassifiedTotal > 0) {
    distribution["Unclassified"] = unclassifiedTotal / total;
    if (unclassifiedTotal > maxAmt) {
      dominantCategory = "Unclassified";
    }
  }

  const concentrationScore = calculateConcentrationScore(distribution);
  const volatility = calculateVolatility(deploymentAmounts);

  // 3. Efficiency Calculation (Heuristic)
  // Starts at 100, penalized by volatility, accelerating burn, and low runway.
  let efficiency = 100;
  efficiency -= volatility * 60; // Much more sensitive to erratic spending
  if (burnTrend === "increasing") efficiency -= 15;
  if (currentAnalytics.runwayDays && currentAnalytics.runwayDays < 90)
    efficiency -= 40; // Aggressive penalty for low runway

  // 4. Status Determination

  // 4. Status Determination
  let runwayStatus: "healthy" | "concerning" | "critical" = "healthy";
  if (currentAnalytics.runwayDays !== null) {
    if (currentAnalytics.runwayDays < 30) runwayStatus = "critical";
    else if (currentAnalytics.runwayDays < 90) runwayStatus = "concerning";
  }

  return {
    generatedAt: new Date().toISOString(),
    deploymentCount: currentAnalytics.deploymentCount,
    capitalEfficiencyScore: Math.round(Math.max(efficiency, 0)),

    burnRate: {
      current: currentAnalytics.dailyBurnRate,
      trend: burnTrend,
      monthlyProjection: currentAnalytics.dailyBurnRate * 30,
    },

    runway: {
      currentDays: currentAnalytics.runwayDays,
      deltaDays: runwayDelta,
      status: runwayStatus,
    },

    allocation: {
      dominantCategory,
      categoryDistribution: distribution,
      concentrationScore,
    },

    volatilityScore: volatility,

    metadataQuality: currentAnalytics.metadataQuality,

    disciplineTrend: inferDiscipline(burnTrend, runwayDelta),

    behavioralFlags: generateBehavioralFlags({
      burnTrend,
      volatility,
      concentration: concentrationScore,
      runwayDays: currentAnalytics.runwayDays,
      dominantCategory,
    }),
  };
};

/**
 * Context Compression
 * Strips metadata to optimize for LLM token usage while preserving signal.
 */
export const compressContextForAI = (context: BehavioralContext): string => {
  return JSON.stringify({
    score: context.capitalEfficiencyScore,
    burn: `${context.burnRate.current}/day (${context.burnRate.trend})`,
    runway: `${context.runway.currentDays}d (${context.runway.status})`,
    allocation: `${context.allocation.dominantCategory} (conc: ${context.allocation.concentrationScore.toFixed(2)})`,
    flags: context.behavioralFlags.join(","),
    discipline: context.disciplineTrend,
    metadata: `${context.metadataQuality.lowQualityCount}/${context.deploymentCount} low-quality labels`,
  });
};
