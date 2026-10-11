"use client";

import React, { useState } from "react";
import { GraphData, Vertex, Edge, DeviceType, Scenario } from "@/types/graph";
import { ALL_SCENARIOS } from "@/lib/sample-data";
import InteractiveNetworkGraph, { DEVICE_ICONS } from "@/components/graph/InteractiveNetworkGraph";
import {
  Plus,
  Trash2,
  FolderOpen,
  Download,
  Upload,
  Settings2,
  Network,
  Share2,
  Sliders,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface NetworkLabViewProps {
  graph: GraphData;
  onUpdateGraph: (updated: GraphData) => void;
  onLoadScenario: (scenario: Scenario) => void;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
}

export default function NetworkLabView({
  graph,
  onUpdateGraph,
  onLoadScenario,
  onUpdateVertexPosition,
}: NetworkLabViewProps) {
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // New Node Form State
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState<DeviceType>("router");
  const [newNodeIp, setNewNodeIp] = useState("10.0.0.100");

  // New Edge Form State
  const [newEdgeSource, setNewEdgeSource] = useState("");
  const [newEdgeTarget, setNewEdgeTarget] = useState("");
  const [newEdgeWeight, setNewEdgeWeight] = useState<number>(5);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearErrors = () => setErrorMessage(null);

  // Add Vertex
  const handleAddVertex = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const label = newNodeLabel.trim() || `Node-${graph.vertices.length + 1}`;
    const id = `v_${Date.now()}`;

    // Place new node in a visible area
    const newVertex: Vertex = {
      id,
      label,
      type: newNodeType,
      ip: newNodeIp,
      x: 350 + (Math.random() * 120 - 60),
      y: 220 + (Math.random() * 120 - 60),
      status: "normal",
    };

    onUpdateGraph({
      ...graph,
      vertices: [...graph.vertices, newVertex],
    });

    setNewNodeLabel("");
  };

  // Remove Selected Vertex
  const handleRemoveVertex = (id: string) => {
    clearErrors();
    onUpdateGraph({
      ...graph,
      vertices: graph.vertices.filter((v) => v.id !== id),
      edges: graph.edges.filter((e) => e.source !== id && e.target !== id),
    });
    if (selectedVertex?.id === id) setSelectedVertex(null);
  };

  // Add Edge
  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!newEdgeSource || !newEdgeTarget) {
      setErrorMessage("Please select both source and target vertices.");
      return;
    }

    if (newEdgeSource === newEdgeTarget) {
      setErrorMessage("Discrete Math: Self-loops are generally disallowed in simple network graphs.");
      return;
    }

    // Check duplicate
    const exists = graph.edges.some(
      (e) =>
        (e.source === newEdgeSource && e.target === newEdgeTarget) ||
        (!graph.isDirected && e.source === newEdgeTarget && e.target === newEdgeSource)
    );

    if (exists) {
      setErrorMessage("A connection between these two devices already exists.");
      return;
    }

    const newEdge: Edge = {
      id: `e_${Date.now()}`,
      source: newEdgeSource,
      target: newEdgeTarget,
      weight: Number(newEdgeWeight) || 1,
      directed: graph.isDirected,
      latency: Number(newEdgeWeight),
    };

    onUpdateGraph({
      ...graph,
      edges: [...graph.edges, newEdge],
    });
  };

  // Remove Edge
  const handleRemoveEdge = (edgeId: string) => {
    clearErrors();
    onUpdateGraph({
      ...graph,
      edges: graph.edges.filter((e) => e.id !== edgeId),
    });
    if (selectedEdge?.id === edgeId) setSelectedEdge(null);
  };

  // Update Selected Vertex
  const handleUpdateSelectedVertex = (updates: Partial<Vertex>) => {
    if (!selectedVertex) return;
    const updated = { ...selectedVertex, ...updates };
    setSelectedVertex(updated);
    onUpdateGraph({
      ...graph,
      vertices: graph.vertices.map((v) => (v.id === updated.id ? updated : v)),
    });
  };

  // Update Selected Edge Weight
  const handleUpdateSelectedEdgeWeight = (w: number) => {
    if (!selectedEdge) return;
    const updated = { ...selectedEdge, weight: w };
    setSelectedEdge(updated);
    onUpdateGraph({
      ...graph,
      edges: graph.edges.map((e) => (e.id === updated.id ? updated : e)),
    });
  };

  // JSON Export & Import
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyber_nexus_topology_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.vertices) && Array.isArray(parsed.edges)) {
          onUpdateGraph(parsed);
          clearErrors();
        } else {
          setErrorMessage("Invalid topology format. File must contain vertices and edges arrays.");
        }
      } catch (err) {
        setErrorMessage("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Scenario Selector */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            Predefined Academic Network Scenarios
          </h2>
          <p className="text-xs text-slate-400">
            Load realistic engineering network architectures with predetermined discrete graph properties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ALL_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onLoadScenario(sc)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition"
            >
              {sc.name.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={clearErrors} className="text-rose-400 font-bold hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Interactive Canvas & Editor Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold uppercase tracking-wider">
              <Network className="w-4 h-4 text-cyan-400" />
              Graph Workspace (Drag nodes to reposition)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" /> Export JSON
              </button>

              <label className="cursor-pointer px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Import JSON
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>
          </div>

          <div className="h-[520px] w-full">
            <InteractiveNetworkGraph
              vertices={graph.vertices}
              edges={graph.edges}
              isDirected={graph.isDirected}
              selectedVertexId={selectedVertex?.id}
              selectedEdgeId={selectedEdge?.id}
              onSelectVertex={(v) => {
                setSelectedVertex(v);
                setSelectedEdge(null);
              }}
              onSelectEdge={(e) => {
                setSelectedEdge(e);
                setSelectedVertex(null);
              }}
              onUpdateVertexPosition={onUpdateVertexPosition}
            />
          </div>
        </div>

        {/* Right 1 Col: Editor Controls & Inspector Panel */}
        <div className="glass-panel p-4 rounded-xl flex flex-col space-y-5 overflow-y-auto max-h-[600px]">
          {/* INSPECTOR: Selected Vertex or Edge */}
          {selectedVertex ? (
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Inspect Device: {selectedVertex.label}
                </span>
                <button
                  onClick={() => handleRemoveVertex(selectedVertex.id)}
                  className="p-1 hover:bg-rose-950 text-rose-400 rounded transition"
                  title="Delete Vertex"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Device Label</label>
                  <input
                    type="text"
                    value={selectedVertex.label}
                    onChange={(e) => handleUpdateSelectedVertex({ label: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Device Role / Type</label>
                  <select
                    value={selectedVertex.type}
                    onChange={(e) =>
                      handleUpdateSelectedVertex({ type: e.target.value as DeviceType })
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="pc">PC / Workstation</option>
                    <option value="server">Application Server</option>
                    <option value="router">Core Router / Switch</option>
                    <option value="firewall">Perimeter Firewall</option>
                    <option value="gateway">Border Gateway</option>
                    <option value="database">Database Cluster</option>
                    <option value="iot">IoT Sensor Device</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">IP Address</label>
                  <input
                    type="text"
                    value={selectedVertex.ip || ""}
                    onChange={(e) => handleUpdateSelectedVertex({ ip: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : selectedEdge ? (
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Inspect Connection Edge
                </span>
                <button
                  onClick={() => handleRemoveEdge(selectedEdge.id)}
                  className="p-1 hover:bg-rose-950 text-rose-400 rounded transition"
                  title="Delete Edge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Endpoints:</span>
                  <div className="font-mono text-cyan-300 mt-0.5">
                    {graph.vertices.find((v) => v.id === selectedEdge.source)?.label} ↔{" "}
                    {graph.vertices.find((v) => v.id === selectedEdge.target)?.label}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Edge Weight w(e) / Latency (ms)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedEdge.weight}
                    onChange={(e) => handleUpdateSelectedEdgeWeight(Number(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              Click any device or edge on the graph to inspect, edit properties, or delete it.
            </div>
          )}

          {/* ADD VERTEX FORM */}
          <form onSubmit={handleAddVertex} className="space-y-3 border-t border-slate-800 pt-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Add Network Device (Vertex)
            </span>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Device Label</label>
                <input
                  type="text"
                  placeholder="e.g. RT-Branch, SRV-Auth"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Type</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as DeviceType)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="pc">PC</option>
                    <option value="server">Server</option>
                    <option value="router">Router</option>
                    <option value="firewall">Firewall</option>
                    <option value="gateway">Gateway</option>
                    <option value="database">Database</option>
                    <option value="iot">IoT Device</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">IP Address</label>
                  <input
                    type="text"
                    value={newNodeIp}
                    onChange={(e) => setNewNodeIp(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Vertex to Graph
              </button>
            </div>
          </form>

          {/* ADD EDGE FORM */}
          <form onSubmit={handleAddEdge} className="space-y-3 border-t border-slate-800 pt-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              Add Connection (Edge)
            </span>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Source (u)</label>
                  <select
                    value={newEdgeSource}
                    onChange={(e) => setNewEdgeSource(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="">Select source...</option>
                    {graph.vertices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target (v)</label>
                  <select
                    value={newEdgeTarget}
                    onChange={(e) => setNewEdgeTarget(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="">Select target...</option>
                    {graph.vertices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Edge Weight w(u,v)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newEdgeWeight}
                  onChange={(e) => setNewEdgeWeight(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Share2 className="w-4 h-4" /> Connect Devices
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
