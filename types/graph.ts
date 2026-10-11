export type DeviceType =
  | "pc"
  | "server"
  | "router"
  | "firewall"
  | "gateway"
  | "database"
  | "iot";

export interface Vertex {
  id: string;
  label: string;
  type: DeviceType;
  x: number;
  y: number;
  ip?: string;
  subnet?: string;
  disabled?: boolean;
  status?: "normal" | "compromised" | "offline" | "warning";
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  directed: boolean;
  disabled?: boolean;
  latency?: number;
  bandwidth?: string;
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
  isDirected: boolean;
  name?: string;
  description?: string;
}

export interface AdjacencyMatrixData {
  vertexIds: string[];
  labels: string[];
  matrix: number[][];
}

export interface IncidenceMatrixData {
  vertexIds: string[];
  edgeIds: string[];
  matrix: number[][]; // rows: vertices, cols: edges
}

export interface AdjacencyListEntry {
  vertexId: string;
  label: string;
  neighbors: { targetId: string; targetLabel: string; weight: number; edgeId: string }[];
}

export interface GraphTypeInfo {
  isDirected: boolean;
  isNull: boolean;
  isComplete: boolean;
  isRegular: boolean;
  regularDegree?: number;
  isTree: boolean;
  isWeighted: boolean;
  isBipartite?: boolean;
}

export interface AnalysisResult {
  vertexCount: number;
  edgeCount: number;
  degrees: Record<string, number>;
  inDegrees: Record<string, number>;
  outDegrees: Record<string, number>;
  isolatedVertices: string[];
  pendantVertices: string[];
  isConnected: boolean;
  componentCount: number;
  components: string[][];
  cutVertices: string[]; // Articulation points
  bridges: string[]; // Edge IDs
  handshakingSum: number;
  handshakingExpected: number;
  handshakingHolds: boolean;
  graphType: GraphTypeInfo;
}

export interface AlgorithmStep {
  stepNumber: number;
  title: string;
  description: string;
  pseudocodeLine?: number;
  activeVertices?: string[];
  activeEdges?: string[];
  visitedVertices?: string[];
  mstEdges?: string[];
  rejectedEdges?: string[];
  currentEdge?: string;
  tableState?: Record<string, { dist: number | string; prev: string | null; finalized: boolean }>;
  dsuSets?: Record<string, string[]>;
  costSoFar?: number;
  actionType: "init" | "select" | "relax" | "reject" | "accept" | "visit" | "complete";
}

export interface ResilienceFactor {
  name: string;
  value: string | number;
  impact: string;
  weight: number;
  points: number;
}

export interface ResilienceRecommendation {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  detail: string;
  mathReason: string;
}

export interface ResilienceReport {
  score: number; // 0-100
  riskLevel: "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
  connectivityState: "Fully Connected" | "Partially Partitioned" | "Severely Segmented";
  cutVertexCount: number;
  bridgeCount: number;
  redundancyRatio: number;
  scoreFormula: string;
  factors: ResilienceFactor[];
  insights: string[];
  recommendations: ResilienceRecommendation[];
}

export interface FailureSimulationResult {
  targetType: "vertex" | "edge";
  targetId: string;
  targetLabel: string;
  beforeComponents: number;
  afterComponents: number;
  isCritical: boolean;
  lostVertices: string[];
  disconnectedSubnets: string[][];
  resilienceDrop: number;
  mathematicalReason: string;
  recommendation: string;
}

export interface Scenario {
  id: string;
  name: string;
  category: string;
  description: string;
  graph: GraphData;
}
