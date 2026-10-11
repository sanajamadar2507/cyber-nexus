import { GraphData, FailureSimulationResult } from "@/types/graph";

/**
 * Computes connected components for undirected graph or weakly connected components for directed.
 */
export function getConnectedComponents(graph: GraphData): string[][] {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const adj = new Map<string, string[]>();

  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const edge of activeEdges) {
    if (adj.has(edge.source) && adj.has(edge.target)) {
      adj.get(edge.source)!.push(edge.target);
      adj.get(edge.target)!.push(edge.source); // Weak connectivity for directed as well
    }
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const v of activeVertices) {
    if (!visited.has(v.id)) {
      const component: string[] = [];
      const queue: string[] = [v.id];
      visited.add(v.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        component.push(curr);

        const neighbors = adj.get(curr) || [];
        for (const nxt of neighbors) {
          if (!visited.has(nxt)) {
            visited.add(nxt);
            queue.push(nxt);
          }
        }
      }
      components.push(component);
    }
  }

  return components;
}

/**
 * Tarjan's algorithm for Articulation Points (Cut Vertices) and Bridges (Cut Edges).
 * Returns strictly computed cut vertices and bridges for the active undirected graph.
 */
export function findCutComponents(graph: GraphData): {
  cutVertices: string[];
  bridges: string[]; // Edge IDs
} {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);

  const adj = new Map<string, { to: string; edgeId: string }[]>();
  activeVertices.forEach((v) => adj.set(v.id, []));

  for (const e of activeEdges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.push({ to: e.target, edgeId: e.id });
      adj.get(e.target)!.push({ to: e.source, edgeId: e.id });
    }
  }

  const tin = new Map<string, number>();
  const low = new Map<string, number>();
  const visited = new Set<string>();
  let timer = 0;

  const cutVerticesSet = new Set<string>();
  const bridgesSet = new Set<string>();

  function dfs(u: string, pEdge: string | null) {
    visited.add(u);
    tin.set(u, ++timer);
    low.set(u, timer);
    let children = 0;

    const neighbors = adj.get(u) || [];
    for (const { to: v, edgeId } of neighbors) {
      if (edgeId === pEdge) continue;

      if (visited.has(v)) {
        // Back edge
        low.set(u, Math.min(low.get(u)!, tin.get(v)!));
      } else {
        // Tree edge
        children++;
        dfs(v, edgeId);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));

        // Articulation point condition for non-root
        if (pEdge !== null && low.get(v)! >= tin.get(u)!) {
          cutVerticesSet.add(u);
        }

        // Bridge condition: low[v] > tin[u]
        if (low.get(v)! > tin.get(u)!) {
          bridgesSet.add(edgeId);
        }
      }
    }

    // Root articulation point condition: at least 2 independent children
    if (pEdge === null && children > 1) {
      cutVerticesSet.add(u);
    }
  }

  for (const v of activeVertices) {
    if (!visited.has(v.id)) {
      dfs(v.id, null);
    }
  }

  return {
    cutVertices: Array.from(cutVerticesSet),
    bridges: Array.from(bridgesSet),
  };
}

/**
 * Simulates the failure of a specific vertex or edge.
 * Computes exact before vs after connected components, impact rating, and discrete math rationale.
 */
export function simulateFailure(
  graph: GraphData,
  targetType: "vertex" | "edge",
  targetId: string
): FailureSimulationResult {
  const initialComponents = getConnectedComponents(graph);
  const beforeCount = initialComponents.length;

  let afterCount = beforeCount;
  let isCritical = false;
  let targetLabel = targetId;
  let disconnectedSubnets: string[][] = [];

  if (targetType === "vertex") {
    const targetVertex = graph.vertices.find((v) => v.id === targetId);
    targetLabel = targetVertex ? targetVertex.label : targetId;

    // Create cloned graph with vertex disabled
    const modifiedGraph: GraphData = {
      ...graph,
      vertices: graph.vertices.map((v) =>
        v.id === targetId ? { ...v, disabled: true } : v
      ),
      edges: graph.edges.map((e) =>
        e.source === targetId || e.target === targetId
          ? { ...e, disabled: true }
          : e
      ),
    };

    const afterComponents = getConnectedComponents(modifiedGraph);
    afterCount = afterComponents.length;
    disconnectedSubnets = afterComponents;
    isCritical = afterCount > beforeCount;
  } else {
    const targetEdge = graph.edges.find((e) => e.id === targetId);
    if (targetEdge) {
      const src = graph.vertices.find((v) => v.id === targetEdge.source)?.label || targetEdge.source;
      const tgt = graph.vertices.find((v) => v.id === targetEdge.target)?.label || targetEdge.target;
      targetLabel = `${src} ↔ ${tgt}`;
    }

    const modifiedGraph: GraphData = {
      ...graph,
      edges: graph.edges.map((e) =>
        e.id === targetId ? { ...e, disabled: true } : e
      ),
    };

    const afterComponents = getConnectedComponents(modifiedGraph);
    afterCount = afterComponents.length;
    disconnectedSubnets = afterComponents;
    isCritical = afterCount > beforeCount;
  }

  const resilienceDrop = isCritical
    ? Math.min(65, (afterCount - beforeCount) * 25 + 15)
    : 5;

  let mathReason = "";
  let recommendation = "";

  if (isCritical) {
    if (targetType === "vertex") {
      mathReason = `Node "${targetLabel}" is a Cut / Articulation Vertex. Removal splits the graph from ${beforeCount} to ${afterCount} disconnected components.`;
      recommendation = `Introduce alternate multi-homed links or dual-homing router paths to bypass ${targetLabel} so that connectivity $\\kappa(G) \\ge 2$.`;
    } else {
      mathReason = `Link "${targetLabel}" is an Edge Cut (Bridge). Its removal increases graph components from ${beforeCount} to ${afterCount}, breaking bipartite or radial flow.`;
      recommendation = `Add a parallel redundant link or complementary mesh route to close the cycle and eliminate this bridge (edge connectivity $\\lambda(G) \\ge 2$).`;
    }
  } else {
    mathReason = `The graph possesses cycle redundancy (multiple independent paths). Removal preserves connectivity (${afterCount} component${afterCount > 1 ? "s" : ""}).`;
    recommendation = `Optimal redundancy verified. Maintain current link failover monitoring.`;
  }

  return {
    targetType,
    targetId,
    targetLabel,
    beforeComponents: beforeCount,
    afterComponents: afterCount,
    isCritical,
    lostVertices: [targetId],
    disconnectedSubnets,
    resilienceDrop,
    mathematicalReason: mathReason,
    recommendation,
  };
}
