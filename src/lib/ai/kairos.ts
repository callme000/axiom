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
 * Local rule-based insight generation (Deterministic)
 */
export function generateKairosInsight(input: DeploymentInput): KairosInsight {
  const { title, amount } = input;
  const lower = title.toLowerCase();

  const base: KairosInsight = {
    type: "info",
    category: "pattern_recognition",
    confidence: 1.0,
    message:
      "Deployment recorded. Pattern formation will become clearer over time.",
    related_ids: input.id ? [input.id] : [],
  };

  if (amount > 10000) {
    return {
      ...base,
      type: "warning",
      category: "capital_efficiency",
      message:
        "High-value capital deployment detected. Monitoring long-term return potential.",
    };
  }

  if (lower.includes("course") || lower.includes("book")) {
    return {
      ...base,
      category: "spending_habit",
      message:
        "Skill acquisition detected. This may improve future earning capacity.",
    };
  }

  if (lower.includes("game") || lower.includes("food")) {
    return {
      ...base,
      type: "warning",
      category: "spending_habit",
      message:
        "Consumption-oriented spending detected. Ensure intentional allocation.",
    };
  }

  return base;
}

/**
 * AI-powered behavioral insight generation (Placeholder for Hugging Face)
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

  // NOTE: Awaiting replacement with Hugging Face (Mistral) model.
  // The local engine will eventually generate this structure internally via JSON prompting.

  return {
    type: "info",
    category: "system",
    confidence: 0.9,
    message:
      "Local intelligence engine (Mistral) is currently initializing. Behavioral analysis will resume shortly.",
  };
}
