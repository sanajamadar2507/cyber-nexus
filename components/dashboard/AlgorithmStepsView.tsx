"use client";

import React, { useState } from "react";
import { GraphData, AlgorithmStep } from "@/types/graph";
import { runDijkstraStepByStep } from "@/lib/algorithms/dijkstra";
import { runPrimStepByStep, runKruskalStepByStep } from "@/lib/algorithms/mst";
import { runBfsStepByStep, runDfsStepByStep } from "@/lib/algorithms/traversals";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  ListOrdered,
  Play,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Clock,
  Network,
  HelpCircle,
} from "lucide-react";

interface AlgorithmStepsViewProps {
  graph: GraphData;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export type SupportedAlgorithm = "dijkstra" | "prim" | "kruskal" | "bfs" | "dfs";

export const ALGO_METADATA: Record<
  SupportedAlgorithm,
  { name: string; complexity: string; interpretation: string; unit: string }
> = {
  dijkstra: {
    name: "Dijkstra's Shortest Path",
    complexity: "O((V + E) log V)",
    interpretation: "Determines minimum-latency OSPF router path from source to target host.",
    unit: "Unit 5 / Unit 6: Shortest Path in Graphs",
  },
  prim: {
    name: "Prim's Minimum Spanning Tree",
    complexity: "O(E log V)",
    interpretation: "Grows a loop-free STP switching topology outward from a designated Root Bridge.",
    unit: "Unit 6: Spanning Trees & Greedy Cut Algorithms",
  },
  kruskal: {
    name: "Kruskal's Minimum Spanning Tree",
    complexity: "O(E log E)",
    interpretation: "Synthesizes minimal-cost infrastructure by sorting edges and rejecting cycles with Disjoint Sets.",
    unit: "Unit 6: Spanning Trees & Disjoint Set Union",
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    complexity: "O(V + E)",
    interpretation: "Broadcast storm discovery, ARP request propagation, and shortest hop-count finding.",
    unit: "Unit 5: Graph Exploration & Level-Order Traversal",
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    complexity: "O(V + E)",
    interpretation: "Back-edge detection, cycle identification, topological sorting, and deep routing path exploration.",
    unit: "Unit 5: Graph Exploration & Cycle Detection",
  },
};

export default function AlgorithmStepsView({
  graph,
  onUpdateVertexPosition,
}: AlgorithmStepsViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const [selectedAlgo, setSelectedAlgo] = useState<SupportedAlgorithm>("dijkstra");
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Run the selected algorithm to get steps
  const simData = React.useMemo(() => {
    if (activeVertices.length === 0) return { steps: [], finalSummary: "" };

    const s = activeVertices[0]?.id;
    const t = activeVertices[activeVertices.length - 1]?.id;

    if (selectedAlgo === "dijkstra") {
      const res = runDijkstraStepByStep(graph, s, t);
      return {
        steps: res.steps,
        finalSummary: `Shortest path cost: ${res.totalCost}`,
        highlightedNodes: res.shortestPath,
        highlightedEdges: res.pathEdges,
      };
    } else if (selectedAlgo === "prim") {
      const res = runPrimStepByStep(graph, s);
      return {
        steps: res.steps,
        finalSummary: `MST Cost: ${res.mstCost}, Edges: ${res.edgeCount}`,
        mstEdges: res.mstEdges,
      };
    } else if (selectedAlgo === "kruskal") {
      const res = runKruskalStepByStep(graph);
      return {
        steps: res.steps,
        finalSummary: `MST Cost: ${res.mstCost}, Edges: ${res.edgeCount}`,
        mstEdges: res.mstEdges,
      };
    } else if (selectedAlgo === "bfs") {
      const res = runBfsStepByStep(graph, s);
      return {
        steps: res.steps,
        finalSummary: `Visit Order: ${res.visitOrder.join(" → ")}`,
        highlightedEdges: res.visitedEdgeIds,
      };
    } else {
      const res = runDfsStepByStep(graph, s);
      return {
        steps: res.steps,
        finalSummary: `DFS Order: ${res.visitOrder.join(" → ")}`,
        highlightedEdges: res.visitedEdgeIds,
      };
    }
  }, [graph, selectedAlgo, activeVertices]);

  const steps = simData.steps;
  const currentStep: AlgorithmStep | undefined = steps[stepIndex];
  const meta = ALGO_METADATA[selectedAlgo];

  const handleSelectAlgo = (algo: SupportedAlgorithm) => {
    setSelectedAlgo(algo);
    setStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header and Algorithm Switcher */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
              Interactive Algorithm Explainer
            </span>
            <span className="text-xs text-slate-400 font-mono">{meta.unit}</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            ALGORITHM STEPS & VIVA PRESENTATION TRAINER
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Interactive step-by-step demonstrations for Discrete Mathematics project viva and classroom presentations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          {(["dijkstra", "prim", "kruskal", "bfs", "dfs"] as SupportedAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => handleSelectAlgo(algo)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition uppercase font-mono ${
                selectedAlgo === algo
                  ? "bg-cyan-600 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step Controls & Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          {/* Stepper Toolbar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                disabled={stepIndex === 0}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 text-xs font-bold flex items-center gap-1 transition"
              >
                <SkipBack className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                onClick={() => setStepIndex((s) => Math.min(steps.length - 1, s + 1))}
                disabled={stepIndex === steps.length - 1}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <span>Next Step</span> <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setStepIndex(0)}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Step <span className="text-cyan-300 font-bold">{stepIndex + 1}</span> of{" "}
              {steps.length || 1}
            </div>
          </div>

          {/* Current Step Display Card */}
          {currentStep && (
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-xs space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {currentStep.title}
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* Graph Canvas */}
          <div className="h-[440px] w-full">
            <InteractiveNetworkGraph
              vertices={graph.vertices}
              edges={graph.edges}
              isDirected={selectedAlgo === "dijkstra" ? graph.isDirected : false}
              highlightedVertices={currentStep?.activeVertices || []}
              highlightedEdges={
                selectedAlgo === "prim" || selectedAlgo === "kruskal"
                  ? currentStep?.mstEdges || []
                  : currentStep?.activeEdges || []
              }
              rejectedEdges={currentStep?.rejectedEdges || []}
              activeStepEdge={currentStep?.currentEdge}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right 1 Col: Algorithm Details & Viva Prep Card */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                {meta.name}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">{meta.unit}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Time Complexity
                </span>
                <span className="font-mono text-cyan-300 font-bold text-sm">
                  {meta.complexity}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Practical Network Interpretation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {meta.interpretation}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Overall Execution Result
                </span>
                <div className="font-mono text-emerald-400 text-xs">
                  {simData.finalSummary}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-slate-300">
            <span className="font-bold text-cyan-300 flex items-center gap-1 mb-1">
              <HelpCircle className="w-3.5 h-3.5" /> Presentation Tip:
            </span>
            Use the &quot;Next Step&quot; button while narrating each invariant update to your course evaluators during your viva exam.
          </div>
        </div>
      </div>
    </div>
  );
}
