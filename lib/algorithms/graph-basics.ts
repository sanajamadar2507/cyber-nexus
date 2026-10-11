import {
  GraphData,
  AdjacencyMatrixData,
  IncidenceMatrixData,
  AdjacencyListEntry,
  GraphTypeInfo,
} from "@/types/graph";

/**
 * Generates the dynamic Adjacency Matrix representation.
 */
export function getAdjacencyMatrix(graph: GraphData): AdjacencyMatrixData {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const n = activeVertices.length;
  const idToIndex = new Map<string, number>();
  activeVertices.forEach((v, idx) => idToIndex.set(v.id, idx));

  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (const edge of activeEdges) {
    const u = idToIndex.get(edge.source);
    const v = idToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = edge.weight || 1;
      if (!graph.isDirected) {
        matrix[v][u] = edge.weight || 1;
      }
    }
  }

  return {
    vertexIds: activeVertices.map((v) => v.id),
    labels: activeVertices.map((v) => v.label),
    matrix,
  };
}

/**
 * Generates the dynamic Incidence Matrix representation.
 * For undirected: M[v][e] = 1 if v is incident on e.
 * For directed: M[v][e] = -1 if v is source, +1 if v is target.
 */
export function getIncidenceMatrix(graph: GraphData): IncidenceMatrixData {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const n = activeVertices.length;
  const m = activeEdges.length;

  const vMap = new Map<string, number>();
  activeVertices.forEach((v, idx) => vMap.set(v.id, idx));

  const matrix: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

  activeEdges.forEach((edge, edgeIdx) => {
    const u = vMap.get(edge.source);
    const v = vMap.get(edge.target);
    if (u !== undefined && v !== undefined) {
      if (graph.isDirected) {
        if (u === v) {
          matrix[u][edgeIdx] = 2; // self loop in directed
        } else {
          matrix[u][edgeIdx] = -1; // source
          matrix[v][edgeIdx] = 1;  // destination
        }
      } else {
        if (u === v) {
          matrix[u][edgeIdx] = 2; // self loop in undirected counts as 2
        } else {
          matrix[u][edgeIdx] = 1;
          matrix[v][edgeIdx] = 1;
        }
      }
    }
  });

  return {
    vertexIds: activeVertices.map((v) => v.id),
    edgeIds: activeEdges.map((e) => e.id),
    matrix,
  };
}

/**
 * Generates the dynamic Adjacency List representation.
 */
export function getAdjacencyList(graph: GraphData): AdjacencyListEntry[] {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  const list: AdjacencyListEntry[] = activeVertices.map((v) => ({
    vertexId: v.id,
    label: v.label,
    neighbors: [],
  }));

  const listMap = new Map<string, AdjacencyListEntry>();
  list.forEach((entry) => listMap.set(entry.vertexId, entry));

  for (const edge of activeEdges) {
    const src = listMap.get(edge.source);
    const tgt = listMap.get(edge.target);
    const tgtNode = vMap.get(edge.target);
    const srcNode = vMap.get(edge.source);

    if (src && tgtNode) {
      src.neighbors.push({
        targetId: edge.target,
        targetLabel: tgtNode.label,
        weight: edge.weight,
        edgeId: edge.id,
      });
    }

    if (!graph.isDirected && tgt && srcNode && edge.source !== edge.target) {
      tgt.neighbors.push({
        targetId: edge.source,
        targetLabel: srcNode.label,
        weight: edge.weight,
        edgeId: edge.id,
      });
    }
  }

  return list;
}

/**
 * Computes vertex degrees, in-degrees, and out-degrees.
 */
export function computeDegrees(graph: GraphData) {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);

  const degrees: Record<string, number> = {};
  const inDegrees: Record<string, number> = {};
  const outDegrees: Record<string, number> = {};

  activeVertices.forEach((v) => {
    degrees[v.id] = 0;
    inDegrees[v.id] = 0;
    outDegrees[v.id] = 0;
  });

  for (const edge of activeEdges) {
    if (degrees[edge.source] !== undefined) {
      outDegrees[edge.source] = (outDegrees[edge.source] || 0) + 1;
      degrees[edge.source] = (degrees[edge.source] || 0) + 1;
    }
    if (degrees[edge.target] !== undefined) {
      inDegrees[edge.target] = (inDegrees[edge.target] || 0) + 1;
      if (!graph.isDirected && edge.source !== edge.target) {
        degrees[edge.target] = (degrees[edge.target] || 0) + 1;
      }
    }
  }

  const isolatedVertices = activeVertices
    .filter((v) => degrees[v.id] === 0)
    .map((v) => v.id);

  const pendantVertices = activeVertices
    .filter((v) => degrees[v.id] === 1)
    .map((v) => v.id);

  // Handshaking theorem: sum of degrees in undirected graph = 2 * |E|
  const handshakingSum = Object.values(degrees).reduce((acc, d) => acc + d, 0);
  const handshakingExpected = 2 * activeEdges.length;
  const handshakingHolds = graph.isDirected
    ? Object.values(inDegrees).reduce((acc, d) => acc + d, 0) === activeEdges.length
    : handshakingSum === handshakingExpected;

  return {
    degrees,
    inDegrees,
    outDegrees,
    isolatedVertices,
    pendantVertices,
    handshakingSum,
    handshakingExpected,
    handshakingHolds,
  };
}

/**
 * Classifies graph mathematical properties.
 */
export function classifyGraph(
  graph: GraphData,
  degrees: Record<string, number>,
  isConnected: boolean
): GraphTypeInfo {
  const n = graph.vertices.filter((v) => !v.disabled).length;
  const m = graph.edges.filter((e) => !e.disabled).length;

  const isNull = m === 0;
  const degValues = Object.values(degrees);
  const isRegular =
    n > 0 && degValues.length === n && degValues.every((d) => d === degValues[0]);
  const regularDegree = isRegular && n > 0 ? degValues[0] : undefined;

  // Complete graph: K_n has n*(n-1)/2 edges in undirected, or each vertex degree is n-1
  const isComplete =
    !graph.isDirected && n > 1 && m === (n * (n - 1)) / 2 && isRegular && regularDegree === n - 1;

  // Tree: connected and |E| = |V| - 1
  const isTree = isConnected && m === n - 1;

  const isWeighted = graph.edges.some((e) => e.weight !== 1 && e.weight !== 0);

  return {
    isDirected: graph.isDirected,
    isNull,
    isComplete,
    isRegular,
    regularDegree,
    isTree,
    isWeighted,
  };
}
