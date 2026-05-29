"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchTelemetryLogsAction,
  type AuditLog,
  type TelemetrySummary,
} from "@/app/dashboard/actions";

/**
 * TELEMETRY DASHBOARD (Phase 2)
 * High-density forensic UI for the Kairos Insight Engine.
 * Aesthetic: Quiet System (monochromatic, high-precision).
 */
export function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTelemetry = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsLoading(true);
    setError(null);
    try {
      const summary = await fetchTelemetryLogsAction();
      setTelemetry(summary);
    } catch (err) {
      setError("Failed to retrieve forensic logs.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTelemetry();
  }, [loadTelemetry]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-foreground/5 rounded"></div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-24 bg-foreground/5 rounded-xl"></div>
          <div className="h-24 bg-foreground/5 rounded-xl"></div>
          <div className="h-24 bg-foreground/5 rounded-xl"></div>
        </div>
        <div className="h-64 bg-foreground/5 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-red-500/10 rounded-3xl">
        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.02]">
          <span className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em] block mb-2">
            Total Cycles
          </span>
          <span className="text-2xl font-black tabular-nums text-foreground">
            {telemetry?.totalCycles || 0}
          </span>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.02]">
          <span className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em] block mb-2">
            Avg. Latency
          </span>
          <span className="text-2xl font-black tabular-nums text-foreground">
            {telemetry?.averageLatency || 0}
            <span className="text-xs ml-1 text-foreground/40 font-bold uppercase">
              ms
            </span>
          </span>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.02]">
          <span className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em] block mb-2">
            Match Rate
          </span>
          <span className="text-2xl font-black tabular-nums text-foreground">
            {telemetry?.matchRate || 0}%
          </span>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-foreground/[0.02]">
          <span className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em] block mb-2">
            Active Rules
          </span>
          <span className="text-2xl font-black tabular-nums text-foreground">
            {Object.keys(telemetry?.ruleHits || {}).length}
          </span>
        </div>
      </div>

      {/* RULE FREQUENCY */}
      {telemetry && Object.keys(telemetry.ruleHits).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] ml-1">
            Rule Trigger Frequency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(telemetry.ruleHits)
              .sort(([, a], [, b]) => b - a)
              .map(([ruleId, count]) => (
                <div
                  key={ruleId}
                  className="p-4 border border-foreground/5 rounded-xl flex items-center justify-between"
                >
                  <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-tighter truncate max-w-[180px]">
                    {ruleId}
                  </span>
                  <span className="text-[10px] font-black bg-foreground/5 px-2 py-0.5 rounded text-foreground/80">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* FORENSIC LOG TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">
            Evaluation Audit Trail
          </h3>
          <button
            onClick={() => loadTelemetry(true)}
            className="text-[9px] font-black text-foreground/40 uppercase tracking-widest hover:text-foreground transition-colors"
          >
            Refresh Log
          </button>
        </div>
        <div className="overflow-hidden border border-foreground/10 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-foreground/10">
                <th className="p-4 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                  Timestamp
                </th>
                <th className="p-4 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                  Rule ID
                </th>
                <th className="p-4 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                  Severity
                </th>
                <th className="p-4 text-[9px] font-black text-foreground/40 uppercase tracking-widest text-right">
                  Latency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {telemetry?.logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-foreground/[0.01] transition-colors group"
                >
                  <td className="p-4 text-[10px] font-bold text-foreground/40 tabular-nums">
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-4 text-[10px] font-black text-foreground/80 uppercase tracking-tighter">
                    {log.rule_id}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        log.severity === "critical"
                          ? "bg-red-500/10 text-red-500"
                          : log.severity === "high"
                            ? "bg-orange-500/10 text-orange-500"
                            : log.severity === "medium"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : log.severity === "none"
                                ? "text-foreground/20"
                                : "bg-foreground/5 text-foreground/60"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] font-bold text-foreground/60 tabular-nums text-right">
                    {(log.evaluation_time_ms || 0).toFixed(2)}ms
                  </td>
                </tr>
              ))}
              {(!telemetry || telemetry.logs.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]"
                  >
                    No evaluation data recorded in current window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
