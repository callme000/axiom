"use client";

import { useState } from "react";
import { LIABILITY_TYPES, type Liability } from "@/lib/finance/liabilities";
import {
  createLiabilityAction,
  deleteLiabilityAction,
  type DashboardSnapshot,
} from "./actions";

interface LiabilitySectionProps {
  liabilities: Liability[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function LiabilitySection({
  liabilities,
  onSnapshot,
}: LiabilitySectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    liability_name: "",
    liability_type: "credit_card",
    outstanding_balance: "",
    interest_rate: "",
    minimum_payment: "",
    institution: "",
  });

  const formatKSh = (amt: number) => {
    return `KSh ${Math.round(amt).toLocaleString()}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createLiabilityAction({
        liability_name: form.liability_name,
        liability_type: form.liability_type,
        outstanding_balance: Number(form.outstanding_balance),
        interest_rate: form.interest_rate ? Number(form.interest_rate) : 0,
        minimum_payment: form.minimum_payment ? Number(form.minimum_payment) : 0,
        institution: form.institution || undefined,
      });
      setForm({
        liability_name: "",
        liability_type: "credit_card",
        outstanding_balance: "",
        interest_rate: "",
        minimum_payment: "",
        institution: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to record obligation",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Acknowledge resolution of this obligation?")) return;
    setIsLoading(true);
    try {
      const snapshot = await deleteLiabilityAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete obligation");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Financial Obligations
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d={isAdding ? "M18 12H6" : "M12 5v14M5 12h14"} />
          </svg>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Obligation Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Equity Bank Loan"
                  value={form.liability_name}
                  onChange={(e) =>
                    setForm({ ...form, liability_name: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Outstanding Balance (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.outstanding_balance}
                  onChange={(e) =>
                    setForm({ ...form, outstanding_balance: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Type
                </label>
                <select
                  value={form.liability_type}
                  onChange={(e) =>
                    setForm({ ...form, liability_type: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {LIABILITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Min. Payment
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.minimum_payment}
                  onChange={(e) =>
                    setForm({ ...form, minimum_payment: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Interest (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.interest_rate}
                  onChange={(e) =>
                    setForm({ ...form, interest_rate: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">
                Institution (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. NCBA Bank"
                value={form.institution}
                onChange={(e) =>
                  setForm({ ...form, institution: e.target.value })
                }
                className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-tight ml-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-3 rounded-xl font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "ACKNOWLEDGING..." : "ACKNOWLEDGE OBLIGATION"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {liabilities.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 text-center group hover:border-foreground/20 transition-colors">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              No financial obligations recorded.
            </p>
            <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-tight opacity-60">
              Solvency awareness layer currently optimal.
            </p>
          </div>
        ) : (
          liabilities.map((liability) => (
            <div
              key={liability.id}
              className="bg-foreground/5 border border-foreground/5 rounded-2xl p-5 group hover:bg-foreground/10 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-background bg-foreground/30 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {liability.liability_type.replace("_", " ")}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {liability.liability_name}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    {liability.institution && (
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {liability.institution}
                      </p>
                    )}
                    {liability.interest_rate > 0 && (
                      <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">
                        {liability.interest_rate}% APR
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatKSh(liability.outstanding_balance)}
                    </p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest opacity-60">
                      Remaining Obligation
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(liability.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
