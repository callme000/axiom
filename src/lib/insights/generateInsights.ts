import { BehavioralContext } from "../context/contextTypes";
import { InsightEngineResult, InsightPriority } from "./types";
import { KairosInsight } from "../ai/kairos";
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

  // Axiom Standard: Gracefully handle the "Quiet" state
  if (activeRules.length === 0) {
    return {
      primaryInsight: {
        type: "info",
        severity: "observation",
        category: "strategic_alignment",
        message:
          "No material structural deterioration detected since previous evaluation.",
        supportingSignals: [],
        timestamp: new Date().toISOString(),
        runway: null,
        capitalEfficiency: context.capitalEfficiencyScore ?? 0,
        isSilent: true, // This is the "Quiet System" output
      },
      allInsights: [],
    };
  }

  // 2. Generate insights and apply deterministic metadata confidence weighting.
  const generatedInsights = activeRules.map((rule) => {
    const insight = rule.generate(context);

    return {
      priority: rule.priority,
      insight: {
        ...insight,
      },
    };
  });

  // 3. Prioritize
  // Sort by priority (High > Medium > Low) and then by confidence
  const sortedInsights = generatedInsights.sort((a, b) => {
    const priorityScore: Record<InsightPriority, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    if (priorityScore[a.priority] !== priorityScore[b.priority]) {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    return 0; // Maintain order within same priority
  });

  return {
    primaryInsight: sortedInsights[0].insight,
    allInsights: generatedInsights.map((result) => result.insight),
  };
};
