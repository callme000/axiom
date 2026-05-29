"use client";

import React, { useEffect, useState } from "react";
import { fetchHistoricalAuditAction } from "./actions";
import { AuditRecord } from "@/lib/db/audit";

const formatKSh = (amt: number) => {
  const isNegative = amt < 0;
  const absAmt = Math.abs(amt);
  return `${isNegative ? "-" : ""}KSh ${Math.round(absAmt).toLocaleString()}`;
};

export function HistoricalAudit() {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAudit() {
      try {
        const records = await fetchHistoricalAuditAction();
        setAuditRecords(records);
      } catch (err) {
        console.error("Failed to fetch audit history:", err);
        setError("Forensic layer synchronization failure.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAudit();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center animate-pulse">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
          Synchronizing Forensic Layer...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40">
          {error}
        </p>
      </div>
    );
  }

  if (auditRecords.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-foreground/5 rounded-3xl">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
          No audit history found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 opacity-20">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
          Historical Audit Trail
        </h3>
        <div className="h-0.5 flex-1 bg-foreground/10"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {auditRecords.map((record) => (
          <div
            key={`${record.type}-${record.id}`}
            className="group relative bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-4 flex items-center justify-between transition-colors hover:bg-foreground/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center grayscale opacity-40">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-foreground"
                >
                  {record.type === "deployment" && (
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  )}
                  {record.type === "income" && (
                    <path d="M12 20V10M18 20V4M6 20v-4" />
                  )}
                  {record.type === "liability" && (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  )}
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-sm text-foreground/40 line-through decoration-foreground/20">
                    {record.name}
                  </h4>
                  <span className="text-[8px] font-black px-2 py-0.5 bg-foreground/5 rounded-full uppercase tracking-tighter text-foreground/30">
                    {record.type}
                  </span>
                </div>
                <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-tighter">
                  Deleted:{" "}
                  {new Date(record.deleted_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-sm tabular-nums text-foreground/30 line-through decoration-foreground/10">
                {formatKSh(record.amount)}
              </p>
              <p className="text-[8px] font-black text-foreground/20 uppercase tracking-widest mt-0.5">
                Archived
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[9px] font-black text-foreground/10 uppercase tracking-[0.2em] mt-4">
        Forensic view only :: Data immutable
      </p>
    </div>
  );
}
