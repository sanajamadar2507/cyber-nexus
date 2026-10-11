import { GraphData, ResilienceReport, ResilienceFactor, ResilienceRecommendation } from "@/types/graph";
import { computeDegrees } from "@/lib/algorithms/graph-basics";
import { getConnectedComponents, findCutComponents } from "@/lib/algorithms/connectivity";

/**
 * Computes a transparent, deterministic rule-based Demonstration Resilience Score (0 - 100).
 * Based strictly on mathematical graph invariants: connectivity, articulation points, bridges, and degree redundancy.
 */
export function calculateResilienceReport(graph: GraphData): ResilienceReport {
  const activeVertices = graph.vertices.filter((v) => !v.disabled);
  const activeEdges = graph.edges.filter((e) => !e.disabled);
  const n = activeVertices.length;
  const m = activeEdges.length;

  if (n === 0) {
    return {
      score: 0,
      riskLevel: "CRITICAL",
      connectivityState: "Severely Segmented",
      cutVertexCount: 0,
      bridgeCount: 0,
      redundancyRatio: 0,
      scoreFormula: "Score = 0 (Empty graph)",
      factors: [],
      insights: ["Network has zero active nodes."],
      recommendations: [],
    };
  }

  const { degrees, pendantVertices, isolatedVertices } = computeDegrees(graph);
  const components = getConnectedComponents(graph);
  const compCount = components.length;

  const { cutVertices, bridges } = findCutComponents(graph);
  const cutCount = cutVertices.length;
  const bridgeCount = bridges.length;

  // Base score 100
  let score = 100;
  const factors: ResilienceFactor[] = [];

  // Factor 1: Graph Connectivity
  if (compCount > 1) {
    const penalty = Math.min(45, (compCount - 1) * 20);
    score -= penalty;
    factors.push({
      name: "Network Partitioning",
      value: `${compCount} isolated components`,
      impact: `-${penalty} pts`,
      weight: 30,
      points: -penalty,
    });
  } else {
    factors.push({
      name: "Global Connectivity",
      value: "1 connected component (Complete Path Existence)",
      impact: "+0 pts (Optimal)",
      weight: 30,
      points: 0,
    });
  }

  // Factor 2: Articulation / Cut Vertices
  if (cutCount > 0) {
    const penalty = Math.min(30, cutCount * 8);
    score -= penalty;
    factors.push({
      name: "Cut / Articulation Vertices",
      value: `${cutCount} single points of failure`,
      impact: `-${penalty} pts`,
      weight: 25,
      points: -penalty,
    });
  } else {
    factors.push({
      name: "Biconnectivity (No Cut Vertices)",
      value: "0 articulation vertices (κ(G) ≥ 2)",
      impact: "+10 pts",
      weight: 25,
      points: 10,
    });
    score = Math.min(100, score + 10);
  }

  // Factor 3: Bridges / Cut Edges
  if (bridgeCount > 0) {
    const penalty = Math.min(25, bridgeCount * 6);
    score -= penalty;
    factors.push({
      name: "Bridges (Critical Links)",
      value: `${bridgeCount} links with no parallel paths`,
      impact: `-${penalty} pts`,
      weight: 25,
      points: -penalty,
    });
  } else {
    factors.push({
      name: "Edge 2-Connectivity",
      value: "0 bridges (λ(G) ≥ 2, cycle-redundant)",
      impact: "+8 pts",
      weight: 25,
      points: 8,
    });
    score = Math.min(100, score + 8);
  }

  // Factor 4: Edge-to-Vertex Redundancy Ratio (m / n)
  const redundancyRatio = Number((m / Math.max(1, n)).toFixed(2));
  if (redundancyRatio >= 1.5) {
    const bonus = 8;
    score = Math.min(100, score + bonus);
    factors.push({
      name: "Mesh Density / Path Redundancy",
      value: `Ratio |E|/|V| = ${redundancyRatio} (High redundancy)`,
      impact: `+${bonus} pts`,
      weight: 10,
      points: bonus,
    });
  } else if (redundancyRatio < 1.0) {
    const penalty = 12;
    score -= penalty;
    factors.push({
      name: "Sub-Tree Sparsity",
      value: `Ratio |E|/|V| = ${redundancyRatio} (Under-connected)`,
      impact: `-${penalty} pts`,
      weight: 10,
      points: -penalty,
    });
  }

  // Factor 5: Pendant & Isolated Nodes
  if (pendantVertices.length > 0 || isolatedVertices.length > 0) {
    const penalty = Math.min(15, (pendantVertices.length + isolatedVertices.length * 2) * 3);
    score -= penalty;
    factors.push({
      name: "End-Device Exposure (Degree ≤ 1)",
      value: `${pendantVertices.length} pendant + ${isolatedVertices.length} isolated`,
      impact: `-${penalty} pts`,
      weight: 10,
      points: -penalty,
    });
  }

  // Clamp score
  score = Math.max(10, Math.min(100, Math.round(score)));

  // Risk Level
  let riskLevel: ResilienceReport["riskLevel"] = "LOW";
  if (score < 45) riskLevel = "CRITICAL";
  else if (score < 65) riskLevel = "ELEVATED";
  else if (score < 80) riskLevel = "MODERATE";

  // Connectivity State
  let connectivityState: ResilienceReport["connectivityState"] = "Fully Connected";
  if (compCount > 2) connectivityState = "Severely Segmented";
  else if (compCount === 2) connectivityState = "Partially Partitioned";

  // Insights derived directly from graph properties
  const insights: string[] = [];
  const vMap = new Map(activeVertices.map((v) => [v.id, v]));

  // Concentration nodes (degree >= 4 or max degree)
  const maxDegVertexId = Object.entries(degrees).sort((a, b) => b[1] - a[1])[0];
  if (maxDegVertexId && maxDegVertexId[1] >= 3) {
    const vLabel = vMap.get(maxDegVertexId[0])?.label || maxDegVertexId[0];
    insights.push(`Node "${vLabel}" acts as a traffic concentration hub with high degree (${maxDegVertexId[1]} links).`);
  }

  if (cutCount > 0) {
    const cutLabels = cutVertices.slice(0, 3).map((id) => vMap.get(id)?.label || id).join(", ");
    insights.push(
      `Detected ${cutCount} Articulation Cut Vertices (${cutLabels}${cutCount > 3 ? "..." : ""}). Failure of any of these immediately partitions the topology.`
    );
  } else {
    insights.push("Graph is 2-connected: no single vertex failure will partition the network.");
  }

  if (bridgeCount > 0) {
    insights.push(
      `Network possesses ${bridgeCount} Bridge links. Packet routing across these edges lacks failover redundancy.`
    );
  } else {
    insights.push("Zero bridge links detected: every edge is contained within at least one cycle.");
  }

  if (pendantVertices.length > 0) {
    insights.push(
      `${pendantVertices.length} endpoints are singly-homed pendant nodes (degree = 1), vulnerable to immediate link detachment.`
    );
  }

  // Deterministic Recommendations
  const recommendations: ResilienceRecommendation[] = [];

  if (cutCount > 0) {
    const primeCut = cutVertices[0];
    const primeLabel = vMap.get(primeCut)?.label || primeCut;
    recommendations.push({
      id: "rec-cut",
      priority: "HIGH",
      title: `Eliminate Single Point of Failure at ${primeLabel}`,
      detail: `Add a cross-connect between the two subnets separated by ${primeLabel} to form a cycle and eliminate this articulation point.`,
      mathReason: `Increases vertex connectivity κ(G) from 1 to ≥ 2 by eliminating the 1-vertex cut set.`,
    });
  }

  if (bridgeCount > 0) {
    recommendations.push({
      id: "rec-bridge",
      priority: "HIGH",
      title: `Reinforce ${bridgeCount} Critical Bridge Link(s)`,
      detail: `Deploy secondary redundant links in parallel with identified bridges to prevent edge partition.`,
      mathReason: `Increases edge connectivity λ(G) so that min-cut capacity exceeds 1.`,
    });
  }

  if (redundancyRatio < 1.3 && n >= 4) {
    recommendations.push({
      id: "rec-mesh",
      priority: "MEDIUM",
      title: "Establish Alternate Routing Ring",
      detail: `Construct an auxiliary link between perimeter routers or edge switches to enhance multi-path routing options.`,
      mathReason: `Generates additional fundamental cycles C_k, lowering diameter and average shortest path cost.`,
    });
  }

  if (pendantVertices.length > 2) {
    recommendations.push({
      id: "rec-dual-home",
      priority: "LOW",
      title: "Dual-Home Mission-Critical Workstations",
      detail: `Connect key servers or workstations to an alternate secondary switch to avoid leaf isolation.`,
      mathReason: `Elevates vertex degree deg(v) from 1 (pendant) to 2, removing vulnerability to single link drops.`,
    });
  }

  return {
    score,
    riskLevel,
    connectivityState,
    cutVertexCount: cutCount,
    bridgeCount,
    redundancyRatio,
    scoreFormula: `Score = max(10, min(100, 100 - Penalties + Bonuses))`,
    factors,
    insights,
    recommendations,
  };
}
