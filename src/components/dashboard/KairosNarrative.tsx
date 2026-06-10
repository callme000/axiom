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
      critical: "text-leakage",
      warning: "text-warning",
      advisory: "text-truth",
      observation: "text-muted-foreground",
    }[insight.severity] || "text-muted-foreground";

  const glowClass =
    {
      critical: "bg-glow-leakage",
      warning: "bg-glow-warning",
      advisory: "bg-glow-truth",
      observation: "",
    }[insight.severity] || "";

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
      <LuxuryCard
        className={`p-8 md:p-12 overflow-hidden group bg-card/40 backdrop-blur-xl border-border relative ${glowClass}`}
      >
        <div className="space-y-8 font-mono relative z-10">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-[10px] tracking-[0.6em] text-muted-foreground uppercase">
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                STATUS:
              </p>
              <p className="text-sm text-foreground uppercase tracking-wider">
                {insight.category?.replace(/_/g, " ") || "STRATEGIC ANALYSIS"}
                <span className={`ml-2 ${severityColor}`}>
                  (Severity: {displaySeverity})
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                DIAGNOSTIC:
              </p>
              <p className="text-lg leading-relaxed text-foreground font-light selection:bg-foreground selection:text-background">
                {insight.message}
              </p>
            </div>

            {insight.supportingSignals &&
              insight.supportingSignals.length > 0 && (
                <div className="pt-6 border-t border-border space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    SUPPORTING SIGNALS:
                  </p>
                  <div className="space-y-3">
                    {insight.supportingSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-start group/signal"
                      >
                        <span className="text-[10px] text-muted-foreground/30 mt-1">
                          {idx + 1}.
                        </span>
                        <p className="text-xs text-muted-foreground group-hover/signal:text-foreground transition-colors leading-relaxed">
                          {signal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="pt-8 border-t border-border flex justify-between items-center opacity-60">
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest">
                  Efficiency Index
                </p>
                <p className="text-[10px] text-foreground">
                  {(insight.capitalEfficiency || 0).toFixed(1)}/100
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest">
                  Runway Window
                </p>
                <p className="text-[10px] text-foreground uppercase">
                  {insight.runway ? `${insight.runway} Days` : "Stable"}
                </p>
              </div>
            </div>
            <p className="text-[8px] tracking-[0.4em] text-muted-foreground uppercase">
              Kairos Narrative Engine v1.2
            </p>
          </div>
        </div>
      </LuxuryCard>
    </ScrollReveal>
  );
}
