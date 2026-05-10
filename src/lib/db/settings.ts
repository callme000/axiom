import { supabase } from "@/lib/supabase";

export async function getUserSettings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 is 'no rows found'
    throw error;
  }

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

export async function updateLiquidity(amount: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
        user_id: user.id,
        total_liquidity: amount,
        updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
