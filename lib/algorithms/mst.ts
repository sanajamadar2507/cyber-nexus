import { GraphData, AlgorithmStep } from "@/types/graph";

export interface MstSimulationResult {
  algorithm: "kruskal" | "prim";
  steps: AlgorithmStep[];
  mstEdges: string[]; // Edge IDs
  mstCost: number;
  edgeCount: number;
  vertexCount: number;
  isConnected: boolean;
  sortedEdges?: { id: string; source: string; target: string; weight: number }[];
}

/**
 * Disjoint Set Union (Union-Find) with path compression and union by rank.
 */
class DisjointSet {
  parent: Map<string, string> = new Map();
  rank: Map<string, number> = new Map();

  constructor(elements: string[]) {
    elements.forEach((el) => {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    });
  }

  find(item: string): string {
    const root = this.parent.get(item);
    if (!root || root === item) return item;
    const p = this.find(root);
    this.parent.set(item, p);
    return p;
  }

  union(a: string, b: string): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const rankA = this.rank.get(rootA) || 0;
    const rankB = this.rank.get(rootB) || 0;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }

  getSets(): Record<string, string[]> {
    const sets: Record<string, string[]> = {};
    this.parent.forEach((_, key) => {
      const root = this.find(key);
      if (!sets[root]) sets[root] = [];
      sets[root].push(key);
    });
    return sets;
  }
}

/**
 * Kruskal's Algorithm simulator step-by-step with DSU cycle rejection.
 */
export function runKruskalStepByStep(graph: GraphData): MstSimulationResult {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  const steps: AlgorithmStep[] = [];
  const vertexIds = activeVertices.map((v) => v.id);
  const dsu = new DisjointSet(vertexIds);

  // Sort edges ascending by weight
  const sortedEdges = [...activeEdges].sort((a, b) => a.weight - b.weight);

  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let totalCost = 0;
  let stepCount = 1;

  steps.push({
    stepNumber: stepCount++,
    title: "Step 1: Sort All Edges",
    description: `Kruskal's greedy approach sorts all ${sortedEdges.length} edges in ascending order of weight: [${sortedEdges.map((e) => `${vMap.get(e.source)?.label}-${vMap.get(e.target)?.label} (${e.weight})`).join(", ")}]. Each vertex begins in its own disjoint set.`,
    activeVertices: [],
    activeEdges: [],
    mstEdges: [],
    rejectedEdges: [],
    dsuSets: dsu.getSets(),
    costSoFar: 0,
    actionType: "init",
  });

  for (const edge of sortedEdges) {
    const uLabel = vMap.get(edge.source)?.label || edge.source;
    const vLabel = vMap.get(edge.target)?.label || edge.target;
    const rootU = dsu.find(edge.source);
    const rootV = dsu.find(edge.target);

    if (rootU !== rootV) {
      // Accept edge
      dsu.union(edge.source, edge.target);
      mstEdges.push(edge.id);
      totalCost += edge.weight;

      steps.push({
        stepNumber: stepCount++,
        title: `Accept Edge: ${uLabel} ↔ ${vLabel} (Weight ${edge.weight})`,
        description: `Vertices ${uLabel} and ${vLabel} are in distinct components (Find(${uLabel}) ≠ Find(${vLabel})). Adding this edge creates no cycle. Edge ACCEPTED into MST. Cumulative Cost = ${totalCost}.`,
        activeVertices: [edge.source, edge.target],
        currentEdge: edge.id,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        dsuSets: dsu.getSets(),
        costSoFar: totalCost,
        actionType: "accept",
      });

      if (mstEdges.length === activeVertices.length - 1) {
        break; // Spanning tree complete
      }
    } else {
      // Reject edge: cycle detected
      rejectedEdges.push(edge.id);

      steps.push({
        stepNumber: stepCount++,
        title: `Cycle Detected: Reject Edge ${uLabel} ↔ ${vLabel} (Weight ${edge.weight})`,
        description: `Vertices ${uLabel} and ${vLabel} already share the same representative component (Find(${uLabel}) = Find(${vLabel}) = ${rootU}). Adding this edge would create a cycle (violating Tree Property |E| = |V|-1). Edge REJECTED.`,
        activeVertices: [edge.source, edge.target],
        currentEdge: edge.id,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        dsuSets: dsu.getSets(),
        costSoFar: totalCost,
        actionType: "reject",
      });
    }
  }

  steps.push({
    stepNumber: stepCount,
    title: "Kruskal's MST Complete",
    description: `Minimum Spanning Tree contains ${mstEdges.length} edges connecting all ${activeVertices.length} vertices with minimal total cost of ${totalCost}.`,
    activeVertices: vertexIds,
    mstEdges: [...mstEdges],
    rejectedEdges: [...rejectedEdges],
    dsuSets: dsu.getSets(),
    costSoFar: totalCost,
    actionType: "complete",
  });

  return {
    algorithm: "kruskal",
    steps,
    mstEdges,
    mstCost: totalCost,
    edgeCount: mstEdges.length,
    vertexCount: activeVertices.length,
    isConnected: mstEdges.length === activeVertices.length - 1 || activeVertices.length <= 1,
    sortedEdges: sortedEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: e.weight,
    })),
  };
}

/**
 * Prim's Algorithm simulator step-by-step starting from initial vertex.
 */
export function runPrimStepByStep(graph: GraphData, startVertexId?: string): MstSimulationResult {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  if (activeVertices.length === 0) {
    return {
      algorithm: "prim",
      steps: [],
      mstEdges: [],
      mstCost: 0,
      edgeCount: 0,
      vertexCount: 0,
      isConnected: true,
    };
  }

  const startId =
    startVertexId && activeVertices.some((v) => v.id === startVertexId)
      ? startVertexId
      : activeVertices[0].id;

  const adj = new Map<string, { to: string; weight: number; edgeId: string }[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, weight: e.weight, edgeId: e.id });
      adj.get(e.target)!.push({ to: e.source, weight: e.weight, edgeId: e.id });
    }
  }

  const inTree = new Set<string>([startId]);
  const mstEdges: string[] = [];
  let totalCost = 0;
  let stepCount = 1;
  const steps: AlgorithmStep[] = [];

  steps.push({
    stepNumber: stepCount++,
    title: `Step 1: Initialize Prim from Root ${vMap.get(startId)?.label}`,
    description: `Prim's algorithm grows a single tree from starting root ${vMap.get(startId)?.label}. Tree vertex set S = {${vMap.get(startId)?.label}}. Remaining cut V \\ S contains ${activeVertices.length - 1} vertices.`,
    activeVertices: [startId],
    activeEdges: [],
    mstEdges: [],
    costSoFar: 0,
    actionType: "init",
  });

  while (inTree.size < activeVertices.length) {
    // Find min-weight edge crossing cut (u inTree, v not inTree)
    let bestEdge: { from: string; to: string; weight: number; edgeId: string } | null = null;

    for (const u of inTree) {
      const neighbors = adj.get(u) || [];
      for (const n of neighbors) {
        if (!inTree.has(n.to)) {
          if (!bestEdge || n.weight < bestEdge.weight) {
            bestEdge = { from: u, to: n.to, weight: n.weight, edgeId: n.edgeId };
          }
        }
      }
    }

    if (!bestEdge) {
      // Disconnected graph
      break;
    }

    inTree.add(bestEdge.to);
    mstEdges.push(bestEdge.edgeId);
    totalCost += bestEdge.weight;

    const fromLabel = vMap.get(bestEdge.from)?.label || bestEdge.from;
    const toLabel = vMap.get(bestEdge.to)?.label || bestEdge.to;

    steps.push({
      stepNumber: stepCount++,
      title: `Add Minimum Cut Edge: ${fromLabel} ↔ ${toLabel} (${bestEdge.weight})`,
      description: `Examining all candidate edges crossing the cut (S, V \\ S). Minimum edge is (${fromLabel}, ${toLabel}) with cost ${bestEdge.weight}. Node ${toLabel} is annexed into the MST. Cumulative Cost = ${totalCost}.`,
      activeVertices: Array.from(inTree),
      activeEdges: [bestEdge.edgeId],
      mstEdges: [...mstEdges],
      costSoFar: totalCost,
      actionType: "accept",
    });
  }

  steps.push({
    stepNumber: stepCount,
    title: "Prim's MST Complete",
    description: `Minimum Spanning Tree finished spanning ${inTree.size} vertices with ${mstEdges.length} edges and total cost ${totalCost}.`,
    activeVertices: Array.from(inTree),
    mstEdges: [...mstEdges],
    costSoFar: totalCost,
    actionType: "complete",
  });

  return {
    algorithm: "prim",
    steps,
    mstEdges,
    mstCost: totalCost,
    edgeCount: mstEdges.length,
    vertexCount: inTree.size,
    isConnected: inTree.size === activeVertices.length,
  };
}
