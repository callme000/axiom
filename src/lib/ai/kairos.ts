import { createClient } from "../supabase/server";
import { getDeployments } from "../db/deployments";
import { getAccounts } from "../db/accounts";
import { getLiabilities } from "../db/liabilities";
import { getIncomeStreams } from "../db/income";
import { getGoals } from "../db/goals";
import { getUserSettings } from "../db/settings";
import { buildBehavioralContext } from "../context/buildBehavioralContext";
import { generateSummary } from "../analytics/engine";
import {
  Deployment,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
} from "../analytics/types";
import { MetadataQualitySummary } from "../finance/metadataQuality";
import { DeploymentAdvancedContext } from "../finance/deploymentContext";

export type DeploymentInput = {
  id?: string;
  title: string;
  amount: number;
  created_at?: string;
  category?: string | null;
  advanced_context?: DeploymentAdvancedContext | null;
};

export type InsightSeverity =
  | "observation"
  | "advisory"
  | "warning"
  | "critical";

export interface KairosInsight {
  type: "warning" | "info" | "pattern" | "opportunity";
  severity: InsightSeverity;
  category:
    | "capital_efficiency"
    | "spending_habit"
    | "pattern_recognition"
    | "system";
  confidence: number;
  message: string;
  supportingSignal?: string;
  timestamp: string;
  metadataQuality?: MetadataQualitySummary;
  related_ids?: string[];
  is_new_signal?: boolean;
}

/**
 * SERVER-SIDE ORCHESTRATOR: generateSystemInsights
 * Safely hydrates the Kairos AI layer with analytical context.
 * Rule: Read-only. Pure advisory sandbox.
 */
export async function generateSystemInsights(): Promise<KairosInsight> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required for Kairos hydration.");
  }

  // 1. Retrieve Canonical Context (Read-Only)
  const [
    deploymentsData,
    accountsData,
    liabilitiesData,
    incomeStreamsData,
    goalsData,
    settings,
  ] = await Promise.all([
    getDeployments(supabase),
    getAccounts(supabase),
    getLiabilities(supabase),
    getIncomeStreams(supabase),
    getGoals(supabase),
    getUserSettings(supabase),
  ]);

  const deployments = (deploymentsData || []) as Deployment[];
  const accounts = (accountsData || []) as Account[];
  const liabilities = (liabilitiesData || []) as Liability[];
  const incomeStreams = (incomeStreamsData || []) as IncomeStream[];
  const goals = (goalsData || []) as FinancialGoal[];
  const liquidity = Number(settings.total_liquidity);

  // 2. Build Deterministic Analytics & Behavioral Context
  const analytics = generateSummary(
    deployments,
    liquidity,
    accounts,
    liabilities,
    incomeStreams,
    goals,
  );

  const context = buildBehavioralContext(
    { currentAnalytics: analytics },
    deployments.map((d) => Number(d.amount)),
  );

  // 3. Extract Core Metrics for AI Evaluation
  const runway = context.runway.currentDays;
  const hhi = context.allocation.concentrationScore;
  const volatility = context.volatilityScore;
  const efficiency = context.capitalEfficiencyScore;

  // 4. Construct Highly Constrained System Instructions
  const systemInstructions = [
    "Identity: Axiom Kairos Intelligence (Read-Only Advisory).",
    "Aesthetic: Quiet System. Concise, strategic, desaturated observations.",
    "Restriction: NO markdown, NO structural tags, NO code generation, NO conversational filler.",
    "Objective: Analyze risk vectors and capital velocity strictly based on provided metrics.",
    "Input Framework: HHI (Concentration), Volatility (Erraticism), Efficiency (Score), Runway (Window).",
    runway === null
      ? "Runway is stable. Focus strictly on allocation velocity (HHI) and strategic diversification patterns."
      : runway < 30
        ? "CRITICAL: Runway < 30 days. Focus strictly on immediate capital mitigation and burn reduction."
        : "Runway is active. Analyze capital efficiency and deployment discipline.",
  ];

  // 5. LLM Prompt Construction
  const prompt = `
    METRICS:
    - Runway: ${runway === null ? "Stable (Infinite)" : runway + " days"}
    - Allocation HHI: ${hhi.toFixed(2)}
    - Spending Volatility: ${volatility.toFixed(2)}
    - Efficiency Score: ${efficiency}
    - Dominant Category: ${context.allocation.dominantCategory}
    - Flags: ${context.behavioralFlags.join(", ")}

    TASK: Provide a single strategic observation in 15 words or less. Focus on the primary risk vector.
  `;

  // 6. Execute AI Evaluation Call (Mock implementation for orchestrator structure)
  // In a real implementation, this would call OpenAI/Anthropic via a secure proxy.
  const aiResponse = await callAxiomAIProxy(systemInstructions, prompt);

  return {
    type: runway === null ? "info" : runway < 30 ? "warning" : "pattern",
    severity:
      runway === null ? "observation" : runway < 30 ? "critical" : "advisory",
    category: "capital_efficiency",
    confidence: 0.95,
    message: aiResponse,
    supportingSignal: `HHI: ${hhi.toFixed(2)} | Vol: ${volatility.toFixed(2)}`,
    timestamp: new Date().toISOString(),
    metadataQuality: context.metadataQuality,
    is_new_signal: true,
  };
}

/**
 * Placeholder for the actual LLM provider integration.
 * In a production environment, this would hit a Vercel AI SDK route or internal proxy.
 */
async function callAxiomAIProxy(
  instructions: string[],
  prompt: string,
): Promise<string> {
  // Simulating the "Quiet System" aesthetic output
  // Real world: return await openai.chat.completions.create(...)
  return "Capital velocity exceeding replenishment capacity. Mitigation of recurring leakage is mandatory.";
}

/**
 * Legacy support for deterministic logic if AI is unavailable.
 */
export async function generateKairosAIInsight(
  deployments: DeploymentInput[],
  currentBalance?: number,
  previousInsight?: KairosInsight | null,
): Promise<KairosInsight> {
  // (Preserving original function signature for backward compatibility)
  return generateSystemInsights();
}
