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
      category: "solvency_pressure",
      timestamp: new Date().toISOString(),
      message: `Operational runway has contracted to ${Math.round(ctx.runway.currentDays || 0)} days. Immediate capital preservation required.`,
      supportingSignals: [
        `Runway Delta: ${ctx.runway.deltaDays >= 0 ? "+" : ""}${Math.round(ctx.runway.deltaDays)} days since last evaluation.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
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
        timestamp: new Date().toISOString(),
        message: isLeakage
          ? "Capital efficiency crisis detected. Excessive 'Leakage' is compromising long-term sustainability."
          : "Capital efficiency has reached a critical threshold. Current deployment patterns are suboptimal.",
        supportingSignals: [
          `Efficiency Index: ${ctx.capitalEfficiencyScore}/100 — Dominant: ${ctx.allocation.dominantCategory} (${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}%).`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: false,
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
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message:
        "Unclassified ledger entries detected. Strategize capital intent for accurate efficiency analysis.",
      supportingSignals: [
        `Metadata Integrity: ${Math.round((ctx.allocation.categoryDistribution["Unclassified"] || 0) * 100)}% of deployments lack strategic classification.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
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
      category: "capital_efficiency",
      timestamp: new Date().toISOString(),
      message:
        "Erratic deployment patterns detected. Inconsistent capital outlays indicate a lack of operational planning.",
      supportingSignals: [
        `Irregularity Index: HIGH — Volatility score of ${(ctx.volatilityScore * 100).toFixed(1)}% exceeds variance threshold.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
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
        type: "info",
        severity: "observation",
        category: "capital_efficiency",
        timestamp: new Date().toISOString(),
        message: isAsset
          ? "High operational discipline in Asset accumulation detected. Consistent deployment provides a stable foundation for scaling."
          : "High operational discipline detected. Consistent spending patterns provide a stable foundation for capital scaling.",
        supportingSignals: [
          `Stability Metric: ${(100 - ctx.volatilityScore * 100).toFixed(1)}% consistency across ${ctx.deploymentCount} deployments.`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: true,
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
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this allocation aligns with strategic intent.`,
      supportingSignals: [
        `Concentration Score: ${ctx.allocation.concentrationScore.toFixed(2)} — ${ctx.allocation.dominantCategory} represents ${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}% of total deployment.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 7. DEFAULT PATTERN (Legible Silence - Observation)
  {
    id: "default_pattern",
    priority: "low",
    condition: () => true,
    generate: (ctx) => ({
      type: "info",
      severity: "observation",
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message:
        "No material behavioral shifts detected. Silence is intentional.",
      supportingSignals: [
        "Observing capital behavior: State remains within normal variance parameters.",
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: true,
    }),
  },
];
