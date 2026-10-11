"use client";

import React, { useState } from "react";
import { GraphData } from "@/types/graph";
import {
  getAdjacencyMatrix,
  getIncidenceMatrix,
  getAdjacencyList,
} from "@/lib/algorithms/graph-basics";
import { Grid, Layers, ListOrdered, Info, Check, ArrowRight } from "lucide-react";

interface GraphRepresentationViewProps {
  graph: GraphData;
}

export default function GraphRepresentationView({ graph }: GraphRepresentationViewProps) {
  const [activeTab, setActiveTab] = useState<"adjMatrix" | "incMatrix" | "adjList">("adjMatrix");
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const adjMatrixData = getAdjacencyMatrix(graph);
  const incMatrixData = getIncidenceMatrix(graph);
  const adjListData = getAdjacencyList(graph);

  return (
    <div className="space-y-6">
      {/* Header with Representation Tabs */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            Discrete Graph Mathematical Representations
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically computed data structures representing network topology in memory and algebraic graph theory.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("adjMatrix")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "adjMatrix"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Adjacency Matrix A(G)
          </button>
          <button
            onClick={() => setActiveTab("incMatrix")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "incMatrix"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Incidence Matrix M(G)
          </button>
          <button
            onClick={() => setActiveTab("adjList")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "adjList"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Adjacency List Adj[v]
          </button>
        </div>
      </div>

      {/* 1. ADJACENCY MATRIX PANEL */}
      {activeTab === "adjMatrix" && (
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                Adjacency Matrix A(G) — Size: {adjMatrixData.labels.length} × {adjMatrixData.labels.length}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                An adjacency matrix represents whether pairs of vertices are connected. Cell A[i][j] specifies connection weight w(v_i, v_j).
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Space Complexity: <span className="text-cyan-400 font-bold">O(|V|²)</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <table className="border-collapse text-xs font-mono">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-800 bg-slate-950 text-slate-500 font-bold">
                    v \ v
                  </th>
                  {adjMatrixData.labels.map((label, idx) => (
                    <th
                      key={idx}
                      className={`p-2 border border-slate-800 bg-slate-900/80 text-cyan-300 font-bold max-w-[80px] truncate ${
                        hoveredCell?.col === idx ? "bg-cyan-950/80 text-cyan-200" : ""
                      }`}
                      title={label}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjMatrixData.matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td
                      className={`p-2 border border-slate-800 bg-slate-900/80 text-cyan-300 font-bold max-w-[100px] truncate ${
                        hoveredCell?.row === rIdx ? "bg-cyan-950/80 text-cyan-200" : ""
                      }`}
                    >
                      {adjMatrixData.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isHovered = hoveredCell?.row === rIdx && hoveredCell?.col === cIdx;
                      const hasEdge = val > 0;
                      return (
                        <td
                          key={cIdx}
                          onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`p-2 border border-slate-800/80 text-center font-bold matrix-cell cursor-pointer ${
                            rIdx === cIdx
                              ? "bg-slate-950/80 text-slate-600"
                              : hasEdge
                              ? "bg-cyan-950/40 text-cyan-300"
                              : "text-slate-600"
                          } ${isHovered ? "ring-2 ring-cyan-400 bg-cyan-900/60" : ""}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Mathematical Invariant:
            </div>
            <p>
              In an undirected graph, the adjacency matrix is strictly symmetric (A = Aᵀ). The sum of entries along row i corresponds exactly to vertex degree deg(v_i) for unweighted graphs.
            </p>
          </div>
        </div>
      )}

      {/* 2. INCIDENCE MATRIX PANEL */}
      {activeTab === "incMatrix" && (
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                Incidence Matrix M(G) — Size: {incMatrixData.vertexIds.length} Vertices × {incMatrixData.edgeIds.length} Edges
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                An incidence matrix represents the relationship between vertices and edges.
                {graph.isDirected
                  ? " In directed graphs: -1 indicates edge departure (outflow), +1 indicates edge arrival (inflow)."
                  : " For undirected graphs: M[v][e] = 1 if vertex v is incident to edge e."}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Space Complexity: <span className="text-cyan-400 font-bold">O(|V| × |E|)</span>
            </div>
          </div>

          {incMatrixData.edgeIds.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              Graph has zero active edges. Connect devices in Network Lab to compute Incidence Matrix.
            </div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <table className="border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 border border-slate-800 bg-slate-950 text-slate-500 font-bold">
                      Vertex \ Edge
                    </th>
                    {incMatrixData.edgeIds.map((edgeId, idx) => {
                      const edge = graph.edges.find((e) => e.id === edgeId);
                      const uLabel = graph.vertices.find((v) => v.id === edge?.source)?.label;
                      const vLabel = graph.vertices.find((v) => v.id === edge?.target)?.label;
                      return (
                        <th
                          key={idx}
                          className="p-2 border border-slate-800 bg-slate-900/80 text-cyan-300 font-bold text-center"
                          title={`e${idx + 1}: ${uLabel} ↔ ${vLabel}`}
                        >
                          e{idx + 1}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {incMatrixData.matrix.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 border border-slate-800 bg-slate-900/80 text-cyan-300 font-bold max-w-[120px] truncate">
                        {graph.vertices.find((v) => v.id === incMatrixData.vertexIds[rIdx])?.label}
                      </td>
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-2 border border-slate-800/80 text-center font-bold ${
                            val === 1
                              ? "bg-emerald-950/40 text-emerald-300"
                              : val === -1
                              ? "bg-rose-950/40 text-rose-300"
                              : "text-slate-600"
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Mathematical Property:
            </div>
            <p>
              In an undirected graph, every column of the incidence matrix contains exactly two 1&apos;s (the endpoints of that edge), verifying that every simple link connects exactly two devices.
            </p>
          </div>
        </div>
      )}

      {/* 3. ADJACENCY LIST PANEL */}
      {activeTab === "adjList" && (
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                Adjacency List Adj[v] — Linked Forward-Star Format
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The standard dynamic data structure utilized by routing protocols (OSPF link-state database) and graph traversal algorithms (BFS, DFS, Dijkstra).
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Optimal Space: <span className="text-emerald-400 font-bold">O(|V| + |E|)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adjListData.map((entry) => (
              <div
                key={entry.vertexId}
                className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="font-bold font-mono text-cyan-300 text-xs">
                      {entry.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Degree: {entry.neighbors.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {entry.neighbors.length === 0 ? (
                    <span className="text-slate-600 font-mono text-xs italic">
                      [Isolated / ∅]
                    </span>
                  ) : (
                    entry.neighbors.map((n, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/50 text-cyan-200"
                      >
                        <span>{n.targetLabel}</span>
                        <span className="text-[10px] text-cyan-400 font-bold">
                          (w={n.weight})
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
