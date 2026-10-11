"use client";

import React from "react";
import { Info, GraduationCap, Cpu, ShieldCheck, Terminal, Award, BookOpen } from "lucide-react";

export default function AboutProjectView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
            Course Project Details
          </span>
          <span className="text-xs text-slate-400 font-mono">Engineering Academic Evaluation</span>
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
          ABOUT CYBER NEXUS
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1">
          An Intelligent Graph-Based Network Security & Resilience Analysis System built for the Second Year Engineering Discrete Mathematics course.
        </p>
      </div>

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            Academic Metadata
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400">Project Title:</span>
              <span className="font-bold text-white font-mono">CYBER NEXUS</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400">Course:</span>
              <span className="font-bold text-white">Discrete Mathematics (SE Sem III / IV)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400">Engineering Domain:</span>
              <span className="font-bold text-cyan-300">Discrete Mathematics + Cybersecurity</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400">Core Mathematical Foundation:</span>
              <span className="font-bold text-white">Graph Theory & Trees</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400">Core Deterministic Algorithms:</span>
              <span className="font-mono text-cyan-300 font-bold">
                Dijkstra + Prim + Kruskal + BFS + DFS + Tarjan
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Project Scope & Statement of Purpose
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            The primary academic purpose of this project is to demonstrate how{" "}
            <strong className="text-white">Discrete Mathematics, especially Graph Theory and Trees</strong>, can be rigorously applied to model, analyze, and evaluate the security and resilience of computer networks.
          </p>

          <p className="text-xs text-slate-400 leading-relaxed">
            Rather than functioning as a black-box cybersecurity dashboard, this platform directly exposes the algebraic matrices, discrete invariants, cycle structures, cut vertices, and minimum spanning trees that govern network survivability.
          </p>

          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 space-y-1 text-xs text-slate-300">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Project Viva Note:
            </div>
            <p className="text-[11px] text-slate-400">
              All computations run client-side in deterministic TypeScript without external AI APIs or cloud databases, guaranteeing 100% offline reproducibility.
            </p>
          </div>
        </div>
      </div>

      {/* College Presentation Placeholder Card */}
      <div className="glass-panel p-5 rounded-xl border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          College Submission Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Department</span>
            <span className="text-slate-200">[Department of Computer Science & Engineering]</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Team Members</span>
            <span className="text-slate-200">[Student Name(s) / Roll Numbers Placeholder]</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Faculty Mentor</span>
            <span className="text-slate-200">[Course Faculty / Project Guide Placeholder]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
