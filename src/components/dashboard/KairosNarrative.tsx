"use client";

import React from "react";
import { LuxuryCard } from "../ui/luxury-card";
import { ScrollReveal } from "../ui/scroll-reveal";
import { KairosInsight } from "@/lib/ai/kairos";

interface KairosNarrativeProps {
  insight: KairosInsight | null;
}

export function KairosNarrative({ insight }: KairosNarrativeProps) {
  if (!insight) return null;

  const severityColor =
    {
      critical: "text-red-500",
      warning: "text-orange-500",
      advisory: "text-blue-400",
      observation: "text-white/40",
    }[insight.severity] || "text-white/40";

  const severityPulse = insight.severity === "critical" ? "animate-pulse" : "";

  const displaySeverity =
    {
      critical: "Critical",
      warning: "High",
      advisory: "Medium",
      observation: "Low",
    }[insight.severity] || "Low";

  return (
    <ScrollReveal direction="up" distance={20} duration={1}>
      <LuxuryCard className="p-8 md:p-12 overflow-hidden group bg-black/40 backdrop-blur-xl border-white/5">
        <div className="space-y-8 font-mono">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <p className="text-[10px] tracking-[0.6em] text-white/20 uppercase">
              [SYSTEM SCAN COMPLETE]
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${severityColor.replace("text-", "bg-")} ${severityPulse}`}
              />
              <p
                className={`text-[9px] tracking-widest uppercase ${severityColor}`}
              >
                Active Monitoring
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                STATUS:
              </p>
              <p className="text-sm text-white/80 uppercase tracking-wider">
                {insight.category.replace(/_/g, " ")}
                <span className={`ml-2 ${severityColor}`}>
                  (Severity: {displaySeverity})
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                DIAGNOSTIC:
              </p>
              <p className="text-lg leading-relaxed text-white font-light selection:bg-white selection:text-black">
                {insight.message}
              </p>
            </div>

            {insight.supportingSignals &&
              insight.supportingSignals.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">
                    SUPPORTING SIGNALS:
                  </p>
                  <div className="space-y-3">
                    {insight.supportingSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-start group/signal"
                      >
                        <span className="text-[10px] text-white/10 mt-1">
                          {idx + 1}.
                        </span>
                        <p className="text-xs text-white/40 group-hover/signal:text-white/60 transition-colors leading-relaxed">
                          {signal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[8px] text-white/40 uppercase tracking-widest">
                  Efficiency Index
                </p>
                <p className="text-[10px] text-white">
                  {(insight.capitalEfficiency || 0).toFixed(1)}/100
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-white/40 uppercase tracking-widest">
                  Runway Window
                </p>
                <p className="text-[10px] text-white uppercase">
                  {insight.runway ? `${insight.runway} Days` : "Stable"}
                </p>
              </div>
            </div>
            <p className="text-[8px] tracking-[0.4em] text-white/20 uppercase">
              Kairos Narrative Engine v1.1
            </p>
          </div>
        </div>
      </LuxuryCard>
    </ScrollReveal>
  );
}
