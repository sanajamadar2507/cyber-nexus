"use client";

import React from "react";
import {
  Workflow,
  Network,
  Grid,
  BarChart2,
  Cpu,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";

export const PIPELINE_STEPS = [
  {
    step: "01",
    title: "NETWORK INPUT",
    desc: "Ingests raw network topology or user-defined node connections (PCs, switches, routers, firewalls, and link metrics).",
    icon: Network,
    badge: "Input Stage",
  },
  {
    step: "02",
    title: "GRAPH MODELING",
    desc: "Translates devices to vertices V, links to edges E, communication paths to directed/undirected edges, and latency to weights w(e).",
    icon: Workflow,
    badge: "Formal Model",
  },
  {
    step: "03",
    title: "GRAPH REPRESENTATION",
    desc: "Generates in-memory dynamic data structures: Adjacency Matrix A(G), Incidence Matrix M(G), and Adjacency Lists Adj[v].",
    icon: Grid,
    badge: "Data Structures",
  },
  {
    step: "04",
    title: "MATHEMATICAL ANALYSIS",
    desc: "Computes vertex degrees, verifies Euler's Handshaking Theorem, detects cycles, and evaluates global graph connectivity.",
    icon: BarChart2,
    badge: "Discrete Invariants",
  },
  {
    step: "05",
    title: "ALGORITHM EXECUTION",
    desc: "Executes deterministic algorithms: Tarjan's cut-point search, Dijkstra's shortest path, Prim's and Kruskal's MST, and BFS/DFS.",
    icon: Cpu,
    badge: "Algorithmic Engine",
  },
  {
    step: "06",
    title: "SECURITY / RESILIENCE ANALYSIS",
    desc: "Simulates failure of critical cut vertices and bridges; calculates connected component fragmentation and Demonstration Resilience Score.",
    icon: ShieldAlert,
    badge: "Resilience Engine",
  },
  {
    step: "07",
    title: "VISUAL INSIGHTS",
    desc: "Renders interactive SVG canvas highlighting articulation nodes, bridges, shortest paths, and partitioned subnets.",
    icon: Sparkles,
    badge: "Visual Analytics",
  },
  {
    step: "08",
    title: "ALGORITHMIC RECOMMENDATION",
    desc: "Formulates deterministic rule-based topology hardening actions (e.g. adding redundant cycles to eliminate cut vertices).",
    icon: CheckCircle2,
    badge: "Prescriptive Mitigation",
  },
];

export default function ProjectMethodologyView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
            System Architecture
          </span>
          <span className="text-xs text-slate-400 font-mono">End-to-End Mathematical Pipeline</span>
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
          PROJECT METHODOLOGY & PIPELINE
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1">
          The 8-stage algorithmic pipeline bridging Discrete Mathematics graph theory with automated network resilience evaluation.
        </p>
      </div>

      {/* Visual Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-extrabold text-cyan-400 text-sm">
                    {step.step}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-900 text-slate-400 border border-slate-800">
                    {step.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{step.title}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Deterministic</span>
                <span>Stage {idx + 1}/8</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
