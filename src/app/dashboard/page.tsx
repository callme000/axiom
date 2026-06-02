"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getDashboardSnapshotAction,
  createDeploymentAction,
  type DashboardSnapshot,
} from "./actions";
import { AccountSection } from "./AccountSection";
import { LiabilitySection } from "./LiabilitySection";
import { IncomeSection } from "./IncomeSection";
import { GoalSection } from "./GoalSection";
import { StrategicObjectiveSection } from "./StrategicObjectiveSection";
import { BaselineSection } from "./BaselineSection";
import { PendingInflows } from "./PendingInflows";
import { TelemetryDashboard } from "@/components/dashboard/TelemetryDashboard";
import DayZeroOnboarding from "@/components/dashboard/DayZeroOnboarding";
import { NewEntryForm } from "./NewEntryForm";
import type {
  AnalyticsSummary,
  Deployment,
  Account,
  Liability,
  IncomeStream,
  FinancialGoal,
  StrategicObjective,
  OperationalBaseline,
} from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { DeploymentMap } from "@/lib/utils/taxonomy";

interface LedgerState {
  deployments: Deployment[];
  accounts: Account[];
  liabilities: Liability[];
  incomeStreams: IncomeStream[];
  goals: FinancialGoal[];
  objectives: StrategicObjective[];
  baseline: OperationalBaseline[];
  analytics: AnalyticsSummary | null;
}

type KairosInsight = DashboardSnapshot["kairosInsight"];

const EMPTY_ADVANCED_CONTEXT = {
  associatedAccount: "",
  expectedReturnHorizon: "",
  tags: "",
};

export default function Dashboard() {
  const [ledger, setLedger] = useState<LedgerState>({
    deployments: [],
    accounts: [],
    liabilities: [],
    incomeStreams: [],
    goals: [],
    objectives: [],
    baseline: [],
    analytics: null,
  });
  const [liquidity, setLiquidity] = useState<number>(0);
  const [kairosInsight, setKairosInsight] = useState<KairosInsight | null>(
    null,
  );

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isIntelligenceSyncing, setIsIntelligenceSyncing] = useState(false);

  const isExecuting = useRef(false);
  const fetchCount = useRef(0);

  const applyDashboardSnapshot = useCallback((snapshot: DashboardSnapshot) => {
    if (!snapshot.authenticated) return;
    setLiquidity(snapshot.liquidity);
    setLedger({
      deployments: snapshot.deployments as Deployment[],
      accounts: snapshot.accounts,
      liabilities: snapshot.liabilities,
      incomeStreams: snapshot.incomeStreams,
      goals: snapshot.goals,
      objectives: snapshot.objectives,
      baseline: snapshot.baseline,
      analytics: snapshot.analytics as AnalyticsSummary | null,
    });
    setKairosInsight(snapshot.kairosInsight);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    const requestId = ++fetchCount.current;
    try {
      const snapshot = await getDashboardSnapshotAction();
      if (requestId !== fetchCount.current) return;
      applyDashboardSnapshot(snapshot);
    } catch {
      // Fail silently for background fetches
    } finally {
      if (requestId === fetchCount.current) setIsInitialLoading(false);
    }
  }, [applyDashboardSnapshot]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      await fetchDashboardData();
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [fetchDashboardData]);

  if (isInitialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 pb-20 animate-pulse space-y-12">
        <div className="h-12 w-64 bg-foreground/5 rounded-2xl"></div>
        <div className="h-96 bg-foreground/5 rounded-4xl"></div>
      </div>
    );
  }

  if (ledger.accounts.length === 0 && ledger.baseline.length === 0) {
    return <DayZeroOnboarding onComplete={applyDashboardSnapshot} />;
  }

  return (
    <div className="space-y-24">
      {/* Zone 0 — PSYCHOLOGICAL ANCHOR (RUNWAY) */}
      <section className="pt-8 md:pt-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-foreground/5 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">
            Active Solvency Monitor
          </span>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-7xl md:text-9xl font-black text-foreground tracking-tighter tabular-nums leading-none">
            {ledger.analytics?.runwayDays !== null &&
            ledger.analytics?.runwayDays !== undefined
              ? Math.round(ledger.analytics.runwayDays)
              : "∞"}
          </h1>
          <p className="text-sm md:text-lg font-black text-foreground/40 uppercase tracking-[0.5em] mt-4">
            Days of Runway
          </p>
        </div>
        <div className="max-w-md mx-auto pt-8">
          <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, (ledger.analytics?.runwayDays ?? 0) / 3.65)}%`,
              }}
            ></div>
          </div>
          <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest mt-3">
            Deterministic survival projection :: v1.0
          </p>
        </div>
      </section>

      {/* Zone 1 — FINANCIAL POSITION */}
      <section id="overview" className="space-y-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase opacity-30">
            Current Position
          </h2>
        </div>

        <PendingInflows
          incomeStreams={ledger.incomeStreams}
          accounts={ledger.accounts}
          onSnapshot={applyDashboardSnapshot}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-foreground/[0.02] border border-foreground/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-foreground/[0.04] transition-colors">
            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">
              Net Worth
            </span>
            <span
              className={`text-4xl font-black tabular-nums ${ledger.analytics && ledger.analytics.netWorth < 0 ? "text-red-500" : "text-foreground"}`}
            >
              {formatCurrency(ledger.analytics?.netWorth || 0)}
            </span>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-4">
              Total equity
            </p>
          </div>

          <div className="bg-foreground/[0.02] border border-foreground/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-foreground/[0.04] transition-colors">
            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">
              Total Capital
            </span>
            <span className="text-4xl font-black tabular-nums text-foreground">
              {formatCurrency(liquidity)}
            </span>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-4">
              Liquid liquidity
            </p>
          </div>

          <div className="bg-foreground/[0.02] border border-foreground/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-foreground/[0.04] transition-colors">
            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">
              Monthly Inflow
            </span>
            <span className="text-4xl font-black tabular-nums text-foreground">
              {formatCurrency(ledger.analytics?.totalMonthlyIncome || 0)}
            </span>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-4">
              Replenishment velocity
            </p>
          </div>
        </div>
      </section>

      {/* Zone 2 — NEW ENTRY */}
      <section id="deploy" className="max-w-4xl mx-auto w-full">
        <div className="bg-background border border-foreground/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-background"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                New Entry
              </h2>
              <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                Strategic Allocation & Log
              </p>
            </div>
          </div>

          <NewEntryForm
            accounts={ledger.accounts}
            liquidity={liquidity}
            isActionLoading={isActionLoading}
            onSubmit={async (data) => {
              if (isExecuting.current) return;
              setIsActionLoading(true);
              isExecuting.current = true;
              setIsIntelligenceSyncing(true);
              try {
                const snapshot = await createDeploymentAction({
                  title: data.title,
                  amount: data.amount,
                  category: data.category,
                  accountId: data.accountId,
                  advancedContext: EMPTY_ADVANCED_CONTEXT,
                });
                applyDashboardSnapshot(snapshot);
              } finally {
                setIsActionLoading(false);
                isExecuting.current = false;
                setIsIntelligenceSyncing(false);
              }
            }}
          />
        </div>
      </section>

      {/* Subsections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          id="accounts"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <AccountSection
            accounts={ledger.accounts}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="liabilities"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <LiabilitySection
            liabilities={ledger.liabilities}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="income"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <IncomeSection
            incomeStreams={ledger.incomeStreams}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="baseline"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <BaselineSection
            baseline={ledger.baseline}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="objectives"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <StrategicObjectiveSection
            objectives={ledger.objectives}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="goals"
          className="bg-background border-none rounded-3xl p-6 md:p-8 scroll-mt-10"
        >
          <GoalSection
            goals={ledger.goals}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
      </div>

      {/* Zone 3 — INSIGHTS */}
      <section
        id="intelligence"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        <div
          className={`lg:col-span-8 bg-foreground border-none rounded-[2rem] p-8 md:p-12 text-background shadow-2xl min-h-64 flex flex-col justify-between transition-all duration-500 ${kairosInsight?.severity === "critical" ? "ring-4 ring-orange-500/20" : ""} ${isIntelligenceSyncing ? "opacity-70 grayscale scale-[0.98]" : "opacity-100 scale-100"}`}
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-background/10 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${kairosInsight?.severity === "critical" ? "bg-orange-500 animate-pulse" : "bg-background/20"}`}
                ></div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-background/60">
                  {kairosInsight?.category?.replace("_", " ") || "SYSTEM SCAN"}
                </span>
              </div>
              <div className="flex items-center gap-6">
                {kairosInsight && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${kairosInsight.severity === "critical" ? "text-orange-500" : kairosInsight.severity === "warning" ? "text-yellow-500/80" : "text-background/60"}`}
                  >
                    {kairosInsight.severity.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {kairosInsight ? (
                kairosInsight.isSilent ? (
                  <p className="text-lg font-medium leading-tight text-background/60 italic">
                    No material changes detected.
                  </p>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <p className="text-xl md:text-2xl font-medium leading-snug text-background">
                      {kairosInsight.message}
                    </p>
                    {kairosInsight.supportingSignals &&
                      kairosInsight.supportingSignals.length > 0 && (
                        <div className="mt-8 space-y-4">
                          {kairosInsight.supportingSignals.map(
                            (signal, idx) => (
                              <p
                                key={idx}
                                className="text-sm font-medium leading-relaxed text-background/50 border-l border-background/20 pl-6"
                              >
                                {signal}
                              </p>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                )
              ) : (
                <div className="space-y-4 opacity-20">
                  <div className="h-4 bg-background/20 rounded-full w-full"></div>
                  <div className="h-4 bg-background/20 rounded-full w-3/4"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {ledger.analytics && ledger.analytics.totalDeployed > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase opacity-30">
                Allocation
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(ledger.analytics.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const percentage =
                      (amt / ledger.analytics!.totalDeployed) * 100;
                    return (
                      <div
                        key={cat}
                        className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 hover:bg-foreground/[0.04] transition-all"
                      >
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest block mb-1">
                              {DeploymentMap[
                                cat as keyof typeof DeploymentMap
                              ] || cat}
                            </span>
                            <span className="text-lg font-black text-foreground tabular-nums">
                              {formatCurrency(amt)}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-foreground/30">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Zone 4 — HISTORY */}
      <section id="ledger" className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase opacity-30">
            History
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ledger.deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-6 hover:bg-foreground/[0.04] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center text-foreground/40">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-foreground">
                      {deployment.title}
                    </h3>
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">
                      {DeploymentMap[
                        deployment.category as keyof typeof DeploymentMap
                      ] || deployment.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl tabular-nums text-foreground">
                    {formatCurrency(deployment.amount)}
                  </p>
                  <p className="text-[9px] font-bold text-foreground/30 uppercase mt-1">
                    {new Date(deployment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zone 6 — OBSERVABILITY */}
      <section id="observability" className="space-y-12">
        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase opacity-30">
          Telemetry
        </h2>
        <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[2rem] p-8 md:p-12">
          <TelemetryDashboard />
        </div>
      </section>
    </div>
  );
}
