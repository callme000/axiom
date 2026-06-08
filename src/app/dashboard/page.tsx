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
import { PendingLiabilities } from "./PendingLiabilities";
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
      // Fail silently
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
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center px-8 md:px-12 animate-pulse">
        <div className="max-w-7xl w-full h-[600px] grid lg:grid-cols-[1.1fr_1.4fr] gap-16 md:gap-24 items-stretch">
          <div className="flex flex-col justify-center h-full border-r border-white/5 pr-12 space-y-6">
            <div className="h-32 w-48 bg-white/5 rounded-2xl" />
            <div className="h-16 w-64 bg-white/10 rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded-full" />
              <div className="h-4 w-5/6 bg-white/5 rounded-full" />
              <div className="h-4 w-4/6 bg-white/5 rounded-full" />
            </div>
          </div>
          <div className="h-full bg-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-14 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="h-8 w-48 bg-white/5 rounded-lg" />
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                  <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                  <div className="h-12 bg-white/5 rounded-lg border-b border-white/10" />
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-12">
              <div className="h-14 w-64 bg-white/5 rounded-full border border-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ledger.accounts.length === 0 && ledger.baseline.length === 0) {
    return <DayZeroOnboarding onComplete={applyDashboardSnapshot} />;
  }

  return (
    <div className="space-y-32">
      {/* Zone 0 — PSYCHOLOGICAL ANCHOR (SOLVENCY) */}
      <section className="text-center space-y-8 animate-in fade-in duration-1000">
        <div className="inline-flex items-center gap-4 px-6 py-2 border border-white/10 backdrop-blur-sm rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">
            Structural Solvency Window
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="font-cormorant italic text-2xl text-white/40 mb-2">
            Remaining Capital Life
          </div>
          <h1 className="font-cormorant text-8xl md:text-[10rem] text-white tracking-tighter tabular-nums leading-none">
            {ledger.analytics?.runwayDays !== null &&
            ledger.analytics?.runwayDays !== undefined
              ? Math.round(ledger.analytics.runwayDays)
              : "∞"}
            <span className="text-2xl font-sans font-light text-white/20 ml-4 tracking-widest uppercase">
              Days
            </span>
          </h1>
        </div>

        <div className="max-w-xl mx-auto pt-12 space-y-4">
          <div className="h-px w-full bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-white/60 transition-all duration-2000 ease-out"
              style={{
                width: `${Math.min(100, (ledger.analytics?.runwayDays ?? 0) / 3.65)}%`,
              }}
            ></div>
          </div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
            Deterministic survival projection :: v1.0
          </p>
        </div>
      </section>

      {/* Zone 1 — FINANCIAL POSITION */}
      <section id="overview" className="space-y-16">
        <div className="flex items-center gap-6">
          <span className="font-cormorant italic text-3xl text-white/20">
            I.
          </span>
          <h2 className="font-cormorant text-4xl text-white tracking-wide">
            Financial Position
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <PendingInflows
          incomeStreams={ledger.incomeStreams}
          accounts={ledger.accounts}
          onSnapshot={applyDashboardSnapshot}
        />

        <PendingLiabilities
          liabilities={ledger.liabilities}
          accounts={ledger.accounts}
          onSnapshot={applyDashboardSnapshot}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Net Worth",
              value: formatCurrency(ledger.analytics?.netWorth || 0),
              sub: "Total Equity",
            },
            {
              label: "Total Capital",
              value: formatCurrency(liquidity),
              sub: "Liquid Assets",
            },
            {
              label: "Monthly Income",
              value: formatCurrency(ledger.analytics?.totalMonthlyIncome || 0),
              sub: "Replenishment",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white/2 border border-white/5 p-10 group hover:bg-white hover:text-black transition-all duration-500"
            >
              <span className="text-[10px] font-mono text-white/40 group-hover:text-black/40 uppercase tracking-[0.3em] mb-8 block">
                {card.label}
              </span>
              <span className="font-cormorant text-4xl md:text-5xl block mb-4 transition-transform group-hover:translate-x-2">
                {card.value}
              </span>
              <p className="text-[9px] font-mono text-white/20 group-hover:text-black/20 uppercase tracking-widest">
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Zone 2 — ARCHITECTURE ENTRY */}
      <section id="deploy" className="max-w-4xl mx-auto w-full">
        <div className="bg-white/2 border border-white/5 p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>

          <div className="flex items-center gap-8 mb-16">
            <span className="font-cormorant italic text-3xl text-white/20">
              II.
            </span>
            <div className="space-y-2">
              <h2 className="font-cormorant text-5xl text-white leading-none">
                Architecture Deployment
              </h2>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.4em]">
                Strategic Capital Allocation
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div
          id="accounts"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <AccountSection
            accounts={ledger.accounts}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="liabilities"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <LiabilitySection
            liabilities={ledger.liabilities}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="income"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <IncomeSection
            incomeStreams={ledger.incomeStreams}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="baseline"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <BaselineSection
            baseline={ledger.baseline}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="objectives"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <StrategicObjectiveSection
            objectives={ledger.objectives}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
        <div
          id="goals"
          className="bg-white/2 border border-white/5 p-10 transition-all hover:border-white/20"
        >
          <GoalSection
            goals={ledger.goals}
            onSnapshot={applyDashboardSnapshot}
          />
        </div>
      </div>

      {/* Zone 3 — INTELLIGENCE */}
      <section id="intelligence" className="space-y-16">
        <div className="flex items-center gap-6">
          <span className="font-cormorant italic text-3xl text-white/20">
            III.
          </span>
          <h2 className="font-cormorant text-4xl text-white tracking-wide">
            Kairos Intelligence
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div
            className={`lg:col-span-8 bg-white p-12 md:p-20 text-black flex flex-col justify-between transition-all duration-700 ${isIntelligenceSyncing ? "opacity-50 grayscale" : "opacity-100"}`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-8 mb-12">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${kairosInsight?.severity === "critical" ? "bg-red-600 animate-pulse" : "bg-black/20"}`}
                  ></div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/40">
                    {kairosInsight?.category?.replace("_", " ") ||
                      "SESSION MONITOR"}
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
                  {kairosInsight?.severity.toUpperCase() || "NORMAL"}
                </span>
              </div>

              <div className="space-y-8">
                {kairosInsight ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="font-cormorant text-4xl md:text-5xl leading-tight">
                      {kairosInsight.message}
                    </p>
                    {kairosInsight.supportingSignals?.map((signal, idx) => (
                      <p
                        key={idx}
                        className="mt-8 text-black/50 text-lg font-light italic leading-relaxed pl-8 border-l border-black/10"
                      >
                        {signal}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 opacity-10">
                    <div className="h-4 bg-black rounded w-full" />
                    <div className="h-4 bg-black rounded w-3/4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <h3 className="font-cormorant italic text-3xl text-white/60">
              Capital Allocation
            </h3>
            <div className="space-y-8">
              {ledger.analytics &&
                Object.entries(ledger.analytics.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const percentage =
                      (amt / ledger.analytics!.totalDeployed) * 100;
                    return (
                      <div key={cat} className="space-y-4 group cursor-default">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                            {DeploymentMap[cat as keyof typeof DeploymentMap] ||
                              cat}
                          </span>
                          <span className="font-cormorant text-xl text-white group-hover:text-white transition-colors">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div className="h-px w-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-white/60 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>

      {/* Zone 4 — LEDGER */}
      <section id="ledger" className="space-y-16">
        <div className="flex items-center gap-6">
          <span className="font-cormorant italic text-3xl text-white/20">
            IV.
          </span>
          <h2 className="font-cormorant text-4xl text-white tracking-wide">
            Capital Ledger
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="space-y-4">
          {ledger.deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-white/5 hover:bg-white/1 transition-all"
            >
              <div className="space-y-1">
                <h3 className="font-cormorant text-2xl text-white transition-transform group-hover:translate-x-2">
                  {deployment.title}
                </h3>
                <p className="text-[9px] font-mono tracking-[0.4em] text-white/20 uppercase">
                  {DeploymentMap[
                    deployment.category as keyof typeof DeploymentMap
                  ] || deployment.category}
                </p>
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="font-cormorant text-2xl text-white">
                  {formatCurrency(deployment.amount)}
                </p>
                <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
                  {new Date(deployment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OBSERVABILITY */}
      <section className="pt-32 opacity-20">
        <TelemetryDashboard />
      </section>
    </div>
  );
}
