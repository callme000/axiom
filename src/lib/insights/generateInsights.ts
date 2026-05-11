import { BehavioralContext } from "../context/contextTypes";
import { weightConfidenceForMetadataQuality } from "../finance/metadataQuality";
import { InsightEngineResult } from "./types";
import { rules } from "./rules/registry";

/**
 * Axiom Insight Engine Orchestrator
 * Evaluates behavioral context against the rule registry to generate
 * prioritized strategic insights.
 */
export const evaluateInsights = (
  context: BehavioralContext,
): InsightEngineResult => {
  // 1. Filter rules by condition
  const activeRules = rules.filter((rule) => rule.condition(context));

  // 2. Generate insights and apply deterministic metadata confidence weighting.
  const generatedInsights = activeRules.map((rule) => {
    const insight = rule.generate(context);

    return {
      priority: rule.priority,
      insight: {
        ...insight,
        confidence: weightConfidenceForMetadataQuality(
          insight.confidence,
          context.metadataQuality,
        ),
      },
    };
  });

  // 3. Prioritize
  // Sort by priority (High > Medium > Low) and then by confidence
  const sortedInsights = generatedInsights.sort((a, b) => {
    const priorityScore = { high: 3, medium: 2, low: 1 };

    if (priorityScore[a.priority] !== priorityScore[b.priority]) {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    return b.insight.confidence - a.insight.confidence;
  });

  return {
    primaryInsight: sortedInsights[0].insight,
    allInsights: generatedInsights.map((result) => result.insight),
  };
};
