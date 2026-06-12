"use client";

import { useState, useCallback } from "react";
import { createDeploymentAction } from "./actions";
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
import { TelemetryDashboard } from "@/components/dashboard/TelemetryDashboard";
import { NewEntryForm } from "./NewEntryForm";
import { 
  ShieldCheck, 
  Waves, 
  Flame, 
  Timer, 
  Cpu, 
  Brain, 
  Zap, 
  Hexagon, 
  Activity,
  Database,
  RefreshCw
} from "lucide-react";
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
import { getDashboardSnapshotAction } from "./actions";

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

interface DashboardClientProps {
  initialSnapshot: DashboardSnapshot;
}

export function DashboardClient({ initialSnapshot }: DashboardClientProps) {
  const [ledger, setLedger] = useState<LedgerState>({
    deployments: initialSnapshot.deployments,
    accounts: initialSnapshot.accounts,
    liabilities: initialSnapshot.liabilities,
    incomeStreams: initialSnapshot.incomeStreams,
    goals: initialSnapshot.goals,
    objectives: initialSnapshot.objectives,
    baseline: initialSnapshot.baseline,
    analytics: initialSnapshot.analytics,
  });

  const [kairosInsight, setKairosInsight] = useState<KairosInsight | null>(
    initialSnapshot.kairosInsight,
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
    }
  }, [applyDashboardSnapshot]);

  // 1. HUD / MACRO KPI ROW
  const hudMetrics = [
    {
      label: "Sovereign Wealth",
      icon: ShieldCheck,
      value: ledger.analytics?.totalAssets || 0,
      prefix: "KES ",
      desc: "Total Capitalized Architecture",
      chartType: "sparkline",
      chartColor: "var(--truth)",
      chartData: [100, 110, 105, 120, 115, 130, 140],
    },
    {
      label: "Liquid Capital",
      icon: Waves,
      value: ledger.analytics?.liquidity || 0,
      prefix: "KES ",
      desc: "Immediate Deployment Capacity",
      chartType: "sparkline",
      chartColor: "var(--truth)",
      chartData: [50, 45, 60, 55, 70, 65, 80],
    },
    {
      label: "Structural Burn",
      icon: Flame,
      value: ledger.analytics?.totalStructuralMonthlyBurn || 0,
      prefix: "KES ",
      suffix: " /mo",
      desc: "Operational Maintenance Cost",
      chartType: "bar",
      chartColor: "var(--leakage)",
      chartData: [20, 22, 18, 25, 20, 24, 21],
    },
    {
      label: "Operational Runway",
      icon: Timer,
      value: ledger.analytics?.runwayDays || 0,
      suffix: " DAYS",
      desc: "Time to Critical Depletion",
      chartType: "donut",
      chartColor: "var(--opportunity)",
      chartData: [],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto p-4 md:p-8 pb-32 space-y-12 md:space-y-16 font-mono"
    >
      {/* HEADER SECTION - CLINICAL */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.4em] text-truth uppercase font-bold">
            AXIOM // STRATEGIC COMMAND
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">
            Architect <span className="text-zinc-500">Session</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchDashboardData}
            className="group px-6 py-2 border border-white/10 bg-zinc-900/50 rounded-sm text-[9px] tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 text-zinc-400"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Sync Intel
          </button>
        </div>
      </motion.header>

      {/* ZONE 1: THE HUD (Macro KPIs) */}
      <motion.section
        id="overview"
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {hudMetrics.map((metric) => (
          <div
            key={metric.label}
            className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm group hover:border-truth/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <p className="text-[9px] tracking-[0.2em] text-zinc-500 uppercase font-bold group-hover:text-zinc-300 transition-colors">
                  {metric.label}
                </p>
                <metric.icon strokeWidth={1.5} size={16} className="text-zinc-600 group-hover:text-truth transition-colors" />
              </div>
              <div className="space-y-1 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[clamp(1.25rem,5vw,2.25rem)] font-bold text-white tabular-nums tracking-tighter leading-none">
                    <AnimatedNumber
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      compact={true}
                    />
                  </h3>
                </div>
                <p className="text-[8px] tracking-[0.1em] text-zinc-700 uppercase group-hover:text-zinc-500 transition-colors">
                  {metric.desc}
                </p>
              </div>
            </div>

            {/* Chart Area */}
            {metric.chartType === "sparkline" && (
              <div className="mt-6 -mx-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <MiniSparkline
                  data={metric.chartData}
                  color={metric.chartColor}
                />
              </div>
            )}
            {metric.chartType === "bar" && (
              <div className="mt-6 -mx-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <MiniBarChart
                  data={metric.chartData}
                  color={metric.chartColor}
                />
              </div>
            )}
            {metric.chartType === "donut" && (
              <div className="mt-6 w-full -mx-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <MiniDonut
                  value={metric.value}
                  max={365}
                  color={metric.chartColor}
                />
              </div>
            )}
          </div>
        ))}
      </motion.section>

      {/* ZONE 2: ARCHITECTURE DEPLOYMENT */}
      <motion.section id="deploy" variants={itemVariants} className="w-full">
        <div className="p-8 md:p-12 bg-[#0a0a0a] border border-white/10 rounded-sm">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="space-y-4 md:w-1/3">
              <div className="flex w-10 h-10 bg-truth/10 items-center justify-center border border-truth/20">
                <Cpu strokeWidth={1.5} size={20} className="text-truth" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                Capital Deployment
              </h2>
              <p className="text-[10px] tracking-tight text-zinc-500 uppercase leading-relaxed">
                Execute resource allocation. Log deployments and dictate the flow of
                capital across the architecture.
              </p>
            </div>
            <div className="md:w-2/3 w-full bg-black/40 p-6 border border-white/5">
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
        </div>
      </motion.section>

      {/* ZONE 3: KAIROS INTELLIGENCE */}
      <motion.section
        id="intelligence"
        variants={itemVariants}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <span className="text-zinc-700 text-lg font-bold">01.</span>
            <Brain strokeWidth={1.5} size={20} className="text-truth" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">
            Kairos Intel
          </h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <KairosNarrative insight={kairosInsight} />
      </motion.section>

      {/* ZONE 4: THE LEDGER */}
      <motion.div
        id="ledger"
        variants={itemVariants}
        className="space-y-12 md:space-y-24"
      >
        {/* CAPITAL ACCOUNTS - NOW ON TOP */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <span className="text-zinc-700 text-lg font-bold">02.</span>
              <Database strokeWidth={1.5} size={20} className="text-truth" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">
              Capital Accounts
            </h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
            <AccountSection
              accounts={ledger.accounts}
              onSnapshot={applyDashboardSnapshot}
            />
          </div>
        </section>

        {/* TACTICAL & STRATEGIC GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* LEFT COLUMN: TACTICAL ENGINE */}
          <section className="space-y-12">
            {/* PENDING ACTIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-700 text-lg font-bold">03.</span>
                  <Zap strokeWidth={1.5} size={20} className="text-warning" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  Tactical Units
                </h2>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="space-y-3">
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

            <div className="space-y-6">
              <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
                <IncomeSection
                  incomeStreams={ledger.incomeStreams}
                  onSnapshot={applyDashboardSnapshot}
                />
              </div>
              <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
                <BaselineSection
                  baseline={ledger.baseline}
                  onSnapshot={applyDashboardSnapshot}
                />
              </div>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
              <LiabilitySection
                liabilities={ledger.liabilities}
                onSnapshot={applyDashboardSnapshot}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: STRATEGIC ENGINE */}
          <section className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-700 text-lg font-bold">04.</span>
                  <Hexagon strokeWidth={1.5} size={20} className="text-truth" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  Strategic Alignment
                </h2>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
                <StrategicObjectiveSection
                  objectives={ledger.objectives}
                  onSnapshot={applyDashboardSnapshot}
                />
              </div>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
              <GoalSection
                goals={ledger.goals}
                onSnapshot={applyDashboardSnapshot}
              />
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm">
              <HistoricalAudit deployments={ledger.deployments} />
            </div>

            {/* OBSERVABILITY */}
            <section className="opacity-40 hover:opacity-100 transition-opacity duration-500 border-t border-white/5 pt-12">
              <div className="flex items-center gap-4 md:gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-700 text-lg font-bold">05.</span>
                  <Activity strokeWidth={1.5} size={20} className="text-truth" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                  Telemetry
                </h2>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <TelemetryDashboard />
            </section>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
