import { geminiModel } from "./gemini";

export type DeploymentInput = {
  title: string;
  amount: number;
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
 * AI-powered behavioral insight generation (Probabilistic)
 */
export async function generateKairosAIInsight(deployments: DeploymentInput[]) {
  if (!deployments || deployments.length === 0) {
    return "No financial events recorded. Logic engine awaiting data for pattern formation.";
  }

  const summary = deployments
    .slice(0, 10)
    .map((d) => `- ${d.title}: KSh ${d.amount}`)
    .join("\n");

  const prompt = `
You are Kairos, a financial intelligence system.

Rules:
- Be analytical only
- No motivation
- No emotional language
- No preaching
- Max 2 sentences

User deployments:
${summary}

Return insight about spending patterns and capital efficiency.
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Kairos AI Error:", error);
    return "Intelligence engine temporarily unavailable. Standard pattern recognition active.";
  }
}
