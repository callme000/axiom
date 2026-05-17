import {
  Deployment,
  AnalyticsSummary,
  Account,
  Liability,
  IncomeStream,
} from "./types";
import { summarizeMetadataQuality } from "../finance/metadataQuality";
import { calculateMonthlyInflow } from "../finance/income";

/**
 * Pure, deterministic engine for financial intelligence.
 * Rule: The database is truth. This engine only interprets.
 */

export const calculateTotal = (deployments: Deployment[]): number => {
  return deployments.reduce((sum, d) => sum + Number(d.amount), 0);
};

export const calculateAccountTotal = (accounts: Account[]): number => {
  return accounts.reduce((sum, a) => sum + Number(a.current_balance), 0);
};

export const calculateLiabilityTotal = (liabilities: Liability[]): number => {
  return liabilities.reduce((sum, l) => sum + Number(l.outstanding_balance), 0);
};

export const calculateIncomeMetrics = (streams: IncomeStream[]) => {
  return streams.reduce(
    (acc, stream) => {
      const monthly = calculateMonthlyInflow(stream);
      acc.total += monthly;
      if (stream.is_recurring) {
        acc.recurring += monthly;
      } else {
        acc.irregular += monthly;
      }
      acc.concentration[stream.income_type] =
        (acc.concentration[stream.income_type] || 0) + monthly;
      return acc;
    },
    {
      total: 0,
      recurring: 0,
      irregular: 0,
      concentration: {} as Record<string, number>,
    },
  );
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
 * Projects runway based on deterministic liquidity and income offset.
 * Formula: Runway = (Liquid Assets + Monthly Income Offset) / Burn Rate
 * Note: Returns days.
 */
export const projectRunway = (
  balance: number,
  dailyBurnRate: number,
  monthlyIncome: number = 0,
): number | null => {
  if (dailyBurnRate <= 0) return null;
  // Implementation of: (Liquid Assets + Monthly Income Offset) / Burn Rate
  // This is effectively (balance + monthlyIncome) / dailyBurnRate.
  return (balance + monthlyIncome) / dailyBurnRate;
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
  liquidity: number = 0,
  accounts: Account[] = [],
  liabilities: Liability[] = [],
  incomeStreams: IncomeStream[] = [],
): AnalyticsSummary => {
  const total = calculateTotal(deployments);
  const burnRate = calculateBurnRate(deployments);

  const totalAssets = calculateAccountTotal(accounts);
  const totalLiabilities = calculateLiabilityTotal(liabilities);
  const netWorth = totalAssets - totalLiabilities;

  const income = calculateIncomeMetrics(incomeStreams);

  return {
    totalDeployed: total,
    averageDeployment: calculateAverage(deployments),
    dailyBurnRate: burnRate,
    runwayDays: liquidity
      ? projectRunway(liquidity, burnRate, income.total)
      : null,
    categoryBreakdown: getCategoryBreakdown(deployments),
    deploymentCount: deployments.length,
    metadataQuality: summarizeMetadataQuality(deployments),
    // Liability System v1
    totalLiabilities,
    totalAssets,
    netWorth,
    liquidity,
    // Income Engine v1
    totalMonthlyIncome: income.total,
    recurringIncome: income.recurring,
    irregularIncome: income.irregular,
    incomeConcentration: income.concentration,
    adjustedDailyBurn: Math.max(0, burnRate - income.total / 30),
  };
};
