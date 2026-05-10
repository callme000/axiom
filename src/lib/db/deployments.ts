import { supabase } from "@/lib/supabase";
import { validateDeployment } from "../finance/validateDeployment";

export async function getDeployments() {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Creates a new deployment record.
 * Guaranteed to pass through the Taxonomy Enforcement Gate.
 */
export async function createDeployment(
  title: string,
  amount: number,
  userId: string,
  category: string,
  impactScore: number = 0,
) {
  // 1. Pass through Taxonomy Enforcement Gate
  const validated = validateDeployment({
    title,
    amount,
    category,
    impactScore,
  });

  // 2. Database Write (Verified Truth)
  const { data, error } = await supabase.from("deployments").insert({
    title: validated.title,
    amount: validated.amount,
    user_id: userId,
    category: validated.category,
    impact_score: validated.impactScore,
  });

  if (error) throw error;
  return data;
}

/**
 * Updates an existing deployment record.
 * Enforces partial taxonomy validation for updated fields.
 */
export async function updateDeployment(
  id: string,
  updates: {
    title?: string;
    amount?: number;
    category?: string;
    impact_score?: number;
  },
) {
  // 1. Enforcement for provided fields
  // Note: We use the gate to normalize and validate only what changed
  if (updates.title || updates.amount || updates.category) {
    // We simulate a full input to reuse the Gate logic,
    // but only use the validated fields for the update.
    const validated = validateDeployment({
      title: updates.title || "Temporary Title",
      amount: updates.amount || 1,
      category: updates.category || "Leakage", // Explicit default for gate reuse
      impactScore: updates.impact_score,
    });

    if (updates.title) updates.title = validated.title;
    if (updates.amount) updates.amount = validated.amount;
    if (updates.category) updates.category = validated.category;
    if (updates.impact_score !== undefined)
      updates.impact_score = validated.impactScore;
  }

  // 2. Database Update
  const { data, error } = await supabase
    .from("deployments")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteDeployment(id: string) {
  const { error } = await supabase.from("deployments").delete().eq("id", id);

  if (error) throw error;
  return true;
}
