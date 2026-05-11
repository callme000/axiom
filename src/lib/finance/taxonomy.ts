/**
 * Return-based taxonomy metadata.
 * Keep labels and operational definitions centralized for validation and UI.
 */
export const TAXONOMY_CATEGORIES = [
  {
    value: "Asset",
    label: "Asset",
    definition: "Expected future value generation",
  },
  {
    value: "Skill",
    label: "Skill",
    definition: "Improves future earning capability",
  },
  {
    value: "Leverage",
    label: "Leverage",
    definition: "Multiplies output or saves time",
  },
  {
    value: "Experience",
    label: "Experience",
    definition: "Intentional quality-of-life deployment",
  },
  {
    value: "Leakage",
    label: "Leakage",
    definition: "Non-strategic capital drift",
    behavioralSignal:
      "Leakage deployments are tracked separately to protect long-term positioning.",
  },
] as const;

export type ValidCategory = (typeof TAXONOMY_CATEGORIES)[number]["value"];

export const VALID_CATEGORIES: ReadonlyArray<ValidCategory> = TAXONOMY_CATEGORIES.map(
  (category) => category.value,
);

export const TAXONOMY_DEFINITIONS = TAXONOMY_CATEGORIES.reduce(
  (definitions, category) => {
    definitions[category.value] = category.definition;
    return definitions;
  },
  {} as Record<ValidCategory, string>,
);

export function isValidCategory(category: string): category is ValidCategory {
  return TAXONOMY_CATEGORIES.some((item) => item.value === category);
}

export function getTaxonomyDefinition(category: string) {
  return isValidCategory(category)
    ? TAXONOMY_DEFINITIONS[category]
    : undefined;
}

export function getTaxonomyBehavioralSignal(category: string) {
  if (!isValidCategory(category)) return undefined;

  const taxonomyCategory = TAXONOMY_CATEGORIES.find(
    (item) => item.value === category,
  );

  return taxonomyCategory && "behavioralSignal" in taxonomyCategory
    ? taxonomyCategory.behavioralSignal
    : undefined;
}

export function formatTaxonomyCategoryList() {
  return VALID_CATEGORIES.join(", ");
}
