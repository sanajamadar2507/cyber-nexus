"use client";

import React from "react";
import {
  ShieldAlert,
  RotateCcw,
  Sliders,
  Tv,
  Network,
  Share2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface NavbarProps {
  graphName: string;
  isDirected: boolean;
  isConnected: boolean;
  vertexCount: number;
  edgeCount: number;
  onReset: () => void;
  onToggleDirected: () => void;
  onPresentationMode: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export default function Navbar({
  graphName,
  isDirected,
  isConnected,
  vertexCount,
  edgeCount,
  onReset,
  onToggleDirected,
  onPresentationMode,
  activeTab,
  onSelectTab,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-cyber-950/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Academic Project Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base md:text-lg tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              CYBER NEXUS
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-cyan-950 border border-cyan-700/60 text-cyan-300 rounded">
              DM Lab v2.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden lg:block">
            Discrete Mathematics Applied Network Resilience & Graph Theory System
          </p>
        </div>
      </div>

      {/* Center Graph Topology Metrics Badges */}
      <div className="hidden md:flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 px-3.5 py-1.5 rounded-full text-xs">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-400">|V|:</span>
          <span className="text-cyan-300 font-bold">{vertexCount}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">|E|:</span>
          <span className="text-cyan-300 font-bold">{edgeCount}</span>
        </div>

        <div className="w-[1px] h-3.5 bg-slate-800" />

        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-[11px]">Connected</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-rose-400 font-medium text-[11px]">Partitioned</span>
            </>
          )}
        </div>

        <div className="w-[1px] h-3.5 bg-slate-800" />

        <button
          onClick={onToggleDirected}
          title="Toggle between Directed and Undirected Graph modeling"
          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          {isDirected ? "Directed (u→v)" : "Undirected (u—v)"}
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPresentationMode}
          title="Launch Presentation Mode for Project Viva / College PPT"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 transition transform active:scale-95"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Presentation Mode</span>
        </button>

        <button
          onClick={onReset}
          title="Reset Graph to Default Scenario"
          className="p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
