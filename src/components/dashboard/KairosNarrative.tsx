"use client";

import React from "react";
import { ScrollReveal } from "../ui/scroll-reveal";
import { KairosInsight } from "@/lib/ai/kairos";

interface KairosNarrativeProps {
  insight: KairosInsight | null;
}

export function KairosNarrative({ insight }: KairosNarrativeProps) {
  if (!insight) return null;

  const severityColor =
    {
      critical: "text-leakage",
      warning: "text-warning",
      advisory: "text-truth",
      observation: "text-zinc-500",
    }[insight.severity] || "text-zinc-500";

  const severityBorder =
    {
      critical: "border-leakage/40",
      warning: "border-warning/40",
      advisory: "border-truth/40",
      observation: "border-white/10",
    }[insight.severity] || "border-white/10";

  const severityPulse = insight.severity === "critical" ? "animate-pulse" : "";

  const displaySeverity =
    {
      critical: "CRITICAL",
      warning: "HIGH",
      advisory: "MEDIUM",
      observation: "LOW",
    }[insight.severity] || "LOW";

  return (
    <ScrollReveal direction="up" distance={10} duration={0.6}>
      <div
        className={`p-8 md:p-12 bg-[#0a0a0a] border ${severityBorder} rounded-sm relative overflow-hidden font-mono`}
      >
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-bold">
              [ANALYSIS_REPORT_01]
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${severityColor.replace("text-", "bg-")} ${severityPulse}`}
              />
              <p
                className={`text-[9px] tracking-widest uppercase font-bold ${severityColor}`}
              >
                Operational Status: {displaySeverity}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                SECTOR:
              </p>
              <p className="text-sm text-white uppercase tracking-wider font-bold">
                {insight.category?.replace(/_/g, " ") || "STRATEGIC ANALYSIS"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                OBSERVATION:
              </p>
              <p className="text-lg leading-relaxed text-zinc-200 selection:bg-white selection:text-black">
                {insight.message}
              </p>
            </div>

            {insight.supportingSignals &&
              insight.supportingSignals.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                    SUPPORTING DATA:
                  </p>
                  <div className="space-y-3">
                    {insight.supportingSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-start group/signal"
                      >
                        <span className="text-[10px] text-zinc-700 mt-1">
                          {idx + 1}.
                        </span>
                        <p className="text-xs text-zinc-400 group-hover/signal:text-white transition-colors leading-relaxed">
                          {signal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-between items-center opacity-40">
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">
                  Efficiency_Idx
                </p>
                <p className="text-[10px] text-white">
                  {(insight.capitalEfficiency || 0).toFixed(1)}/100
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">
                  Runway_Window
                </p>
                <p className="text-[10px] text-white uppercase">
                  {insight.runway ? `${insight.runway} Days` : "Stable"}
                </p>
              </div>
            </div>
            <p className="text-[8px] tracking-[0.4em] text-zinc-700 uppercase">
              Kairos Intel Engine v1.2
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
