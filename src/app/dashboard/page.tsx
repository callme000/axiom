"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/lib/db/deployments";
import { saveInsight, getInsights } from "@/lib/db/insights";
import { getUserSettings, updateLiquidity } from "@/lib/db/settings";
import { generateKairosAIInsight, KairosInsight } from "@/lib/ai/kairos";
import { generateSummary, AnalyticsSummary } from "@/lib/analytics";

type Deployment = {
  id: string;
  title: string;
  amount: number;
  created_at: string;
  category?: string | null;
};

interface LedgerState {
  deployments: Deployment[];
  analytics: AnalyticsSummary | null;
}

/**
 * UTILITY: Consistent Currency Formatting
 * Forces lowercase 'h' as requested.
 */
const formatKSh = (amt: number) => {
  return `KSh ${Math.round(amt).toLocaleString()}`;
};

export default function Dashboard() {
  // ATOMIC DATA STATE
  const [ledger, setLedger] = useState<LedgerState>({
    deployments: [],
    analytics: null,
  });
  const [liquidity, setLiquidity] = useState<number>(0);
  const [category, setCategory] = useState("Unclassified");
  const [kairosInsight, setKairosInsight] = useState<KairosInsight | null>(
    null,
  );

  // FORM STATE
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // EXECUTION LOCKS
  const isExecuting = useRef(false);
  const fetchCount = useRef(0);

  // LOADING & ERROR STATES
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLiquidityLoading, setIsLiquidityLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isIntelligenceSyncing, setIsIntelligenceSyncing] = useState(false);

  // ERROR STATES
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [liquidityError, setLiquidityError] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "Unclassified",
  });
  const [isEditingLiquidity, setIsEditingLiquidity] = useState(false);
  const [liquidityInput, setLiquidityInput] = useState("");

  /**
   * REFRESH & ANALYZE (Centralized Intelligence Trigger)
   */
  const refreshAndReAnalyze = useCallback(
    async (userId: string, currentLiquidity: number) => {
      setIsIntelligenceSyncing(true);
      try {
        const data = await getDeployments();
        const castedData = (data || []) as Deployment[];

        setLedger({
          deployments: castedData,
          analytics: generateSummary(castedData, currentLiquidity),
        });

        const insight = await generateKairosAIInsight(
          castedData,
          currentLiquidity,
          kairosInsight,
        );
        if (insight.is_new_signal) {
          await saveInsight(insight, userId);
        }
        setKairosInsight(insight);
      } catch {
        setGlobalError("Behavioral sync lagging. Data integrity maintained.");
      } finally {
        setIsIntelligenceSyncing(false);
      }
    },
    [kairosInsight],
  );

  const fetchDashboardData = useCallback(async () => {
    const requestId = ++fetchCount.current;
    setGlobalError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const [deploymentsData, settings] = await Promise.all([
        getDeployments(),
        getUserSettings(),
      ]);

      if (requestId !== fetchCount.current) return;

      const castedDeployments = (deploymentsData || []) as Deployment[];
      const currentLiquidity = Number(settings.total_liquidity);

      setLiquidity(currentLiquidity);
      setLiquidityInput(currentLiquidity.toString());

      setLedger({
        deployments: castedDeployments,
        analytics: generateSummary(castedDeployments, currentLiquidity),
      });

      const savedInsights = await getInsights(1);
      if (
        requestId === fetchCount.current &&
        savedInsights &&
        savedInsights.length > 0
      ) {
        setKairosInsight(savedInsights[0]);
      } else if (requestId === fetchCount.current) {
        const initial = await generateKairosAIInsight(
          [],
          currentLiquidity,
          null,
        );
        setKairosInsight(initial);
      }
    } catch {
      setGlobalError("Connectivity failure. Intelligence layer offline.");
    } finally {
      if (requestId === fetchCount.current) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  async function handleAddDeployment(e: React.FormEvent) {
    e.preventDefault();
    if (isExecuting.current) return;

    setIsActionLoading(true);
    setFormError(null);
    isExecuting.current = true;

    try {
      if (category === "Unclassified") {
        throw new Error("Strategic classification required");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Session unverified");

      await createDeployment(title, Number(amount), user.id, category);

      setTitle("");
      setAmount("");
      setCategory("Unclassified");

      await refreshAndReAnalyze(user.id, liquidity);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Deployment failed");
    } finally {
      setIsActionLoading(false);
      isExecuting.current = false;
    }
  }

  async function handleUpdateLiquidity() {
    if (isExecuting.current) return;
    setIsLiquidityLoading(true);
    setLiquidityError(null);
    isExecuting.current = true;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthenticated");

      const newAmount = Number(liquidityInput);
      if (isNaN(newAmount)) throw new Error("Invalid value");

      await updateLiquidity(newAmount);
      setLiquidity(newAmount);
      setIsEditingLiquidity(false);

      await refreshAndReAnalyze(user.id, newAmount);
    } catch {
      setLiquidityError("Update failed");
    } finally {
      setIsLiquidityLoading(false);
      isExecuting.current = false;
    }
  }

  async function handleDelete(id: string) {
    if (isExecuting.current) return;
    if (!confirm("Permanent deletion cannot be undone. Proceed?")) return;

    setDeletingId(id);
    isExecuting.current = true;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await deleteDeployment(id);
      await refreshAndReAnalyze(user.id, liquidity);
    } catch {
      setGlobalError("Deletion interrupted.");
    } finally {
      setDeletingId(null);
      isExecuting.current = false;
    }
  }

  function startEdit(deployment: Deployment) {
    setEditingId(deployment.id);
    setEditForm({
      title: deployment.title,
      amount: deployment.amount.toString(),
      category: deployment.category || "Unclassified",
    });
  }

  async function handleUpdate(id: string) {
    if (isExecuting.current) return;
    setUpdatingId(id);
    isExecuting.current = true;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (!editForm.title.trim()) throw new Error("Title required");
      if (Number(editForm.amount) <= 0) throw new Error("Amount invalid");

      await updateDeployment(id, {
        title: editForm.title,
        amount: Number(editForm.amount),
        category: editForm.category,
      });
      setEditingId(null);
      await refreshAndReAnalyze(user.id, liquidity);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
      isExecuting.current = false;
    }
  }

  if (isInitialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 pb-20 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="h-12 w-64 bg-foreground/5 rounded-2xl"></div>
            <div className="h-4 w-48 bg-foreground/5 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-96 bg-foreground/5 rounded-4xl"></div>
          <div className="lg:col-span-8 h-96 bg-foreground/5 rounded-4xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase">
            AXIOM <span className="hidden md:inline">::</span>{" "}
            <span className="text-gray-500">DASHBOARD</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
            Financial Intelligence System v2.1-FORCE-SYNC
          </p>
        </div>

        <div className="flex gap-4">
          <div
            className={`bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-40 relative group cursor-pointer transition-colors ${liquidityError ? "border-red-500/50 bg-red-500/5" : "border-foreground/5"}`}
            onClick={() =>
              !isEditingLiquidity &&
              !isLiquidityLoading &&
              setIsEditingLiquidity(true)
            }
          >
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              {liquidityError ? "Update Error" : "Total Liquidity"}
            </span>
            {isEditingLiquidity ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  type="number"
                  disabled={isLiquidityLoading}
                  value={liquidityInput}
                  onChange={(e) => setLiquidityInput(e.target.value)}
                  className="bg-background border-none rounded p-1 text-center font-black text-lg w-full focus:outline-none disabled:opacity-50"
                />
                <button
                  disabled={isLiquidityLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateLiquidity();
                  }}
                  className="bg-foreground text-background text-[8px] font-black py-1 rounded disabled:opacity-50"
                >
                  {isLiquidityLoading ? "SYNCING..." : "SAVE TRUTH"}
                </button>
              </div>
            ) : (
              <>
                <span className="text-2xl font-black tabular-nums text-foreground text-center">
                  {formatKSh(liquidity)}
                </span>
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    Edit Liquidity
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-40 border-foreground/5">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Daily Burn
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground text-center">
              {formatKSh(ledger.analytics?.dailyBurnRate || 0)}
            </span>
          </div>
        </div>
      </div>

      {globalError && (
        <div className="mb-10 bg-red-500/10 border-2 border-red-500/20 p-8 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-1">
                System Anomaly Detected
              </h3>
              <p className="text-red-600/70 text-xs font-bold uppercase tracking-widest leading-tight max-w-md">
                {globalError}
              </p>
            </div>
          </div>
          <button
            disabled={isInitialLoading}
            onClick={fetchDashboardData}
            className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10 disabled:opacity-50"
          >
            Attempt Re-Sync
          </button>
        </div>
      )}

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-opacity duration-500 ${globalError && !isInitialLoading && ledger.deployments.length === 0 ? "opacity-40 pointer-events-none grayscale" : "opacity-100"}`}
      >
        {/* Left Sidebar: Controls & Intelligence */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-foreground/5 blur-3xl rounded-full transition-all group-hover:bg-foreground/10"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-background"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  Deploy Capital
                </h2>
              </div>

              <form onSubmit={handleAddDeployment} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                    Capital Designation
                  </label>
                  <input
                    type="text"
                    disabled={isActionLoading}
                    placeholder="e.g. Asset Acquisition"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-medium disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                      Amount (KSh)
                    </label>
                    <input
                      type="number"
                      disabled={isActionLoading}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-bold tabular-nums disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                      Category
                    </label>
                    <select
                      disabled={isActionLoading}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className={`w-full border-2 rounded-2xl p-4 focus:outline-none transition-colors font-bold appearance-none cursor-pointer disabled:opacity-50 ${category === "Unclassified" ? "border-orange-500/30 text-orange-500/60 bg-orange-500/5" : "border-foreground/10 bg-background text-foreground"}`}
                    >
                      <option value="Unclassified">-- SELECT TYPE --</option>
                      <option value="Asset">Asset</option>
                      <option value="Skill">Skill</option>
                      <option value="Leverage">Leverage</option>
                      <option value="Experience">Experience</option>
                      <option value="Leakage">Leakage</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-500/10 border-2 border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-red-500 shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs font-black text-red-600 uppercase tracking-tight leading-tight">
                      {formError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isActionLoading}
                  className={`w-full px-4 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl ${formError ? "bg-red-600 text-white shadow-red-500/20" : "bg-foreground text-background shadow-foreground/10"}`}
                >
                  {isActionLoading ? "PROCESSING..." : "EXECUTE DEPLOYMENT"}
                </button>
              </form>
            </div>
          </div>

          {/* Behavioral Presence Section */}
          <div
            className={`bg-foreground border rounded-3xl p-8 text-background shadow-2xl min-h-50 flex flex-col justify-between transition-all duration-500 ${kairosInsight?.severity === "critical" ? "ring-4 ring-orange-500/50" : ""} ${isIntelligenceSyncing ? "opacity-70 grayscale scale-[0.98]" : "opacity-100 scale-100"}`}
          >
            <div>
              <div className="flex items-center gap-2 mb-6 opacity-60">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Kairos Presence ::{" "}
                  {kairosInsight?.category?.replace("_", " ") || "STANDBY"}
                </span>
              </div>

              <div className="space-y-4">
                {kairosInsight ? (
                  <div
                    className={`transition-all duration-700 ${kairosInsight.is_new_signal ? "animate-in fade-in slide-in-from-bottom-2" : ""}`}
                  >
                    <p
                      className={`text-lg font-bold leading-tight italic ${kairosInsight.severity === "critical" ? "text-orange-400" : "text-background"}`}
                    >
                      &ldquo;{kairosInsight.message}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-5 border-t border-background/10 pt-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                          Reliability
                        </span>
                        <span className="text-xs font-black">
                          {(kairosInsight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                          Status
                        </span>
                        <span
                          className={`text-xs font-black uppercase ${kairosInsight.severity === "critical" ? "text-orange-400" : "text-blue-300"}`}
                        >
                          {kairosInsight.severity}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                          Observation
                        </span>
                        <span className="text-xs font-black uppercase text-gray-400">
                          {new Date(kairosInsight.timestamp).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 opacity-30">
                    <div className="h-4 bg-background/20 rounded-full w-full"></div>
                    <div className="h-4 bg-background/20 rounded-full w-2/3"></div>
                    <p className="text-[10px] font-bold uppercase mt-4 tracking-widest">
                      Awaiting signal for behavioral interpretation...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {ledger.analytics && (
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full animate-pulse"></span>
                    Projected Runway:{" "}
                    {ledger.analytics.runwayDays
                      ? `${Math.round(ledger.analytics.runwayDays)} Days`
                      : "Stable"}
                  </div>
                </div>
                <p className="text-[8px] font-bold text-background/40 uppercase tracking-tight">
                  * Calculated against {formatKSh(liquidity)} operational truth
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main: Analysis & History */}
        <div className="lg:col-span-8 space-y-10">
          {/* Empty State: Aliveness / Onboarding */}
          {ledger.deployments.length === 0 && !globalError && (
            <div className="bg-foreground/5 border-2 border-dashed border-foreground/10 rounded-4xl p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-foreground/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-foreground">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase mb-4">
                  Establish Financial Truth
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10">
                  Axiom is observing your capital behavior. Begin by deploying
                  funds into Assets, Skills, or Leverage to initialize the
                  intelligence engine.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-xs font-black text-foreground">
                      LEAD
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest leading-tight">
                      Assets generate future value
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-xs font-black text-foreground">
                      GROW
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest leading-tight">
                      Skills improve earning ability
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-xs font-black text-foreground">
                      MULTIPLY
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest leading-tight">
                      Leverage saves operational time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Capital Allocation Section */}
          {ledger.analytics && ledger.analytics.totalDeployed > 0 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Capital Allocation
                </h2>
                <div className="h-0.5 w-12 bg-foreground/10"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ledger.analytics.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const percentage =
                      (amt / ledger.analytics!.totalDeployed) * 100;
                    return (
                      <div
                        key={cat}
                        className="bg-background border rounded-4xl p-5 shadow-sm hover:border-foreground/20 transition-all group"
                      >
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">
                              {cat}
                            </span>
                            <span className="text-lg font-black text-foreground tabular-nums group-hover:text-black dark:group-hover:text-white">
                              {formatKSh(amt)}
                            </span>
                          </div>
                          <span className="text-sm font-black text-gray-400">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
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

          {/* Deployment History Section */}
          {ledger.deployments.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">
                    Recent History
                  </h2>
                  <div className="h-0.5 w-12 bg-foreground/10"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Chronological Stream
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {ledger.deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="bg-background border rounded-4xl p-6 shadow-sm hover:shadow-2xl hover:border-foreground/20 transition-all flex flex-col gap-4 group"
                  >
                    {editingId === deployment.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            disabled={updatingId === deployment.id}
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-foreground font-bold disabled:opacity-50"
                          />
                          <input
                            type="number"
                            disabled={updatingId === deployment.id}
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-foreground font-black disabled:opacity-50"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <select
                            disabled={updatingId === deployment.id}
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-xs font-black uppercase disabled:opacity-50"
                          >
                            <option value="Unclassified">Unclassified</option>
                            <option value="Asset">Asset</option>
                            <option value="Skill">Skill</option>
                            <option value="Leverage">Leverage</option>
                            <option value="Experience">Experience</option>
                            <option value="Leakage">Leakage</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              disabled={updatingId === deployment.id}
                              onClick={() => setEditingId(null)}
                              className="text-xs font-black text-gray-500 uppercase px-3 py-1 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={updatingId === deployment.id}
                              onClick={() => handleUpdate(deployment.id)}
                              className="text-xs font-black bg-foreground text-background rounded-lg px-4 py-1 uppercase disabled:opacity-50"
                            >
                              {updatingId === deployment.id
                                ? "SAVING..."
                                : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-foreground group-hover:text-background ${deletingId === deployment.id ? "animate-pulse" : ""}`}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-black text-xl text-foreground transition-colors leading-none">
                                {deployment.title}
                              </h3>
                              <span className="text-[8px] font-black px-2 py-0.5 bg-foreground/5 rounded-full uppercase tracking-tighter text-gray-400">
                                {deployment.category || "Unclassified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-tighter">
                              <span>
                                {new Date(
                                  deployment.created_at,
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>
                                {new Date(
                                  deployment.created_at,
                                ).toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <p className="font-black text-2xl tabular-nums text-foreground tracking-tighter">
                            {formatKSh(deployment.amount)}
                          </p>
                          <div className="mt-1 flex items-center gap-3">
                            <button
                              disabled={deletingId !== null}
                              onClick={() => startEdit(deployment)}
                              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-foreground disabled:opacity-30"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deletingId !== null}
                              onClick={() => handleDelete(deployment.id)}
                              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 disabled:opacity-30"
                            >
                              {deletingId === deployment.id
                                ? "DELETING..."
                                : "Delete"}
                            </button>
                            <div className="px-3 py-1 bg-green-500/10 rounded-full ml-2">
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
