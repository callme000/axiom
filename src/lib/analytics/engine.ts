import {
  Deployment,
  AnalyticsSummary,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
  StrategicObjective,
  StrategicAlignment,
} from "./types";
import { summarizeMetadataQuality } from "../finance/metadataQuality";
import { calculateMonthlyInflow } from "../finance/income";
import { calculateGoalProgressPercentage } from "../finance/goals";
import { calculateObjectiveFundingRatio } from "../finance/objectives";

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

export const calculateGoalMetrics = (
  goals: FinancialGoal[],
  objectives: StrategicObjective[] = [],
) => {
  const goalStats = goals.reduce(
    (acc, goal) => {
      acc.totalTargets += Number(goal.target_amount);
      acc.totalProgress += Number(goal.current_progress);
      if (goal.priority === "critical" && goal.status === "active") {
        acc.criticalCount += 1;
      }
      acc.progressSum += calculateGoalProgressPercentage(goal);
      return acc;
    },
    {
      totalTargets: 0,
      totalProgress: 0,
      criticalCount: 0,
      progressSum: 0,
    },
  );

  return objectives.reduce((acc, obj) => {
    acc.totalTargets += Number(obj.target_amount);
    acc.totalProgress += Number(obj.current_amount);
    if (obj.priority_level === "critical" && obj.status === "active") {
      acc.criticalCount += 1;
    }
    acc.progressSum += calculateObjectiveFundingRatio(obj);
    return acc;
  }, goalStats);
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
 * Correct Formula: Runway = balance / (dailyBurnRate - (monthlyIncome / 30))
 * Note: Returns days. Returns null if adjusted burn is <= 0 (stable state).
 */
export const projectRunway = (
  balance: number,
  dailyBurnRate: number,
  monthlyIncome: number = 0,
  netWorth: number = 0,
): number | null => {
  const adjustedDailyBurn = dailyBurnRate - monthlyIncome / 30;

  // If net worth is negative, the structural foundation is critical regardless of cash flow
  if (netWorth < 0) return 0;

  if (adjustedDailyBurn <= 0) return null;
  if (balance <= 0) return 0;

  return balance / adjustedDailyBurn;
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
 * Deterministic Strategic Alignment Logic
 */

export function calculateStrategicAlignment(
  objectives: StrategicObjective[],
  deployments: Deployment[],
  liquidity: number,
  incomeTotal: number,
  burnRate: number,
  liabilities: Liability[],
): StrategicAlignment {
  const fundingRatios: Record<string, number> = {};
  const velocity: Record<
    string,
    "stable" | "accelerating" | "stagnant" | "regressing"
  > = {};
  const objectiveStarvationSignals: string[] = [];
  const strategicAllocationSignals: string[] = [];
  const now = new Date();

  // 1. Funding Ratios & Starvation
  objectives.forEach((obj) => {
    const ratio = calculateObjectiveFundingRatio(obj);
    fundingRatios[obj.id] = ratio;

    const ageInDays = Math.max(
      1,
      (now.getTime() - new Date(obj.created_at).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Starvation detection
    if (obj.status === "active" && ratio < 10 && ageInDays > 90) {
      objectiveStarvationSignals.push(
        `${obj.objective_name} objective has remained below 10% funded for ${Math.floor(ageInDays)} days.`,
      );
    }

    // Velocity (Simplified deterministic approach based on age)
    const dailyRate = obj.current_amount / ageInDays;
    if (dailyRate === 0) {
      velocity[obj.id] = "stagnant";
    } else if (ratio >= 100) {
      velocity[obj.id] = "stable"; // Completed
    } else {
      velocity[obj.id] = "stable"; // Default for now as we don't have historical delta
    }
  });

  // 2. Strategic Allocation Awareness
  const categories = getCategoryBreakdown(deployments);
  const leakage = categories["Leakage"] || 0;
  const assets = categories["Asset"] || 0;
  const hasActiveAccumulation = objectives.some(
    (o) =>
      o.status === "active" &&
      (o.objective_type === "liquidity" ||
        o.objective_type === "emergency_reserve"),
  );

  if (hasActiveAccumulation && leakage > assets) {
    strategicAllocationSignals.push(
      "Leakage deployments exceeded Asset deployments during an active liquidity accumulation objective.",
    );
  }

  // 3. Liquidity Sufficiency
  const criticalObjectives = objectives.filter(
    (o) => o.priority_level === "critical" && o.status === "active",
  );
  const totalCriticalTarget = criticalObjectives.reduce(
    (sum, o) => sum + (o.target_amount - o.current_amount),
    0,
  );
  const isSufficient = liquidity >= totalCriticalTarget;
  const shortfall = Math.max(0, totalCriticalTarget - liquidity);

  const liquiditySufficiency = {
    isSufficient,
    message: isSufficient
      ? "Current liquidity structure sufficiently supports short-term obligations."
      : `Emergency reserve target exceeds current liquidity capacity by ${shortfall.toLocaleString()} KSh.`,
    shortfall,
  };

  // 4. Alignment Pressure (Weighted Scoring 0-100)
  let pressureScore = 0;

  // Weight: Leakage vs Assets (up to 25 points)
  if (leakage > assets) pressureScore += 25;
  else if (leakage > 0) pressureScore += 10;

  // Weight: Liquidity Sufficiency (up to 30 points)
  if (!isSufficient) pressureScore += 30;

  // Weight: Starvation (up to 20 points)
  if (objectiveStarvationSignals.length > 0) pressureScore += 20;

  // Weight: High Liabilities (up to 25 points)
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + Number(l.outstanding_balance),
    0,
  );
  if (totalLiabilities > liquidity * 2) pressureScore += 25;

  return {
    fundingRatios,
    velocity,
    alignmentPressure: Math.min(100, pressureScore),
    liquiditySufficiency,
    objectiveStarvationSignals,
    strategicAllocationSignals,
  };
}

/**
 * Main entry point for generating a full analytics context.
 */
export const generateSummary = (
  deployments: Deployment[],
  liquidity: number = 0,
  accounts: Account[] = [],
  liabilities: Liability[] = [],
  incomeStreams: IncomeStream[] = [],
  goals: FinancialGoal[] = [],
  objectives: StrategicObjective[] = [],
): AnalyticsSummary => {
  const total = calculateTotal(deployments);
  const burnRate = calculateBurnRate(deployments);

  const totalAssets = calculateAccountTotal(accounts);
  const totalLiabilities = calculateLiabilityTotal(liabilities);
  const netWorth = totalAssets - totalLiabilities;

  const income = calculateIncomeMetrics(incomeStreams);
  const goalMetrics = calculateGoalMetrics(goals, objectives);

  const strategicAlignment = calculateStrategicAlignment(
    objectives,
    deployments,
    liquidity,
    income.total,
    burnRate,
    liabilities,
  );

  const totalIntentionsCount = goals.length + objectives.length;

  return {
    totalDeployed: total,
    averageDeployment: calculateAverage(deployments),
    dailyBurnRate: burnRate,
    runwayDays: projectRunway(liquidity, burnRate, income.total, netWorth),
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
    // Goal System v1
    totalStrategicTargets: goalMetrics.totalTargets,
    totalCurrentProgress: goalMetrics.totalProgress,
    averageGoalProgress:
      totalIntentionsCount > 0
        ? goalMetrics.progressSum / totalIntentionsCount
        : 0,
    criticalGoalCount: goalMetrics.criticalCount,
    fundingGap: Math.max(
      0,
      goalMetrics.totalTargets - goalMetrics.totalProgress,
    ),
    // Strategic Objectives v1
    strategicAlignment,
  };
};
