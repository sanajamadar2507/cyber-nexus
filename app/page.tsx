"use client";

import React, { useState, useMemo } from "react";
import { GraphData, Scenario } from "@/types/graph";
import { SAMPLE_ENTERPRISE } from "@/lib/sample-data";
import { computeDegrees, classifyGraph } from "@/lib/algorithms/graph-basics";
import { getConnectedComponents, findCutComponents } from "@/lib/algorithms/connectivity";
import { calculateResilienceReport } from "@/lib/scoring/resilience";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/dashboard/HeroSection";
import OverviewView from "@/components/dashboard/OverviewView";
import NetworkLabView from "@/components/dashboard/NetworkLabView";
import GraphRepresentationView from "@/components/dashboard/GraphRepresentationView";
import GraphAnalysisView from "@/components/dashboard/GraphAnalysisView";
import StructuralSecurityView from "@/components/dashboard/StructuralSecurityView";
import RoutingLabView from "@/components/dashboard/RoutingLabView";
import SpanningTreeLabView from "@/components/dashboard/SpanningTreeLabView";
import TreeLabView from "@/components/dashboard/TreeLabView";
import ResilienceLabView from "@/components/dashboard/ResilienceLabView";
import DmConceptsView from "@/components/dashboard/DmConceptsView";
import AlgorithmStepsView from "@/components/dashboard/AlgorithmStepsView";
import ProjectMethodologyView from "@/components/dashboard/ProjectMethodologyView";
import SyllabusAlignmentView from "@/components/dashboard/SyllabusAlignmentView";
import AboutProjectView from "@/components/dashboard/AboutProjectView";
import PresentationView from "@/components/dashboard/PresentationView";

import { Menu } from "lucide-react";

export default function CyberNexusApp() {
  // Central Graph State
  const [graph, setGraph] = useState<GraphData>(SAMPLE_ENTERPRISE);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Presentation Mode Toggle
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Mobile Sidebar Toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Dynamic Graph Analysis Calculations (Centralized & Reactive)
  const analysis = useMemo(() => {
    const activeVertices = graph.vertices.filter((v) => !v.disabled);
    const activeEdges = graph.edges.filter((e) => !e.disabled);

    const degInfo = computeDegrees(graph);
    const components = getConnectedComponents(graph);
    const isConnected = components.length <= 1 && activeVertices.length > 0;
    const cutComponents = findCutComponents(graph);
    const graphType = classifyGraph(graph, degInfo.degrees, isConnected);

    return {
      vertexCount: activeVertices.length,
      edgeCount: activeEdges.length,
      degrees: degInfo.degrees,
      inDegrees: degInfo.inDegrees,
      outDegrees: degInfo.outDegrees,
      isolatedVertices: degInfo.isolatedVertices,
      pendantVertices: degInfo.pendantVertices,
      isConnected,
      componentCount: components.length,
      components,
      cutVertices: cutComponents.cutVertices,
      bridges: cutComponents.bridges,
      handshakingSum: degInfo.handshakingSum,
      handshakingExpected: degInfo.handshakingExpected,
      handshakingHolds: degInfo.handshakingHolds,
      graphType,
    };
  }, [graph]);

  // Dynamic Resilience Report Calculations
  const resilience = useMemo(() => {
    return calculateResilienceReport(graph);
  }, [graph]);

  // Handlers
  const handleResetGraph = () => {
    setGraph(JSON.parse(JSON.stringify(SAMPLE_ENTERPRISE)));
  };

  const handleToggleDirected = () => {
    setGraph((prev) => ({
      ...prev,
      isDirected: !prev.isDirected,
    }));
  };

  const handleLoadScenario = (scenario: Scenario) => {
    setGraph(JSON.parse(JSON.stringify(scenario.graph)));
  };

  const handleUpdateVertexPosition = (id: string, x: number, y: number) => {
    setGraph((prev) => ({
      ...prev,
      vertices: prev.vertices.map((v) => (v.id === id ? { ...v, x, y } : v)),
    }));
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Presentation Mode Fullscreen Overlay */}
      {isPresentationMode && (
        <PresentationView
          graph={graph}
          analysis={analysis}
          resilience={resilience}
          onExit={() => setIsPresentationMode(false)}
          onUpdateVertexPosition={handleUpdateVertexPosition}
        />
      )}

      {/* Top Navigation Bar */}
      <Navbar
        graphName={graph.name || "Default Network"}
        isDirected={graph.isDirected}
        isConnected={analysis.isConnected}
        vertexCount={analysis.vertexCount}
        edgeCount={analysis.edgeCount}
        onReset={handleResetGraph}
        onToggleDirected={handleToggleDirected}
        onPresentationMode={() => setIsPresentationMode(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Mobile Menu Button Banner */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          <Menu className="w-4 h-4 text-cyan-400" />
          <span>Modules Menu</span>
        </button>

        <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
          {activeTab}
        </span>
      </div>

      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Landing Hero Section (Visible in Overview Tab) */}
          {activeTab === "overview" && (
            <HeroSection
              onLaunchLab={() => setActiveTab("lab")}
              onExploreConcepts={() => setActiveTab("concepts")}
            />
          )}

          {/* Tab Views */}
          {activeTab === "overview" && (
            <OverviewView
              graph={graph}
              analysis={analysis}
              resilience={resilience}
              onNavigateTab={setActiveTab}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "lab" && (
            <NetworkLabView
              graph={graph}
              onUpdateGraph={setGraph}
              onLoadScenario={handleLoadScenario}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "representation" && (
            <GraphRepresentationView graph={graph} />
          )}

          {activeTab === "analysis" && (
            <GraphAnalysisView graph={graph} analysis={analysis} />
          )}

          {activeTab === "security" && (
            <StructuralSecurityView
              graph={graph}
              analysis={analysis}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "routing" && (
            <RoutingLabView
              graph={graph}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "mst" && (
            <SpanningTreeLabView
              graph={graph}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "trees" && (
            <TreeLabView graph={graph} />
          )}

          {activeTab === "resilience" && (
            <ResilienceLabView
              graph={graph}
              onUpdateGraph={setGraph}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "concepts" && (
            <DmConceptsView />
          )}

          {activeTab === "algorithms" && (
            <AlgorithmStepsView
              graph={graph}
              onUpdateVertexPosition={handleUpdateVertexPosition}
            />
          )}

          {activeTab === "methodology" && (
            <ProjectMethodologyView />
          )}

          {activeTab === "syllabus" && (
            <SyllabusAlignmentView />
          )}

          {activeTab === "about" && (
            <AboutProjectView />
          )}
        </main>
      </div>

      {/* Academic Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-900 bg-cyber-950/80 text-center text-xs text-slate-500 font-mono">
        <p>
          CYBER NEXUS • Discrete Mathematics Engineering Course Project • Graph Theory & Trees in Network Resilience
        </p>
      </footer>
    </div>
  );
}
