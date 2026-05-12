"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/lib/db/deployments";
import { getUserSettings, updateLiquidity } from "@/lib/db/settings";
import { getInsights, saveInsight } from "@/lib/db/insights";
import { generateKairosAIInsight, type KairosInsight } from "@/lib/ai/kairos";
import { generateSummary, type AnalyticsSummary } from "@/lib/analytics";
import type { Deployment } from "@/lib/analytics/types";
import type { DeploymentAdvancedContextInput } from "@/lib/finance/deploymentContext";

export interface DashboardSnapshot {
  authenticated: boolean;
  deployments: Deployment[];
  analytics: AnalyticsSummary | null;
  liquidity: number;
  kairosInsight: KairosInsight | null;
}

export interface CreateDeploymentActionInput {
  title: string;
  amount: number;
  category: string;
  advancedContext?: DeploymentAdvancedContextInput;
}

export interface UpdateDeploymentActionInput {
  title: string;
  amount: number;
  category: string;
}

function unauthenticatedSnapshot(): DashboardSnapshot {
  return {
    authenticated: false,
    deployments: [],
    analytics: null,
    liquidity: 0,
    kairosInsight: null,
  };
}

function normalizeSavedInsight(row: Record<string, unknown>): KairosInsight {
  const metadata =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};

  return {
    type: row.type as KairosInsight["type"],
    severity: (metadata.severity as KairosInsight["severity"]) || "observation",
    category: row.category as KairosInsight["category"],
    confidence: Number(row.confidence),
    message: String(row.message || ""),
    supportingSignal: String(metadata.supporting_signal || ""),
    timestamp: String(
      metadata.timestamp || row.created_at || new Date().toISOString(),
    ),
    metadataQuality:
      metadata.metadata_quality && typeof metadata.metadata_quality === "object"
        ? (metadata.metadata_quality as KairosInsight["metadataQuality"])
        : undefined,
    related_ids: Array.isArray(metadata.related_ids)
      ? (metadata.related_ids as string[])
      : [],
    is_new_signal: false,
  };
}

async function buildDashboardSnapshot(
  options: { forceInsightEvaluation?: boolean } = {},
): Promise<DashboardSnapshot> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  const [deploymentsData, settings] = await Promise.all([
    getDeployments(supabase),
    getUserSettings(supabase),
  ]);

  const deployments = (deploymentsData || []) as Deployment[];
  const liquidity = Number(settings.total_liquidity);
  const analytics = generateSummary(deployments, liquidity);
  const savedInsights = await getInsights(supabase, 1);
  const previousInsight =
    savedInsights && savedInsights.length > 0
      ? normalizeSavedInsight(savedInsights[0] as Record<string, unknown>)
      : null;

  if (!options.forceInsightEvaluation && previousInsight) {
    return {
      authenticated: true,
      deployments,
      analytics,
      liquidity,
      kairosInsight: previousInsight,
    };
  }

  const kairosInsight = await generateKairosAIInsight(
    deployments,
    liquidity,
    previousInsight,
  );

  if (kairosInsight.is_new_signal) {
    await saveInsight(supabase, kairosInsight, user.id);
  }

  return {
    authenticated: true,
    deployments,
    analytics,
    liquidity,
    kairosInsight,
  };
}

export async function getDashboardSnapshotAction() {
  return buildDashboardSnapshot();
}

export async function createDeploymentAction(
  input: CreateDeploymentActionInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await createDeployment(
    supabase,
    input.title,
    input.amount,
    user.id,
    input.category,
    0,
    input.advancedContext,
  );

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function updateDeploymentAction(
  id: string,
  input: UpdateDeploymentActionInput,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await updateDeployment(supabase, id, {
    title: input.title,
    amount: input.amount,
    category: input.category,
  });

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function deleteDeploymentAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await deleteDeployment(supabase, id);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}

export async function updateLiquidityAction(amount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticatedSnapshot();

  await updateLiquidity(supabase, amount);

  return buildDashboardSnapshot({ forceInsightEvaluation: true });
}
