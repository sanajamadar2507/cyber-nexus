# CYBER NEXUS
### An Intelligent Graph-Based Network Security & Resilience Analysis System

> **Second Year Engineering Discrete Mathematics Course Project**  
> **Domain**: Discrete Mathematics + Network Security & Fault Tolerance  
> **Core Concepts**: Graph Theory, Algebraic Representations, Trees, and Algorithmic Resilience

---

## 1. Overview & Academic Rationale

**CYBER NEXUS** models computer networks as mathematical graphs to analyze topology vulnerabilities, evaluate structural resilience, and discover optimal packet routes using deterministic Discrete Mathematics principles.

Unlike generic dashboards, **every metric, partition score, and routing path is generated dynamically through graph theory invariants and classical algorithms**:

| Discrete Mathematics Concept | Network Engineering Equivalent | Project Implementation |
| :--- | :--- | :--- |
| **Vertex $V$** | Network Device | Workstations, Servers, Routers, Firewalls, Gateways, Databases, IoT |
| **Edge $E$** | Physical/Logical Link | Communication channels with weight $w(e)$ (latency/cost) |
| **Directed Edge $(u, v)$** | Directional Egress | One-way firewall rules / simplex packet channels |
| **Vertex Degree $\deg(v)$** | Port Density | In-degree $\deg^-(v)$, Out-degree $\deg^+(v)$, Handshaking theorem |
| **Adjacency Matrix $A(G)$** | Direct Reachability Matrix | Dynamic $\|V\| \times \|V\|$ lookup matrix with $O(\|V\|^2)$ space |
| **Incidence Matrix $M(G)$** | Device-to-Link Topology | Dynamic $\|V\| \times \|E\|$ mapping with $O(\|V\| \cdot \|E\|)$ space |
| **Adjacency List** | Router Forward-Star Table | Memory-efficient $O(\|V\| + \|E\|)$ neighbor lists |
| **Path $P$ & Reachability** | Packet Route | Simple path enumeration and shortest path finding |
| **Fundamental Cycles $C_k$** | Network Loops / Redundancy | Cycle detection, circuit backup rings, and loop-free trees |
| **Cut / Articulation Vertex** | Single Point of Failure (SPOF) | Tarjan's DFS algorithm ($O(V + E)$) detecting structural bottlenecks |
| **Edge Cut / Bridge** | Critical Backhaul Link | Links whose severance strictly partitions the graph into $\ge 2$ components |
| **Spanning Tree $T$** | Loop-Free Switching (STP) | Tree subgraph connecting all nodes without cycles ($\|E\| = \|V\| - 1$) |
| **Minimum Spanning Tree** | Optimal Infrastructure Cost | Prim's ($O(E \log V)$) & Kruskal's ($O(E \log E)$) algorithms with DSU |
| **Shortest Path** | OSPF Link-State Routing | Dijkstra's algorithm ($O((V + E) \log V)$) with edge relaxation table |
| **Rooted Tree & Traversal** | Hierarchical Network Topology | Tree depth, leaf nodes, Preorder, Postorder, and Binary Tree Inorder demo |

---

## 2. Key Modules

1. **Overview Dashboard**: Key topology metrics, global connectivity state, Handshaking Theorem check, and the Demonstration Resilience Score.
2. **Network Lab (Graph Editor)**: Full interactive topology designer—add/remove nodes and links, edit weights, drag nodes, and load predefined scenarios:
   - *Enterprise Network*
   - *Data Center Spine-Leaf*
   - *Smart Campus IoT*
   - *Vulnerable Network (Single Points of Failure)*
   - *Resilient Multi-Ring Mesh*
3. **Graph Representation**: Dynamic computation and interactive display of:
   - Adjacency Matrix $A(G)$
   - Incidence Matrix $M(G)$
   - Adjacency List $\text{Adj}[v]$
4. **Graph Analysis**: Degree distribution, isolated ($\deg=0$) and pendant ($\deg=1$) nodes, Euler's Handshaking Theorem verification ($\sum \deg(v) = 2|E|$), fundamental cycle detection, and a small-graph ($\le 10$) Hamiltonian Cycle checker.
5. **Network Structural Security**: Tarjan's algorithm identifying articulation cut vertices and bridges, with an interactive before-vs-after component failure analyzer.
6. **Routing Lab (Dijkstra)**: Interactive step-by-step OSPF packet router simulator with step playback, tentative distance tables, visited sets, and algorithmic complexity notes.
7. **Spanning Tree Lab (MST)**: Prim's and Kruskal's step-by-step visualizers with candidate edge sorting, Disjoint Set Union (DSU) cycle rejection animations, and total cost metrics.
8. **Tree Lab**: Conversion to rooted trees, hierarchy depth, parent-child maps, leaf node discovery, and general $k$-ary traversals alongside a mathematically rigorous Binary Tree Inorder demonstration.
9. **Cyber Resilience Lab (Signature Feature)**: Interactive fault injection (Router Failure, Server Crash, Bridge Link Cut, Gateway Outage, Multi-Node Drops, Network Partitions) with before-vs-after component metrics, circular Demonstration Resilience Score gauge ($0-100$), and deterministic rule-based mitigation recommendations.
10. **DM Concepts & Syllabus Alignment**: Academic reference cards mapping discrete math definitions to network models, aligned with Units 1, 5, 6 and Course Outcomes CO1, CO5, CO6.
11. **Algorithm Steps & Explainer**: Presentation-friendly step-by-step trainer for Dijkstra, Prim, Kruskal, BFS, and DFS with "Next Step" controls.
12. **Presentation Mode**: Fullscreen, distraction-free presenter view with enlarged graph, high contrast, slide decks, and mathematical theorem highlights for project viva and seminar evaluations.

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Cyber/Engineering Theme with subtle grid pattern)
- **Icons**: Lucide React
- **Graph Engine**: Custom Interactive SVG Graph Canvas (Zero heavy external graph library dependencies, smooth pan/zoom, draggable nodes, device glyphs, bridge dashed lines, and cut-vertex halos)
- **Architecture**: 100% Client-Side Deterministic Algorithms (No external AI APIs, no databases, no server requirements)

---

## 4. Local Setup & Vercel Deployment

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or yarn

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

### Production Build & Verification
```bash
npm run build
npm run start
```

### Deploy to Vercel
This project is configured specifically for 1-click Vercel deployment:
- No environment variables required
- No database or backend dependencies
- Fully static client-side compilation
- Ready for immediate import via GitHub on [vercel.com](https://vercel.com).

---

## 5. Course Alignment

- **Unit 1 — Set Theory & Relations**: Device sets $V$, binary edge relations $E \subseteq V \times V$, relational matrices.
- **Unit 5 — Graph Theory**: Degree sequences, Handshaking Theorem, paths, cycles, matrices, connectivity, cut vertices, and bridges.
- **Unit 6 — Trees & Traversals**: Acyclic structures, spanning trees, Prim's and Kruskal's algorithms, Dijkstra's algorithm, rooted tree traversals (Preorder, Inorder, Postorder).
- **Course Outcomes**: CO1 (Discrete Structures), CO5 (Graph Applications), CO6 (Tree Structures & Optimizations).
