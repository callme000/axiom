"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/lib/db/deployments";
import { saveInsight, getInsights } from "@/lib/db/insights";
import { generateKairosAIInsight, KairosInsight } from "@/lib/ai/kairos";
import { generateSummary, AnalyticsSummary } from "@/lib/analytics";

type Deployment = {
  id: string;
  title: string;
  amount: number;
  created_at: string;
  category?: string | null;
};

export default function Dashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [kairosInsight, setKairosInsight] = useState<KairosInsight | null>(
    null,
  );

  // Loading & Error States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  /**
   * REFRESH & ANALYZE (Centralized Intelligence Trigger)
   * This function ensures the ledger, analytics, and Kairos are always in sync.
   */
  const refreshAndReAnalyze = useCallback(async (userId: string) => {
    try {
      const data = await getDeployments();
      const castedData = (data || []) as Deployment[];
      setDeployments(castedData);

      // 1. Update Deterministic Analytics
      const summary = generateSummary(castedData);
      setAnalytics(summary);

      // 2. Trigger Intelligence Engine
      setKairosInsight((prev) => ({
        ...(prev || {
          type: "info",
          category: "system",
          confidence: 1.0,
          message: "",
        }),
        message: "Synchronizing intelligence...",
      }));

      const insight = await generateKairosAIInsight(castedData);

      // 3. Persist Memory
      await saveInsight(insight, userId);
      setKairosInsight(insight);
    } catch (error) {
      console.error("Intelligence synchronization failed:", error);
    }
  }, []);

  const fetchDeployments = useCallback(async () => {
    setGlobalError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return; // Middleware will handle redirect

      const data = await getDeployments();
      const castedData = (data || []) as Deployment[];
      setDeployments(castedData);

      const summary = generateSummary(castedData);
      setAnalytics(summary);

      const savedInsights = await getInsights(1);
      if (savedInsights && savedInsights.length > 0) {
        setKairosInsight(savedInsights[0]);
      }
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
      setGlobalError(
        "Database Connection Interrupted. Unable to synchronize ledger.",
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDeployments();
  }, [fetchDeployments]);

  async function handleAddDeployment(e: React.FormEvent) {
    e.preventDefault();
    setIsActionLoading(true);
    setFormError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFormError("User not authenticated");
        return;
      }

      await createDeployment(title, Number(amount), user.id, category);

      // Clear form
      setTitle("");
      setAmount("");
      setCategory("General");

      // Trigger intelligence update
      await refreshAndReAnalyze(user.id);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add deployment";
      setFormError(errorMsg);
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this deployment?")) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await deleteDeployment(id);
      await refreshAndReAnalyze(user.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete deployment");
    }
  }

  function startEdit(deployment: Deployment) {
    setEditingId(deployment.id);
    setEditForm({
      title: deployment.title,
      amount: deployment.amount.toString(),
      category: deployment.category || "General",
    });
  }

  async function handleUpdate(id: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Validation
      if (!editForm.title.trim()) throw new Error("Title cannot be empty");
      if (Number(editForm.amount) <= 0)
        throw new Error("Amount must be greater than zero");

      await updateDeployment(id, {
        title: editForm.title,
        amount: Number(editForm.amount),
        category: editForm.category,
      });
      setEditingId(null);

      // TRIGGER KAIROS ON EDIT
      await refreshAndReAnalyze(user.id);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Update failed";
      alert(errorMsg);
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
          <div className="lg:col-span-4 h-96 bg-foreground/5 rounded-[2.5rem]"></div>
          <div className="lg:col-span-8 h-96 bg-foreground/5 rounded-[2.5rem]"></div>
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
            Financial Intelligence System v2.0
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-40">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Total Deployed
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground text-center">
              {analytics?.totalDeployed.toLocaleString("en-KE", {
                style: "currency",
                currency: "KSh",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-40">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Daily Burn
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground text-center">
              {analytics?.dailyBurnRate.toLocaleString("en-KE", {
                style: "currency",
                currency: "KSh",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      {globalError && (
        <div className="mb-10 bg-red-500/10 border-2 border-red-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
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
                Synchronization Failure
              </h3>
              <p className="text-red-600/70 text-sm font-bold uppercase tracking-widest leading-none">
                {globalError}
              </p>
            </div>
          </div>
          <button
            onClick={fetchDeployments}
            className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10"
          >
            Re-Synchronize
          </button>
        </div>
      )}

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-opacity duration-500 ${globalError ? "opacity-40 pointer-events-none grayscale" : "opacity-100"}`}
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
                    placeholder="e.g. Server Hosting"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                      Amount (KSh)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-bold tabular-nums"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground font-bold appearance-none cursor-pointer"
                    >
                      <option value="General">General</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Marketing">Marketing</option>
                      <option value="R&D">R&D</option>
                      <option value="Operations">Operations</option>
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

          {/* Intelligence Section */}
          <div
            className={`bg-foreground border rounded-3xl p-8 text-background shadow-2xl min-h-50 flex flex-col justify-between transition-colors duration-500 ${kairosInsight?.type === "warning" ? "ring-4 ring-orange-500/50" : ""}`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4 opacity-60">
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
                  Kairos Engine Analysis ::{" "}
                  {kairosInsight?.category?.replace("_", " ") || "STANDBY"}
                </span>
              </div>

              <div className="space-y-4">
                {kairosInsight ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-lg font-bold leading-tight">
                      &ldquo;{kairosInsight.message}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                          Confidence
                        </span>
                        <span className="text-xs font-black">
                          {(kairosInsight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-6 w-[1px] bg-background/10"></div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                          Classification
                        </span>
                        <span
                          className={`text-xs font-black uppercase ${kairosInsight.type === "warning" ? "text-orange-400" : "text-blue-400"}`}
                        >
                          {kairosInsight.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 opacity-30">
                    <div className="h-4 bg-background/20 rounded-full w-full"></div>
                    <div className="h-4 bg-background/20 rounded-full w-2/3"></div>
                    <p className="text-[10px] font-bold uppercase mt-4">
                      Awaiting financial event for interpretation...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {analytics && (
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full animate-pulse"></span>
                    Projected Runway:{" "}
                    {analytics.runwayDays
                      ? `${Math.round(analytics.runwayDays)} Days`
                      : "Stable"}
                  </div>
                </div>
                <p className="text-[8px] font-bold text-background/40 uppercase tracking-tight">
                  * Benchmark based on 1M KSh operational balance
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main: Analysis & History */}
        <div className="lg:col-span-8 space-y-10">
          {/* Capital Allocation Section */}
          {analytics && analytics.totalDeployed > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Capital Allocation
                </h2>
                <div className="h-0.5 w-12 bg-foreground/10"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analytics.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const percentage = (amt / analytics.totalDeployed) * 100;
                    return (
                      <div
                        key={cat}
                        className="bg-background border rounded-4xl p-5 shadow-sm"
                      >
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">
                              {cat}
                            </span>
                            <span className="text-lg font-black text-foreground tabular-nums">
                              {amt.toLocaleString("en-KE", {
                                style: "currency",
                                currency: "KSh",
                                maximumFractionDigits: 0,
                              })}
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
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Recent History
                </h2>
                <div className="h-0.5 w-12 bg-foreground/10"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Sort: Newest First
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {deployments.length === 0 ? (
                <div className="text-center py-32 bg-background border-2 border-dashed rounded-4xl border-foreground/5">
                  <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                    No financial events recorded in ledger.
                  </p>
                </div>
              ) : (
                deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="bg-background border rounded-4xl p-6 shadow-sm hover:shadow-2xl hover:border-foreground/20 transition-all flex flex-col gap-4 group"
                  >
                    {editingId === deployment.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-foreground font-bold"
                          />
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-foreground font-black"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="bg-foreground/5 border-none rounded-xl p-2 text-xs font-black uppercase"
                          >
                            <option value="General">General</option>
                            <option value="Infrastructure">
                              Infrastructure
                            </option>
                            <option value="Marketing">Marketing</option>
                            <option value="R&D">R&D</option>
                            <option value="Operations">Operations</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs font-black text-gray-500 uppercase px-3 py-1"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdate(deployment.id)}
                              className="text-xs font-black bg-foreground text-background rounded-lg px-4 py-1 uppercase"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-foreground group-hover:text-background">
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
                                {deployment.category || "General"}
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
                            {Number(deployment.amount).toLocaleString("en-KE", {
                              style: "currency",
                              currency: "KSh",
                            })}
                          </p>
                          <div className="mt-1 flex items-center gap-3">
                            <button
                              onClick={() => startEdit(deployment)}
                              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-foreground"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(deployment.id)}
                              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500"
                            >
                              Delete
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
