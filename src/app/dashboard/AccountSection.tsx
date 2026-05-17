"use client";

import { useState } from "react";
import { ACCOUNT_TYPES, type Account } from "@/lib/finance/accounts";
import {
  createAccountAction,
  deleteAccountAction,
  type DashboardSnapshot,
} from "./actions";

interface AccountSectionProps {
  accounts: Account[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function AccountSection({ accounts, onSnapshot }: AccountSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    account_name: "",
    account_type: "checking",
    current_balance: "",
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
      const snapshot = await createAccountAction({
        account_name: form.account_name,
        account_type: form.account_type,
        current_balance: Number(form.current_balance),
        institution: form.institution || undefined,
      });
      setForm({
        account_name: "",
        account_type: "checking",
        current_balance: "",
        institution: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm("Remove this capital container? This action is structural only.")
    )
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteAccountAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Capital Containers
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
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Container Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Checking"
                  value={form.account_name}
                  onChange={(e) =>
                    setForm({ ...form, account_name: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Current Balance (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.current_balance}
                  onChange={(e) =>
                    setForm({ ...form, current_balance: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Type
                </label>
                <select
                  value={form.account_type}
                  onChange={(e) =>
                    setForm({ ...form, account_type: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Institution (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard Chartered"
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
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
              {isLoading ? "ESTABLISHING..." : "ESTABLISH CONTAINER"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {accounts.length === 0 ? (
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
              className="bg-foreground/5 border border-foreground/10 rounded-2xl p-5 group hover:bg-foreground/10 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-background bg-foreground/30 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {account.account_type}
                    </span>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {account.account_name}
                    </h3>
                  </div>
                  {account.institution && (
                    <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                      {account.institution}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {formatKSh(account.current_balance)}
                    </p>
                    <p className="text-[8px] font-black text-foreground/60 uppercase tracking-widest opacity-60">
                      Authoritative Balance
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
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
