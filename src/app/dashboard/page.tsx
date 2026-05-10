"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getDeployments } from "@/lib/db/deployments";
import { addDeploymentAction } from "./actions";

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

      const formData = new FormData();
      formData.append("title", title);
      formData.append("amount", amount);

      const result = await addDeploymentAction(formData, user.id);

      setKairosMessage(result.insight);

      // Refresh list
      await fetchDeployments();

      // Clear form
      setTitle("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add deployment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">
          AXIOM // DASHBOARD
        </h1>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Financial Intelligence System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar: Add Deployment */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-background border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              Deploy Capital
            </h2>

            <form onSubmit={handleAddDeployment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Server Hosting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border bg-background rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-foreground/5 text-foreground placeholder:text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border bg-background rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-foreground/5 text-foreground placeholder:text-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background px-4 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit Deployment"}
              </button>
            </form>

            {kairosMessage && (
              <div className="mt-6 p-4 bg-foreground/5 border-l-4 border-foreground rounded-r-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Kairos Analysis
                </p>
                <p className="text-sm text-foreground leading-relaxed italic">
                  &quot;{kairosMessage}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main: Deployment History */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-foreground">
              Recent History
            </h2>
            <span className="text-xs font-medium bg-foreground/5 border px-2 py-1 rounded text-gray-400">
              {deployments.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {deployments.length === 0 ? (
              <div className="text-center py-20 bg-background border rounded-2xl border-dashed">
                <p className="text-gray-400 font-medium">
                  No financial events recorded.
                </p>
              </div>
            ) : (
              deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="bg-background border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group"
                >
                  <div>
                    <h3 className="font-bold text-foreground transition-colors">
                      {deployment.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {new Date(deployment.created_at).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg tabular-nums text-foreground">
                      {Number(deployment.amount).toLocaleString("en-KE", {
                        style: "currency",
                        currency: "KSh",
                      })}
                    </p>
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
