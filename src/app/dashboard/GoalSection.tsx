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

  const formatKSh = (amt: number) => {
    return `KSh ${Math.round(amt).toLocaleString()}`;
  };

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
    if (!confirm("Remove this financial goal?")) return;
    setIsLoading(true);
    try {
      const snapshot = await deleteGoalAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete goal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
          Financial Goals
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
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Goal Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Month Emergency Fund"
                  value={form.goal_name}
                  onChange={(e) =>
                    setForm({ ...form, goal_name: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Target Capital (KSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={form.target_amount}
                  onChange={(e) =>
                    setForm({ ...form, target_amount: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Strategy Type
                </label>
                <select
                  value={form.goal_type}
                  onChange={(e) =>
                    setForm({ ...form, goal_type: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {GOAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {GOAL_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Current Inception
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.current_progress}
                  onChange={(e) =>
                    setForm({ ...form, current_progress: e.target.value })
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
              {isLoading ? "INITIALIZING..." : "INITIALIZE GOAL"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 text-center group hover:border-foreground/20 transition-colors">
            <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
              No financial goals defined.
            </p>
            <p className="text-foreground/40 text-[10px] mt-2 uppercase tracking-tight opacity-60">
              Capital currently operating without specific achievement targets.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgressPercentage(goal);
            return (
              <div
                key={goal.id}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl p-5 group hover:bg-foreground/10 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[8px] font-black text-background px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                          goal.priority === "critical"
                            ? "bg-orange-500"
                            : goal.priority === "high"
                              ? "bg-foreground/60"
                              : "bg-foreground/30"
                        }`}
                      >
                        {goal.priority}
                      </span>
                      <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                        {goal.goal_name}
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                      {goal.goal_type.replace("_", " ")} • {goal.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black tabular-nums text-foreground">
                        {Math.round(progress)}%
                      </p>
                      <p className="text-[8px] font-black text-foreground/60 uppercase tracking-widest opacity-60">
                        Goal Fulfullment
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
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

                {/* Deterministic Progress Track */}
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
                    {formatKSh(goal.current_progress)}
                  </p>
                  <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                    Target: {formatKSh(goal.target_amount)}
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
