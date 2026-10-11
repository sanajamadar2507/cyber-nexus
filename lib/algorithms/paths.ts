import { GraphData } from "@/types/graph";

/**
 * Finds all simple paths between source and destination using DFS with backtracking.
 * Caps at maximum 10 paths to avoid combinatorial explosion on dense graphs.
 */
export function findSimplePaths(
  graph: GraphData,
  sourceId: string,
  destId: string,
  maxPaths = 10
): { paths: string[][]; edgesList: string[][] } {
  const activeVertices = new Set(graph.vertices.filter((v) => !v.disabled).map((v) => v.id));
  if (!activeVertices.has(sourceId) || !activeVertices.has(destId)) {
    return { paths: [], edgesList: [] };
  }

  const adj = new Map<string, { to: string; edgeId: string }[]>();
  activeVertices.forEach((id) => adj.set(id, []));

  for (const e of graph.edges.filter((e) => !e.disabled)) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, edgeId: e.id });
      if (!graph.isDirected) {
        adj.get(e.target)!.push({ to: e.source, edgeId: e.id });
      }
    }
  }

  const resultPaths: string[][] = [];
  const resultEdges: string[][] = [];
  const currentPath: string[] = [sourceId];
  const currentEdges: string[] = [];
  const visited = new Set<string>([sourceId]);

  function dfs(curr: string) {
    if (resultPaths.length >= maxPaths) return;
    if (curr === destId) {
      resultPaths.push([...currentPath]);
      resultEdges.push([...currentEdges]);
      return;
    }

    const neighbors = adj.get(curr) || [];
    for (const { to: nxt, edgeId } of neighbors) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        currentPath.push(nxt);
        currentEdges.push(edgeId);

        dfs(nxt);

        currentEdges.pop();
        currentPath.pop();
        visited.delete(nxt);
      }
    }
  }

  dfs(sourceId);
  return { paths: resultPaths, edgesList: resultEdges };
}

/**
 * Detects fundamental cycles in an undirected or directed graph.
 */
export function detectCycles(graph: GraphData): {
  hasCycle: boolean;
  cycleNodes: string[][];
  cycleEdges: string[][];
} {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
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

  const visited = new Set<string>();
  const parent = new Map<string, { node: string | null; edgeId: string | null }>();
  const cycleNodes: string[][] = [];
  const cycleEdges: string[][] = [];

  for (const start of activeVertices) {
    if (!visited.has(start.id)) {
      const dfsVisit = (u: string, p: string | null, pEdge: string | null): boolean => {
        visited.add(u);
        parent.set(u, { node: p, edgeId: pEdge });

        const neighbors = adj.get(u) || [];
        for (const { to: v, edgeId } of neighbors) {
          if (edgeId === pEdge) continue;

          if (visited.has(v)) {
            // Cycle found! Backtrack cycle
            const cNode: string[] = [v, u];
            const cEdge: string[] = [edgeId];
            let curr = u;
            while (curr && curr !== v) {
              const prev = parent.get(curr);
              if (!prev || !prev.node) break;
              if (prev.node !== v) cNode.push(prev.node);
              if (prev.edgeId) cEdge.push(prev.edgeId);
              curr = prev.node;
            }
            if (cNode.length >= 3) {
              cycleNodes.push(cNode);
              cycleEdges.push(cEdge);
              if (cycleNodes.length >= 5) return true; // Limit detected cycles for display
            }
          } else {
            if (dfsVisit(v, u, edgeId)) return true;
          }
        }
        return false;
      };

      dfsVisit(start.id, null, null);
    }
  }

  return {
    hasCycle: cycleNodes.length > 0,
    cycleNodes,
    cycleEdges,
  };
}

/**
 * Checks for a Hamiltonian Cycle in small graphs (N <= 10).
 * Demonstrates the NP-Complete property with backtracking search.
 */
export function checkHamiltonianCycle(graph: GraphData): {
  supported: boolean;
  hasCycle: boolean;
  cycle: string[]; // List of vertex IDs in sequence forming the cycle
  visitedCount: number;
  explanation: string;
} {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const n = activeVertices.length;

  if (n < 3) {
    return {
      supported: true,
      hasCycle: false,
      cycle: [],
      visitedCount: n,
      explanation: "A Hamiltonian cycle requires at least 3 vertices in a simple graph.",
    };
  }

  if (n > 10) {
    return {
      supported: false,
      hasCycle: false,
      cycle: [],
      visitedCount: 0,
      explanation: `Current graph has ${n} vertices. Hamiltonian Cycle is an NP-Complete problem (O(N!) combinatorial search space). For safety, interactive verification is restricted to N ≤ 10 vertices.`,
    };
  }

  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const adj = new Map<string, Set<string>>();
  activeVertices.forEach((v) => adj.set(v.id, new Set()));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.add(e.target);
      if (!graph.isDirected) {
        adj.get(e.target)!.add(e.source);
      }
    }
  }

  const startNode = activeVertices[0].id;
  const path: string[] = [startNode];
  const inPath = new Set<string>([startNode]);
  let exploredStates = 0;

  function backtrack(curr: string): boolean {
    exploredStates++;
    if (path.length === n) {
      // Must be adjacent to startNode to close the cycle
      if (adj.get(curr)?.has(startNode)) {
        path.push(startNode);
        return true;
      }
      return false;
    }

    const neighbors = Array.from(adj.get(curr) || []);
    for (const nxt of neighbors) {
      if (!inPath.has(nxt)) {
        inPath.add(nxt);
        path.push(nxt);

        if (backtrack(nxt)) return true;

        path.pop();
        inPath.delete(nxt);
      }
    }
    return false;
  }

  const found = backtrack(startNode);

  return {
    supported: true,
    hasCycle: found,
    cycle: found ? path : [],
    visitedCount: exploredStates,
    explanation: found
      ? `Hamiltonian Cycle verified: visits every vertex exactly once and returns to ${activeVertices[0].label}.`
      : `No Hamiltonian Cycle exists. No simple cycle visits all ${n} vertices without repeating.`,
  };
}
