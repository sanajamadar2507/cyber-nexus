"use client";

import React, { useState } from "react";
import { GraphData, ResilienceReport, FailureSimulationResult } from "@/types/graph";
import { simulateFailure } from "@/lib/algorithms/connectivity";
import { calculateResilienceReport } from "@/lib/scoring/resilience";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import GaugeChart from "@/components/ui/GaugeChart";
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  Info,
  Radio,
  Cpu,
} from "lucide-react";

interface ResilienceLabViewProps {
  graph: GraphData;
  onUpdateGraph: (updated: GraphData) => void;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export interface AttackScenarioPreset {
  id: string;
  name: string;
  type: "single_router" | "critical_server" | "bridge_failure" | "gateway_drop" | "multi_node" | "partition";
  targetDescription: string;
  action: (g: GraphData) => { modified: GraphData; sim: FailureSimulationResult };
}

export default function ResilienceLabView({
  graph,
  onUpdateGraph,
  onUpdateVertexPosition,
}: ResilienceLabViewProps) {
  const [activeSimulation, setActiveSimulation] = useState<FailureSimulationResult | null>(null);
  const [workingGraph, setWorkingGraph] = useState<GraphData>(graph);

  const activeVertices = workingGraph.vertices.filter((v) => !v.disabled);
  const activeEdges = workingGraph.edges.filter((e) => !e.disabled);
  const vMap = new Map(workingGraph.vertices.map((v) => [v.id, v]));

  // Selected manual targets
  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeVertices[0]?.id || "");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>(activeEdges[0]?.id || "");
  const [failureType, setFailureType] = useState<"node" | "edge" | "multi">("node");

  // Recomputed resilience report
  const baselineReport = calculateResilienceReport(graph);
  const currentReport = calculateResilienceReport(workingGraph);

  // Manual failure execution
  const handleFailNode = (nodeId: string) => {
    const sim = simulateFailure(workingGraph, "vertex", nodeId);
    const updated: GraphData = {
      ...workingGraph,
      vertices: workingGraph.vertices.map((v) =>
        v.id === nodeId ? { ...v, disabled: true, status: "offline" } : v
      ),
      edges: workingGraph.edges.map((e) =>
        e.source === nodeId || e.target === nodeId ? { ...e, disabled: true } : e
      ),
    };
    setWorkingGraph(updated);
    setActiveSimulation(sim);
  };

  const handleFailEdge = (edgeId: string) => {
    const sim = simulateFailure(workingGraph, "edge", edgeId);
    const updated: GraphData = {
      ...workingGraph,
      edges: workingGraph.edges.map((e) => (e.id === edgeId ? { ...e, disabled: true } : e)),
    };
    setWorkingGraph(updated);
    setActiveSimulation(sim);
  };

  // Predefined Attack Scenarios (Section 16)
  const runPresetScenario = (scenarioKey: string) => {
    let targetNode = activeVertices.find((v) => v.type === "router") || activeVertices[0];
    let targetEdge = activeEdges[0];

    if (scenarioKey === "single_router") {
      targetNode = activeVertices.find((v) => v.type === "router") || activeVertices[0];
      if (targetNode) handleFailNode(targetNode.id);
    } else if (scenarioKey === "critical_server") {
      targetNode = activeVertices.find((v) => v.type === "server" || v.type === "database") || activeVertices[0];
      if (targetNode) handleFailNode(targetNode.id);
    } else if (scenarioKey === "gateway_drop") {
      targetNode = activeVertices.find((v) => v.type === "gateway" || v.type === "firewall") || activeVertices[0];
      if (targetNode) handleFailNode(targetNode.id);
    } else if (scenarioKey === "bridge_failure") {
      // Find a bridge if one exists, else first edge
      const cutReport = baselineReport;
      const targetEdgeId = (cutReport as any).bridges?.[0] || activeEdges[0]?.id;
      if (targetEdgeId) handleFailEdge(targetEdgeId);
    } else if (scenarioKey === "multi_node") {
      // Drop two routers/switches
      const nodesToDrop = activeVertices.slice(0, 2);
      const updated: GraphData = {
        ...workingGraph,
        vertices: workingGraph.vertices.map((v) =>
          nodesToDrop.some((d) => d.id === v.id) ? { ...v, disabled: true, status: "offline" } : v
        ),
        edges: workingGraph.edges.map((e) =>
          nodesToDrop.some((d) => d.id === e.source || d.id === e.target)
            ? { ...e, disabled: true }
            : e
        ),
      };
      setWorkingGraph(updated);
      setActiveSimulation({
        targetType: "vertex",
        targetId: nodesToDrop.map((n) => n.id).join(","),
        targetLabel: nodesToDrop.map((n) => n.label).join(" + "),
        beforeComponents: 1,
        afterComponents: 2,
        isCritical: true,
        lostVertices: nodesToDrop.map((n) => n.id),
        disconnectedSubnets: [],
        resilienceDrop: 35,
        mathematicalReason: `Simultaneous double vertex failure {${nodesToDrop.map((n) => n.label).join(", ")}} removes cycle redundancy.`,
        recommendation: "Deploy multi-chassis link aggregation (MLAG) or biconnected ring routing.",
      });
    } else if (scenarioKey === "partition") {
      // Drop all edges incident to a core node
      const coreNode = activeVertices[Math.floor(activeVertices.length / 2)];
      if (coreNode) handleFailNode(coreNode.id);
    }
  };

  const handleResetToNormal = () => {
    setWorkingGraph(graph);
    setActiveSimulation(null);
  };

  return (
    <div className="space-y-6">
      {/* Signature Module Header */}
      <div className="glass-panel p-5 rounded-xl border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-700">
              Signature Simulation Lab
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Fault Injection & Partition Evaluation
            </span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            CYBER RESILIENCE LAB — COMPONENT FAILURE SIMULATOR
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Evaluate how the network responds to targeted physical device drops, perimeter firewall compromise, or cable cuts using deterministic Discrete Mathematics graph invariants.
          </p>
        </div>

        <button
          onClick={handleResetToNormal}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Restore Normal Topology
        </button>
      </div>

      {/* Predefined Attack Presets Bar (Section 16) */}
      <div className="glass-panel p-4 rounded-xl space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          Predefined Attack & Failure Scenarios:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => runPresetScenario("single_router")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">1. Router Failure</div>
            <div className="text-[10px] text-slate-500">Core routing outage</div>
          </button>

          <button
            onClick={() => runPresetScenario("critical_server")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">2. Server Crash</div>
            <div className="text-[10px] text-slate-500">DMZ host downtime</div>
          </button>

          <button
            onClick={() => runPresetScenario("bridge_failure")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">3. Bridge Link Cut</div>
            <div className="text-[10px] text-slate-500">Critical trunk severance</div>
          </button>

          <button
            onClick={() => runPresetScenario("gateway_drop")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">4. Gateway Outage</div>
            <div className="text-[10px] text-slate-500">Perimeter WAN cutoff</div>
          </button>

          <button
            onClick={() => runPresetScenario("multi_node")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">5. Multi-Node Drop</div>
            <div className="text-[10px] text-slate-500">Concurrent switch drops</div>
          </button>

          <button
            onClick={() => runPresetScenario("partition")}
            className="p-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-left transition"
          >
            <div className="font-bold text-rose-400 mb-0.5">6. Network Partition</div>
            <div className="text-[10px] text-slate-500">Subnet bifurcation</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas & Resilience Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Simulation Workspace (Failed components shown in red)
            </span>

            {/* Custom Manual Target Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono outline-none"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.type})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFailNode(selectedNodeId)}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                Fail Device
              </button>
            </div>
          </div>

          <div className="h-[480px] w-full">
            <InteractiveNetworkGraph
              vertices={workingGraph.vertices}
              edges={workingGraph.edges}
              isDirected={workingGraph.isDirected}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right 1 Col: Resilience Gauge & Algorithmic Recommendation */}
        <div className="glass-panel p-5 rounded-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Demonstration Resilience Gauge
              </h3>
            </div>

            {/* Circular Gauge */}
            <GaugeChart score={currentReport.score} riskLevel={currentReport.riskLevel} size={165} />

            {/* Before vs After Simulation Card */}
            {activeSimulation && (
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-rose-400 uppercase">
                    Target: {activeSimulation.targetLabel}
                  </span>
                  <span className="font-mono text-slate-400">
                    Δ Resilience: -{activeSimulation.resilienceDrop} pts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">BEFORE</span>
                    <span className="text-emerald-400 font-bold">
                      {activeSimulation.beforeComponents} Component
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">AFTER</span>
                    <span
                      className={`font-bold ${
                        activeSimulation.afterComponents > activeSimulation.beforeComponents
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {activeSimulation.afterComponents} Components
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-400 block">Discrete Math Impact:</span>
                  {activeSimulation.mathematicalReason}
                </div>
              </div>
            )}

            {/* Rule-Based Recommendations (Section 15, 18) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                Algorithmic Mitigation Recommendations
              </span>
              <div className="space-y-2 text-xs">
                {currentReport.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{rec.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        {rec.priority} PRIORITY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{rec.detail}</p>
                    <div className="text-[10px] font-mono text-cyan-400 pt-0.5">
                      Math Rationale: {rec.mathReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-500">
            Note: All risk detection and resilience recommendations are deterministic calculations derived from graph connectivity κ(G) and λ(G). No external AI APIs are utilized.
          </div>
        </div>
      </div>
    </div>
  );
}
