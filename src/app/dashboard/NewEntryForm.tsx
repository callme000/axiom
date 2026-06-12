"use client";

import { useState, useEffect } from "react";
import { TAXONOMY_CATEGORIES } from "@/lib/finance/taxonomy";
import { DeploymentMap } from "@/lib/utils/taxonomy";
import { formatCurrency } from "@/lib/utils/formatters";
import { Account } from "@/lib/analytics/types";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

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
  
  // Execution Animation State
  const [executionState, setExecutionState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    if (isActionLoading) {
      setExecutionState("loading");
    } else if (executionState === "loading" && !error) {
      setExecutionState("success");
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([30, 50, 30]); // Heavy tactile confirmation
      }
    } else if (executionState === "success") {
      const timer = setTimeout(() => setExecutionState("idle"), 2000);
      return () => clearTimeout(timer);
    } else if (error) {
      setExecutionState("idle");
    }
  }, [isActionLoading, error, executionState]);

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
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
      <div className="space-y-8 md:space-y-12">
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em] ml-1">
            Intent
          </label>
          <input
            type="text"
            disabled={isActionLoading}
            placeholder="Strategic objective?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-6 font-mono text-xl md:text-3xl text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-white transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em] ml-1">
                  Amount (KES)
                </label>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                  Available: {formatCurrency(liquidity)}
                </span>
              </div>
              <input
                type="number"
                disabled={isActionLoading}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-4 font-mono text-2xl text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-white transition-all tabular-nums"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em] ml-1">
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
            <label className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em] ml-1">
              Strategic Classification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TAXONOMY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    // Simulated Web Haptics (Vibration on supported mobile, visual flash otherwise)
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                      navigator.vibrate(10);
                    }
                    setCategory(cat.value);
                  }}
                  className={`p-3 border transition-all text-left flex flex-col justify-center items-center active:scale-95 ${
                    category === cat.value
                      ? "border-truth bg-truth/10 text-truth shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]"
                      : "border-white/5 bg-white/2 text-zinc-500 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="block text-[8px] font-bold tracking-[0.2em] uppercase truncate">
                    {DeploymentMap[cat.value] || cat.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Dynamic Definition Display */}
            {category !== "Unclassified" && (
              <div className="p-4 bg-zinc-900/50 border-l-2 border-truth animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mb-1">
                  Intent Definition // {category.replace("_", " ")}
                </p>
                <p className="text-[10px] text-zinc-300 leading-relaxed italic">
                  &quot;{TAXONOMY_CATEGORIES.find(c => c.value === category)?.definition}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-white/10 font-mono text-[9px] text-white/60 uppercase tracking-widest">
          ERROR: {error}
        </div>
      )}

      <div className="pt-8 flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isActionLoading || executionState !== "idle"}
            className="flex-1 border border-white/5 text-muted-foreground/80 py-6 font-medium tracking-[0.3em] uppercase text-xs hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isActionLoading || executionState !== "idle"}
          className={`flex-2 py-6 font-bold tracking-[0.3em] uppercase text-[10px] transition-all relative overflow-hidden flex items-center justify-center min-w-[200px] ${
            executionState === "success" 
              ? "bg-truth text-white border-none" 
              : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50"
          }`}
        >
          <AnimatePresence mode="wait">
            {executionState === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                AUTHORIZE DEPLOYMENT
              </motion.span>
            )}
            {executionState === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3"
              >
                <Loader2 size={16} className="animate-spin text-black" />
                EXECUTING...
              </motion.span>
            )}
            {executionState === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="flex items-center gap-3"
              >
                <Check strokeWidth={3} size={16} />
                CONFIRMED
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </form>
  );
}
