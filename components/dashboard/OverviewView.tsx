"use client";

import React from "react";
import { GraphData, AnalysisResult, ResilienceReport } from "@/types/graph";
import MetricCard from "@/components/ui/MetricCard";
import GaugeChart from "@/components/ui/GaugeChart";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  Network,
  Share2,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface OverviewViewProps {
  graph: GraphData;
  analysis: AnalysisResult;
  resilience: ResilienceReport;
  onNavigateTab: (tabId: string) => void;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export const DM_MAPPINGS = [
  { dm: "Vertex V", net: "Network Device (PC, Router, Server, Firewall, Gateway)" },
  { dm: "Edge E", net: "Physical/Logical Communication Link" },
  { dm: "Directed Edge (u,v)", net: "One-Way Communication Channel / Firewall Egress Rule" },
  { dm: "Edge Weight w(e)", net: "Link Latency (ms), Transmission Cost, or Vulnerability Metric" },
  { dm: "Vertex Degree deg(v)", net: "Port Density / Number of Connected Network Neighbors" },
  { dm: "Path P", net: "End-to-End Packet Routing Path" },
  { dm: "Cycle C", net: "Routing Loop / Fault-Tolerant Redundant Ring" },
  { dm: "Connected Components", net: "Isolated Subnets or Partitioned Network Segments" },
  { dm: "Cut Vertex (Articulation)", net: "Single Point of Failure Router or Gateway" },
  { dm: "Bridge (Edge Cut)", net: "Critical Trunk Cable / Single Inter-Switch Uplink" },
  { dm: "Spanning Tree", net: "Loop-Free Switching Topology (IEEE 802.1D Spanning Tree Protocol)" },
  { dm: "Shortest Path (Dijkstra)", net: "Lowest-Cost OSPF / IS-IS Routing Protocol Path" },
];

export default function OverviewView({
  graph,
  analysis,
  resilience,
  onNavigateTab,
  onUpdateVertexPosition,
}: OverviewViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);

  return (
    <div className="space-y-6">
      {/* 8 Dynamic Summary Metrics Cards (Section 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Vertices"
          value={activeVertices.length}
          subtitle="|V| Active Network Devices"
          icon={Cpu}
          variant="cyan"
        />
        <MetricCard
          title="Total Edges"
          value={activeEdges.length}
          subtitle="|E| Active Connections"
          icon={Share2}
          variant="cyan"
        />
        <MetricCard
          title="Graph Type"
          value={graph.isDirected ? "Directed" : "Undirected"}
          subtitle={analysis.graphType.isWeighted ? "Weighted Graph" : "Unweighted"}
          icon={Network}
          variant="default"
        />
        <MetricCard
          title="Connectivity Status"
          value={analysis.isConnected ? "Connected" : `${analysis.componentCount} Components`}
          subtitle={analysis.isConnected ? "1 Global Component" : "Network Partitioned"}
          icon={analysis.isConnected ? CheckCircle : AlertTriangle}
          variant={analysis.isConnected ? "emerald" : "rose"}
        />
        <MetricCard
          title="Critical Vertices"
          value={analysis.cutVertices.length}
          subtitle="Articulation / Cut Points"
          icon={AlertTriangle}
          variant={analysis.cutVertices.length > 0 ? "amber" : "emerald"}
          badge={analysis.cutVertices.length > 0 ? "VULNERABILITY" : "SAFE"}
        />
        <MetricCard
          title="Critical Edges"
          value={analysis.bridges.length}
          subtitle="Bridges (Cut Links)"
          icon={ShieldAlert}
          variant={analysis.bridges.length > 0 ? "rose" : "emerald"}
          badge={analysis.bridges.length > 0 ? "NO REDUNDANCY" : "PROTECTED"}
        />
        <MetricCard
          title="Network Resilience"
          value={`${resilience.score}%`}
          subtitle="Rule-Based Graph Metric"
          icon={Activity}
          variant={
            resilience.riskLevel === "LOW"
              ? "emerald"
              : resilience.riskLevel === "MODERATE"
              ? "cyan"
              : "rose"
          }
        />
        <MetricCard
          title="Security Risk Level"
          value={resilience.riskLevel}
          subtitle={`${resilience.connectivityState}`}
          icon={ShieldAlert}
          variant={
            resilience.riskLevel === "LOW"
              ? "emerald"
              : resilience.riskLevel === "MODERATE"
              ? "amber"
              : "rose"
          }
        />
      </div>

      {/* Main Grid: Live Interactive Graph + Resilience Gauge Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2-column Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                Live Topology & Structural Invariants
              </h2>
              <p className="text-xs text-slate-400">
                Articulation cut vertices are marked with pulsing amber halos; bridge links with red dashed lines.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("lab")}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
            >
              Open Editor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[420px] w-full">
            <InteractiveNetworkGraph
              vertices={graph.vertices}
              edges={graph.edges}
              isDirected={graph.isDirected}
              cutVertices={analysis.cutVertices}
              bridgeEdges={analysis.bridges}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right: Resilience & Health Radar Panel */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Resilience Evaluation
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Deterministic</span>
            </div>

            <GaugeChart score={resilience.score} riskLevel={resilience.riskLevel} size={170} />

            {/* Score Breakdown Factors */}
            <div className="mt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Mathematical Penalties & Bonuses
              </span>
              <div className="space-y-1.5 text-xs">
                {resilience.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800/80"
                  >
                    <span className="text-slate-300 truncate pr-2">{factor.name}</span>
                    <span
                      className={`font-mono font-bold ${
                        factor.points > 0
                          ? "text-emerald-400"
                          : factor.points < 0
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("resilience")}
            className="w-full py-2.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Launch Failure Simulation Lab
          </button>
        </div>
      </div>

      {/* Discrete Mathematics to Network Engineering Mapping Table */}
      <div className="glass-panel p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Discrete Mathematics ↔ Computer Network Engineering Mapping
            </h3>
            <p className="text-xs text-slate-400">
              Rigorous correspondence between Discrete Mathematical Structures and real-world cybersecurity infrastructure.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("concepts")}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
          >
            View All DM Definitions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DM_MAPPINGS.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {item.dm}
              </div>
              <p className="text-xs text-slate-400 leading-snug">{item.net}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
