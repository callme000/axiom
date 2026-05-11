import type { SupabaseClient } from "@supabase/supabase-js";
import type { KairosInsight } from "@/lib/ai/kairos";

export async function saveInsight(
  supabase: SupabaseClient,
  insight: KairosInsight,
  userId: string,
) {
  const { data, error } = await supabase.from("kairos_insights").insert({
    user_id: userId,
    type: insight.type,
    category: insight.category,
    confidence: insight.confidence,
    message: insight.message,
    metadata: {
      related_ids: insight.related_ids || [],
      metadata_quality: insight.metadataQuality || null,
<<<<<<< HEAD
      severity: insight.severity,
      timestamp: insight.timestamp,
      source: "server_action",
    },
=======
      source: "client_engine"
    }
>>>>>>> 41913c834896734927b1e32cff59691e1448743f
  });

  if (error) {
    console.error("Error saving insight:", error);
    throw error;
  }
  return data;
}

export async function getInsights(supabase: SupabaseClient, limit: number = 5) {
  const { data, error } = await supabase
    .from("kairos_insights")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
  return data;
}
