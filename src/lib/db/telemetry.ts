import { createClient } from "@/lib/supabase/server";

/**
 * TELEMETRY SERVICE (Phase 1)
 * Records insight evaluation events for observability.
 */
export async function logKairosEvaluation(data: {
  ruleId: string;
  severity: string;
  durationMs: number;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Record evaluation event to kairos_insights table.
    // This phase uses the rule registry ID and performance metadata.
    const { error } = await supabase.from("kairos_insights").insert({
      user_id: user.id,
      rule_id: data.ruleId,
      severity: data.severity,
      evaluation_time_ms: data.durationMs,
    });

    if (error) {
      console.error("[Telemetry] Error recording evaluation:", error.message);
    }
  } catch (err) {
    // Observability must be non-blocking; we swallow errors to protect primary flows.
    console.error("[Telemetry] Critical failure in logging:", err);
  }
}
