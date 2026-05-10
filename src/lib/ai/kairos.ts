export type DeploymentInput = {
  title: string;
  amount: number;
};

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
