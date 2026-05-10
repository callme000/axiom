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
  const { data, error } = await supabase.from("deployments").insert({
    title,
    amount,
    user_id: userId,
    category,
    impact_score: impactScore,
  });

  if (error) throw error;
  return data;
}
