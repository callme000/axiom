import { BehavioralContext } from "../context/contextTypes";
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

  // 2. Generate insights
  const generatedInsights = activeRules.map((rule) => rule.generate(context));

  // 3. Prioritize
  // Sort by priority (High > Medium > Low) and then by confidence
  const sortedRules = activeRules.sort((a, b) => {
    const priorityScore = { high: 3, medium: 2, low: 1 };

    if (priorityScore[a.priority] !== priorityScore[b.priority]) {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    // Secondary sort: Confidence of the generated insight
    return b.generate(context).confidence - a.generate(context).confidence;
  });

  return {
    primaryInsight: sortedRules[0].generate(context),
    allInsights: generatedInsights,
  };
};
