"use client";

import React from "react";
import { Deployment } from "@/lib/analytics/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { DeploymentMap } from "@/lib/utils/taxonomy";

interface HistoricalAuditProps {
  deployments: Deployment[];
}

export function HistoricalAudit({ deployments }: HistoricalAuditProps) {
  if (!deployments || deployments.length === 0) {
    return (
      <div className="p-8 text-center border border-white/5 rounded-3xl opacity-20">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em]">
          No deployment history found
        </p>
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
        <h3 className="font-cormorant italic text-3xl text-white/40">
          Historical Audit
        </h3>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
        {sortedDeployments.map((record) => (
          <div
            key={record.id}
            className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between transition-all hover:bg-white/[0.04] hover:border-white/10"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
                <h4 className="font-cormorant text-xl text-white/80 group-hover:text-white transition-colors">
                  {record.title}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded-full text-white/40 uppercase tracking-widest">
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
              <p className="font-cormorant text-2xl text-white">
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
