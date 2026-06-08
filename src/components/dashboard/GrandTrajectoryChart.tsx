"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { LuxuryCard } from "../ui/luxury-card";
import { formatCurrency } from "@/lib/utils/formatters";
import { ScrollReveal } from "../ui/scroll-reveal";

interface ChartData {
  name: string;
  value: number;
}

interface GrandTrajectoryChartProps {
  data: ChartData[];
  title?: string;
}

export function GrandTrajectoryChart({
  data,
  title = "Wealth Trajectory // 12-Month Projection",
}: GrandTrajectoryChartProps) {
  return (
    <ScrollReveal direction="up" distance={20} duration={1}>
      <LuxuryCard className="p-8 md:p-12 overflow-hidden group">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-[0.6em] text-white/20 uppercase">
              Sovereign Intelligence Analysis
            </p>
            <h3 className="font-cormorant italic text-3xl text-white/80 transition-all duration-700 group-hover:text-white">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span>Projected Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-white/20" />
              <span>Structural Baseline</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full mt-8 relative">
          {/* Subtle Decorative Grid Underlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="white" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="white" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="white"
                vertical={false}
                opacity={0.03}
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.1)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontFamily: "monospace",
                }}
                dy={20}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <p className="font-mono text-[8px] tracking-widest text-white/40 uppercase mb-2">
                          {payload[0].payload.name}
                        </p>
                        <p className="font-cormorant text-2xl text-white">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="white"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={2500}
                animationEasing="ease-in-out"
                activeDot={{
                  r: 4,
                  fill: "white",
                  stroke: "black",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 flex justify-between items-center pt-8 border-t border-white/5">
          <div className="flex gap-12">
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                Delta Variance
              </p>
              <p className="text-xs font-mono text-emerald-500/80">+12.4%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                Confidence Index
              </p>
              <p className="text-xs font-mono text-white/60">0.94</p>
            </div>
          </div>
          <p className="font-mono text-[8px] tracking-[0.5em] text-white/10 uppercase">
            Autonomous Strategic Modeling v1.0
          </p>
        </div>
      </LuxuryCard>
    </ScrollReveal>
  );
}
