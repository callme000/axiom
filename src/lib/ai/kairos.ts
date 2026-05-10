import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { evaluateInsights } from "../insights/generateInsights";
import { generateSummary } from "../analytics/engine";
import { Deployment } from "../analytics/types";

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
  currentBalance?: number,
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

  // 1. Map inputs to domain models
  const domainDeployments: Deployment[] = deployments.map((d) => ({
    id: d.id || "temp",
    title: d.title,
    amount: d.amount,
    created_at: d.created_at || new Date().toISOString(),
    category: d.category,
  }));

  // 2. Generate Analytics Context (Source of Truth)
  const analytics = generateSummary(domainDeployments, currentBalance);

  // 3. Build Behavioral Context (Compression Layer)
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    domainDeployments.map((d) => d.amount),
  );

  // 4. Evaluate Insights (Logic Layer)
  const result = evaluateInsights(context);

  return result.primaryInsight;
}
