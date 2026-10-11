"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Vertex, Edge, DeviceType } from "@/types/graph";
import {
  Monitor,
  Server,
  Network,
  Shield,
  Globe,
  Database,
  Radio,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  AlertTriangle,
  Move,
} from "lucide-react";

interface InteractiveNetworkGraphProps {
  vertices: Vertex[];
  edges: Edge[];
  isDirected?: boolean;
  selectedVertexId?: string | null;
  selectedEdgeId?: string | null;
  onSelectVertex?: (vertex: Vertex | null) => void;
  onSelectEdge?: (edge: Edge | null) => void;
  onUpdateVertexPosition?: (id: string, x: number, y: number) => void;
  highlightedVertices?: string[];
  highlightedEdges?: string[];
  cutVertices?: string[];
  bridgeEdges?: string[];
  mstEdges?: string[];
  rejectedEdges?: string[];
  activeStepEdge?: string | null;
  presentationMode?: boolean;
  className?: string;
}

export const DEVICE_ICONS: Record<DeviceType, React.ElementType> = {
  pc: Monitor,
  server: Server,
  router: Network,
  firewall: Shield,
  gateway: Globe,
  database: Database,
  iot: Radio,
};

export const DEVICE_COLORS: Record<DeviceType, { bg: string; border: string; text: string; fill: string }> = {
  pc: { bg: "bg-blue-950/80", border: "border-blue-500", text: "text-blue-400", fill: "#3b82f6" },
  server: { bg: "bg-emerald-950/80", border: "border-emerald-500", text: "text-emerald-400", fill: "#10b981" },
  router: { bg: "bg-cyan-950/80", border: "border-cyan-500", text: "text-cyan-400", fill: "#06b6d4" },
  firewall: { bg: "bg-amber-950/80", border: "border-amber-500", text: "text-amber-400", fill: "#f59e0b" },
  gateway: { bg: "bg-purple-950/80", border: "border-purple-500", text: "text-purple-400", fill: "#a855f7" },
  database: { bg: "bg-indigo-950/80", border: "border-indigo-500", text: "text-indigo-400", fill: "#6366f1" },
  iot: { bg: "bg-teal-950/80", border: "border-teal-500", text: "text-teal-400", fill: "#14b8a6" },
};

export default function InteractiveNetworkGraph({
  vertices,
  edges,
  isDirected = false,
  selectedVertexId = null,
  selectedEdgeId = null,
  onSelectVertex,
  onSelectEdge,
  onUpdateVertexPosition,
  highlightedVertices = [],
  highlightedEdges = [],
  cutVertices = [],
  bridgeEdges = [],
  mstEdges = [],
  rejectedEdges = [],
  activeStepEdge = null,
  presentationMode = false,
  className = "",
}: InteractiveNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Pan and Zoom transform
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node Dragging
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Hover state
  const [hoveredNode, setHoveredNode] = useState<Vertex | null>(null);

  // Lookup map for fast position resolution
  const vertexMap = useMemo(() => {
    const map = new Map<string, Vertex>();
    vertices.forEach((v) => map.set(v.id, v));
    return map;
  }, [vertices]);

  // Compute graph bounds for centering
  const resetFitView = () => {
    if (vertices.length === 0) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }
    const xs = vertices.map((v) => v.x);
    const ys = vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX || 600;
    const height = maxY - minY || 400;

    const scale = Math.min(1.2, Math.max(0.65, Math.min(800 / (width + 160), 500 / (height + 160))));
    setZoom(scale);
    setPan({
      x: 420 - ((minX + maxX) / 2) * scale,
      y: 260 - ((minY + maxY) / 2) * scale,
    });
  };

  const handleMouseDownSvg = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === "rect") {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectVertex?.(null);
      onSelectEdge?.(null);
    }
  };

  const handleMouseMoveSvg = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingNodeId) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Transform client coordinates to SVG world space
      const worldX = (clientX - pan.x) / zoom;
      const worldY = (clientY - pan.y) / zoom;

      onUpdateVertexPosition?.(draggingNodeId, Math.round(worldX), Math.round(worldY));
    }
  };

  const handleMouseUpSvg = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleWheelSvg = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Node Drag Initiation
  const startDragNode = (e: React.MouseEvent, node: Vertex) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    onSelectVertex?.(node);
  };

  const nodeRadius = presentationMode ? 28 : 22;

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-cyber-950/90 rounded-xl border border-slate-800 overflow-hidden select-none graph-canvas flex flex-col ${className}`}
    >
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1 rounded-lg shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.15))}
          title="Zoom In"
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z * 0.85))}
          title="Zoom Out"
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={resetFitView}
          title="Reset View & Center"
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1.5">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Legend Badge Overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#06b6d4]" />
          Normal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/50 inline-block shadow-[0_0_6px_#f59e0b]" />
          Cut Vertex (Articulation)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] bg-rose-500 border-dashed inline-block" />
          Bridge (Cut Edge)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] bg-emerald-400 inline-block shadow-[0_0_6px_#10b981]" />
          MST / Active Path
        </span>
      </div>

      {/* SVG Interactive Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDownSvg}
        onMouseMove={handleMouseMoveSvg}
        onMouseUp={handleMouseUpSvg}
        onWheel={handleWheelSvg}
      >
        <defs>
          {/* Arrowhead marker for directed edges */}
          <marker
            id="cyber-arrow"
            viewBox="0 0 10 10"
            refX={presentationMode ? "24" : "18"}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#06b6d4" />
          </marker>
          <marker
            id="cyber-arrow-highlight"
            viewBox="0 0 10 10"
            refX={presentationMode ? "24" : "18"}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
          </marker>

          {/* Glowing Filter effects */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Global World Transform Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. EDGES RENDER */}
          {edges.map((edge) => {
            const u = vertexMap.get(edge.source);
            const v = vertexMap.get(edge.target);
            if (!u || !v) return null;

            const isSelected = selectedEdgeId === edge.id;
            const isHighlighted = highlightedEdges.includes(edge.id);
            const isMst = mstEdges.includes(edge.id);
            const isRejected = rejectedEdges.includes(edge.id);
            const isBridge = bridgeEdges.includes(edge.id);
            const isActiveStep = activeStepEdge === edge.id;
            const isDisabled = edge.disabled || u.disabled || v.disabled;

            // Compute midpoint for edge weight badge
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            // Style determination
            let strokeColor = "#334155"; // Default slate
            let strokeWidth = 2;
            let strokeDash = undefined;

            if (isDisabled) {
              strokeColor = "#1e293b";
              strokeDash = "3,3";
            } else if (isActiveStep) {
              strokeColor = "#f59e0b"; // Active amber
              strokeWidth = 3.5;
            } else if (isRejected) {
              strokeColor = "#ef4444";
              strokeDash = "4,4";
            } else if (isMst) {
              strokeColor = "#10b981"; // Emerald
              strokeWidth = 3;
            } else if (isHighlighted) {
              strokeColor = "#06b6d4"; // Cyan
              strokeWidth = 3;
            } else if (isBridge) {
              strokeColor = "#f43f5e"; // Rose
              strokeWidth = 2.5;
              strokeDash = "5,4";
            } else if (isSelected) {
              strokeColor = "#38bdf8";
              strokeWidth = 3;
            }

            return (
              <g
                key={edge.id}
                className="cursor-pointer transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge?.(edge);
                }}
              >
                {/* Wider invisible stroke for easy clicking */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth={14}
                />

                {/* Visible Edge Line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={
                    isDirected || edge.directed
                      ? isHighlighted || isMst
                        ? "url(#cyber-arrow-highlight)"
                        : "url(#cyber-arrow)"
                      : undefined
                  }
                />

                {/* Edge Weight Pill Badge */}
                {edge.weight !== undefined && !isDisabled && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-14}
                      y={-10}
                      width={28}
                      height={20}
                      rx={6}
                      fill="#0b1120"
                      stroke={
                        isMst
                          ? "#10b981"
                          : isBridge
                          ? "#f43f5e"
                          : isHighlighted
                          ? "#06b6d4"
                          : "#334155"
                      }
                      strokeWidth={1.2}
                      className="transition-colors shadow"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={
                        isMst
                          ? "#34d399"
                          : isBridge
                          ? "#fda4af"
                          : isHighlighted
                          ? "#22d3ee"
                          : "#94a3b8"
                      }
                      fontSize={11}
                      fontWeight="600"
                      fontFamily="monospace"
                      className="pointer-events-none select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 2. VERTICES RENDER */}
          {vertices.map((node) => {
            const isSelected = selectedVertexId === node.id;
            const isHighlighted = highlightedVertices.includes(node.id);
            const isCutVertex = cutVertices.includes(node.id);
            const isDisabled = node.disabled;
            const Icon = DEVICE_ICONS[node.type] || Monitor;
            const colors = DEVICE_COLORS[node.type] || DEVICE_COLORS.pc;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onMouseDown={(e) => startDragNode(e, node)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVertex?.(node);
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Cut Vertex Halo Ring */}
                {isCutVertex && !isDisabled && (
                  <circle
                    r={nodeRadius + 9}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.8}
                    strokeDasharray="4,3"
                    className="animate-spin"
                    style={{ animationDuration: "12s" }}
                  />
                )}

                {/* Highlight / Selected Outer Ring */}
                {(isSelected || isHighlighted) && !isDisabled && (
                  <circle
                    r={nodeRadius + 6}
                    fill="none"
                    stroke={isHighlighted ? "#10b981" : "#00f0ff"}
                    strokeWidth={2}
                    filter="url(#glow-cyan)"
                  />
                )}

                {/* Node Main Circle Container */}
                <circle
                  r={nodeRadius}
                  fill={isDisabled ? "#1e293b" : isCutVertex ? "#2d1f05" : "#0b1528"}
                  stroke={
                    isDisabled
                      ? "#475569"
                      : isCutVertex
                      ? "#f59e0b"
                      : isSelected
                      ? "#00f0ff"
                      : isHighlighted
                      ? "#10b981"
                      : colors.fill
                  }
                  strokeWidth={isSelected || isHighlighted ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />

                {/* Centered Device Icon via SVG foreignObject */}
                <foreignObject
                  x={-nodeRadius + 4}
                  y={-nodeRadius + 4}
                  width={(nodeRadius - 4) * 2}
                  height={(nodeRadius - 4) * 2}
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {isDisabled ? (
                      <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isCutVertex
                            ? "text-amber-400"
                            : isHighlighted
                            ? "text-emerald-400"
                            : colors.text
                        }`}
                      />
                    )}
                  </div>
                </foreignObject>

                {/* Cut Vertex Warning Badge */}
                {isCutVertex && !isDisabled && (
                  <g transform={`translate(${nodeRadius - 4}, ${-nodeRadius + 4})`}>
                    <circle r={7} fill="#b45309" stroke="#f59e0b" strokeWidth={1} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={9}
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      !
                    </text>
                  </g>
                )}

                {/* Vertex Label */}
                <text
                  y={nodeRadius + 14}
                  textAnchor="middle"
                  fill={isDisabled ? "#64748b" : isSelected ? "#00f0ff" : "#f1f5f9"}
                  fontSize={presentationMode ? 14 : 11}
                  fontWeight="600"
                  fontFamily="system-ui"
                  className="pointer-events-none select-none tracking-tight"
                >
                  {node.label}
                </text>

                {/* IP Address Subtitle */}
                {node.ip && (
                  <text
                    y={nodeRadius + 26}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={presentationMode ? 11 : 9}
                    fontFamily="monospace"
                    className="pointer-events-none select-none"
                  >
                    {node.ip}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Info Card */}
      {hoveredNode && (
        <div className="absolute top-3 left-3 z-30 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 p-2.5 rounded-lg shadow-xl text-xs max-w-[200px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {hoveredNode.label}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 space-y-0.5">
            <div>Type: <span className="text-cyan-300 uppercase">{hoveredNode.type}</span></div>
            {hoveredNode.ip && <div>IP: <span className="font-mono text-slate-300">{hoveredNode.ip}</span></div>}
            {hoveredNode.subnet && <div>Zone: <span className="text-slate-300">{hoveredNode.subnet}</span></div>}
            {cutVertices.includes(hoveredNode.id) && (
              <div className="text-amber-400 font-semibold flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3" /> Articulation Vertex
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
