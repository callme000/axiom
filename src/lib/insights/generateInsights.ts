import { BehavioralContext } from "../context/contextTypes";
import { InsightEngineResult, InsightPriority } from "./types";
import { KairosInsight } from "../ai/kairos";
import { rules } from "./rules/registry";
import { logKairosEvaluation } from "../db/telemetry";

/**
 * Axiom Insight Engine Orchestrator
 * Evaluates behavioral context against the rule registry to generate
 * prioritized strategic insights.
 *
 * V1.2: Added asynchronous telemetry logging for performance audit.
 */
export const evaluateInsights = async (
  context: BehavioralContext,
): Promise<InsightEngineResult> => {
  // 1. Process all rules and capture telemetry
  const evaluationResults = await Promise.all(
    rules.map(async (rule) => {
      const start = Date.now();
      const isMatched = rule.condition(context);

      let insight: KairosInsight | null = null;
      if (isMatched) {
        insight = rule.generate(context);
      }

      const duration = Date.now() - start;

      // Persist forensic telemetry (Non-blocking but awaited for database integrity)
      await logKairosEvaluation({
        ruleId: rule.id,
        severity: insight?.severity || "none",
        durationMs: duration,
      });

      if (isMatched && insight) {
        return {
          priority: rule.priority,
          insight,
        };
      }
      return null;
    }),
  );

  const generatedInsights = evaluationResults.filter(
    (result): result is { priority: InsightPriority; insight: KairosInsight } =>
      result !== null,
  );

  // Axiom Standard: Gracefully handle the "Quiet" state
  if (generatedInsights.length === 0) {
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

  // 2. Prioritize
  // Sort by priority (High > Medium > Low) and then by confidence
  const sortedInsights = [...generatedInsights].sort((a, b) => {
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
