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

  // Fallback for "Quiet System" philosophy - handle empty ruleset explicitly
  const primaryInsight =
    sortedInsights.length > 0
      ? sortedInsights[0].insight
      : createSilentInsight(context);

  return {
    primaryInsight,
    allInsights: generatedInsights.map((result) => result.insight),
  };
};

/**
 * Generates a default silent insight when no behavioral rules are triggered.
 * Adheres to the Axiom "Quiet System" philosophy.
 */
const createSilentInsight = (ctx: BehavioralContext): KairosInsight => ({
  type: "info",
  severity: "observation",
  category: "strategic_alignment",
  timestamp: new Date().toISOString(),
  message: "No material behavioral shifts detected. Silence is intentional.",
  supportingSignals: ["System stability within expected variance parameters."],
  runway: ctx.runway.currentDays,
  capitalEfficiency: ctx.capitalEfficiencyScore,
  isSilent: true,
});
