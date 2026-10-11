"use client";

import React, { useState } from "react";
import { GraphData, AnalysisResult, FailureSimulationResult } from "@/types/graph";
import { simulateFailure } from "@/lib/algorithms/connectivity";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Activity,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";

interface StructuralSecurityViewProps {
  graph: GraphData;
  analysis: AnalysisResult;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export default function StructuralSecurityView({
  graph,
  analysis,
  onUpdateVertexPosition,
}: StructuralSecurityViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(graph.vertices.map((v) => [v.id, v]));

  // Selected component for failure drill-down
  const [selectedTargetType, setSelectedTargetType] = useState<"vertex" | "edge">("vertex");
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    analysis.cutVertices[0] || activeVertices[0]?.id || ""
  );

  const [simResult, setSimResult] = useState<FailureSimulationResult | null>(null);

  const handleSimulateFailure = () => {
    if (!selectedTargetId) return;
    const res = simulateFailure(graph, selectedTargetType, selectedTargetId);
    setSimResult(res);
  };

  const handleResetSimulation = () => {
    setSimResult(null);
  };

  // Preview graph when simulated
  const previewGraph: GraphData = simResult
    ? {
        ...graph,
        vertices: graph.vertices.map((v) =>
          simResult.targetType === "vertex" && v.id === simResult.targetId
            ? { ...v, disabled: true }
            : v
        ),
        edges: graph.edges.map((e) =>
          (simResult.targetType === "vertex" &&
            (e.source === simResult.targetId || e.target === simResult.targetId)) ||
          (simResult.targetType === "edge" && e.id === simResult.targetId)
            ? { ...e, disabled: true }
            : e
        ),
      }
    : graph;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="glass-panel p-5 rounded-xl border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-700">
              Discrete Mathematics Core
            </span>
            <span className="text-xs text-slate-400 font-mono">Whitney&apos;s Theorem κ(G) ≤ λ(G) ≤ δ(G)</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            NETWORK STRUCTURAL SECURITY & CONNECTIVITY CUT ANALYSIS
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Identifies single points of network failure (Articulation Vertices) and single points of transmission failure (Bridges / Cut Edges) using Tarjan&apos;s DFS algorithm in O(V + E) time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[100px]">
            <span className="text-[10px] text-slate-400 block uppercase">Cut Vertices</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {analysis.cutVertices.length}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[100px]">
            <span className="text-[10px] text-slate-400 block uppercase">Bridge Edges</span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {analysis.bridges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Simulation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph with highlighted cuts */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Structural Bottleneck Visualizer
              </h3>
              <p className="text-[11px] text-slate-400">
                Pulsing amber halos indicate Articulation Vertices; red dashed lines indicate Bridge connections.
              </p>
            </div>

            {simResult && (
              <button
                onClick={handleResetSimulation}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset Simulation
              </button>
            )}
          </div>

          <div className="h-[460px] w-full">
            <InteractiveNetworkGraph
              vertices={previewGraph.vertices}
              edges={previewGraph.edges}
              isDirected={previewGraph.isDirected}
              cutVertices={analysis.cutVertices}
              bridgeEdges={analysis.bridges}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right Col: Interactive Failure Drill & Before vs After Impact */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Simulate Component Failure
            </h3>

            {/* Target Selectors */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTargetType("vertex");
                    setSelectedTargetId(analysis.cutVertices[0] || activeVertices[0]?.id || "");
                  }}
                  className={`flex-1 py-1.5 rounded font-semibold transition ${
                    selectedTargetType === "vertex"
                      ? "bg-amber-600 text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Vertex (Device)
                </button>
                <button
                  onClick={() => {
                    setSelectedTargetType("edge");
                    setSelectedTargetId(analysis.bridges[0] || activeEdges[0]?.id || "");
                  }}
                  className={`flex-1 py-1.5 rounded font-semibold transition ${
                    selectedTargetType === "edge"
                      ? "bg-rose-600 text-white font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Edge (Link)
                </button>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Target to Fail:</label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:border-cyan-500"
                >
                  {selectedTargetType === "vertex" ? (
                    <>
                      {analysis.cutVertices.map((id) => (
                        <option key={id} value={id}>
                          [CRITICAL CUT] {vMap.get(id)?.label}
                        </option>
                      ))}
                      {activeVertices
                        .filter((v) => !analysis.cutVertices.includes(v.id))
                        .map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label} ({v.type})
                          </option>
                        ))}
                    </>
                  ) : (
                    <>
                      {analysis.bridges.map((id) => {
                        const edge = graph.edges.find((e) => e.id === id);
                        return (
                          <option key={id} value={id}>
                            [CRITICAL BRIDGE] {vMap.get(edge?.source || "")?.label} ↔{" "}
                            {vMap.get(edge?.target || "")?.label}
                          </option>
                        );
                      })}
                      {activeEdges
                        .filter((e) => !analysis.bridges.includes(e.id))
                        .map((e) => (
                          <option key={e.id} value={e.id}>
                            {vMap.get(e.source)?.label} ↔ {vMap.get(e.target)?.label}
                          </option>
                        ))}
                    </>
                  )}
                </select>
              </div>

              <button
                onClick={handleSimulateFailure}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
              >
                <Play className="w-4 h-4" /> Simulate Failure & Recompute Graph
              </button>
            </div>

            {/* SIMULATION RESULT DISPLAY */}
            {simResult && (
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Failure Impact Analysis
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      simResult.isCritical
                        ? "bg-rose-950 text-rose-300 border border-rose-700"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    }`}
                  >
                    {simResult.isCritical ? "CRITICAL CUT DETECTED" : "REDUNDANT PATH INTACT"}
                  </span>
                </div>

                {/* BEFORE vs AFTER (Section 11 requirement) */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">BEFORE FAILURE</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {simResult.beforeComponents} Component{simResult.beforeComponents > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">AFTER FAILURE</span>
                    <span
                      className={`font-bold text-sm ${
                        simResult.afterComponents > simResult.beforeComponents
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {simResult.afterComponents} Component{simResult.afterComponents > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Discrete Math Rationale */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[11px]">
                    Mathematical Reason:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {simResult.mathematicalReason}
                  </p>
                </div>

                {/* Rule-Based Mitigation */}
                <div className="space-y-1 pt-1 border-t border-slate-900">
                  <span className="text-cyan-400 font-bold block text-[11px]">
                    Algorithmic Recommendation:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {simResult.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1 mb-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Academic Note
            </span>
            An articulation vertex v satisfies: component count of G - {`{v}`} strictly exceeds component count of G.
          </div>
        </div>
      </div>
    </div>
  );
}
