"use client";

import React, { useState, useEffect } from "react";
import { GraphData, AlgorithmStep } from "@/types/graph";
import { runDijkstraStepByStep, DijkstraSimulationResult } from "@/lib/algorithms/dijkstra";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  Route,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

interface RoutingLabViewProps {
  graph: GraphData;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export default function RoutingLabView({
  graph,
  onUpdateVertexPosition,
}: RoutingLabViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const vMap = new Map(graph.vertices.map((v) => [v.id, v]));

  const [sourceId, setSourceId] = useState<string>(activeVertices[0]?.id || "");
  const [destId, setDestId] = useState<string>(activeVertices[activeVertices.length - 1]?.id || "");

  const [simResult, setSimResult] = useState<DijkstraSimulationResult | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-run when source/dest change
  const handleRunDijkstra = () => {
    if (!sourceId || !destId) return;
    const res = runDijkstraStepByStep(graph, sourceId, destId);
    setSimResult(res);
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (activeVertices.length >= 2) {
      const s = activeVertices[0].id;
      const t = activeVertices[activeVertices.length - 1].id;
      setSourceId(s);
      setDestId(t);
      const res = runDijkstraStepByStep(graph, s, t);
      setSimResult(res);
      setStepIndex(0);
    }
  }, [graph]);

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && simResult) {
      timer = setInterval(() => {
        setStepIndex((curr) => {
          if (curr < simResult.steps.length - 1) {
            return curr + 1;
          } else {
            setIsPlaying(false);
            return curr;
          }
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, simResult]);

  const currentStep: AlgorithmStep | undefined = simResult?.steps[stepIndex];

  return (
    <div className="space-y-6">
      {/* Header and Endpoint Selectors */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
              Optimal Packet Routing
            </span>
            <span className="text-xs text-slate-400 font-mono">Dijkstra&apos;s Greedy Algorithm</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            ROUTING LAB — INTERACTIVE SHORTEST PATH SIMULATOR
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Simulates dynamic single-source shortest path packet routing. Step through edge relaxation, min-heap extraction, and shortest route determination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Source (s)</span>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="bg-transparent text-white font-mono font-bold outline-none"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[1px] h-6 bg-slate-800" />

            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Dest (t)</span>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="bg-transparent text-white font-mono font-bold outline-none"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleRunDijkstra}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
          >
            <Play className="w-3.5 h-3.5" /> Run Dijkstra
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Step Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Graph Canvas & Animation Stepper Bar */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          {/* Playback Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                disabled={stepIndex === 0}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 transition"
                title="Previous Step"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={() =>
                  setStepIndex((s) => (simResult ? Math.min(simResult.steps.length - 1, s + 1) : s))
                }
                disabled={!simResult || stepIndex === simResult.steps.length - 1}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 transition"
                title="Next Step"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                title="Reset to Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Step{" "}
              <span className="text-cyan-300 font-bold">
                {stepIndex + 1}
              </span>{" "}
              of {simResult?.steps.length || 1}
            </div>
          </div>

          {/* Current Step Description Card */}
          {currentStep && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-cyan-300 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {currentStep.title}
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* Interactive Graph Canvas */}
          <div className="h-[430px] w-full">
            <InteractiveNetworkGraph
              vertices={graph.vertices}
              edges={graph.edges}
              isDirected={graph.isDirected}
              highlightedVertices={
                stepIndex === (simResult?.steps.length || 0) - 1
                  ? simResult?.shortestPath || []
                  : currentStep?.activeVertices || []
              }
              highlightedEdges={
                stepIndex === (simResult?.steps.length || 0) - 1
                  ? simResult?.pathEdges || []
                  : currentStep?.activeEdges || []
              }
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right 1 Col: Tentative Distance Table & Complexity Info */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Route className="w-4 h-4 text-cyan-400" />
                Dijkstra Distance Table
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Tentative dist[v]</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="text-left pb-1.5">Vertex</th>
                    <th className="text-center pb-1.5">Dist</th>
                    <th className="text-center pb-1.5">Prev</th>
                    <th className="text-right pb-1.5">Finalized</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentStep?.tableState &&
                    Object.entries(currentStep.tableState).map(([nodeId, state]) => {
                      const v = vMap.get(nodeId);
                      return (
                        <tr key={nodeId} className="hover:bg-slate-900/50">
                          <td className="py-1.5 text-cyan-300 font-bold">{v?.label || nodeId}</td>
                          <td className="py-1.5 text-center font-bold text-white">
                            {state.dist}
                          </td>
                          <td className="py-1.5 text-center text-slate-400">
                            {state.prev || "—"}
                          </td>
                          <td className="py-1.5 text-right">
                            {state.finalized ? (
                              <span className="text-[10px] text-emerald-400 font-bold">YES</span>
                            ) : (
                              <span className="text-[10px] text-slate-500">NO</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Final Path Summary Card */}
            {simResult && simResult.isReachable && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Shortest Route Computed
                </span>
                <div className="font-mono text-white text-sm">
                  {simResult.shortestPath.map((id) => vMap.get(id)?.label).join(" → ")}
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
                  <span>Total Accumulated Metric:</span>
                  <span className="text-emerald-300 font-bold text-sm">
                    {simResult.totalCost} ms
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Complexity Card */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Algorithmic Complexity & OSPF
            </span>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>
                Min-Heap Priority Queue:{" "}
                <span className="font-mono text-cyan-300 font-bold">O((|V| + |E|) log |V|)</span>
              </div>
              <div>
                Dense Matrix: <span className="font-mono text-cyan-300 font-bold">O(|V|²)</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight pt-1">
                OSPF (Open Shortest Path First) and IS-IS distribute link metrics via LSAs and execute Dijkstra locally inside each router to populate the IP Routing Table (FIB).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
