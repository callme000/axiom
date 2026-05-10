import { supabase } from "@/lib/supabase";

export async function getDeployments() {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createDeployment(
  title: string,
  amount: number,
  userId: string,
  category: string = "General",
  impactScore: number = 0,
) {
  // Validation
  if (!title.trim()) throw new Error("Title is required");
  if (amount <= 0) throw new Error("Amount must be greater than zero");

  const { data, error } = await supabase.from("deployments").insert({
    title: title.trim(),
    amount,
    user_id: userId,
    category,
    impact_score: impactScore,
  });

  if (error) throw error;
  return data;
}

export async function updateDeployment(
  id: string,
  updates: {
    title?: string;
    amount?: number;
    category?: string;
    impact_score?: number;
  },
) {
  // Validation
  if (updates.title !== undefined && !updates.title.trim()) {
    throw new Error("Title cannot be empty");
  }
  if (updates.amount !== undefined && updates.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const { data, error } = await supabase
    .from("deployments")
    .update({
      ...updates,
      title: updates.title?.trim(),
    })
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteDeployment(id: string) {
  const { error } = await supabase.from("deployments").delete().eq("id", id);

  if (error) throw error;
  return true;
}
