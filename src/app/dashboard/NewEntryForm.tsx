"use client";

import { useState } from "react";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
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
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-12">
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] ml-1">
            Intent
          </label>
          <input
            type="text"
            disabled={isActionLoading}
            placeholder="Objective of this deployment?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-6 font-cormorant text-4xl text-white placeholder:text-white/5 focus:outline-none focus:border-white transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] ml-1">
                Amount (KES)
              </label>
              <input
                type="number"
                disabled={isActionLoading}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-4 font-cormorant text-3xl text-white placeholder:text-white/5 focus:outline-none focus:border-white transition-all tabular-nums"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] ml-1">
                Funding Source
              </label>
              <select
                disabled={isActionLoading}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-3 font-mono text-[10px] tracking-widest uppercase text-white/60 focus:outline-none"
              >
                <option value="" className="bg-black">
                  External / Manual
                </option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-black">
                    {acc.account_name} ({formatCurrency(acc.current_balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] ml-1">
              Strategic Classification
            </label>
            <div className="grid grid-cols-2 gap-4">
              {TAXONOMY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 border transition-all text-left space-y-2 ${
                    category === cat.value
                      ? "border-white bg-white text-black"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="block text-[8px] font-mono tracking-widest uppercase">
                    {DeploymentMap[cat.value] || cat.label}
                  </span>
                  <span
                    className={`block text-[7px] font-light leading-tight ${category === cat.value ? "text-black/60" : "text-white/20"}`}
                  >
                    {cat.definition}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-white/10 font-mono text-[9px] text-white/60 uppercase tracking-widest">
          ERROR: {error}
        </div>
      )}

      <div className="pt-8">
        <button
          type="submit"
          disabled={isActionLoading}
          className="w-full bg-white text-black py-6 font-medium tracking-[0.3em] uppercase text-xs hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5 disabled:opacity-50"
        >
          {isActionLoading ? "EXECUTING..." : "AUTHORIZE DEPLOYMENT"}
        </button>
      </div>
    </form>
  );
}
