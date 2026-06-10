"use client";

import { useState, useSyncExternalStore } from "react";
import { ACCOUNT_TYPES, type Account } from "@/lib/finance/accounts";
import { createAccountAction } from "./actions";
import { type DashboardSnapshot } from "@/lib/dashboard/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { AccountMap } from "@/lib/utils/taxonomy";
import { DistributionPieChart } from "@/components/dashboard/MiniCharts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Wallet } from "lucide-react";

interface AccountSectionProps {
  accounts: Account[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

const emptySubscribe = () => () => {};

export function AccountSection({ accounts, onSnapshot }: AccountSectionProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sourceForm, setSourceForm] = useState({
    account_name: "",
    account_type: "checking",
    current_balance: "",
    institution: "",
  });

  const chartData = accounts.map((a) => ({
    name: a.account_name,
    value: Number(a.current_balance),
  }));

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

  if (!isClient) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Wallet strokeWidth={1.2} size={20} className="text-truth" />
          <h2 className="font-cormorant text-2xl text-foreground tracking-wide uppercase">
            Accounts
          </h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground/40 hover:text-foreground transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND ACCOUNT"}
        </button>
      </div>
      {isAdding && (
        <div className="bg-white/2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSourceSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Account Name
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
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Current Liquidity
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
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Account Type
                </label>
                <select
                  value={sourceForm.account_type}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      account_type: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-black">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Financial Institution
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
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 font-mono text-[9px] uppercase tracking-widest">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 font-medium tracking-[0.2em] uppercase text-[10px] hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "INITIALIZING..." : "CONFIRM ACCOUNT"}
            </button>
          </form>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="py-6 border-b border-white/5 mb-6">
          <DistributionPieChart data={chartData} />
        </div>
      )}

      <div className="space-y-2">
        {accounts.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No accounts active
            </p>
          </div>
        ) : (
          accounts.map((account, index) => (
            <ScrollReveal key={account.id} delay={index * 0.05} distance={10}>
              <div className="flex items-center justify-between py-6 border-b border-white/5 group hover:bg-white/1 transition-all px-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono tracking-widest uppercase text-white/20">
                    {AccountMap[account.account_type] || account.account_type}
                  </span>
                  <h3 className="font-cormorant text-xl text-white transition-transform group-hover:translate-x-2">
                    {account.account_name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-xl text-white">
                    {formatCurrency(account.current_balance)}
                  </p>
                  {account.institution && (
                    <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest mt-1">
                      {account.institution}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}
