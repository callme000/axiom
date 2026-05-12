import type { SupabaseClient } from "@supabase/supabase-js";
import { validateDeployment } from "../finance/validateDeployment";
import {
  hasDeploymentAdvancedContext,
  type DeploymentAdvancedContextInput,
} from "../finance/deploymentContext";

function isMissingAdvancedContextColumn(error: { message?: string }) {
  return Boolean(error.message?.toLowerCase().includes("advanced_context"));
}

export async function getDeployments(supabase: SupabaseClient) {
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
  supabase: SupabaseClient,
  title: string,
  amount: number,
  userId: string,
  category: string,
  impactScore: number = 0,
  advancedContext: DeploymentAdvancedContextInput = {},
) {
  // 1. Pass through Taxonomy Enforcement Gate
  const validated = validateDeployment({
    title,
    amount,
    category,
    impactScore,
    advancedContext,
  });

  // 2. Database Write (Verified Truth)
  const deploymentRecord = {
    title: validated.title,
    amount: validated.amount,
    user_id: userId,
    category: validated.category,
    impact_score: validated.impactScore,
    ...(hasDeploymentAdvancedContext(validated.advancedContext)
      ? { advanced_context: validated.advancedContext }
      : {}),
  };

  const { data, error } = await supabase
    .from("deployments")
    .insert(deploymentRecord);

  if (error) {
    if (
      hasDeploymentAdvancedContext(validated.advancedContext) &&
      isMissingAdvancedContextColumn(error)
    ) {
      throw new Error(
        "Advanced Context schema unavailable. Apply supabase-setup.sql before saving advanced deployment metadata.",
      );
    }

    throw error;
  }
  return data;
}

/**
 * Updates an existing deployment record.
 * Enforces partial taxonomy validation for updated fields.
 */
export async function updateDeployment(
  supabase: SupabaseClient,
  id: string,
  updates: {
    title?: string;
    amount?: number;
    category?: string;
    impact_score?: number;
    advancedContext?: DeploymentAdvancedContextInput;
  },
) {
  // 1. Enforcement for provided fields
  // Note: We use the gate to normalize and validate only what changed
  const dbUpdates: Record<string, unknown> = {};
  const shouldValidate =
    updates.title !== undefined ||
    updates.amount !== undefined ||
    updates.category !== undefined ||
    updates.advancedContext !== undefined ||
    updates.impact_score !== undefined;

  if (shouldValidate) {
    // We simulate a full input to reuse the Gate logic,
    // but only use the validated fields for the update.
    const validated = validateDeployment({
      title: updates.title ?? "Temporary Title",
      amount: updates.amount ?? 1,
      category: updates.category ?? "Leakage", // Explicit default for gate reuse
      impactScore: updates.impact_score,
      advancedContext: updates.advancedContext,
    });

    if (updates.title !== undefined) dbUpdates.title = validated.title;
    if (updates.amount !== undefined) dbUpdates.amount = validated.amount;
    if (updates.category !== undefined) dbUpdates.category = validated.category;
    if (updates.impact_score !== undefined)
      dbUpdates.impact_score = validated.impactScore;
    if (updates.advancedContext !== undefined)
      dbUpdates.advanced_context = validated.advancedContext;
  }

  // 2. Database Update
  const { data, error } = await supabase
    .from("deployments")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    if (
      updates.advancedContext !== undefined &&
      isMissingAdvancedContextColumn(error)
    ) {
      throw new Error(
        "Advanced Context schema unavailable. Apply supabase-setup.sql before saving advanced deployment metadata.",
      );
    }

    throw error;
  }
  return data;
}

export async function deleteDeployment(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("deployments").delete().eq("id", id);

  if (error) throw error;
  return true;
}
