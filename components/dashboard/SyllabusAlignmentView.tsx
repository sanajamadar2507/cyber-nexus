"use client";

import React from "react";
import { FileCheck2, BookOpen, CheckCircle, GraduationCap, Award } from "lucide-react";

export const UNITS = [
  {
    unit: "Unit 1",
    title: "Set Theory & Relations",
    topics: "Sets, Subsets, Binary Relations, Equivalence Relations, Matrix Representation of Relations",
    appliedCyberNexus:
      "Network devices modeled as set V. Communication links modeled as relation E ⊆ V × V. Access control lists modeled as relational matrices.",
  },
  {
    unit: "Unit 5",
    title: "Graph Theory",
    topics:
      "Graphs, Subgraphs, Degree of Vertex, Handshaking Theorem, Paths & Cycles, Matrix Representation (Adjacency & Incidence), Connectivity, Cut Vertices & Bridges, Euler & Hamiltonian Graphs",
    appliedCyberNexus:
      "Dynamic Adjacency Matrix A(G), Incidence Matrix M(G), degree calculation, Euler Handshaking verification ∑ deg(v)=2|E|, Tarjan's Articulation Points and Bridges detection, and failure impact simulation.",
  },
  {
    unit: "Unit 6",
    title: "Trees & Algorithms",
    topics:
      "Trees, Rooted Trees, Tree Traversals (Preorder, Inorder, Postorder), Spanning Trees, Minimum Spanning Trees (Prim's & Kruskal's), Shortest Path (Dijkstra's Algorithm)",
    appliedCyberNexus:
      "Transformation of acyclic topologies into rooted trees, general k-ary traversals, dedicated binary tree inorder demonstration, Prim's and Kruskal's step-by-step MST visualizer with DSU cycle rejection, and Dijkstra packet routing simulator.",
  },
];

export const COURSE_OUTCOMES = [
  {
    co: "CO1",
    statement: "Apply discrete mathematical structures (sets, relations, graphs, and trees) to represent computational problems.",
    nexusImplementation:
      "Implemented via dynamic vertex/edge graph models, binary relations, and matrix data structures representing computer network architectures.",
  },
  {
    co: "CO5",
    statement: "Analyze graph models and apply fundamental graph theory concepts and algorithms to solve real-world engineering problems.",
    nexusImplementation:
      "Implemented via automated graph classification, vertex degree distributions, bridge and cut-vertex detection, and deterministic resilience scoring.",
  },
  {
    co: "CO6",
    statement: "Construct and evaluate tree structures, spanning trees, and optimization algorithms for efficient routing and hierarchy modeling.",
    nexusImplementation:
      "Implemented via Dijkstra's shortest path simulator, Prim's and Kruskal's MST generators, and tree hierarchy depth and traversal analyzers.",
  },
];

export default function SyllabusAlignmentView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
            Academic Curriculum
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Second Year Engineering (SE Computer Engineering / IT)
          </span>
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
          DISCRETE MATHEMATICS SYLLABUS & COURSE OUTCOME ALIGNMENT
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1">
          Direct mapping of Cyber Nexus modules to accredited engineering syllabus units (Unit 1, Unit 5, Unit 6) and Course Outcomes (CO1, CO5, CO6).
        </p>
      </div>

      {/* Units Mapping */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Syllabus Units Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UNITS.map((u, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-cyan-400 text-xs">
                    {u.unit}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    Theoretical Unit
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{u.title}</h4>

                <div className="text-xs text-slate-400">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Curriculum Topics:
                  </span>
                  <p className="mt-0.5 leading-relaxed">{u.topics}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                  Cyber Nexus Application:
                </span>
                <p className="leading-snug text-[11px]">{u.appliedCyberNexus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Outcomes Mapping */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          Course Outcomes (CO) Attainment
        </h3>

        <div className="space-y-3">
          {COURSE_OUTCOMES.map((co, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shrink-0">
                  {co.co}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{co.statement}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    <span className="text-cyan-400 font-semibold">Attainment in Project: </span>
                    {co.nexusImplementation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold shrink-0 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Attained</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
