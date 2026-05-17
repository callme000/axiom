"use client";

import { useState } from "react";
import {
  OBJECTIVE_TYPES,
  OBJECTIVE_PRIORITIES,
  OBJECTIVE_STATUSES,
  calculateObjectiveProgressPercentage,
  calculateObjectiveFundingRatio,
  type StrategicObjective,
} from "@/lib/finance/objectives";
import {
  createStrategicObjectiveAction,
  updateStrategicObjectiveAction,
  deleteStrategicObjectiveAction,
  type DashboardSnapshot,
} from "./actions";

interface StrategicObjectiveSectionProps {
  objectives: StrategicObjective[];
  onSnapshot: (snapshot: DashboardSnapshot) => void;
}

export function StrategicObjectiveSection({
  objectives,
  onSnapshot,
}: StrategicObjectiveSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    objective_name: "",
    objective_type: "emergency_reserve",
    target_amount: "",
    current_amount: "",
    priority_level: "moderate",
    status: "active",
    target_date: "",
    notes: "",
  });

  const formatKSh = (amt: number) => {
    return `KSh ${Math.round(amt).toLocaleString()}`;
  };

  function startEdit(obj: StrategicObjective) {
    setEditingId(obj.id);
    setForm({
      objective_name: obj.objective_name,
      objective_type: obj.objective_type,
      target_amount: obj.target_amount.toString(),
      current_amount: obj.current_amount.toString(),
      priority_level: obj.priority_level,
      status: obj.status,
      target_date: obj.target_date || "",
      notes: obj.notes || "",
    });
    setIsAdding(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let snapshot;
      if (editingId) {
        snapshot = await updateStrategicObjectiveAction(editingId, {
          objective_name: form.objective_name,
          objective_type: form.objective_type,
          target_amount: Number(form.target_amount),
          current_amount: form.current_amount ? Number(form.current_amount) : 0,
          priority_level: form.priority_level,
          status: form.status,
          target_date: form.target_date || null,
          notes: form.notes || undefined,
        });
      } else {
        snapshot = await createStrategicObjectiveAction({
          objective_name: form.objective_name,
          objective_type: form.objective_type,
          target_amount: Number(form.target_amount),
          current_amount: form.current_amount ? Number(form.current_amount) : 0,
          priority_level: form.priority_level,
          status: form.status,
          target_date: form.target_date || null,
          notes: form.notes || undefined,
        });
      }
      setForm({
        objective_name: "",
        objective_type: "emergency_reserve",
        target_amount: "",
        current_amount: "",
        priority_level: "moderate",
        status: "active",
        target_date: "",
        notes: "",
      });
      setIsAdding(false);
      setEditingId(null);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to establish strategic intent",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("De-prioritize this strategic objective?")) return;
    setIsLoading(true);
    try {
      const snapshot = await deleteStrategicObjectiveAction(id);
      onSnapshot(snapshot);
    } catch (err: unknown) {
      alert("Failed to delete objective");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
            Strategic Objectives
          </h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
            Directional Financial Intentions
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setEditingId(null);
              setForm({
                objective_name: "",
                objective_type: "emergency_reserve",
                target_amount: "",
                current_amount: "",
                priority_level: "moderate",
                status: "active",
                target_date: "",
                notes: "",
              });
            }
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding ? "Cancel" : "+ Set Objective"}
          </span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border-2 border-foreground rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Objective Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multi-Asset Liquidity Base"
                  value={form.objective_name}
                  onChange={(e) =>
                    setForm({ ...form, objective_name: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) =>
                    setForm({ ...form, target_date: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Target Amount (KSh)
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
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Current Position (KSh)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.current_amount}
                  onChange={(e) =>
                    setForm({ ...form, current_amount: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Objective Type
                </label>
                <select
                  value={form.objective_type}
                  onChange={(e) =>
                    setForm({ ...form, objective_type: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {OBJECTIVE_TYPES.map(
                    (t: { value: string; label: string }) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Priority Level
                </label>
                <select
                  value={form.priority_level}
                  onChange={(e) =>
                    setForm({ ...form, priority_level: e.target.value })
                  }
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {OBJECTIVE_PRIORITIES.map(
                    (p: { value: string; label: string }) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                  Operational Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold appearance-none"
                >
                  {OBJECTIVE_STATUSES.map(
                    (s: { value: string; label: string }) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-foreground/60 uppercase tracking-widest mb-1.5 block ml-1">
                Strategic Notes (Optional)
              </label>
              <textarea
                placeholder="Details of this strategic intention..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border-2 border-foreground/10 bg-background rounded-xl p-3 focus:outline-none focus:border-foreground transition-colors text-foreground text-sm font-bold min-h-[80px]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-tight ml-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-4 rounded-xl font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50 shadow-xl"
            >
              {isLoading
                ? "ESTABLISHING..."
                : editingId
                  ? "Update Strategic Intent"
                  : "Establish Strategic Intent"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {objectives.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-16 text-center group hover:border-foreground/20 transition-colors">
            <p className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
              No strategic objectives defined.
            </p>
            <p className="text-foreground/40 text-[10px] mt-3 uppercase tracking-tight opacity-60 leading-relaxed">
              Axiom currently observes financial behavior <br /> without
              directional context.
            </p>
          </div>
        ) : (
          objectives.map((obj) => {
            const ratio = calculateObjectiveFundingRatio(obj);
            return (
              <div
                key={obj.id}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 group hover:bg-foreground/10 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-black text-background px-2 py-0.5 rounded uppercase tracking-[0.1em] ${
                          obj.priority_level === "critical"
                            ? "bg-orange-500"
                            : obj.priority_level === "high"
                              ? "bg-foreground/70"
                              : "bg-foreground/40"
                        }`}
                      >
                        {obj.priority_level}
                      </span>
                      <h3 className="text-base font-black text-foreground uppercase tracking-tight">
                        {obj.objective_name}
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
                      {obj.objective_type.replace("_", " ")} :: {obj.status}
                      {obj.target_date && ` • Target: ${obj.target_date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-black tabular-nums text-foreground">
                        {Math.round(ratio)}%
                      </p>
                      <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                        Funding Ratio
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(obj)}
                        className="p-2 text-foreground/20 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(obj.id)}
                        className="p-2 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          width="16"
                          height="16"
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

                <div className="space-y-3">
                  <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        ratio >= 100 ? "bg-green-500" : "bg-foreground/60"
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-0.5">
                        Current Position
                      </p>
                      <p className="text-xs font-black text-foreground tabular-nums">
                        {formatKSh(obj.current_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-0.5">
                        Strategic Target
                      </p>
                      <p className="text-xs font-black text-foreground/60 tabular-nums">
                        {formatKSh(obj.target_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {obj.notes && (
                  <div className="mt-5 pt-4 border-t border-foreground/5">
                    <p className="text-[10px] font-bold text-foreground/40 italic leading-relaxed">
                      &quot;{obj.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
