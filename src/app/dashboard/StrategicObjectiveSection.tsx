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
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

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
    if (
      !confirm(
        "Archive this strategic objective? It will be removed from the active mission board but retained for alignment history.",
      )
    )
      return;
    setIsLoading(true);
    try {
      const snapshot = await deleteStrategicObjectiveAction(id);
      onSnapshot(snapshot);
    } catch {
      alert("Failed to archive objective");
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
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setEditingId(null);
            }
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground">
            {isAdding ? "Cancel" : "+ Add objective"}
          </span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund"
                  value={form.objective_name}
                  onChange={(e) =>
                    setForm({ ...form, objective_name: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) =>
                    setForm({ ...form, target_date: e.target.value })
                  }
                  className="w-full border border-foreground/5 bg-foreground/[0.02] rounded-xl p-3 focus:outline-none focus:border-foreground/20 transition-colors text-foreground text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">
                  Current Position
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.current_amount}
                  onChange={(e) =>
                    setForm({ ...form, current_amount: e.target.value })
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
              className="w-full bg-foreground text-background py-4 rounded-xl font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading
                ? "SAVING..."
                : editingId
                  ? "Update Intent"
                  : "Set Intent"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {objectives.length === 0 ? (
          <div className="border border-dashed border-foreground/10 rounded-2xl p-16 text-center">
            <p className="text-foreground/40 text-[10px] uppercase tracking-widest">
              No objectives defined.
            </p>
          </div>
        ) : (
          objectives.map((obj) => {
            const ratio = calculateObjectiveFundingRatio(obj);
            return (
              <div
                key={obj.id}
                className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-6 group hover:bg-foreground/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-black text-background px-2 py-0.5 rounded uppercase tracking-[0.1em] ${
                          obj.priority_level === "critical"
                            ? "bg-orange-500"
                            : "bg-foreground/40"
                        }`}
                      >
                        {obj.priority_level}
                      </span>
                      <h3 className="text-base font-black text-foreground uppercase tracking-tight">
                        {obj.objective_name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tabular-nums text-foreground">
                      {Math.round(ratio)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        ratio >= 100 ? "bg-green-500" : "bg-foreground/40"
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                      {formatCurrency(obj.current_amount)}
                    </p>
                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                      Target: {formatCurrency(obj.target_amount)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
