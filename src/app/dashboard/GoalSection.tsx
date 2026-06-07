"use client";

import { useState } from "react";
import {
  calculateGoalProgressPercentage,
  type FinancialGoal,
} from "@/lib/finance/goals";
import { createGoalAction, type DashboardSnapshot } from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";

interface GoalSectionProps {
  goals: FinancialGoal[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function GoalSection({ goals, onSnapshot }: GoalSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    goal_name: "",
    goal_type: "emergency_fund",
    target_amount: "",
    current_progress: "",
    priority: "medium",
    status: "active",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await createGoalAction({
        goal_name: form.goal_name,
        goal_type: form.goal_type,
        target_amount: Number(form.target_amount),
        current_progress: form.current_progress
          ? Number(form.current_progress)
          : 0,
        priority: form.priority,
        status: form.status,
        notes: form.notes || undefined,
      });
      setForm({
        goal_name: "",
        goal_type: "emergency_fund",
        target_amount: "",
        current_progress: "",
        priority: "medium",
        status: "active",
        notes: "",
      });
      setIsAdding(false);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to record financial goal",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
          Wealth Milestones
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND MILESTONE"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Milestone Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund"
                  value={form.goal_name}
                  onChange={(e) =>
                    setForm({ ...form, goal_name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Target Amount
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.target_amount}
                  onChange={(e) =>
                    setForm({ ...form, target_amount: e.target.value })
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
              {isLoading ? "SAVING..." : "CONFIRM MILESTONE"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {goals.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No milestones active
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgressPercentage(goal);
            return (
              <div
                key={goal.id}
                className="space-y-4 group cursor-default pb-8 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <span
                      className={`text-[8px] font-mono tracking-widest uppercase ${
                        goal.priority === "critical"
                          ? "text-red-500"
                          : "text-white/20"
                      }`}
                    >
                      {goal.priority}
                    </span>
                    <h3 className="font-cormorant text-2xl text-white transition-transform group-hover:translate-x-2">
                      {goal.goal_name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="font-cormorant text-3xl text-white tabular-nums">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-white/60 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>

                <div className="flex justify-between items-end pt-2 opacity-30 group-hover:opacity-60 transition-opacity">
                  <p className="text-[9px] font-mono uppercase tracking-widest">
                    {formatCurrency(goal.current_progress)}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-widest">
                    Target: {formatCurrency(goal.target_amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
