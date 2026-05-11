import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { evaluateInsights } from "../insights/generateInsights";
import { generateSummary } from "../analytics/engine";
import { Deployment } from "../analytics/types";
import { MetadataQualitySummary } from "../finance/metadataQuality";
import { DeploymentAdvancedContext } from "../finance/deploymentContext";

export type DeploymentInput = {
  id?: string;
  title: string;
  amount: number;
  created_at?: string;
  category?: string | null;
  advanced_context?: DeploymentAdvancedContext | null;
};

export type InsightSeverity = "passive" | "advisory" | "critical";

export interface KairosInsight {
  type: "warning" | "info" | "pattern" | "opportunity";
  severity: InsightSeverity; // New: production-safe classification
  category:
    | "capital_efficiency"
    | "spending_habit"
    | "pattern_recognition"
    | "system";
  confidence: number;
  message: string;
  timestamp: string; // New: for temporal continuity
  metadataQuality?: MetadataQualitySummary;
  related_ids?: string[];
  is_new_signal?: boolean; // New: for UX transition logic
}

/**
 * DETERMINISTIC INTERPRETATION ENGINE (Kairos V1.1)
 * Implementation of Behavioral Presence Layer.
 */
export async function generateKairosAIInsight(
  deployments: DeploymentInput[],
  currentBalance?: number,
  previousInsight?: KairosInsight | null,
): Promise<KairosInsight> {
  // 1. Initial State (Waiting for Signal)
  if (!deployments || deployments.length === 0) {
    return {
      type: "info",
      severity: "passive",
      category: "system",
      confidence: 1.0,
      timestamp: new Date().toISOString(),
      message:
        "Intelligence engine dormant. Awaiting financial deployment signals to begin behavioral analysis.",
    };
  }

  // 2. Map inputs to domain models
  const domainDeployments: Deployment[] = deployments.map((d) => ({
    id: d.id || "temp",
    title: d.title,
    amount: d.amount,
    created_at: d.created_at || new Date().toISOString(),
    category: d.category,
    advanced_context: d.advanced_context,
  }));

  // 3. Generate Analytics Context (Source of Truth)
  const analytics = generateSummary(domainDeployments, currentBalance);

  // 4. Build Behavioral Context (Compression Layer)
  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    domainDeployments.map((d) => d.amount),
  );

  // 5. Evaluate Insights (Logic Layer)
  const result = evaluateInsights(context);
  const primary = {
    ...result.primaryInsight,
    metadataQuality: context.metadataQuality,
  };

  // 6. Signal Filtering & Deduplication (Behavioral Presence)
  // If the new message is exactly the same as the previous, we preserve the signal
  // but mark it as 'old' to avoid jarring UI transitions.
  if (previousInsight && previousInsight.message === primary.message) {
    return {
      ...primary,
      is_new_signal: false,
      timestamp: previousInsight.timestamp, // Keep original time
    };
  }

  return {
    ...primary,
    timestamp: new Date().toISOString(),
    is_new_signal: true,
  };
}
