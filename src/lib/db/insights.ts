import { supabase } from "@/lib/supabase";
import { KairosInsight } from "@/lib/ai/kairos";

export async function saveInsight(insight: KairosInsight, userId: string) {
  const { data, error } = await supabase.from("kairos_insights").insert({
    user_id: userId,
    type: insight.type,
    category: insight.category,
    confidence: insight.confidence,
    message: insight.message,
    metadata: {
      related_ids: insight.related_ids || [],
      metadata_quality: insight.metadataQuality || null,
      source: "client_engine"
    }
  });

  if (error) {
    console.error("Error saving insight:", error);
    throw error;
  }
  return data;
}

export async function getInsights(limit: number = 5) {
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
