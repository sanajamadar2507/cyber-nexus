import { GraphData, AlgorithmStep } from "@/types/graph";

export interface DijkstraSimulationResult {
  steps: AlgorithmStep[];
  shortestPath: string[]; // Vertex IDs
  pathEdges: string[]; // Edge IDs
  totalCost: number;
  isReachable: boolean;
  sourceId: string;
  destId: string;
}

/**
 * Step-by-step generator for Dijkstra's shortest path algorithm.
 */
export function runDijkstraStepByStep(
  graph: GraphData,
  sourceId: string,
  destId: string
): DijkstraSimulationResult {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  const steps: AlgorithmStep[] = [];

  // Check valid source & destination
  if (!vMap.has(sourceId) || !vMap.has(destId)) {
    return {
      steps: [
        {
          stepNumber: 0,
          title: "Error: Invalid Endpoints",
          description: "Source or Destination node is disabled or does not exist in graph.",
          actionType: "init",
        },
      ],
      shortestPath: [],
      pathEdges: [],
      totalCost: 0,
      isReachable: false,
      sourceId,
      destId,
    };
  }

  // Check negative weights
  const hasNegativeWeights = activeEdges.some((e) => e.weight < 0);
  if (hasNegativeWeights) {
    return {
      steps: [
        {
          stepNumber: 0,
          title: "Error: Negative Edge Weights Detected",
          description: "Dijkstra's greedy assumption requires all edge weights w(u,v) ≥ 0. Use Bellman-Ford for negative weights.",
          actionType: "init",
        },
      ],
      shortestPath: [],
      pathEdges: [],
      totalCost: 0,
      isReachable: false,
      sourceId,
      destId,
    };
  }

  // Adjacency structure
  const adj = new Map<string, { to: string; weight: number; edgeId: string }[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, weight: e.weight, edgeId: e.id });
      if (!graph.isDirected) {
        adj.get(e.target)!.push({ to: e.source, weight: e.weight, edgeId: e.id });
      }
    }
  }

  // Initialization
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const prevEdge: Record<string, string | null> = {};
  const finalized = new Set<string>();

  activeVertices.forEach((v) => {
    dist[v.id] = Infinity;
    prev[v.id] = null;
    prevEdge[v.id] = null;
  });
  dist[sourceId] = 0;

  const initialTableState: Record<string, { dist: number | string; prev: string | null; finalized: boolean }> = {};
  activeVertices.forEach((v) => {
    initialTableState[v.id] = {
      dist: dist[v.id] === Infinity ? "∞" : dist[v.id],
      prev: null,
      finalized: false,
    };
  });

  steps.push({
    stepNumber: 1,
    title: "Step 1: Initialization",
    description: `Set dist[${vMap.get(sourceId)?.label}] = 0 and dist[v] = ∞ for all other vertices. Unvisited set contains all ${activeVertices.length} vertices.`,
    activeVertices: [sourceId],
    activeEdges: [],
    visitedVertices: [],
    tableState: JSON.parse(JSON.stringify(initialTableState)),
    actionType: "init",
    costSoFar: 0,
  });

  let currentStep = 2;
  let reached = false;

  while (finalized.size < activeVertices.length) {
    // Select unvisited vertex u with min dist[u]
    let u: string | null = null;
    let minD = Infinity;

    for (const v of activeVertices) {
      if (!finalized.has(v.id) && dist[v.id] < minD) {
        minD = dist[v.id];
        u = v.id;
      }
    }

    if (u === null || minD === Infinity) {
      // Remaining vertices unreachable
      break;
    }

    finalized.add(u);
    const uLabel = vMap.get(u)?.label || u;

    // Snapshot table state
    const tableSnapshot: Record<string, any> = {};
    activeVertices.forEach((v) => {
      tableSnapshot[v.id] = {
        dist: dist[v.id] === Infinity ? "∞" : dist[v.id],
        prev: prev[v.id] ? vMap.get(prev[v.id]!)?.label : null,
        finalized: finalized.has(v.id),
      };
    });

    steps.push({
      stepNumber: currentStep++,
      title: `Select Min-Distance Vertex: ${uLabel}`,
      description: `Vertex ${uLabel} has the smallest tentative distance (dist = ${minD}). Mark ${uLabel} as finalized (visited).`,
      activeVertices: [u],
      activeEdges: prevEdge[u] ? [prevEdge[u]!] : [],
      visitedVertices: Array.from(finalized),
      tableState: JSON.parse(JSON.stringify(tableSnapshot)),
      actionType: "select",
      costSoFar: minD,
    });

    if (u === destId) {
      reached = true;
      break;
    }

    // Relax neighbors
    const neighbors = adj.get(u) || [];
    for (const edge of neighbors) {
      const v = edge.to;
      const vLabel = vMap.get(v)?.label || v;
      if (!finalized.has(v)) {
        const alt = dist[u] + edge.weight;
        if (alt < dist[v]) {
          const oldDist = dist[v] === Infinity ? "∞" : dist[v];
          dist[v] = alt;
          prev[v] = u;
          prevEdge[v] = edge.edgeId;

          const relaxTable: Record<string, any> = {};
          activeVertices.forEach((node) => {
            relaxTable[node.id] = {
              dist: dist[node.id] === Infinity ? "∞" : dist[node.id],
              prev: prev[node.id] ? vMap.get(prev[node.id]!)?.label : null,
              finalized: finalized.has(node.id),
            };
          });

          steps.push({
            stepNumber: currentStep++,
            title: `Relax Edge (${uLabel} → ${vLabel})`,
            description: `Edge relaxation: dist[${uLabel}] (${dist[u]}) + weight (${edge.weight}) = ${alt} < dist[${vLabel}] (${oldDist}). Updated dist[${vLabel}] = ${alt}, prev[${vLabel}] = ${uLabel}.`,
            activeVertices: [u, v],
            activeEdges: [edge.edgeId],
            visitedVertices: Array.from(finalized),
            tableState: JSON.parse(JSON.stringify(relaxTable)),
            actionType: "relax",
            costSoFar: alt,
          });
        }
      }
    }
  }

  // Construct shortest path
  const shortestPath: string[] = [];
  const pathEdges: string[] = [];

  if (dist[destId] !== Infinity) {
    let curr: string | null = destId;
    while (curr !== null) {
      shortestPath.unshift(curr);
      const edge = prevEdge[curr];
      if (edge) pathEdges.unshift(edge);
      curr = prev[curr];
    }
  }

  const finalTable: Record<string, any> = {};
  activeVertices.forEach((v) => {
    finalTable[v.id] = {
      dist: dist[v.id] === Infinity ? "∞" : dist[v.id],
      prev: prev[v.id] ? vMap.get(prev[v.id]!)?.label : null,
      finalized: finalized.has(v.id),
    };
  });

  steps.push({
    stepNumber: currentStep,
    title: dist[destId] !== Infinity ? "Final Shortest Path Found" : "Destination Unreachable",
    description:
      dist[destId] !== Infinity
        ? `Optimal route determined: [${shortestPath.map((id) => vMap.get(id)?.label).join(" → ")}] with minimum cumulative cost = ${dist[destId]}.`
        : `No directed path exists from ${vMap.get(sourceId)?.label} to ${vMap.get(destId)?.label}.`,
    activeVertices: shortestPath,
    activeEdges: pathEdges,
    visitedVertices: Array.from(finalized),
    tableState: finalTable,
    actionType: "complete",
    costSoFar: dist[destId] === Infinity ? 0 : dist[destId],
  });

  return {
    steps,
    shortestPath,
    pathEdges,
    totalCost: dist[destId] === Infinity ? 0 : dist[destId],
    isReachable: dist[destId] !== Infinity,
    sourceId,
    destId,
  };
}
