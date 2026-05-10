import { InsightRule } from "../types";

export const rules: InsightRule[] = [
  // 1. Runway Criticality
  {
    id: "runway_critical",
    priority: "high",
    condition: (ctx) => ctx.runway.status === "critical",
    generate: (ctx) => ({
      type: "warning",
      category: "capital_efficiency",
      confidence: 0.98,
      message: `Operational runway has contracted to ${ctx.runway.currentDays} days. Immediate capital preservation required.`
    })
  },

  // 2. Efficiency Decline
  {
    id: "efficiency_decline",
    priority: "high",
    condition: (ctx) => ctx.capitalEfficiencyScore < 40 && ctx.burnRate.trend === "increasing",
    generate: () => ({
      type: "warning",
      category: "capital_efficiency",
      confidence: 0.92,
      message: "Capital efficiency is declining while burn rate accelerates. Operational discipline is currently sub-optimal."
    })
  },

  // 3. Concentration Risk
  {
    id: "heavy_concentration",
    priority: "medium",
    condition: (ctx) => ctx.allocation.concentrationScore > 0.7,
    generate: (ctx) => ({
      type: "info",
      category: "pattern_recognition",
      confidence: 0.85,
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this allocation aligns with strategic intent.`
    })
  },

  // 4. Operational Stability (Positive)
  {
    id: "high_discipline",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore < 0.2 && ctx.disciplineTrend === "improving",
    generate: () => ({
      type: "opportunity",
      category: "spending_habit",
      confidence: 0.90,
      message: "High operational discipline detected. Consistent spending patterns provide a stable foundation for scaling."
    })
  },

  // 5. Erratic Behavior
  {
    id: "erratic_volatility",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore > 0.6,
    generate: () => ({
      type: "warning",
      category: "spending_habit",
      confidence: 0.88,
      message: "Erratic deployment patterns detected. Inconsistent capital outlays may indicate lack of operational planning."
    })
  },

  // 6. Generic Default (Fallback)
  {
    id: "default_pattern",
    priority: "low",
    condition: () => true,
    generate: () => ({
      type: "info",
      category: "pattern_recognition",
      confidence: 0.70,
      message: "Pattern recognition active. Financial behavior is within normal variance parameters."
    })
  }
];
