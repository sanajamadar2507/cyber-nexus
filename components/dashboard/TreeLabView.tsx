"use client";

import React, { useState } from "react";
import { GraphData } from "@/types/graph";
import { buildRootedTree, getSampleBinaryTree, TreeNode } from "@/lib/algorithms/trees";
import {
  Binary,
  Layers,
  ArrowRight,
  GitBranch,
  Info,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface TreeLabViewProps {
  graph: GraphData;
}

export default function TreeLabView({ graph }: TreeLabViewProps) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const [selectedRootId, setSelectedRootId] = useState<string>(activeVertices[0]?.id || "");

  const treeResult = buildRootedTree(graph, selectedRootId);
  const binaryTreeDemo = getSampleBinaryTree();

  const [activeTab, setActiveTab] = useState<"general" | "binary">("general");

  return (
    <div className="space-y-6">
      {/* Header and Mode Selector */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
              Discrete Trees & Hierarchies
            </span>
            <span className="text-xs text-slate-400 font-mono">Unit 6 — Trees & Traversals</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            TREE LAB — ROOTED HIERARCHY & TRAVERSALS
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Transform loop-free network topologies into mathematical rooted trees. Inspect parent-child relationships, tree depth, leaf nodes, and traversal orders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "general"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Network Rooted Tree (k-ary)
          </button>
          <button
            onClick={() => setActiveTab("binary")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "binary"
                ? "bg-cyan-600 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Binary Tree & Inorder Demo
          </button>
        </div>
      </div>

      {activeTab === "general" && treeResult && (
        <div className="space-y-6">
          {/* Root Selector and Tree Invariant Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tree Root Vertex</span>
              <select
                value={selectedRootId}
                onChange={(e) => setSelectedRootId(e.target.value)}
                className="mt-2 w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold font-mono outline-none"
              >
                {activeVertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Tree Height / Depth
              </span>
              <div className="text-2xl font-extrabold font-mono text-white">
                {treeResult.maxDepth}
              </div>
              <span className="text-[10px] text-slate-500">Longest root-to-leaf path</span>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Leaf Nodes (deg = 1)
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {treeResult.leafNodes.length}
              </div>
              <span className="text-[10px] text-slate-500">Terminal end-hosts</span>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Internal Branches
              </span>
              <div className="text-2xl font-extrabold font-mono text-cyan-400">
                {treeResult.internalNodes.length}
              </div>
              <span className="text-[10px] text-slate-500">Forwarding switches/routers</span>
            </div>
          </div>

          {/* Tree Traversals and Parent-Child Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Mathematical Traversals */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                Rooted Tree Traversals (General k-ary)
              </h3>

              <div className="space-y-3 text-xs">
                {/* Preorder */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 font-mono">Preorder Traversal:</span>
                    <span className="text-[10px] font-mono text-slate-500">Root → Children</span>
                  </div>
                  <div className="font-mono text-slate-200 text-xs bg-slate-950 p-2 rounded break-words">
                    {treeResult.preorder.join(" → ")}
                  </div>
                </div>

                {/* Postorder */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 font-mono">Postorder Traversal:</span>
                    <span className="text-[10px] font-mono text-slate-500">Children → Root</span>
                  </div>
                  <div className="font-mono text-slate-200 text-xs bg-slate-950 p-2 rounded break-words">
                    {treeResult.postorder.join(" → ")}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Discrete Mathematics Note:
                </div>
                <p>
                  Inorder traversal is strictly defined for Binary Trees (where Left and Right child orderings are distinguished). For general k-ary network trees, Preorder and Postorder are the canonical deterministic orderings.
                </p>
              </div>
            </div>

            {/* Right: Parent-Child Hierarchy Relationships */}
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Parent → Child Relationship Mapping
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {treeResult.parentChildMap.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-cyan-300 font-bold">{rel.parent} (Parent)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-emerald-300">{rel.child} (Child)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED BINARY TREE & INORDER DEMO */}
      {activeTab === "binary" && (
        <div className="glass-panel p-6 rounded-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              Dedicated Binary Tree Traversal Laboratory
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrates Inorder traversal on a canonical 2-ary binary network routing hierarchy, honoring discrete mathematical rigor.
            </p>
          </div>

          {/* ASCII / Visual Binary Tree Structure */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-xs text-slate-300 space-y-2">
            <div className="text-cyan-300 font-bold text-sm">[Root-GW]</div>
            <div className="text-slate-600">/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \</div>
            <div className="flex justify-center gap-24">
              <span className="text-emerald-400">[Spine-West]</span>
              <span className="text-emerald-400">[Spine-East]</span>
            </div>
            <div className="text-slate-600">/ &nbsp;&nbsp;&nbsp;&nbsp; \ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; \</div>
            <div className="flex justify-center gap-8">
              <span className="text-blue-400">[Leaf-A]</span>
              <span className="text-blue-400">[Leaf-B]</span>
              <span className="text-purple-400">[Leaf-C]</span>
              <span className="text-purple-400">[Leaf-D]</span>
            </div>
          </div>

          {/* All 3 Traversals Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-cyan-300 font-mono block">
                Preorder (Root, Left, Right)
              </span>
              <div className="font-mono text-white text-xs bg-slate-950 p-2 rounded">
                {binaryTreeDemo.preorder.join(" → ")}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-cyan-500/40 space-y-2 text-xs">
              <span className="font-bold text-emerald-300 font-mono block">
                Inorder (Left, Root, Right)
              </span>
              <div className="font-mono text-white text-xs bg-slate-950 p-2 rounded">
                {binaryTreeDemo.inorder.join(" → ")}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-purple-300 font-mono block">
                Postorder (Left, Right, Root)
              </span>
              <div className="font-mono text-white text-xs bg-slate-950 p-2 rounded">
                {binaryTreeDemo.postorder.join(" → ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
