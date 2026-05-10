import { InsightRule } from "../types";

export const rules: InsightRule[] = [
  // 1. Runway Criticality (High Priority)
  {
    id: "runway_critical",
    priority: "high",
    condition: (ctx) => ctx.runway.status === "critical",
    generate: (ctx) => ({
      type: "warning",
      category: "capital_efficiency",
      confidence: 0.98,
      message: `Operational runway has contracted to ${ctx.runway.currentDays} days. Immediate capital preservation required.`,
    }),
  },

  // 2. Efficiency Crisis (High Priority)
  // Triggered by low score, regardless of trend in V1
  {
    id: "efficiency_crisis",
    priority: "high",
    condition: (ctx) => ctx.capitalEfficiencyScore < 40,
    generate: () => ({
      type: "warning",
      category: "capital_efficiency",
      confidence: 0.92,
      message:
        "Capital efficiency has reached a critical threshold. Current deployment patterns are suboptimal for long-term sustainability.",
    }),
  },

  // 3. Erratic Volatility (Medium Priority)
  // Lowered threshold to 0.4 for better sensitivity
  {
    id: "erratic_volatility",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore > 0.4,
    generate: () => ({
      type: "warning",
      category: "spending_habit",
      confidence: 0.9,
      message:
        "Erratic deployment patterns detected. Inconsistent capital outlays may indicate a lack of operational planning.",
    }),
  },

  // 4. High Operational Discipline (Medium Priority)
  // Triggered by low volatility, but requires multiple data points to be meaningful.
  {
    id: "high_discipline",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore < 0.2 && ctx.deploymentCount > 1,
    generate: () => ({
      type: "opportunity",
      category: "spending_habit",
      confidence: 0.95,
      message:
        "High operational discipline detected. Consistent spending patterns provide a stable foundation for capital scaling.",
    }),
  },

  // 5. Heavy Concentration (Low Priority)
  // Moved to low so it doesn't mask behavioral insights
  {
    id: "heavy_concentration",
    priority: "low",
    condition: (ctx) => ctx.allocation.concentrationScore > 0.7,
    generate: (ctx) => ({
      type: "info",
      category: "pattern_recognition",
      confidence: 0.85,
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this allocation aligns with strategic intent.`,
    }),
  },

  // 6. Generic Default (Fallback)
  {
    id: "default_pattern",
    priority: "low",
    condition: () => true,
    generate: () => ({
      type: "info",
      category: "pattern_recognition",
      confidence: 0.7,
      message:
        "Pattern recognition active. Financial behavior is within normal variance parameters.",
    }),
  },
];
