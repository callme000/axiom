"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchTelemetryLogsAction,
  type TelemetrySummary,
} from "@/app/dashboard/actions";

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
    const timer = setTimeout(() => loadTelemetry(), 10);
    return () => clearTimeout(timer);
  }, [loadTelemetry]);

  if (isLoading) {
    return (
      <div className="py-12 space-y-12 animate-pulse opacity-20">
        <div className="h-px bg-white/20 w-full" />
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center opacity-40">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border">
        {[
          { label: "Evaluation Cycles", value: telemetry?.totalCycles || 0 },
          {
            label: "Avg. Latency",
            value: `${telemetry?.averageLatency || 0}ms`,
          },
          {
            label: "Intelligence Yield",
            value: `${telemetry?.matchRate || 0}%`,
          },
          {
            label: "Active Heuristics",
            value: Object.keys(telemetry?.ruleHits || {}).length,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-background p-8 group border-r border-border last:border-r-0">
            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-[0.3em] block mb-4 group-hover:text-foreground transition-colors">
              {stat.label}
            </span>
            <span className="font-mono text-2xl text-foreground tabular-nums font-bold">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* FORENSIC LOG TABLE */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Evaluation Audit Trail
          </h3>
          <button
            onClick={() => loadTelemetry(true)}
            className="text-[8px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          >
            [ Refresh Logs ]
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest font-normal">
                  Timestamp
                </th>
                <th className="py-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest font-normal">
                  Heuristic ID
                </th>
                <th className="py-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest font-normal">
                  Severity
                </th>
                <th className="py-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest font-normal text-right">
                  Compute
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {telemetry?.logs.map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-muted/30 transition-all"
                >
                  <td className="py-4 text-[10px] font-mono text-muted-foreground tabular-nums">
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-4 text-[11px] text-foreground font-mono group-hover:text-white transition-colors">
                    {log.rule_id}
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 border ${
                        log.severity === "critical"
                          ? "text-leakage border-leakage bg-leakage/10"
                          : log.severity === "high" ||
                              log.severity === "warning"
                            ? "text-warning border-warning bg-warning/10"
                            : "text-muted-foreground/70 border-muted-foreground/20"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-4 text-[10px] font-mono text-muted-foreground text-right tabular-nums">
                    {log.evaluation_time_ms?.toFixed(2)}ms
                  </td>
                </tr>
              ))}
              {(!telemetry || telemetry.logs.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest"
                  >
                    No forensic data available.
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
