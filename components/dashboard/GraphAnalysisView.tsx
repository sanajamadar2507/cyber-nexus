"use client";

import React, { useState } from "react";
import { GraphData, AnalysisResult } from "@/types/graph";
import { findSimplePaths, detectCycles, checkHamiltonianCycle } from "@/lib/algorithms/paths";
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Route,
  Zap,
  Info,
  GitCommit,
} from "lucide-react";

interface GraphAnalysisViewProps {
  graph: GraphData;
  analysis: AnalysisResult;
}

export default function GraphAnalysisView({ graph, analysis }: GraphAnalysisViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);

  // Path finder states
  const [sourceId, setSourceId] = useState<string>(activeVertices[0]?.id || "");
  const [destId, setDestId] = useState<string>(activeVertices[1]?.id || "");
  const [foundPaths, setFoundPaths] = useState<string[][] | null>(null);

  // Cycle states
  const cycleResult = detectCycles(graph);

  // Hamiltonian cycle state
  const [hamiltonianResult, setHamiltonianResult] = useState<{
    supported: boolean;
    hasCycle: boolean;
    cycle: string[];
    visitedCount: number;
    explanation: string;
  } | null>(null);

  const handleFindPaths = () => {
    if (!sourceId || !destId) return;
    const res = findSimplePaths(graph, sourceId, destId);
    setFoundPaths(res.paths);
  };

  const handleCheckHamiltonian = () => {
    const res = checkHamiltonianCycle(graph);
    setHamiltonianResult(res);
  };

  const vMap = new Map(graph.vertices.map((v) => [v.id, v]));

  return (
    <div className="space-y-6">
      {/* 1. TOP MATHEMATICAL THEOREM: HANDSHAKING THEOREM */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Euler&apos;s Handshaking Theorem Verification
            </h2>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded">
            ∑ deg(v) = 2|E|
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Sum of All Vertex Degrees</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              ∑ deg(v) = {analysis.handshakingSum}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Summed across all {activeVertices.length} active devices.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Twice Number of Edges (2|E|)</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              2 × {graph.edges.filter((e) => !e.disabled).length} = {analysis.handshakingExpected}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Each undirected edge contributes exactly 2 to total degree.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
            <span className="text-xs text-slate-400 block mb-1">Theorem Invariant Status</span>
            <div className="flex items-center gap-2">
              {analysis.handshakingHolds ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300 font-mono">
                    VERIFIED EQUAL (Holds)
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <span className="text-sm font-bold text-rose-300 font-mono">
                    Directed Graph Invariant
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRAPH CLASSIFICATION & INVARIANTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Graph Type Detection */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            Automatic Graph Classification
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Directionality:</span>
              <span className="font-mono font-bold text-cyan-300">
                {graph.isDirected ? "Directed Digraph" : "Undirected Simple Graph"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Complete Graph (K_n):</span>
              <span className="font-mono font-bold text-slate-200">
                {analysis.graphType.isComplete ? "Yes (K_" + activeVertices.length + ")" : "No"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Regular Graph:</span>
              <span className="font-mono font-bold text-slate-200">
                {analysis.graphType.isRegular
                  ? `Yes (${analysis.graphType.regularDegree}-Regular)`
                  : "No (Irregular degrees)"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Tree Structure:</span>
              <span className="font-mono font-bold text-slate-200">
                {analysis.graphType.isTree ? "Yes (|E| = |V|-1 and connected)" : "No (Contains cycles or disjoint)"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Isolated Vertices (deg = 0):</span>
              <span className="font-mono font-bold text-amber-300">
                {analysis.isolatedVertices.length > 0
                  ? analysis.isolatedVertices.map((id) => vMap.get(id)?.label).join(", ")
                  : "None (All nodes connected)"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-300">Pendant Vertices (deg = 1):</span>
              <span className="font-mono font-bold text-cyan-300">
                {analysis.pendantVertices.length > 0
                  ? `${analysis.pendantVertices.length} devices (${analysis.pendantVertices
                      .slice(0, 3)
                      .map((id) => vMap.get(id)?.label)
                      .join(", ")}${analysis.pendantVertices.length > 3 ? "..." : ""})`
                  : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Vertex Degree Table */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            Vertex Degree Distribution Table
          </h3>

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="text-left pb-1.5">Vertex</th>
                  <th className="text-left pb-1.5">Type</th>
                  <th className="text-center pb-1.5">{graph.isDirected ? "In-deg" : "Degree"}</th>
                  {graph.isDirected && <th className="text-center pb-1.5">Out-deg</th>}
                  <th className="text-right pb-1.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeVertices.map((node) => {
                  const deg = analysis.degrees[node.id] || 0;
                  const inDeg = analysis.inDegrees[node.id] || 0;
                  const outDeg = analysis.outDegrees[node.id] || 0;

                  return (
                    <tr key={node.id} className="hover:bg-slate-900/50">
                      <td className="py-1.5 text-cyan-300 font-bold">{node.label}</td>
                      <td className="py-1.5 text-slate-400 uppercase text-[10px]">{node.type}</td>
                      <td className="py-1.5 text-center font-bold text-white">
                        {graph.isDirected ? inDeg : deg}
                      </td>
                      {graph.isDirected && (
                        <td className="py-1.5 text-center font-bold text-white">{outDeg}</td>
                      )}
                      <td className="py-1.5 text-right">
                        {deg === 0 ? (
                          <span className="text-[10px] text-rose-400">Isolated</span>
                        ) : deg === 1 ? (
                          <span className="text-[10px] text-amber-400">Pendant</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Internal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. PATH FINDER & CYCLE DETECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Path Enumerator */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Route className="w-4 h-4 text-cyan-400" />
            Route & Path Exploration
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Source (s)</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white outline-none focus:border-cyan-500"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Destination (t)</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white outline-none focus:border-cyan-500"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFindPaths}
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Enumerate Simple Paths
          </button>

          {foundPaths && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Found {foundPaths.length} Distinct Route(s):
              </span>
              {foundPaths.length === 0 ? (
                <p className="text-xs text-rose-400 font-mono">
                  No path exists between these endpoints.
                </p>
              ) : (
                foundPaths.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900/80 border border-slate-800 font-mono text-xs text-cyan-300"
                  >
                    Route {idx + 1}: {p.map((id) => vMap.get(id)?.label).join(" → ")}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Cycle & Hamiltonian Cycle Verification */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Cycle Detection & Hamiltonian Property
          </h3>

          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Fundamental Cycles Present:</span>
              <span
                className={`font-mono font-bold ${
                  cycleResult.hasCycle ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {cycleResult.hasCycle ? `Yes (${cycleResult.cycleNodes.length} cycles)` : "No (Acyclic Tree)"}
              </span>
            </div>

            {cycleResult.hasCycle && (
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded">
                Example Cycle:{" "}
                <span className="text-cyan-300">
                  {cycleResult.cycleNodes[0]?.map((id) => vMap.get(id)?.label).join(" ↔ ")}
                </span>
              </div>
            )}
          </div>

          {/* Hamiltonian Checker */}
          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Hamiltonian Cycle Checker:</span>
              <button
                onClick={handleCheckHamiltonian}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition text-[11px]"
              >
                Execute Check
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Computational demonstration intended for small graphs (|V| ≤ 10). Finding a Hamiltonian cycle is an NP-Complete problem.
            </p>

            {hamiltonianResult && (
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                <div
                  className={`font-bold ${
                    hamiltonianResult.hasCycle ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {hamiltonianResult.hasCycle ? "✓ Hamiltonian Cycle Exists!" : "✕ No Hamiltonian Cycle Exists"}
                </div>
                <p className="text-slate-400">{hamiltonianResult.explanation}</p>
                {hamiltonianResult.hasCycle && (
                  <div className="text-cyan-300 break-all">
                    Tour: {hamiltonianResult.cycle.map((id) => vMap.get(id)?.label).join(" → ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
