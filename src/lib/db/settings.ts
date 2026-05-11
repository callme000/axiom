import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUserSettings(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  // If no settings exist, create default
  if (!data) {
    const { data: newData, error: createError } = await supabase
      .from("user_settings")
      .insert({ user_id: user.id, total_liquidity: 0 })
      .select()
      .single();

    if (createError) throw createError;
    return newData;
  }

  return data;
}

export async function updateLiquidity(
  supabase: SupabaseClient,
  amount: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      total_liquidity: amount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
