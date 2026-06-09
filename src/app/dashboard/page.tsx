"use client";

import { useEffect, useState, useCallback } from "react";
import { getDashboardSnapshotAction, createDeploymentAction } from "./actions";
import { type DashboardSnapshot } from "@/lib/dashboard/types";
import { AccountSection } from "./AccountSection";
import { LiabilitySection } from "./LiabilitySection";
import { IncomeSection } from "./IncomeSection";
import { GoalSection } from "./GoalSection";
import { StrategicObjectiveSection } from "./StrategicObjectiveSection";
import { BaselineSection } from "./BaselineSection";
import { motion } from "framer-motion";
import { PendingInflows } from "./PendingInflows";
import { PendingLiabilities } from "./PendingLiabilities";
import { PendingBaselines } from "./PendingBaselines";
import { HistoricalAudit } from "./HistoricalAudit";
import { KairosNarrative } from "@/components/dashboard/KairosNarrative";
import {
  MiniSparkline,
  MiniBarChart,
  MiniDonut,
} from "@/components/dashboard/MiniCharts";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { TelemetryDashboard } from "@/components/dashboard/TelemetryDashboard";
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
import type { KairosInsight } from "@/lib/ai/kairos";
import { formatCurrency } from "@/lib/utils/formatters";

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

export default function DashboardPage() {
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

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [kairosInsight, setKairosInsight] = useState<KairosInsight | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const applyDashboardSnapshot = useCallback((snapshot: DashboardSnapshot) => {
    setLedger({
      deployments: snapshot.deployments,
      accounts: snapshot.accounts,
      liabilities: snapshot.liabilities,
      incomeStreams: snapshot.incomeStreams,
      goals: snapshot.goals,
      objectives: snapshot.objectives,
      baseline: snapshot.baseline,
      analytics: snapshot.analytics,
    });
    setKairosInsight(snapshot.kairosInsight);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const snapshot = await getDashboardSnapshotAction();
      applyDashboardSnapshot(snapshot);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [applyDashboardSnapshot]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
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

  // 1. HUD / MACRO KPI ROW
  const hudMetrics = [
    {
      label: "Sovereign Wealth",
      value: ledger.analytics?.totalAssets || 0,
      prefix: "KES ",
      desc: "Total Capitalized Architecture",
      chartType: "sparkline",
      chartColor: "#8b5cf6", // Purple
      chartData: [100, 110, 105, 120, 115, 130, 140],
    },
    {
      label: "Liquid Capital",
      value: ledger.analytics?.liquidity || 0,
      prefix: "KES ",
      desc: "Immediate Deployment Capacity",
      chartType: "sparkline",
      chartColor: "#3b82f6", // Blue
      chartData: [50, 45, 60, 55, 70, 65, 80],
    },
    {
      label: "Structural Burn",
      value: ledger.analytics?.totalStructuralMonthlyBurn || 0,
      prefix: "KES ",
      suffix: " /mo",
      desc: "Operational Maintenance Cost",
      chartType: "bar",
      chartColor: "#ef4444", // Red
      chartData: [20, 22, 18, 25, 20, 24, 21],
    },
    {
      label: "Operational Runway",
      value: ledger.analytics?.runwayDays || 0,
      suffix: " DAYS",
      desc: "Time to Critical Depletion",
      chartType: "donut",
      chartColor: "#10b981", // Emerald
      chartData: [],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto p-6 md:p-12 pb-32 space-y-24"
    >
      {/* HEADER SECTION */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12"
      >
        <div className="space-y-4">
          <p className="font-mono text-[10px] tracking-[0.6em] text-white/20 uppercase">
            Strategic Command Center // v1.0
          </p>
          <h1 className="font-cormorant text-6xl text-white tracking-tight leading-none">
            Welcome, <span className="italic">Architect.</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 border border-white/10 rounded-full font-mono text-[9px] tracking-widest uppercase hover:bg-white/5 transition-all active:scale-95"
          >
            Refresh Intel
          </button>
        </div>
      </motion.header>

      {/* ZONE 1: THE HUD (Macro KPIs) */}
      <motion.section
        id="overview"
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {hudMetrics.map((metric, i) => (
          <LuxuryCard
            key={metric.label}
            className="p-8 group hover:border-white/20 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <p className="font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase group-hover:text-white/40 transition-colors">
                {metric.label}
              </p>
              <div className="space-y-1 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cormorant text-4xl text-white">
                    <AnimatedNumber
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  </h3>
                </div>
                <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest group-hover:text-white/20 transition-colors">
                  {metric.desc}
                </p>
              </div>
            </div>

            {/* Chart Area */}
            {metric.chartType === "sparkline" && (
              <div className="mt-4 -mx-2">
                <MiniSparkline
                  data={metric.chartData}
                  color={metric.chartColor}
                />
              </div>
            )}
            {metric.chartType === "bar" && (
              <div className="mt-4 -mx-2">
                <MiniBarChart
                  data={metric.chartData}
                  color={metric.chartColor}
                />
              </div>
            )}
            {metric.chartType === "donut" && (
              <div className="mt-4 w-full -mx-2">
                <MiniDonut
                  value={metric.value}
                  max={365}
                  color={metric.chartColor}
                />
              </div>
            )}
          </LuxuryCard>
        ))}
      </motion.section>

      {/* ZONE 2: ARCHITECTURE DEPLOYMENT (NewEntryForm) */}
      <motion.section id="deploy" variants={itemVariants} className="w-full">
        <LuxuryCard className="p-8 md:p-16 border-white/10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="space-y-4 md:w-1/3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <h2 className="font-cormorant text-4xl text-white">
                Architecture Deployment
              </h2>
              <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase leading-relaxed">
                Log deployments, allocate capital, and dictate the flow of
                resources through your system.
              </p>
            </div>
            <div className="md:w-2/3 w-full">
              <NewEntryForm
                accounts={ledger.accounts}
                liquidity={ledger.analytics?.liquidity || 0}
                isActionLoading={isExecuting}
                onSubmit={async (data) => {
                  if (isExecuting) return;
                  setIsExecuting(true);
                  try {
                    const snapshot = await createDeploymentAction({
                      title: data.title,
                      amount: data.amount,
                      category: data.category,
                      accountId: data.accountId,
                    });
                    applyDashboardSnapshot(snapshot);
                  } finally {
                    setIsExecuting(false);
                  }
                }}
              />
            </div>
          </div>
        </LuxuryCard>
      </motion.section>

      {/* ZONE 3: KAIROS INTELLIGENCE */}
      <motion.section
        id="intelligence"
        variants={itemVariants}
        className="space-y-12"
      >
        <div className="flex items-center gap-6">
          <span className="font-cormorant italic text-3xl text-white/20">
            I.
          </span>
          <h2 className="font-cormorant text-4xl text-white tracking-wide">
            Kairos Intelligence
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <KairosNarrative insight={kairosInsight} />
      </motion.section>

      {/* ZONE 4: TACTICAL & STRATEGIC GRID */}
      <motion.div
        id="ledger"
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-24"
      >
        {/* LEFT COLUMN: TACTICAL ENGINE */}
        <section className="space-y-12 lg:space-y-24">
          {/* PENDING ACTIONS */}
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <span className="font-cormorant italic text-3xl text-white/20">
                II.
              </span>
              <h2 className="font-cormorant text-4xl text-white tracking-wide">
                Tactical Response
              </h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="space-y-6">
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
              <PendingBaselines
                baseline={ledger.baseline}
                accounts={ledger.accounts}
                onSnapshot={applyDashboardSnapshot}
              />
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12">
            <LuxuryCard className="p-6 md:p-10">
              <IncomeSection
                incomeStreams={ledger.incomeStreams}
                onSnapshot={applyDashboardSnapshot}
              />
            </LuxuryCard>
            <LuxuryCard className="p-6 md:p-10">
              <BaselineSection
                baseline={ledger.baseline}
                onSnapshot={applyDashboardSnapshot}
              />
            </LuxuryCard>
          </div>

          <LuxuryCard className="p-6 md:p-10">
            <LiabilitySection
              liabilities={ledger.liabilities}
              onSnapshot={applyDashboardSnapshot}
            />
          </LuxuryCard>

          <LuxuryCard className="p-6 md:p-10">
            <AccountSection
              accounts={ledger.accounts}
              onSnapshot={applyDashboardSnapshot}
            />
          </LuxuryCard>
        </section>

        {/* RIGHT COLUMN: STRATEGIC ENGINE */}
        <section className="space-y-12 lg:space-y-24">
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <span className="font-cormorant italic text-3xl text-white/20">
                III.
              </span>
              <h2 className="font-cormorant text-4xl text-white tracking-wide">
                Strategic Alignment
              </h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <LuxuryCard className="p-6 md:p-10">
              <StrategicObjectiveSection
                objectives={ledger.objectives}
                onSnapshot={applyDashboardSnapshot}
              />
            </LuxuryCard>
          </div>

          <LuxuryCard className="p-6 md:p-10">
            <GoalSection
              goals={ledger.goals}
              onSnapshot={applyDashboardSnapshot}
            />
          </LuxuryCard>

          <LuxuryCard className="p-6 md:p-10">
            <HistoricalAudit deployments={ledger.deployments} />
          </LuxuryCard>

          {/* OBSERVABILITY */}
          <section className="opacity-20 hover:opacity-100 transition-opacity duration-1000">
            <div className="flex items-center gap-6 mb-12">
              <span className="font-cormorant italic text-3xl text-white/20">
                IV.
              </span>
              <h2 className="font-cormorant text-4xl text-white tracking-wide">
                System Telemetry
              </h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <TelemetryDashboard />
          </section>
        </section>
      </motion.div>
    </motion.div>
  );
}
