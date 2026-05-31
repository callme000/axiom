"use client";

import { useState, useEffect, useRef } from "react";

const LOGS = [
  { text: "> INITIALIZING KAIROS ENGINE...", type: "info" },
  { text: "> SYNCING OPERATIONAL BASELINE...", type: "info" },
  { text: "> ANALYZING TRANSACTION TAXONOMY...", type: "info" },
  { text: "> CALCULATING STRUCTURAL RUNWAY...", type: "info" },
  { text: "> [WARNING] INFLOW CONCENTRATION RISK DETECTED.", type: "warning" },
  { text: "> 85% OF YIELD RELIES ON A SINGLE FLOW.", type: "warning" },
  { text: "> STRUCTURAL SOLVENCY: OPTIMAL", type: "success" },
  { text: "> DEPLOYMENT STRATEGY: CALCULATED", type: "info" },
];

export function LandingTerminal() {
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showNextLog = (index: number) => {
      if (index >= LOGS.length) {
        setIsTyping(false);
        // Reset after a delay to loop the animation
        timeoutId = setTimeout(() => {
          setVisibleLogs([]);
          setIsTyping(true);
          showNextLog(0);
        }, 5000);
        return;
      }

      timeoutId = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, index]);
        showNextLog(index + 1);
      }, index === 0 ? 500 : 1200);
    };

    showNextLog(0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-white/5">
        {/* Terminal Header */}
        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">
            Kairos // Audit Terminal
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={containerRef}
          className="p-6 h-64 overflow-y-auto space-y-2 scrollbar-hide"
        >
          {visibleLogs.map((logIndex) => {
            const log = LOGS[logIndex];
            return (
              <div
                key={logIndex}
                className={`
                  ${log.type === 'warning' ? 'text-orange-500' : ''}
                  ${log.type === 'success' ? 'text-emerald-500' : ''}
                  ${log.type === 'info' ? 'text-white/70' : ''}
                  animate-in fade-in slide-in-from-left-2 duration-300
                `}
              >
                {log.text}
              </div>
            );
          })}
          {isTyping && (
            <div className="w-2 h-4 bg-white/40 animate-pulse inline-block align-middle ml-1" />
          )}
        </div>
      </div>

      {/* Decorative footer for the terminal */}
      <div className="mt-4 flex justify-between items-center px-4 text-[10px] text-white/20 uppercase tracking-[0.2em]">
        <div>Status: Running Clinical Audit</div>
        <div>Memory: 0.124ms / 256MB</div>
      </div>
    </div>
  );
}
