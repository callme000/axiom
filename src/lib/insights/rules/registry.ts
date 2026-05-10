import { InsightRule } from "../types";

/**
 * KAIROS RULE REGISTRY (V1.1)
 * Behavioral Presence implementation.
 * Identity: Restrained Operational Analyst.
 */

export const rules: InsightRule[] = [
  // 1. RUNWAY DEPLETION (Critical Severity)
  {
    id: "runway_critical",
    priority: "high",
    condition: (ctx) => ctx.runway.status === "critical",
    generate: (ctx) => ({
      type: "warning",
      severity: "critical",
      category: "capital_efficiency",
      confidence: 0.98,
      timestamp: new Date().toISOString(),
      message: `Operational runway has contracted to ${Math.round(ctx.runway.currentDays || 0)} days. Immediate capital preservation and reallocation required.`,
    }),
  },

  // 2. LEAKAGE CRISIS (Critical Severity)
  {
    id: "efficiency_crisis",
    priority: "high",
    condition: (ctx) => ctx.capitalEfficiencyScore < 40,
    generate: (ctx) => {
      const isLeakage = ctx.allocation.dominantCategory === "Leakage";
      return {
        type: "warning",
        severity: "critical",
        category: "capital_efficiency",
        confidence: 0.99,
        timestamp: new Date().toISOString(),
        message: isLeakage
          ? "Capital efficiency crisis detected. Excessive 'Leakage' is compromising long-term sustainability."
          : "Capital efficiency has reached a critical threshold. Current deployment patterns are suboptimal.",
      };
    },
  },

  // 3. UNCLASSIFIED DATA (Advisory Severity)
  {
    id: "unclassified_data",
    priority: "medium",
    condition: (ctx) =>
      (ctx.allocation.categoryDistribution["Unclassified"] || 0) > 0,
    generate: () => ({
      type: "info",
      severity: "advisory",
      category: "system",
      confidence: 1.0,
      timestamp: new Date().toISOString(),
      message:
        "Unclassified ledger entries detected. Strategize capital intent for accurate efficiency analysis.",
    }),
  },

  // 4. ERRATIC VOLATILITY (Advisory Severity)
  {
    id: "erratic_volatility",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore > 0.4,
    generate: () => ({
      type: "warning",
      severity: "advisory",
      category: "spending_habit",
      confidence: 0.9,
      timestamp: new Date().toISOString(),
      message:
        "Erratic deployment patterns detected. Inconsistent capital outlays indicate a lack of operational planning.",
    }),
  },

  // 5. HIGH DISCIPLINE (Passive Severity - Encouragement through cold facts)
  {
    id: "high_discipline",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore < 0.2 && ctx.deploymentCount > 1,
    generate: (ctx) => {
      const isAsset = ctx.allocation.dominantCategory === "Asset";
      return {
        type: "opportunity",
        severity: "passive",
        category: "spending_habit",
        confidence: 0.95,
        timestamp: new Date().toISOString(),
        message: isAsset
          ? "High operational discipline in Asset accumulation detected. Consistent deployment provides a stable foundation for scaling."
          : "High operational discipline detected. Consistent spending patterns provide a stable foundation for capital scaling.",
      };
    },
  },

  // 6. HEAVY CONCENTRATION (Passive Severity)
  {
    id: "heavy_concentration",
    priority: "low",
    condition: (ctx) => ctx.allocation.concentrationScore > 0.7,
    generate: (ctx) => ({
      type: "info",
      severity: "passive",
      category: "pattern_recognition",
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this allocation aligns with strategic intent.`,
    }),
  },

  // 7. DEFAULT PATTERN (Dormant State)
  {
    id: "default_pattern",
    priority: "low",
    condition: () => true,
    generate: () => ({
      type: "info",
      severity: "passive",
      category: "pattern_recognition",
      confidence: 0.7,
      timestamp: new Date().toISOString(),
      message:
        "Intelligence engine observing capital flow. Behavioral state remains within normal variance parameters.",
    }),
  },
];
