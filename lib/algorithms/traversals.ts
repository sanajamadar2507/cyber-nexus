import { GraphData, AlgorithmStep } from "@/types/graph";

export interface TraversalSimulationResult {
  algorithm: "bfs" | "dfs";
  steps: AlgorithmStep[];
  visitOrder: string[]; // Vertex labels
  visitedEdgeIds: string[];
}

/**
 * Step-by-step Breadth-First Search (BFS).
 */
export function runBfsStepByStep(graph: GraphData, startId?: string): TraversalSimulationResult {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  if (activeVertices.length === 0) {
    return { algorithm: "bfs", steps: [], visitOrder: [], visitedEdgeIds: [] };
  }

  const start = startId && vMap.has(startId) ? startId : activeVertices[0].id;
  const adj = new Map<string, { to: string; edgeId: string }[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, edgeId: e.id });
      if (!graph.isDirected) {
        adj.get(e.target)!.push({ to: e.source, edgeId: e.id });
      }
    }
  }

  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  const visitOrder: string[] = [];
  const visitedEdgeIds: string[] = [];
  let stepCount = 1;

  steps.push({
    stepNumber: stepCount++,
    title: `Initialize BFS Queue with ${vMap.get(start)?.label}`,
    description: `Enqueue root node ${vMap.get(start)?.label}. Mark as visited. Level 0 exploration initialized.`,
    activeVertices: [start],
    activeEdges: [],
    visitedVertices: [start],
    actionType: "init",
  });

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currLabel = vMap.get(curr)?.label || curr;
    visitOrder.push(currLabel);

    steps.push({
      stepNumber: stepCount++,
      title: `Dequeue & Process ${currLabel}`,
      description: `Exploring all unvisited 1-hop adjacent neighbors of ${currLabel}. Current queue size: ${queue.length}.`,
      activeVertices: [curr],
      visitedVertices: Array.from(visited),
      actionType: "visit",
    });

    const neighbors = adj.get(curr) || [];
    for (const { to: nxt, edgeId } of neighbors) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        queue.push(nxt);
        visitedEdgeIds.push(edgeId);

        const nxtLabel = vMap.get(nxt)?.label || nxt;
        steps.push({
          stepNumber: stepCount++,
          title: `Discover Neighbor ${nxtLabel}`,
          description: `Discovered unvisited node ${nxtLabel} via edge (${currLabel} → ${nxtLabel}). Enqueued to BFS frontier.`,
          activeVertices: [curr, nxt],
          activeEdges: [edgeId],
          visitedVertices: Array.from(visited),
          actionType: "accept",
        });
      }
    }
  }

  steps.push({
    stepNumber: stepCount,
    title: "BFS Traversal Complete",
    description: `BFS finished. Visited sequence: [${visitOrder.join(" → ")}]. Explored all reachable nodes level-by-level.`,
    activeVertices: Array.from(visited),
    activeEdges: visitedEdgeIds,
    visitedVertices: Array.from(visited),
    actionType: "complete",
  });

  return { algorithm: "bfs", steps, visitOrder, visitedEdgeIds };
}

/**
 * Step-by-step Depth-First Search (DFS).
 */
export function runDfsStepByStep(graph: GraphData, startId?: string): TraversalSimulationResult {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  if (activeVertices.length === 0) {
    return { algorithm: "dfs", steps: [], visitOrder: [], visitedEdgeIds: [] };
  }

  const start = startId && vMap.has(startId) ? startId : activeVertices[0].id;
  const adj = new Map<string, { to: string; edgeId: string }[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, edgeId: e.id });
      if (!graph.isDirected) {
        adj.get(e.target)!.push({ to: e.source, edgeId: e.id });
      }
    }
  }

  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const visitOrder: string[] = [];
  const visitedEdgeIds: string[] = [];
  let stepCount = 1;

  steps.push({
    stepNumber: stepCount++,
    title: `Initialize DFS Stack from ${vMap.get(start)?.label}`,
    description: `Starting recursive depth exploration from ${vMap.get(start)?.label}.`,
    activeVertices: [start],
    visitedVertices: [],
    actionType: "init",
  });

  function dfs(u: string, pEdge: string | null) {
    visited.add(u);
    const uLabel = vMap.get(u)?.label || u;
    visitOrder.push(uLabel);

    steps.push({
      stepNumber: stepCount++,
      title: `Visit Vertex ${uLabel}`,
      description: `Pushed ${uLabel} onto DFS recursion stack. Advancing along branch.`,
      activeVertices: [u],
      activeEdges: pEdge ? [pEdge] : [],
      visitedVertices: Array.from(visited),
      actionType: "visit",
    });

    const neighbors = adj.get(u) || [];
    for (const { to: v, edgeId } of neighbors) {
      if (!visited.has(v)) {
        visitedEdgeIds.push(edgeId);
        dfs(v, edgeId);
      }
    }
  }

  dfs(start, null);

  steps.push({
    stepNumber: stepCount,
    title: "DFS Traversal Complete",
    description: `DFS finished. Visited order: [${visitOrder.join(" → ")}]. All subtree branches fully explored.`,
    activeVertices: Array.from(visited),
    activeEdges: visitedEdgeIds,
    visitedVertices: Array.from(visited),
    actionType: "complete",
  });

  return { algorithm: "dfs", steps, visitOrder, visitedEdgeIds };
}
