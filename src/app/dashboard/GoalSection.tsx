"use client";

import { useState } from "react";
import {
  GOAL_TYPES,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  calculateGoalProgressPercentage,
  type FinancialGoal,
} from "@/lib/finance/goals";
import {
  createGoalAction,
  deleteGoalAction,
  type DashboardSnapshot,
} from "./actions";
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

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Archive this financial goal? It will be removed from active tracking but retained in historical data.",
      )
    )
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteGoalAction(id);
      onSnapshot(snapshot);
    } catch {
      alert("Failed to archive goal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Goals
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding ? "Cancel" : "+ Add goal"}
          </span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund"
                  value={form.goal_name}
                  onChange={(e) =>
                    setForm({ ...form, goal_name: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
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
              {isLoading ? "SAVING..." : "SAVE GOAL"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="border border-dashed border-foreground/10 rounded-2xl p-12 text-center">
            <p className="text-foreground/40 text-[10px] uppercase tracking-widest">
              No active goals.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgressPercentage(goal);
            return (
              <div
                key={goal.id}
                className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 group hover:bg-foreground/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[8px] font-black text-background px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                          goal.priority === "critical"
                            ? "bg-orange-500"
                            : "bg-foreground/30"
                        }`}
                      >
                        {goal.priority}
                      </span>
                      <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                        {goal.goal_name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black tabular-nums text-foreground">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      progress >= 100 ? "bg-green-500" : "bg-foreground/40"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                    {formatCurrency(goal.current_progress)}
                  </p>
                  <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">
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
