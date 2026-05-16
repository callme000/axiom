"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Route Error:", error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-background border-2 border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-red-500"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className="text-3xl font-black tracking-tighter uppercase mb-4 text-foreground">
          System Interrupted
        </h1>

        <p className="text-foreground/60 text-sm font-bold uppercase tracking-widest mb-8 leading-relaxed">
          The intelligence engine encountered an unhandled exception.
        </p>

        <div className="bg-foreground/5 rounded-2xl p-4 mb-8 text-left">
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">
            Error Diagnostic
          </p>
          <p className="text-xs font-mono text-red-400 break-all leading-tight">
            {error.message || "Unknown cryptographic failure"}
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full bg-foreground text-background px-4 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-foreground/10 uppercase"
        >
          Attempt Recovery
        </button>
      </div>
    </main>
  );
}
