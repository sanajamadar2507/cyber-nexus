"use client";

import React from "react";
import {
  ArrowRight,
  BookOpen,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

interface HeroSectionProps {
  onLaunchLab: () => void;
  onExploreConcepts: () => void;
}

export default function HeroSection({
  onLaunchLab,
  onExploreConcepts,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-cyber-900/60 to-cyber-950">
      {/* Subtle Engineering Grid Glow */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Course Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-md">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Second Year Engineering • Discrete Mathematics Project</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-sans">
            CYBER{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              NEXUS
            </span>
          </h1>
          <p className="text-base sm:text-xl font-semibold text-cyan-200/90 tracking-wide">
            An Intelligent Graph-Based Network Security & Resilience Analysis System
          </p>
        </div>

        {/* Academic Purpose Description */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Model a computer network as a graph, analyze its mathematical structure, detect critical components, evaluate resilience, and discover optimal routes using Discrete Mathematics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onLaunchLab}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Network className="w-4 h-4" />
            <span>LAUNCH NETWORK LAB</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreConcepts}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all hover:border-cyan-500/50"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>EXPLORE DM CONCEPTS</span>
          </button>
        </div>

        {/* Animated Miniature Preview Canvas with Floating Concept Badges */}
        <div className="relative mt-8 pt-4 max-w-3xl mx-auto">
          <div className="relative h-44 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl">
            {/* SVG Background Network Mesh */}
            <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 700 200">
              <line x1="80" y1="100" x2="220" y2="40" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,4" className="animate-pulse" />
              <line x1="220" y1="40" x2="380" y2="100" stroke="#10b981" strokeWidth="2" />
              <line x1="220" y1="40" x2="280" y2="160" stroke="#334155" strokeWidth="1.5" />
              <line x1="80" y1="100" x2="280" y2="160" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="280" y1="160" x2="380" y2="100" stroke="#f59e0b" strokeWidth="2" />
              <line x1="380" y1="100" x2="520" y2="50" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="380" y1="100" x2="520" y2="150" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="520" y1="50" x2="640" y2="100" stroke="#10b981" strokeWidth="2" />
              <line x1="520" y1="150" x2="640" y2="100" stroke="#3b82f6" strokeWidth="1.5" />

              {/* Glowing Nodes */}
              <circle cx="80" cy="100" r="8" fill="#06b6d4" />
              <circle cx="220" cy="40" r="10" fill="#10b981" />
              <circle cx="280" cy="160" r="9" fill="#3b82f6" />
              <circle cx="380" cy="100" r="12" fill="#f59e0b" className="animate-pulse" />
              <circle cx="520" cy="50" r="9" fill="#10b981" />
              <circle cx="520" cy="150" r="9" fill="#f43f5e" />
              <circle cx="640" cy="100" r="11" fill="#06b6d4" />
            </svg>

            {/* Floating Concept Labels */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-wrap gap-2.5 justify-center max-w-xl px-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md transform -rotate-1">
                  GRAPH THEORY
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-lg backdrop-blur-md transform rotate-2">
                  CONNECTIVITY
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-lg backdrop-blur-md transform -rotate-2">
                  SHORTEST PATH
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-lg backdrop-blur-md transform rotate-1">
                  SPANNING TREE
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-lg backdrop-blur-md">
                  NETWORK RESILIENCE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
