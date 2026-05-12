/**
 * AXIOM RETURN-BASED TAXONOMY
 * Centralized definitions for the financial intelligence system.
 */

export interface TaxonomyCategory {
  value: string;
  label: string;
  definition: string;
  behavioralSignal: string;
}

export const TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  {
    value: "Asset",
    label: "Asset",
    definition: "Expected future value generation",
    behavioralSignal: "Strategic wealth foundation. Accumulation phase active.",
  },
  {
    value: "Skill",
    label: "Skill",
    definition: "Improves future earning capability",
    behavioralSignal: "Human capital investment. Increasing intrinsic value.",
  },
  {
    value: "Leverage",
    label: "Leverage",
    definition: "Multiplies output or saves time",
    behavioralSignal: "Operational efficiency play. Buying back time.",
  },
  {
    value: "Experience",
    label: "Experience",
    definition: "Intentional quality-of-life deployment",
    behavioralSignal:
      "Conscious enjoyment. Strategic buffer for mental health.",
  },
  {
    value: "Leakage",
    label: "Leakage",
    definition: "Non-strategic capital drift",
    behavioralSignal:
      "Systemic inefficiency. Capital is exiting the system without return.",
  },
];

export const getTaxonomyDefinition = (value: string) => {
  return TAXONOMY_CATEGORIES.find((c) => c.value === value)?.definition || "";
};

export const getTaxonomyBehavioralSignal = (value: string) => {
  return (
    TAXONOMY_CATEGORIES.find((c) => c.value === value)?.behavioralSignal || ""
  );
};
