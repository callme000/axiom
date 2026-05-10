import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { evaluateInsights } from "../insights/generateInsights";

export type DeploymentInput = {
  id?: string;
  title: string;
  amount: number;
  created_at?: string;
  category?: string | null;
};

export interface KairosInsight {
  type: "warning" | "info" | "pattern" | "opportunity";
  category:
    | "capital_efficiency"
    | "spending_habit"
    | "pattern_recognition"
    | "system";
  confidence: number;
  message: string;
  related_ids?: string[];
}

/**
 * DETERMINISTIC INTERPRETATION ENGINE (Kairos V1)
 * Transforms financial history into strategic insights without LLM inference.
 */
export async function generateKairosAIInsight(
  deployments: DeploymentInput[],
): Promise<KairosInsight> {
  if (!deployments || deployments.length === 0) {
    return {
      type: "info",
      category: "system",
      confidence: 1.0,
      message:
        "No financial events recorded. Logic engine awaiting data for pattern formation.",
    };
  }

  // 1. Build Behavioral Context (Compression Layer)
  // Note: We currently don't pass historical metrics yet, but the architecture supports it.
  const context = buildBehavioralContext(
    { currentAnalytics: simulateAnalytics(deployments) },
    deployments.map((d) => d.amount),
  );

  // 2. Evaluate Insights (Logic Layer)
  const result = evaluateInsights(context);

  return result.primaryInsight;
}

/**
 * Helper to transform raw deployments into analytics for context building.
 * (Sync version of the Analytics Engine logic for internal engine use)
 */
function simulateAnalytics(deployments: DeploymentInput[]) {
  const total = deployments.reduce((sum, d) => sum + Number(d.amount), 0);
  const dailyBurn = total / 30; // 30-day window
  const balance = 1000000;

  const breakdown: Record<string, number> = {};
  deployments.forEach((d) => {
    const cat = d.category || "General";
    breakdown[cat] = (breakdown[cat] || 0) + Number(d.amount);
  });

  return {
    totalDeployed: total,
    dailyBurnRate: dailyBurn,
    runwayDays: dailyBurn > 0 ? balance / dailyBurn : null,
    categoryBreakdown: breakdown,
  };
}
