"use client";

import { useState, useSyncExternalStore } from "react";
import { ACCOUNT_TYPES, type Account } from "@/lib/finance/accounts";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
import {
  createAccountAction,
  deleteAccountAction,
  createDeploymentAction,
  type DashboardSnapshot,
} from "./actions";
import { Deployment } from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { AccountMap } from "@/lib/utils/taxonomy";

interface AccountSectionProps {
  accounts: Account[];
  deployments: Deployment[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

const emptySubscribe = () => () => {};

export function AccountSection({
  accounts,
  deployments,
  onSnapshot,
}: AccountSectionProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [activeTab, setActiveTab] = useState<"sources" | "log">("sources");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Source Form
  const [sourceForm, setSourceForm] = useState({
    account_name: "",
    account_type: "checking",
    current_balance: "",
    institution: "",
  });

  // Log Form
  const [logForm, setLogForm] = useState({
    title: "",
    amount: "",
    category: "Maintenance",
    accountId: "",
  });

  async function handleSourceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createAccountAction({
        account_name: sourceForm.account_name,
        account_type: sourceForm.account_type,
        current_balance: Number(sourceForm.current_balance),
        institution: sourceForm.institution || undefined,
      });
      setSourceForm({
        account_name: "",
        account_type: "checking",
        current_balance: "",
        institution: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create source");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createDeploymentAction({
        title: logForm.title,
        amount: Number(logForm.amount),
        category: logForm.category,
        accountId: logForm.accountId,
      });
      setLogForm({
        title: "",
        amount: "",
        category: "Maintenance",
        accountId: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log spending");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSource(id: string) {
    if (!confirm("Archive this source? Historical records will be preserved."))
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteAccountAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to archive source");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveTab("sources");
              setIsAdding(false);
            }}
            className={`text-xl font-black tracking-tight uppercase transition-all ${
              activeTab === "sources" ? "text-foreground" : "text-foreground/20"
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => {
              setActiveTab("log");
              setIsAdding(false);
            }}
            className={`text-xl font-black tracking-tight uppercase transition-all ${
              activeTab === "log" ? "text-foreground" : "text-foreground/20"
            }`}
          >
            Daily Log
          </button>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding
              ? "Cancel"
              : activeTab === "sources"
                ? "+ Add"
                : "+ Entry"}
          </span>
        </button>
      </div>

      {isAdding && activeTab === "sources" && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSourceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M-Pesa, Savings"
                  value={sourceForm.account_name}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      account_name: e.target.value,
                    })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Balance (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={sourceForm.current_balance}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      current_balance: e.target.value,
                    })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Type
                </label>
                <select
                  value={sourceForm.account_type}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      account_type: e.target.value,
                    })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Institution
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={sourceForm.institution}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      institution: e.target.value,
                    })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
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
              {isLoading ? "SAVING..." : "ADD ACCOUNT"}
            </button>
          </form>
        </div>
      )}

      {isAdding && activeTab === "log" && (
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  What did you spend on?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries"
                  value={logForm.title}
                  onChange={(e) =>
                    setLogForm({ ...logForm, title: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={logForm.amount}
                  onChange={(e) =>
                    setLogForm({ ...logForm, amount: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Category
                </label>
                <select
                  value={logForm.category}
                  onChange={(e) =>
                    setLogForm({ ...logForm, category: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {TAXONOMY_CATEGORIES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Source Account
                </label>
                <select
                  required
                  value={logForm.accountId}
                  onChange={(e) =>
                    setLogForm({ ...logForm, accountId: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  <option value="">Select a source</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({formatCurrency(acc.current_balance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-tight ml-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !logForm.accountId}
              className="w-full bg-foreground text-background py-3 rounded-xl font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "LOGGING..." : "LOG SPENDING"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {activeTab === "sources" ? (
          accounts.length === 0 ? (
            <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 text-center group hover:border-foreground/20 transition-colors">
              <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
                No capital containers defined.
              </p>
              <p className="text-foreground/40 text-[10px] mt-2 uppercase tracking-tight opacity-60">
                Define accounts to track authoritative capital.
              </p>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 group hover:bg-foreground/[0.04] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-foreground/40 bg-foreground/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        {AccountMap[account.account_type] ||
                          account.account_type}
                      </span>
                      <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                        {account.account_name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black tabular-nums text-foreground">
                        {formatCurrency(account.current_balance)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTab("log");
                          setLogForm({ ...logForm, accountId: account.id });
                          setIsAdding(true);
                        }}
                        className="p-2 text-foreground/20 hover:text-foreground transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-8 text-center bg-foreground/[0.02]">
              <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
                Daily Spending Log
              </p>
              <p className="text-foreground/40 text-[10px] mt-2 uppercase tracking-tight opacity-60 max-w-[200px] mx-auto leading-relaxed">
                Every entry recorded here will be deducted from your liquid
                sources to ensure total financial certainty.
              </p>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-6 bg-foreground text-background px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Start New Entry
                </button>
              )}
            </div>

            {/* List of recent logs from sources */}
            {deployments.filter((d) => d.account_id).length > 0 && (
              <div className="space-y-3 mt-8">
                <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">
                  Recent Verified Logs
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {deployments
                    .filter((d) => d.account_id)
                    .slice(0, 5)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="bg-foreground/[0.03] border border-foreground/5 rounded-xl p-4 flex items-center justify-between group hover:bg-foreground/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center text-foreground/40 group-hover:bg-foreground group-hover:text-background transition-colors">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-foreground uppercase tracking-tight leading-none mb-1">
                              {d.title}
                            </h5>
                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                              {accounts.find((a) => a.id === d.account_id)
                                ?.account_name || "Source"}{" "}
                              •{" "}
                              {isClient
                                ? new Date(d.created_at).toLocaleDateString()
                                : "--- --, ----"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black tabular-nums text-foreground">
                            {formatCurrency(d.amount)}
                          </p>
                          <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter bg-green-500/10 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
