"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// --- Mini Sparkline (Area) ---
export function MiniSparkline({
  data,
  color = "#8b5cf6", // Default purple
}: {
  data: number[];
  color?: string;
}) {
  const chartData = data.map((val, i) => ({ value: val, index: i }));
  return (
    <div className="h-12 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Mini Bar Chart ---
export function MiniBarChart({
  data,
  color = "#ef4444", // Default red
}: {
  data: number[];
  color?: string;
}) {
  const chartData = data.map((val, i) => ({ value: val, index: i }));
  return (
    <div className="h-12 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={4}>
          <Bar
            dataKey="value"
            fill={color}
            radius={[2, 2, 2, 2]}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Distribution Pie Chart ---
export function DistributionPieChart({
  data,
  colors = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#f97316",
    "#ef4444",
    "#6366f1",
    "#8b5cf6",
  ],
}: {
  data: { name: string; value: number }[];
  colors?: string[];
}) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-40 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={1500}
            paddingAngle={2}
            cornerRadius={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniDonut({
  value,
  max,
  color = "#3b82f6", // Default blue
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const safeValue = Math.min(value, max);
  const remainder = Math.max(0, max - safeValue);
  const data = [
    { name: "Value", value: safeValue },
    { name: "Remainder", value: remainder },
  ];

  return (
    <div className="h-12 w-full relative mt-2">
      <ResponsiveContainer width="100%" height="200%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={1500}
            cornerRadius={4}
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center pointer-events-none pb-1">
        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
          {Math.round((safeValue / max) * 100)}% Capacity
        </span>
      </div>
    </div>
  );
}
