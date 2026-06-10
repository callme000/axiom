"use client";

import { ACCOUNT_TYPES } from "@/lib/finance/accounts";

export interface OnboardingAccount {
  account_name: string;
  account_type: string;
  current_balance: string;
  institution: string;
}

interface AccountsStepProps {
  accounts: OnboardingAccount[];
  onChange: (accounts: OnboardingAccount[]) => void;
}

export function AccountsStep({ accounts, onChange }: AccountsStepProps) {
  const addAccount = () => {
    if (accounts.length < 3) {
      onChange([
        ...accounts,
        {
          account_name: "",
          account_type: "checking",
          current_balance: "",
          institution: "",
        },
      ]);
    }
  };

  const removeAccount = (index: number) => {
    onChange(accounts.filter((_, i) => i !== index));
  };

  const updateAccount = (
    index: number,
    updates: Partial<OnboardingAccount>,
  ) => {
    const next = [...accounts];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
        Account Structure
      </h2>
      <div className="flex-1 space-y-6 md:space-y-4 overflow-y-auto scrollbar-hide pr-2">
        {accounts.map((acc, idx) => (
          <div
            key={idx}
            className="space-y-4 md:space-y-3 pb-6 md:pb-3 border-b border-white/5 relative shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="e.g. M-Pesa, Crypto Wallet"
                value={acc.account_name}
                onChange={(e) =>
                  updateAccount(idx, { account_name: e.target.value })
                }
                className="bg-transparent border-b border-white/10 py-1 font-cormorant text-xl md:text-2xl text-white focus:outline-none placeholder:text-white/5"
              />
              <input
                type="text"
                placeholder="Financial Institution (optional)"
                value={acc.institution}
                onChange={(e) =>
                  updateAccount(idx, { institution: e.target.value })
                }
                className="bg-transparent border-b border-white/10 py-1 text-xs md:text-sm font-light text-white/60 focus:outline-none placeholder:text-white/5"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                  Account Type
                </label>
                <select
                  value={acc.account_type}
                  onChange={(e) =>
                    updateAccount(idx, { account_type: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 focus:outline-none"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option
                      key={t.value}
                      value={t.value}
                      className="bg-[#080808]"
                    >
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                  Current Liquidity
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={acc.current_balance}
                  onChange={(e) =>
                    updateAccount(idx, { current_balance: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-1 text-lg md:text-xl font-light text-white focus:outline-none tabular-nums"
                />
              </div>
            </div>

            {accounts.length > 1 && (
              <button
                type="button"
                onClick={() => removeAccount(idx)}
                className="absolute top-0 right-0 p-2 text-white/10 hover:text-red-400 bg-white/5 rounded-full hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addAccount}
        className="text-[9px] font-mono tracking-[0.6em] uppercase text-white/30 hover:text-white transition-all py-3 px-6 border border-white/10 rounded-full self-start active:scale-95"
      >
        + Append Source
      </button>
    </div>
  );
}
