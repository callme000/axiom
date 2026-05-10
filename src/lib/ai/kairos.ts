export type DeploymentInput = {
  id?: string;
  title: string;
  amount: number;
  created_at?: string;
  category?: string | null;
};

/**
 * Local rule-based insight generation (Deterministic)
 */
export function generateKairosInsight(input: DeploymentInput) {
  const { title, amount } = input;

  const lower = title.toLowerCase();

  if (amount > 10000) {
    return "High-value capital deployment detected. Monitoring long-term return potential.";
  }

  if (lower.includes("course") || lower.includes("book")) {
    return "Skill acquisition detected. This may improve future earning capacity.";
  }

  if (lower.includes("game") || lower.includes("food")) {
    return "Consumption-oriented spending detected. Ensure intentional allocation.";
  }

  return "Deployment recorded. Pattern formation will become clearer over time.";
}

/**
 * AI-powered behavioral insight generation (Placeholder for Hugging Face)
 */
export async function generateKairosAIInsight(deployments: DeploymentInput[]) {
  if (!deployments || deployments.length === 0) {
    return "No financial events recorded. Logic engine awaiting data for pattern formation.";
  }

  // NOTE: Gemini API implementation removed.
  // Awaiting replacement with Hugging Face (Mistral) model.

  return "Local intelligence engine (Mistral) is currently initializing. Behavioral analysis will resume shortly.";
}
