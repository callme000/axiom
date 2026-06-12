"use client";

import React from "react";
import { Deployment } from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { DeploymentMap } from "@/lib/utils/taxonomy";
import { Radar } from "lucide-react";

interface HistoricalAuditProps {
  deployments: Deployment[];
}

export function HistoricalAudit({ deployments }: HistoricalAuditProps) {
  if (!deployments || deployments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-6 relative overflow-hidden">
        {/* Radar Ping Illustration */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
          <div className="absolute inset-0 rounded-full border border-truth/20" />
          <div className="absolute inset-4 rounded-full border border-truth/30" />
          <div className="absolute inset-8 rounded-full border border-truth/40" />
          <div className="absolute inset-0 rounded-full border-t border-truth animate-spin" style={{ animationDuration: '3s' }} />
          <Radar size={32} className="text-truth relative z-10 opacity-80" />
          {/* Scanning Sweep */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 origin-top-left animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-full h-full bg-gradient-to-br from-truth/20 to-transparent transform -skew-x-12" />
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="font-mono text-sm tracking-[0.2em] text-truth uppercase font-bold">
            Audit Ledger Clear
          </h3>
          <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase max-w-xs leading-relaxed">
            No historical deployments detected. Awaiting initial capital allocation to establish forensic baseline.
          </p>
        </div>
      </div>
    );
  }

  // Sort by date descending
  const sortedDeployments = [...deployments].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <h3 className="font-mono text-xl text-white tracking-widest uppercase">
          Historical Audit
        </h3>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
        {sortedDeployments.map((record) => (
          <div
            key={record.id}
            className="group relative bg-white/[0.02] border border-white/5 rounded-sm p-6 flex items-center justify-between transition-all hover:bg-white/[0.04] hover:border-white/10"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="opacity-40 group-hover:opacity-80 transition-opacity"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-mono text-sm uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                  {record.title}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded-sm text-white/40 uppercase tracking-widest">
                    {DeploymentMap[
                      record.category as keyof typeof DeploymentMap
                    ] || record.category}
                  </span>
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    {new Date(record.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg text-white tabular-nums">
                {formatCurrency(record.amount)}
              </p>
              <p className="text-[8px] font-mono text-white/10 uppercase tracking-[0.3em] mt-1">
                Verified Asset
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[8px] font-mono text-white/10 uppercase tracking-[0.5em]">
        Forensic layer immutable // Protocol v1.0
      </p>
    </div>
  );
}
