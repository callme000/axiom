import { Deployment, AnalyticsSummary } from "./types";

/**
 * Pure, deterministic engine for financial intelligence.
 * Rule: The database is truth. This engine only interprets.
 */

export const calculateTotal = (deployments: Deployment[]): number => {
  return deployments.reduce((sum, d) => sum + Number(d.amount), 0);
};

export const calculateAverage = (deployments: Deployment[]): number => {
  if (deployments.length === 0) return 0;
  return calculateTotal(deployments) / deployments.length;
};

/**
 * Calculates burn rate over a specific window (in days).
 * Defaulting to a 30-day window for normalized metrics.
 */
export const calculateBurnRate = (
  deployments: Deployment[],
  windowDays: number = 30,
): number => {
  if (windowDays <= 0) return 0;
  const total = calculateTotal(deployments);
  return total / windowDays;
};

/**
 * Projects runway based on a hypothetical liquidity balance.
 */
export const projectRunway = (
  balance: number,
  dailyBurnRate: number,
): number | null => {
  if (dailyBurnRate <= 0) return null;
  return balance / dailyBurnRate;
};

/**
 * Aggregates deployments into categories.
 */
export const getCategoryBreakdown = (
  deployments: Deployment[],
): Record<string, number> => {
  return deployments.reduce(
    (acc, d) => {
      const cat = d.category || "Unclassified";
      acc[cat] = (acc[cat] || 0) + Number(d.amount);
      return acc;
    },
    {} as Record<string, number>,
  );
};

/**
 * Main entry point for generating a full analytics context.
 */
export const generateSummary = (
  deployments: Deployment[],
  currentBalance: number = 1000000, // Placeholder 1M KSh balance
): AnalyticsSummary => {
  const total = calculateTotal(deployments);
  const burnRate = calculateBurnRate(deployments);

  return {
    totalDeployed: total,
    averageDeployment: calculateAverage(deployments),
    dailyBurnRate: burnRate,
    runwayDays: projectRunway(currentBalance, burnRate),
    categoryBreakdown: getCategoryBreakdown(deployments),
    deploymentCount: deployments.length,
  };
};
