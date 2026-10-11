import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
  variant?: "default" | "cyan" | "emerald" | "amber" | "rose";
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  variant = "default",
  className = "",
}: MetricCardProps) {
  const variantStyles = {
    default: "border-slate-800 bg-slate-900/60 text-slate-100",
    cyan: "border-cyan-500/30 bg-cyan-950/30 text-cyan-200",
    emerald: "border-emerald-500/30 bg-emerald-950/30 text-emerald-200",
    amber: "border-amber-500/30 bg-amber-950/30 text-amber-200",
    rose: "border-rose-500/30 bg-rose-950/30 text-rose-200",
  };

  const iconColors = {
    default: "text-slate-400 bg-slate-800",
    cyan: "text-cyan-400 bg-cyan-900/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    emerald: "text-emerald-400 bg-emerald-900/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    amber: "text-amber-400 bg-amber-900/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    rose: "text-rose-400 bg-rose-900/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
  };

  return (
    <div
      className={`relative p-4 rounded-xl border backdrop-blur-md transition-all duration-200 hover:border-slate-700 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[variant]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
          {value}
        </span>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-normal truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
