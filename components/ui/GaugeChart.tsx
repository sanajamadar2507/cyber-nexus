"use client";

import React from "react";

interface GaugeChartProps {
  score: number; // 0-100
  riskLevel: "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
  size?: number;
}

export default function GaugeChart({ score, riskLevel, size = 180 }: GaugeChartProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc gauge
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  const colorConfig = {
    LOW: { stroke: "#10b981", text: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/40" },
    MODERATE: { stroke: "#06b6d4", text: "text-cyan-400", bg: "bg-cyan-950/60 border-cyan-500/40" },
    ELEVATED: { stroke: "#f59e0b", text: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/40" },
    CRITICAL: { stroke: "#f43f5e", text: "text-rose-400", bg: "bg-rose-950/60 border-rose-500/40" },
  };

  const { stroke, text, bg } = colorConfig[riskLevel] || colorConfig.MODERATE;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-[135deg]"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Score Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-white">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
          <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${bg} ${text}`}>
            {riskLevel} RISK
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          Resilience Metric
        </span>
        <span className="text-[10px] text-slate-500 italic">
          Demonstration Resilience Score (Deterministic)
        </span>
      </div>
    </div>
  );
}
