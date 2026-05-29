import { BehavioralContext } from "../context/contextTypes";
import { KairosInsight } from "../ai/kairos";

export type InsightPriority = "critical" | "high" | "medium" | "low";

export interface InsightRule {
  id: string;
  priority: InsightPriority;
  condition: (context: BehavioralContext) => boolean;
  generate: (context: BehavioralContext) => KairosInsight;
}

export interface InsightEngineResult {
  primaryInsight: KairosInsight;
  allInsights: KairosInsight[];
}
