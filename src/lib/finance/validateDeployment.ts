/**
 * TAXONOMY ENFORCEMENT GATE
 * Ensures every deployment written to the ledger follows the strict return-based taxonomy.
 */

export const VALID_CATEGORIES = ["Asset", "Skill", "Leverage", "Experience", "Leakage"] as const;
export type ValidCategory = typeof VALID_CATEGORIES[number];

export interface DeploymentInput {
  title: string;
  amount: number;
  category: string;
  impactScore?: number;
}

/**
 * Pre-write Validation Layer
 * Rejects any input that violates taxonomy integrity or data truth.
 */
export function validateDeployment(input: DeploymentInput) {
  const { title, amount, category, impactScore } = input;

  // 1. Structural Integrity
  if (!title || !title.trim()) {
    throw new Error("Taxonomy Gate: Title is required for deployment verification");
  }

  if (amount === undefined || amount === null || isNaN(amount)) {
    throw new Error("Taxonomy Gate: Numeric amount is required");
  }

  if (amount <= 0) {
    throw new Error("Taxonomy Gate: Capital deployment must be a positive value (> 0)");
  }

  // 2. Taxonomy Enforcement
  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    // Specifically reject 'Unclassified' and legacy categories
    if (category === "Unclassified") {
      throw new Error("Taxonomy Gate: Strategic classification is mandatory. Entry rejected.");
    }

    throw new Error(`Taxonomy Gate: Unknown category '${category}'. Use Asset, Skill, Leverage, Experience, or Leakage.`);
  }

  // 3. Normalization
  return {
    title: title.trim(),
    amount: Number(amount),
    category: category as ValidCategory,
    impactScore: Math.min(Math.max(impactScore || 0, 0), 10) // Scale 0-10
  };
}
