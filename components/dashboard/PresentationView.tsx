"use client";

import React, { useState } from "react";
import { GraphData, AnalysisResult, ResilienceReport } from "@/types/graph";
import { runDijkstraStepByStep } from "@/lib/algorithms/dijkstra";
import { runKruskalStepByStep } from "@/lib/algorithms/mst";
import InteractiveNetworkGraph from "@/components/graph/InteractiveNetworkGraph";
import {
  Tv,
  X,
  SkipForward,
  SkipBack,
  RotateCcw,
  Network,
  Zap,
  Route,
  GitFork,
  ShieldAlert,
  Binary,
} from "lucide-react";

interface PresentationViewProps {
  graph: GraphData;
  analysis: AnalysisResult;
  resilience: ResilienceReport;
  onExit: () => void;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export const PRESENTATION_SLIDES = [
  {
    id: "intro",
    title: "1. Core Mathematical Modeling: G = (V, E)",
    concept: "Network Devices = Vertices V | Connections = Edges E | Link Weights = Latency w(e)",
    description: "The computer network is formally modeled as a weighted graph G = (V, E) where |V| devices communicate over |E| channels.",
    mode: "topology",
  },
  {
    id: "handshaking",
    title: "2. Euler's Handshaking Theorem Invariant",
    concept: "∑ deg(v) = 2|E| (Every link is shared by exactly two endpoints)",
    description: "Sum of degrees across all active vertices equals twice the number of edges, demonstrating algebraic consistency.",
    mode: "handshaking",
  },
  {
    id: "structural_cuts",
    title: "3. Single Points of Failure: Cut Vertices & Bridges",
    concept: "Articulation Vertices: c(G - {v}) > c(G) | Bridges: c(G - {e}) > c(G)",
    description: "Tarjan's algorithm dynamically pinpoints single points of failure. Disabling these components partitions the network.",
    mode: "cuts",
  },
  {
    id: "routing",
    title: "4. Packet Routing Optimization: Dijkstra's Algorithm",
    concept: "Single-Source Shortest Path (OSPF / IS-IS Link-State Metric)",
    description: "Greedy relaxation discovers the minimal-latency route from Gateway to Target Host with O((V+E) log V) complexity.",
    mode: "routing",
  },
  {
    id: "mst",
    title: "5. Minimum Spanning Tree: Loop Prevention (STP)",
    concept: "Cayley's Tree Axiom: |E| = |V| - 1 without Cycles (Kruskal DSU / Prim)",
    description: "Connects all network entities at minimal total link cost while strictly eliminating broadcast loop hazards.",
    mode: "mst",
  },
  {
    id: "resilience",
    title: "6. Fault-Tolerant Cyber Resilience Evaluation",
    concept: "Demonstration Resilience Score & Algorithmic Hardening",
    description: "Quantifies structural survivability from vertex connectivity κ(G) and prescribes redundant links to elevate tolerance.",
    mode: "resilience",
  },
];

export default function PresentationView({
  graph,
  analysis,
  resilience,
  onExit,
  onUpdateVertexPosition,
}: PresentationViewProps) {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const currentSlide = PRESENTATION_SLIDES[slideIndex];

  const activeVertices = graph.vertices.filter((v) => !v.disabled);

  // Computed data for specific slides
  const dijkstraRes = React.useMemo(() => {
    if (activeVertices.length < 2) return null;
    return runDijkstraStepByStep(graph, activeVertices[0].id, activeVertices[activeVertices.length - 1].id);
  }, [graph, activeVertices]);

  const kruskalRes = React.useMemo(() => {
    return runKruskalStepByStep(graph);
  }, [graph]);

  return (
    <div className="fixed inset-0 z-50 bg-cyber-950 text-white flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Tv className="w-4 h-4" /> Presentation & Viva Mode
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-mono">
              CYBER NEXUS
            </h1>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Discrete Mathematics Course Project • Second Year Engineering
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm font-mono text-slate-400">
            Slide <span className="text-cyan-400 font-bold text-base">{slideIndex + 1}</span> / {PRESENTATION_SLIDES.length}
          </div>
          <button
            onClick={onExit}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Exit Presentation Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 py-4 overflow-hidden">
        {/* Enlarged Graph Canvas (3 Cols) */}
        <div className="lg:col-span-3 h-full rounded-2xl border border-cyan-500/30 overflow-hidden relative shadow-2xl">
          <InteractiveNetworkGraph
            vertices={graph.vertices}
            edges={graph.edges}
            isDirected={currentSlide.mode === "routing" ? graph.isDirected : false}
            presentationMode={true}
            cutVertices={currentSlide.mode === "cuts" ? analysis.cutVertices : []}
            bridgeEdges={currentSlide.mode === "cuts" ? analysis.bridges : []}
            highlightedVertices={
              currentSlide.mode === "routing" ? dijkstraRes?.shortestPath || [] : []
            }
            highlightedEdges={
              currentSlide.mode === "routing" ? dijkstraRes?.pathEdges || [] : []
            }
            mstEdges={currentSlide.mode === "mst" ? kruskalRes.mstEdges : []}
            onUpdateVertexPosition={onUpdateVertexPosition}
          />
        </div>

        {/* Presenter Notes & Mathematical Invariants Card (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              TOPIC {slideIndex + 1} OF 6
            </span>

            <h2 className="text-lg md:text-xl font-black text-white leading-tight">
              {currentSlide.title}
            </h2>

            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-200">
              <span className="text-[10px] text-cyan-400 uppercase block mb-1">
                Mathematical Principle:
              </span>
              {currentSlide.concept}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {currentSlide.description}
            </p>

            {/* Dynamic context data based on slide */}
            {currentSlide.mode === "handshaking" && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                <div>∑ deg(v) = <span className="text-cyan-400 font-bold">{analysis.handshakingSum}</span></div>
                <div>2|E| = <span className="text-cyan-400 font-bold">{analysis.handshakingExpected}</span></div>
                <div className="text-emerald-400 font-bold pt-1">Theorem holds: ∑ deg(v) = 2|E|</div>
              </div>
            )}

            {currentSlide.mode === "cuts" && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                <div>Articulation Vertices: <span className="text-amber-400 font-bold">{analysis.cutVertices.length}</span></div>
                <div>Bridge Edges: <span className="text-rose-400 font-bold">{analysis.bridges.length}</span></div>
                <div className="text-slate-400 text-[11px] pt-1">Targeting these nodes splits the graph immediately.</div>
              </div>
            )}

            {currentSlide.mode === "routing" && dijkstraRes && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                <div>Shortest Route: <span className="text-emerald-400 font-bold">{dijkstraRes.shortestPath.length} hops</span></div>
                <div>Accumulated Cost: <span className="text-emerald-400 font-bold">{dijkstraRes.totalCost} ms</span></div>
              </div>
            )}

            {currentSlide.mode === "mst" && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                <div>MST Total Cost: <span className="text-emerald-400 font-bold">{kruskalRes.mstCost}</span></div>
                <div>MST Edges: <span className="text-cyan-400 font-bold">{kruskalRes.edgeCount} / {activeVertices.length - 1}</span></div>
              </div>
            )}

            {currentSlide.mode === "resilience" && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                <div>Resilience Score: <span className="text-emerald-400 font-bold">{resilience.score} / 100</span></div>
                <div>Risk Rating: <span className="text-cyan-400 font-bold">{resilience.riskLevel}</span></div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                disabled={slideIndex === 0}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <SkipBack className="w-4 h-4" /> Previous Slide
              </button>

              <button
                onClick={() => setSlideIndex((i) => Math.min(PRESENTATION_SLIDES.length - 1, i + 1))}
                disabled={slideIndex === PRESENTATION_SLIDES.length - 1}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
              >
                <span>Next Slide</span> <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onExit}
              className="w-full py-2 text-xs text-slate-400 hover:text-white font-mono text-center"
            >
              Exit Presentation Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
