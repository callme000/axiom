"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getDeployments, createDeployment } from "@/lib/db/deployments";
import { generateKairosAIInsight } from "@/lib/ai/kairos";

type Deployment = {
  id: string;
  title: string;
  amount: number;
  created_at: string;
};

export default function Dashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kairosMessage, setKairosMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDeployments = useCallback(async () => {
    try {
      const data = await getDeployments();
      setDeployments(data || []);
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDeployments();
  }, [fetchDeployments]);

  const totalDeployed = deployments.reduce(
    (sum, d) => sum + Number(d.amount),
    0,
  );
  const avgDeployment =
    deployments.length > 0 ? totalDeployed / deployments.length : 0;

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

      // We perform the creation directly on the client to ensure the Supabase session is included.
      await createDeployment(title, Number(amount), user.id);

      // Clear form
      setTitle("");
      setAmount("");

      // Refresh list to include the new deployment
      const updatedData = await getDeployments();
      setDeployments(updatedData || []);

      // Generate AI-powered behavioral insight based on history
      setKairosMessage("Analytic engine processing history...");
      const aiInsight = await generateKairosAIInsight(updatedData || []);
      setKairosMessage(aiInsight);
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
          <div className="bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-[160px]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Total Deployed
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground text-center">
              {totalDeployed.toLocaleString("en-KE", {
                style: "currency",
                currency: "KSh",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="bg-foreground/5 border rounded-2xl p-4 flex flex-col min-w-[160px]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Avg. Ticket
            </span>
            <span className="text-2xl font-black tabular-nums text-foreground text-center">
              {avgDeployment.toLocaleString("en-KE", {
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
            {/* Subtle Glow Effect */}
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
                    placeholder="e.g. Infrastructure Scalability"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                    Amount (KSh)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border-2 border-foreground/10 bg-background rounded-2xl p-4 pl-16 focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-gray-600 font-bold text-xl tabular-nums"
                      required
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      KSh
                    </span>
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
          <div className="bg-foreground border rounded-3xl p-8 text-background shadow-2xl min-h-[200px] flex flex-col justify-between">
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
                  Kairos Engine Analysis
                </span>
              </div>

              <div className="space-y-4">
                {kairosMessage ? (
                  <p className="text-lg font-bold leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
                    &ldquo;{kairosMessage}&rdquo;
                  </p>
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

            {kairosMessage && (
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 bg-background rounded-full animate-pulse"></span>
                Real-time Insight Generated
              </div>
            )}
          </div>
        </div>

        {/* Main: Deployment History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                Recent History
              </h2>
              <div className="h-[2px] w-12 bg-foreground/10"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Sort: Newest First
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {deployments.length === 0 ? (
              <div className="text-center py-32 bg-background border-2 border-dashed rounded-[2rem] border-foreground/5">
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
                  className="bg-background border rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:border-foreground/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
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
                      <h3 className="font-black text-xl text-foreground transition-colors leading-none mb-2">
                        {deployment.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-tighter">
                        <span>
                          {new Date(deployment.created_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
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
  );
}
