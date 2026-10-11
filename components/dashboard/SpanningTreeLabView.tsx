"use client";

import React, { useState, useEffect } from "react";
import { GraphData, AlgorithmStep } from "@/types/graph";
import {
  runKruskalStepByStep,
  runPrimStepByStep,
  MstSimulationResult,
} from "@/lib/algorithms/mst";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  GitFork,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
} from "lucide-react";

interface SpanningTreeLabViewProps {
  graph: GraphData;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export default function SpanningTreeLabView({
  graph,
  onUpdateVertexPosition,
}: SpanningTreeLabViewProps) {
  const [selectedAlgo, setSelectedAlgo] = useState<"kruskal" | "prim">("kruskal");
  const [simResult, setSimResult] = useState<MstSimulationResult | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const vMap = new Map(graph.vertices.map((v) => [v.id, v]));

  const runSimulation = (algo: "kruskal" | "prim") => {
    setSelectedAlgo(algo);
    const res = algo === "kruskal" ? runKruskalStepByStep(graph) : runPrimStepByStep(graph);
    setSimResult(res);
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    runSimulation(selectedAlgo);
  }, [graph, selectedAlgo]);

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
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, simResult]);

  const currentStep: AlgorithmStep | undefined = simResult?.steps[stepIndex];

  return (
    <div className="space-y-6">
      {/* Header and Algorithm Switcher */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
              Loop-Free Subgraph
            </span>
            <span className="text-xs text-slate-400 font-mono">Cayley&apos;s Theorem V^(V-2) Spanning Trees</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            MINIMUM SPANNING TREE (MST) LAB
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Constructs a minimal cost connected subgraph spanning all devices with zero loops (|E| = |V| - 1). Foundation of IEEE 802.1D Spanning Tree Protocol (STP).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => runSimulation("kruskal")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedAlgo === "kruskal"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kruskal&apos;s Algorithm (Edge Greedy)
          </button>
          <button
            onClick={() => runSimulation("prim")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedAlgo === "prim"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Prim&apos;s Algorithm (Vertex Cut)
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Step Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Graph Canvas & Animation Stepper Bar */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          {/* Controls Bar */}
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
              Step <span className="text-cyan-300 font-bold">{stepIndex + 1}</span> of{" "}
              {simResult?.steps.length || 1}
            </div>
          </div>

          {/* Current Step Description Card */}
          {currentStep && (
            <div
              className={`p-3 rounded-lg border text-xs ${
                currentStep.actionType === "reject"
                  ? "bg-rose-950/40 border-rose-500/40"
                  : currentStep.actionType === "accept"
                  ? "bg-emerald-950/40 border-emerald-500/40"
                  : "bg-slate-900/90 border-cyan-500/30"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold mb-0.5 ${
                  currentStep.actionType === "reject"
                    ? "text-rose-400"
                    : currentStep.actionType === "accept"
                    ? "text-emerald-400"
                    : "text-cyan-300"
                }`}
              >
                {currentStep.actionType === "reject" ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {currentStep.title}
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* Graph Canvas */}
          <div className="h-[430px] w-full">
            <InteractiveNetworkGraph
              vertices={graph.vertices}
              edges={graph.edges}
              isDirected={false}
              mstEdges={currentStep?.mstEdges || []}
              rejectedEdges={currentStep?.rejectedEdges || []}
              activeStepEdge={currentStep?.currentEdge}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right 1 Col: Kruskal Sorted Edges Queue / DSU Sets / Prim State */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <GitFork className="w-4 h-4 text-emerald-400" />
                {selectedAlgo === "kruskal" ? "Kruskal Sorted Edges" : "Prim Cut Frontier"}
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Cost: {currentStep?.costSoFar || 0}
              </span>
            </div>

            {selectedAlgo === "kruskal" && simResult?.sortedEdges && (
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {simResult.sortedEdges.map((e, idx) => {
                  const uLabel = vMap.get(e.source)?.label || e.source;
                  const vLabel = vMap.get(e.target)?.label || e.target;
                  const inMst = currentStep?.mstEdges?.includes(e.id);
                  const isRejected = currentStep?.rejectedEdges?.includes(e.id);
                  const isCurrent = currentStep?.currentEdge === e.id;

                  return (
                    <div
                      key={e.id}
                      className={`p-2 rounded font-mono text-xs flex items-center justify-between border transition ${
                        isCurrent
                          ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400"
                          : inMst
                          ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300"
                          : isRejected
                          ? "bg-rose-950/30 border-rose-800/40 text-rose-400 line-through opacity-60"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span>
                        e{idx + 1}: {uLabel} ↔ {vLabel}
                      </span>
                      <span className="font-bold">w = {e.weight}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MST Summary Card */}
            {simResult && (
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Minimum Spanning Tree Metrics
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Total Cost</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {simResult.mstCost}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Selected Edges</span>
                    <span className="text-cyan-400 font-bold text-base">
                      {simResult.edgeCount} / {activeVertices.length - 1}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Tree Rule Card */}
          <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1 text-xs text-slate-300">
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Discrete Tree Axiom
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              &quot;A spanning tree connects all vertices without cycles.&quot; In an n-vertex graph, every spanning tree contains exactly n - 1 edges and is minimally connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
