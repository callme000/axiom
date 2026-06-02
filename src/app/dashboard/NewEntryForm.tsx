"use client";

import { useState } from "react";
import { TAXONOMY_CATEGORIES, getTaxonomyInterpretation } from "@/lib/finance/taxonomy";
import { DeploymentMap } from "@/lib/utils/taxonomy";
import { formatCurrency } from "@/lib/utils/formatters";
import { Account } from "@/lib/analytics/types";

interface NewEntryFormProps {
  accounts: Account[];
  liquidity: number;
  isActionLoading: boolean;
  onSubmit: (data: {
    title: string;
    amount: number;
    category: string;
    accountId?: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function NewEntryForm({
  accounts,
  liquidity,
  isActionLoading,
  onSubmit,
  onCancel,
}: NewEntryFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Unclassified");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (category === "Unclassified") {
      setError("Strategic intent required.");
      return;
    }

    if (Number(amount) > liquidity && accountId) {
       // Only error if we are deducting from an account
    }

    try {
      await onSubmit({
        title,
        amount: Number(amount),
        category,
        accountId: accountId || undefined,
      });
      setTitle("");
      setAmount("");
      setCategory("Unclassified");
      setAccountId("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Execution failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <div>
          <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-3 block ml-1">
            Intent
          </label>
          <input
            type="text"
            disabled={isActionLoading}
            placeholder="What is this achieving?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-foreground/10 bg-foreground/[0.02] rounded-2xl p-5 focus:outline-none focus:border-foreground/20 transition-all text-foreground text-xl placeholder:text-foreground/20 font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-6">
            <div>
              <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-3 block ml-1">
                Amount (KSh)
              </label>
              <input
                type="number"
                disabled={isActionLoading}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-foreground/10 bg-foreground/[0.02] rounded-2xl p-5 focus:outline-none focus:border-foreground/20 transition-all text-foreground text-2xl placeholder:text-foreground/20 font-black tabular-nums"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-3 block ml-1">
                Funding Source
              </label>
              <select
                disabled={isActionLoading}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full border border-foreground/10 bg-foreground/[0.02] rounded-xl px-5 py-4 focus:outline-none focus:border-foreground/20 transition-colors text-sm text-foreground font-bold appearance-none"
              >
                <option value="">No Deduction (Manual)</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_name} ({formatCurrency(acc.current_balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-7">
            <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-3 block ml-1">
              Strategic Classification
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TAXONOMY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    category === cat.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/5 bg-foreground/[0.02] text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <span className="block text-[9px] font-black uppercase tracking-widest">
                    {DeploymentMap[cat.value] || cat.label}
                  </span>
                  <span className={`block text-[8px] font-bold mt-1 ${category === cat.value ? "text-background/60" : "text-foreground/40"}`}>
                    {cat.definition}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-foreground/40 hover:bg-foreground/5 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isActionLoading}
          className="flex-[2] bg-foreground text-background px-6 py-5 rounded-2xl font-black text-lg uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-foreground/10 disabled:opacity-50"
        >
          {isActionLoading ? "EXECUTING..." : "Execute Entry"}
        </button>
      </div>
    </form>
  );
}
