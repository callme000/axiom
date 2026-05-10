import { InsightRule } from "../types";

export const rules: InsightRule[] = [
  // 1. RUNWAY DEPLETION (Scenario 4)
  {
    id: "runway_critical",
    priority: "high",
    condition: (ctx) => ctx.runway.status === "critical",
    generate: (ctx) => ({
      type: "warning",
      category: "capital_efficiency",
      confidence: 0.98,
      message: `Operational runway has contracted to ${Math.round(ctx.runway.currentDays || 0)} days. Immediate capital preservation and reallocation required.`,
    }),
  },

  // 2. LEAKAGE CRISIS / EFFICIENCY (Scenario 2)
  {
    id: "efficiency_crisis",
    priority: "high",
    condition: (ctx) => ctx.capitalEfficiencyScore < 40,
    generate: (ctx) => {
      const isLeakage = ctx.allocation.dominantCategory === "Leakage";
      return {
        type: "warning",
        category: "capital_efficiency",
        confidence: 0.99, // Higher confidence than runway to ensure behavioral cause is shown first
        message: isLeakage
          ? "Capital efficiency crisis detected. Excessive 'Leakage' is compromising long-term sustainability."
          : "Capital efficiency has reached a critical threshold. Current deployment patterns are suboptimal.",
      };
    },
  },

  // 3. UNCLASSIFIED DATA (Audit Fix)
  {
    id: "unclassified_data",
    priority: "medium",
    condition: (ctx) =>
      (ctx.allocation.categoryDistribution["Unclassified"] || 0) > 0,
    generate: () => ({
      type: "info",
      category: "system",
      confidence: 1.0,
      message:
        "Unclassified ledger entries detected. Strategize capital intent for accurate efficiency analysis.",
    }),
  },

  // 4. ERRATIC VOLATILITY (Scenario 4 - v2.4)
  {
    id: "erratic_volatility",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore > 0.4,
    generate: () => ({
      type: "warning",
      category: "spending_habit",
      confidence: 0.9,
      message:
        "Erratic deployment patterns detected. Inconsistent capital outlays indicate a lack of operational planning.",
    }),
  },

  // 5. HIGH DISCIPLINE (Scenario 1 / 5)
  {
    id: "high_discipline",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore < 0.2 && ctx.deploymentCount > 1,
    generate: (ctx) => {
      const isAsset = ctx.allocation.dominantCategory === "Asset";
      return {
        type: "opportunity",
        category: "spending_habit",
        confidence: 0.95,
        message: isAsset
          ? "High operational discipline in Asset accumulation detected. Consistent deployment provides a stable foundation for scaling."
          : "High operational discipline detected. Consistent spending patterns provide a stable foundation for capital scaling.",
      };
    },
  },

  // 6. HEAVY CONCENTRATION (Scenario 3)
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

  // 7. DEFAULT PATTERN
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
