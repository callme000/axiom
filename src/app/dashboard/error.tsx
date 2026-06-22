"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Route Error:", error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 font-mono selection:bg-white selection:text-black">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-red-500/20 p-8 md:p-12 shadow-2xl relative">
        {/* Warning Indicator */}
        <div className="flex items-center gap-4 border-b border-red-500/20 pb-6 mb-6">
          <AlertOctagon className="text-red-500 shrink-0" size={24} />
          <div>
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-red-500">
              SYSTEM_INTERRUPTED // EXCEPTION_DETECTED
            </h1>
            <p className="text-[9px] tracking-widest text-zinc-500 uppercase">
              Operational pipeline halted by analytical logic error
            </p>
          </div>
        </div>

        <p className="text-zinc-400 text-xs leading-relaxed mb-8 uppercase tracking-wide">
          The Axiom intelligence engine encountered an unhandled diagnostic fault during page render. 
          Session state preserved in secure cache.
        </p>

        {/* Diagnostic Stack Dump */}
        <div className="bg-black border border-white/5 p-4 mb-8 text-left">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            System Error Diagnostics
          </p>
          <p className="text-[10px] font-mono text-red-400 break-all leading-tight">
            {error.message || "UNIDENTIFIED_STATE_FAULT"}
          </p>
          {error.digest && (
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Button - Hard Edge */}
        <button
          onClick={() => reset()}
          className="w-full border border-white/10 bg-zinc-900 text-white hover:bg-white hover:text-black px-6 py-4 font-bold text-[10px] tracking-[0.4em] transition-all uppercase rounded-none"
        >
          [ RECALIBRATE_SYSTEM ]
        </button>
      </div>
    </main>
  );
}
