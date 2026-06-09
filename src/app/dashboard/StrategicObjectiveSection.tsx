"use client";

import { useState } from "react";
import {
  calculateObjectiveFundingRatio,
  type StrategicObjective,
  OBJECTIVE_TYPES,
  OBJECTIVE_PRIORITIES,
  OBJECTIVE_STATUSES,
} from "@/lib/finance/objectives";
import {
  createStrategicObjectiveAction,
  updateStrategicObjectiveAction,
  type DashboardSnapshot,
} from "./actions";
import { formatCurrency } from "@/lib/utils/formatters";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

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

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-white tracking-wide uppercase">
          Strategic Intent
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
        >
          {isAdding ? "✕ CANCEL" : "+ APPEND OBJECTIVE"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/2 border border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Objective Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund"
                  value={form.objective_name}
                  onChange={(e) =>
                    setForm({ ...form, objective_name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Objective Type
                </label>
                <select
                  value={form.objective_type}
                  onChange={(e) =>
                    setForm({ ...form, objective_type: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {OBJECTIVE_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-black"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Priority Level
                </label>
                <select
                  value={form.priority_level}
                  onChange={(e) =>
                    setForm({ ...form, priority_level: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {OBJECTIVE_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value} className="bg-black">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                >
                  {OBJECTIVE_STATUSES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-black">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Current Position
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.current_amount}
                  onChange={(e) =>
                    setForm({ ...form, current_amount: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Target Date
                </label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) =>
                    setForm({ ...form, target_date: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white/60 font-mono text-[10px] tracking-widest uppercase focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Strategic Notes
                </label>
                <input
                  type="text"
                  placeholder="Add context..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
              {isLoading ? "ESTABLISHING..." : "SET STRATEGIC INTENT"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {objectives.length === 0 ? (
          <div className="py-12 text-center opacity-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
              No objectives active
            </p>
          </div>
        ) : (
          objectives.map((obj, index) => {
            const ratio = calculateObjectiveFundingRatio(obj);
            return (
              <ScrollReveal key={obj.id} delay={index * 0.1}>
                <div className="space-y-4 group cursor-default pb-8 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <span
                        className={`text-[8px] font-mono tracking-widest uppercase ${
                          obj.priority_level === "critical"
                            ? "text-red-500"
                            : "text-white/20"
                        }`}
                      >
                        {obj.priority_level}
                      </span>
                      <h3 className="font-cormorant text-2xl text-white transition-transform group-hover:translate-x-2">
                        {obj.objective_name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-cormorant text-3xl text-white tabular-nums">
                        {Math.round(ratio)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, ratio)}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5 + index * 0.1,
                        ease: "easeOut",
                      }}
                      className="absolute inset-y-0 left-0 bg-white/60"
                    />
                  </div>

                  <div className="flex justify-between items-end pt-2 opacity-30 group-hover:opacity-60 transition-opacity">
                    <p className="text-[9px] font-mono uppercase tracking-widest">
                      {formatCurrency(obj.current_amount)}
                    </p>
                    <p className="text-[9px] font-mono uppercase tracking-widest">
                      Target: {formatCurrency(obj.target_amount)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })
        )}
      </div>
    </div>
  );
}
