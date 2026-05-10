"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getDeployments, createDeployment } from "@/lib/db/deployments";
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
  const [loading, setLoading] = useState(false);

  const fetchDeployments = useCallback(async () => {
    try {
      const data = await getDeployments();
      const castedData = (data || []) as Deployment[];
      setDeployments(castedData);

      // Generate analytics from pure engine
      const summary = generateSummary(castedData);
      setAnalytics(summary);
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDeployments();
  }, [fetchDeployments]);

  async function handleAddDeployment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not authenticated");
        return;
      }

      await createDeployment(title, Number(amount), user.id, category);

      // Clear form
      setTitle("");
      setAmount("");
      setCategory("General");

      // Refresh list & analytics
      const updatedData = await getDeployments();
      const castedUpdated = (updatedData || []) as Deployment[];
      setDeployments(castedUpdated);
      setAnalytics(generateSummary(castedUpdated));

      // Generate AI-powered behavioral insight
      setKairosInsight({
        type: "info",
        category: "system",
        confidence: 1.0,
        message: "Analytic engine processing history...",
      });

      const insight = await generateKairosAIInsight(castedUpdated);
      setKairosInsight(insight);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add deployment";
      const errorCode = (err as { code?: string })?.code
        ? ` (${(err as { code?: string }).code})`
        : "";
      alert(`${errorMsg}${errorCode}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl font-black tracking-tighter text-foreground">
            AXIOM // <span className="text-gray-500">DASHBOARD</span>
          </h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em]">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                    onChange={(e) => setTitle(e.target.value)}
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
                      onChange={(e) => setAmount(e.target.value)}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-foreground text-background px-4 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-foreground/10"
                >
                  {loading ? "AUTHENTICATING..." : "EXECUTE DEPLOYMENT"}
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
                  Kairos Engine Analysis //{" "}
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
              <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-background rounded-full animate-pulse"></span>
                  Projected Runway:{" "}
                  {analytics.runwayDays
                    ? `${Math.round(analytics.runwayDays)} Days`
                    : "Stable"}
                </div>
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
                        className="bg-background border rounded-3xl p-5 shadow-sm"
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
                    className="bg-background border rounded-4xl p-6 shadow-sm hover:shadow-2xl hover:border-foreground/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
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
                            {new Date(deployment.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>
                            {new Date(deployment.created_at).toLocaleTimeString(
                              undefined,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
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
                      <div className="mt-1 px-3 py-1 bg-green-500/10 rounded-full">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                          Verified
                        </span>
                      </div>
                    </div>
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
