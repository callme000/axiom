---
name: "axiom-kairos-architect"
description: "Designs and implements Kairos behavioral insight rules. Invoke when the user asks to create a new insight, add a behavioral rule, or track a new financial behavior in Axiom."
---

# Axiom Kairos Architect

This skill guides the AI in constructing deterministic, behavioral insight rules for the Axiom financial intelligence system. It enforces the "Build Backwards" methodology and the "Quiet System" philosophy.

## 1. Context Analysis
Before writing any code, review `src/lib/context/contextTypes.ts` to understand the `BehavioralContext` interface.
- Ensure the required deterministic metrics exist to support the user's requested insight.
- If the metric does not exist, you must implement it in `src/lib/analytics/engine.ts` first.

## 2. Rule Construction
All rules must be implemented in `src/lib/insights/rules/registry.ts` and appended to the `rules` array.

### Rule Structure
A valid `InsightRule` must contain:
- `id`: A unique, snake_case identifier (e.g., `high_velocity_burn`).
- `priority`: One of `"critical" | "high" | "medium" | "low"`.
- `condition`: A function `(ctx: BehavioralContext) => boolean`. This must be a deterministic check.
- `generate`: A function `(ctx: BehavioralContext) => KairosInsight`.

### KairosInsight Schema
The generated insight must conform to:
```typescript
{
  type: "warning" | "info" | "success";
  severity: "critical" | "high" | "warning" | "advisory" | "observation";
  category: "solvency_pressure" | "capital_efficiency" | "strategic_alignment" | "objective_starvation";
  timestamp: string; // new Date().toISOString()
  message: string; // The core observation
  supportingSignals: string[]; // 1-2 bullet points of data backing the message
  runway: number | null;
  capitalEfficiency: number;
  isSilent: boolean;
}
```

## 3. The "Quiet System" Philosophy
- **Restrained Tone:** The tone must be clinical, objective, and analytical (e.g., "Structural deficit detected." not "Oh no, you are spending too much!"). Never use emojis in the message.
- **Intentional Silence:** If the rule represents a normal state or a lack of danger, set `isSilent: true`. The UI will not render a visible card, honoring the user's peace of mind. Only actionable or critical insights should have `isSilent: false`.

## 4. Execution Workflow
1. Plan the necessary context/analytics updates.
2. Implement analytics changes (if necessary).
3. Draft the rule object.
4. Insert the rule into the `rules` array in `src/lib/insights/rules/registry.ts`.
5. Run tests (if applicable) to ensure the engine compiles successfully.