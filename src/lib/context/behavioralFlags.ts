import { TrendState } from "./contextTypes";

/**
 * Identifies discrete behavioral signals for AI interpretation.
 * Objective: High signal, low token usage.
 */

export const generateBehavioralFlags = (params: {
  burnTrend: TrendState;
  volatility: number;
  concentration: number;
  runwayDays: number | null;
  dominantCategory: string;
}): string[] => {
  const flags: string[] = [];

  // 1. Burn Signals
  if (params.burnTrend === "increasing") flags.push("accelerating_burn");
  if (params.burnTrend === "decreasing") flags.push("burn_optimization_detected");

  // 2. Consistency Signals
  if (params.volatility > 0.6) flags.push("erratic_spending_pattern");
  if (params.volatility < 0.2 && params.volatility > 0) flags.push("high_operational_discipline");

  // 3. Allocation Signals
  if (params.concentration > 0.7) flags.push(`heavy_concentration:${params.dominantCategory.toLowerCase()}`);
  if (params.concentration < 0.3) flags.push("fragmented_capital_allocation");

  // 4. Criticality Signals
  if (params.runwayDays !== null && params.runwayDays < 30) flags.push("critical_runway_warning");
  if (params.runwayDays !== null && params.runwayDays > 180) flags.push("extended_operational_security");

  return flags;
};

/**
 * Analyzes category concentration.
 * Returns a score between 0 (even spread) and 1 (all in one category).
 */
export const calculateConcentrationScore = (distribution: Record<string, number>): number => {
  const values = Object.values(distribution);
  if (values.length === 0) return 0;
  if (values.length === 1) return 1;

  // Use Herfindahl-Hirschman Index (HHI) approach for concentration
  // Sum of squares of shares
  const hhi = values.reduce((sum, val) => sum + Math.pow(val, 2), 0);
  return hhi;
};
