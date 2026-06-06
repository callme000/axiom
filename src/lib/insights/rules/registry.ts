import { InsightRule } from "../types";

/**
 * KAIROS RULE REGISTRY (V1.1)
 * Behavioral Presence implementation.
 * Identity: Restrained Operational Analyst.
 */

export const rules: InsightRule[] = [
  // 0. PENDING VERIFICATION (High Priority Alert)
  {
    id: "pending_verification",
    priority: "critical",
    condition: (ctx) => ctx.pendingVerificationCount > 0,
    generate: (ctx) => ({
      type: "warning",
      severity: "critical",
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message: `Action Required: ${ctx.pendingVerificationCount} financial verification${ctx.pendingVerificationCount > 1 ? "s" : ""} detected for today.`,
      supportingSignals: [
        "Axiom has detected scheduled transaction flows that require manual confirmation to ascertain absolute truth.",
        "Verification will update your structural solvency window and capital ledger.",
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },
  // 1. SOLVENCY CRISIS (Critical Severity)
  {
    id: "solvency_crisis",
    priority: "critical",
    condition: (ctx) => ctx.netWorth < 0,
    generate: (ctx) => ({
      type: "warning",
      severity: "critical",
      category: "solvency_pressure",
      timestamp: new Date().toISOString(),
      message:
        "Severe solvency crisis detected. Total credit facilities (e.g., Fuliza, M-Shwari, SACCO Loans) exceed combined capital assets, resulting in a negative net worth state.",
      supportingSignals: [
        `Net Worth: KSh ${Math.round(ctx.netWorth).toLocaleString()}`,
        `Liquid Reserves (MMF/SACCO): KSh ${Math.round(ctx.liquidity).toLocaleString()}`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 2. STRUCTURAL DEFICIT (Critical Severity)
  {
    id: "structural_deficit",
    priority: "high",
    condition: (ctx) => {
      const monthlyBurn = ctx.burnRate.monthlyProjection;
      const monthlyReplenishment = ctx.totalMonthlyIncome;

      // Trigger if structural burn exceeds income (Structural Deficit)
      return monthlyBurn > monthlyReplenishment && monthlyBurn > 0;
    },
    generate: (ctx) => {
      const deficit = ctx.burnRate.monthlyProjection - ctx.totalMonthlyIncome;
      return {
        type: "warning",
        severity: "critical",
        category: "solvency_pressure",
        timestamp: new Date().toISOString(),
        message:
          "Structural deficit detected. Baseline monthly outflow (including M-Pesa leakage) currently outpaces aggregate inbound yield (M-Pesa flows / Hustle & Salary).",
        supportingSignals: [
          `Monthly Deficit: KSh ${Math.round(deficit).toLocaleString()}`,
          `Inbound Yield Coverage: ${Math.round((ctx.totalMonthlyIncome / ctx.burnRate.monthlyProjection) * 100)}% of monthly burn.`,
          `Survival Window: ${ctx.runway.currentDays ? Math.round(ctx.runway.currentDays) : "Unknown"} days remaining.`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: false,
      };
    },
  },
  // 3. SOLVENCY PRESSURE (Critical/Warning Severity)
  {
    id: "solvency_pressure",
    priority: "high",
    condition: (ctx) =>
      !ctx.strategicAlignment.liquiditySufficiency.isSufficient,
    generate: (ctx) => {
      const { shortfall, message } =
        ctx.strategicAlignment.liquiditySufficiency;

      const isCritical =
        ctx.liquidity === 0 ? shortfall > 0 : shortfall / ctx.liquidity > 0.5;

      return {
        type: "warning",
        severity: isCritical ? "critical" : "warning",
        category: "solvency_pressure",
        timestamp: new Date().toISOString(),
        message:
          "Liquid reserves (MMF, SACCO Deposits) are insufficient to satisfy all critical strategic obligations.",
        supportingSignals: [
          message,
          `Combined Available Liquid Reserves: KSh ${Math.round(ctx.liquidity).toLocaleString()}`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: false,
      };
    },
  },

  // 4. OBJECTIVE STARVATION (Advisory Severity)
  {
    id: "objective_starvation",
    priority: "medium",
    condition: (ctx) =>
      ctx.strategicAlignment.objectiveStarvationSignals.length > 0,
    generate: (ctx) => ({
      type: "info",
      severity: "advisory",
      category: "objective_starvation",
      timestamp: new Date().toISOString(),
      message: `Strategic starvation detected: ${ctx.strategicAlignment.objectiveStarvationSignals[0]}`,
      supportingSignals:
        ctx.strategicAlignment.objectiveStarvationSignals.slice(1, 3),
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 5. STRATEGIC CONFLICT (Warning Severity)
  {
    id: "strategic_conflict",
    priority: "medium",
    condition: (ctx) =>
      ctx.strategicAlignment.strategicAllocationSignals.length > 0,
    generate: (ctx) => ({
      type: "warning",
      severity: "warning",
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message: ctx.strategicAlignment.strategicAllocationSignals[0],
      supportingSignals: [
        `Alignment Pressure: ${ctx.strategicAlignment.alignmentPressure}/100`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 6. RUNWAY DEPLETION (Critical Severity)
  {
    id: "runway_critical",
    priority: "critical",
    condition: (ctx) => ctx.runway.status === "critical",
    generate: (ctx) => ({
      type: "warning",
      severity: "critical",
      category: "solvency_pressure",
      timestamp: new Date().toISOString(),
      message: `Operational runway has contracted to ${Math.round(ctx.runway.currentDays || 0)} days. Immediate capital preservation (minimizing M-Pesa leakage) required.`,
      supportingSignals: [
        `Runway Delta: ${ctx.runway.deltaDays >= 0 ? "+" : ""}${Math.round(ctx.runway.deltaDays)} days since last evaluation.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 7. LEAKAGE CRISIS (Critical Severity)
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
          ? "Capital efficiency crisis detected. Excessive 'Mobile Money (M-Pesa) Leakage' is compromising long-term sustainability."
          : "Capital efficiency has reached a critical threshold. Current deployment patterns (Chama, MMF, Shamba) are suboptimal.",
        supportingSignals: [
          `Efficiency Index: ${ctx.capitalEfficiencyScore}/100 — Dominant: ${ctx.allocation.dominantCategory} (${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}%).`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: false,
      };
    },
  },

  // 8. UNCLASSIFIED DATA (Advisory Severity)
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
        "Unclassified outflows detected. Reclassify recent M-Pesa flows to restore the accuracy of the efficiency index.",
      supportingSignals: [
        `Metadata Integrity: ${Math.round((ctx.allocation.categoryDistribution["Unclassified"] || 0) * 100)}% of flows lack strategic classification.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 9. ERRATIC VOLATILITY (Warning Severity)
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
        "High volatility in capital deployment detected. Irregular outbound M-Pesa flows may disrupt runway projections.",
      supportingSignals: [
        `Irregularity Index: HIGH — Volatility score of ${(ctx.volatilityScore * 100).toFixed(1)}% exceeds variance threshold.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 10. HIGH DISCIPLINE (Observation Severity)
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
          ? "High operational discipline in Capital Deployment (Chama, MMF, Shamba) detected. Consistent deployment provides a stable foundation for scaling."
          : "High operational discipline detected. Consistent outflow patterns provide a stable foundation for capital scaling.",
        supportingSignals: [
          `Stability Metric: ${(100 - ctx.volatilityScore * 100).toFixed(1)}% consistency across ${ctx.deploymentCount} deployments.`,
        ],
        runway: ctx.runway.currentDays,
        capitalEfficiency: ctx.capitalEfficiencyScore,
        isSilent: true,
      };
    },
  },

  // 11. HEAVY CONCENTRATION (Advisory Severity)
  {
    id: "heavy_concentration",
    priority: "low",
    condition: (ctx) => ctx.allocation.concentrationScore > 0.7,
    generate: (ctx) => ({
      type: "info",
      severity: "advisory",
      category: "strategic_alignment",
      timestamp: new Date().toISOString(),
      message: `Significant capital concentration detected in ${ctx.allocation.dominantCategory}. Ensure this deployment (Chama, MMF, Shamba) aligns with strategic intent.`,
      supportingSignals: [
        `Concentration Score: ${ctx.allocation.concentrationScore.toFixed(2)} — ${ctx.allocation.dominantCategory} represents ${(ctx.allocation.categoryDistribution[ctx.allocation.dominantCategory] * 100).toFixed(1)}% of total deployment.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },

  // 12. DEFAULT PATTERN (Legible Silence - Observation)
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
        "No material behavioral shifts detected in M-Pesa flows or capital deployment. Silence is intentional.",
      supportingSignals: [
        "Observing capital behavior: State remains within normal variance parameters.",
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: true,
    }),
  },

  // 13. INCOME CONCENTRATION RISK (Warning Severity)
  {
    id: "income_concentration_risk",
    priority: "medium",
    condition: (ctx) => ctx.maxIncomeConcentrationRatio > 0.8,
    generate: (ctx) => ({
      type: "warning",
      severity: "warning",
      category: "capital_efficiency",
      timestamp: new Date().toISOString(),
      message:
        "High inbound concentration risk detected. Over 80% of total yield relies on a single primary flow, creating severe structural fragility.",
      supportingSignals: [
        `Concentration Ratio: ${(ctx.maxIncomeConcentrationRatio * 100).toFixed(1)}% from primary source.`,
      ],
      runway: ctx.runway.currentDays,
      capitalEfficiency: ctx.capitalEfficiencyScore,
      isSilent: false,
    }),
  },
];
