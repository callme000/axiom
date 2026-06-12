import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";
import { SnapshotService } from "./snapshot";
import { saveInsight } from "@/lib/db/insights";
import type { DashboardSnapshot } from "@/lib/dashboard/types";

export interface MutationContext {
  userId: string;
  supabase: SupabaseClient;
}

export interface MutationOptions {
  revalidateType?: "page" | "layout";
}

/**
 * A central framework for executing financial mutations.
 * 
 * This wrapper dramatically reduces boilerplate by orchestrating the mandatory 
 * mutation lifecycle:
 * 1. Execute the specific database mutation
 * 2. Revalidate the Next.js cache path
 * 3. Rebuild the dashboard snapshot & evaluate Kairos behavioral rules
 * 4. Persist any newly generated behavioral insights
 * 5. Return the newly built snapshot to the client
 * 
 * @param context The authenticated context (userId, supabase client)
 * @param mutation The core domain logic to execute
 * @param options Optional configuration for the mutation (e.g., revalidate type)
 * @returns The updated DashboardSnapshot
 */
export async function executeFinancialMutation(
  context: MutationContext,
  mutation: () => Promise<void>,
  options?: MutationOptions
): Promise<DashboardSnapshot> {
  // 1. Execute the core database mutation
  await mutation();

  // 2. Invalidate Next.js cache
  if (options?.revalidateType) {
    revalidatePath("/dashboard", options.revalidateType);
  } else {
    revalidatePath("/dashboard");
  }

  // 3. Rebuild the snapshot & evaluate behavioral insights (Kairos)
  const { snapshot, volatileState } = await SnapshotService.getSnapshot(
    context.supabase,
    context.userId,
    { forceInsightEvaluation: true }
  );

  // 4. Persist newly generated insights
  if (volatileState.requiresPersistence && snapshot.kairosInsight) {
    await saveInsight(context.supabase, snapshot.kairosInsight, context.userId);
  }

  // 5. Return the new source of truth
  return snapshot;
}
