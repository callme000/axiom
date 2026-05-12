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
      message: `Operational runway has contracted to ${Math.round(ctx.runway.currentDays || 0)} days. Immediate capital preservation required.`,
      supportingSignal: `Runway Delta: ${ctx.runway.deltaDays >= 0 ? "+" : ""}${Math.round(ctx.runway.deltaDays)} days since last evaluation.`,
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
        supportingSignal: `Efficiency Index: ${ctx.capitalEfficiencyScore}/100 — Dominant: ${ctx.allocation.dominantCategory} (${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}%).`,
      };
    },
  },

  // 3. UNCLASSIFIED DATA (Advisory Severity)
  {
    id: "unclassified_data",
    priority: "medium",
    condition: (ctx) =>
      (ctx.allocation.categoryDistribution["Unclassified"] || 0) > 0.1, // Only alert if > 10%
    generate: (ctx) => ({
      type: "info",
      severity: "advisory",
      category: "system",
      confidence: 1.0,
      timestamp: new Date().toISOString(),
      message:
        "Unclassified ledger entries detected. Strategize capital intent for accurate efficiency analysis.",
      supportingSignal: `Metadata Integrity: ${Math.round((ctx.allocation.categoryDistribution["Unclassified"] || 0) * 100)}% of deployments lack strategic classification.`,
    }),
  },

  // 4. ERRATIC VOLATILITY (Warning Severity)
  {
    id: "erratic_volatility",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore > 0.4,
    generate: (ctx) => ({
      type: "warning",
      severity: "warning",
      category: "spending_habit",
      confidence: 0.9,
      timestamp: new Date().toISOString(),
      message:
        "Erratic deployment patterns detected. Inconsistent capital outlays indicate a lack of operational planning.",
      supportingSignal: `Irregularity Index: HIGH — Volatility score of ${(ctx.volatilityScore * 100).toFixed(1)}% exceeds variance threshold.`,
    }),
  },

  // 5. HIGH DISCIPLINE (Observation Severity)
  {
    id: "high_discipline",
    priority: "medium",
    condition: (ctx) => ctx.volatilityScore < 0.2 && ctx.deploymentCount > 1,
    generate: (ctx) => {
      const isAsset = ctx.allocation.dominantCategory === "Asset";
      return {
        type: "opportunity",
        severity: "observation",
        category: "spending_habit",
        confidence: 0.95,
        timestamp: new Date().toISOString(),
        message: isAsset
          ? "High operational discipline in Asset accumulation detected. Consistent deployment provides a stable foundation for scaling."
          : "High operational discipline detected. Consistent spending patterns provide a stable foundation for capital scaling.",
        supportingSignal: `Stability Metric: ${(100 - ctx.volatilityScore * 100).toFixed(1)}% consistency across ${ctx.deploymentCount} deployments.`,
      };
    },
  },

  // 6. HEAVY CONCENTRATION (Advisory Severity)
  {
    id: "heavy_concentration",
    priority: "low",
    condition: (ctx) => ctx.allocation.concentrationScore > 0.7,
    generate: (ctx) => ({
      type: "info",
      severity: "advisory",
      category: "pattern_recognition",
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this allocation aligns with strategic intent.`,
      supportingSignal: `Concentration Score: ${ctx.allocation.concentrationScore.toFixed(2)} — ${ctx.allocation.dominantCategory} represents ${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}% of total deployment.`,
    }),
  },

  // 7. DEFAULT PATTERN (Legible Silence - Observation)
  {
    id: "default_pattern",
    priority: "low",
    condition: () => true,
    generate: () => ({
      type: "info",
      severity: "observation",
      category: "pattern_recognition",
      confidence: 0.7,
      timestamp: new Date().toISOString(),
      message:
        "No material behavioral shifts detected. Silence is intentional.",
      supportingSignal:
        "Observing capital behavior: State remains within normal variance parameters.",
    }),
  },
];
