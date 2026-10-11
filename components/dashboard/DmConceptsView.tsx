"use client";

import React, { useState } from "react";
import { BookOpen, Search, Sparkles, HelpCircle, Code } from "lucide-react";

interface ConceptItem {
  id: string;
  name: string;
  category: "Graph Theory" | "Trees" | "Algebraic Representation" | "Algorithms";
  definition: string;
  mathNotation: string;
  networkInterpretation: string;
  cyberImplication: string;
  example: string;
}

export const CONCEPTS_DATA: ConceptItem[] = [
  {
    id: "sets_relations",
    name: "Sets & Relations",
    category: "Algebraic Representation",
    definition: "A graph G = (V, E) is defined where V is a non-empty set of vertices and E ⊆ V × V is a binary relation of edges.",
    mathNotation: "G = (V, E), E ⊆ { {u, v} | u, v ∈ V }",
    networkInterpretation: "V represents the set of all IP devices (routers, hosts). E is the relation 'device u communicates directly with device v'.",
    cyberImplication: "Access control lists (ACLs) and firewall egress matrices define relation subsets R ⊆ V × V.",
    example: "V = {R1, R2, S1}, E = {(R1, R2), (R2, S1)}",
  },
  {
    id: "graphs",
    name: "Graphs (Simple & Multigraphs)",
    category: "Graph Theory",
    definition: "A mathematical structure consisting of discrete objects where some pairs are connected by links.",
    mathNotation: "|V| = n, |E| = m",
    networkInterpretation: "The computer network topology map.",
    cyberImplication: "Network modeling enables formal verification of security boundaries and path isolation.",
    example: "An enterprise LAN modeled as an undirected simple graph without self-loops.",
  },
  {
    id: "adj_matrix",
    name: "Adjacency Matrix",
    category: "Algebraic Representation",
    definition: "A square n × n binary matrix A where A[i][j] = 1 if an edge exists from vertex v_i to vertex v_j, else 0.",
    mathNotation: "A = [a_{ij}], a_{ij} = 1 if (v_i, v_j) ∈ E else 0",
    networkInterpretation: "A comprehensive direct-reachability lookup table between all device pairs.",
    cyberImplication: "Can be multiplied: (A^k)[i][j] gives the exact number of k-hop network paths between hosts i and j.",
    example: "In undirected graphs, A is symmetric: A = Aᵀ. Diagonal entries are 0 for simple graphs.",
  },
  {
    id: "inc_matrix",
    name: "Incidence Matrix",
    category: "Algebraic Representation",
    definition: "An n × m matrix M where rows represent vertices and columns represent edges, indicating incidence.",
    mathNotation: "M = [m_{ve}], m_{ve} = 1 if v is incident on e",
    networkInterpretation: "Maps device interfaces to specific physical cable links and trunk channels.",
    cyberImplication: "Identifies multi-homed routers versus single-port endpoints.",
    example: "Every column in an undirected simple graph incidence matrix sums to exactly 2.",
  },
  {
    id: "degree",
    name: "Vertex Degree & Handshaking Theorem",
    category: "Graph Theory",
    definition: "The number of edges incident to a vertex v. In digraphs, divided into in-degree deg⁻(v) and out-degree deg⁺(v).",
    mathNotation: "∑_{v ∈ V} deg(v) = 2|E|",
    networkInterpretation: "Number of network connections or port density on a switch/router.",
    cyberImplication: "High degree vertices represent traffic concentration hubs and high-value target gateways.",
    example: "If a switch connects 8 servers, deg(v) = 8. Isolated node has deg=0, pendant endpoint has deg=1.",
  },
  {
    id: "paths",
    name: "Paths & Reachability",
    category: "Graph Theory",
    definition: "An alternating sequence of vertices and edges v_0, e_1, v_1, ..., e_k, v_k where all vertices are distinct (simple path).",
    mathNotation: "P = (v_0, v_1, ..., v_k), (v_i, v_{i+1}) ∈ E",
    networkInterpretation: "A multi-hop packet routing path across intermediate routers.",
    cyberImplication: "Path existence confirms network reachability. Path length dictates packet transit latency.",
    example: "Host A → Switch 1 → Router 1 → Server B constitutes a path of length 3.",
  },
  {
    id: "cycles",
    name: "Cycles & Circuit Redundancy",
    category: "Graph Theory",
    definition: "A closed path of length ≥ 3 starting and ending at the same vertex with no repeated intermediate vertices.",
    mathNotation: "C_k = (v_1, v_2, ..., v_k, v_1)",
    networkInterpretation: "A physical ring loop in the switching fabric.",
    cyberImplication: "Provides alternate failover redundancy, but can trigger broadcast storms without spanning tree control.",
    example: "Core Ring: Router 1 — Router 2 — Router 3 — Router 1 forms cycle C_3.",
  },
  {
    id: "connectivity",
    name: "Graph Connectivity & Components",
    category: "Graph Theory",
    definition: "A graph is connected if there is a path between every pair of vertices. Maximal connected subgraphs are components.",
    mathNotation: "κ(G) = min |S| s.t. G \\ S is disconnected or trivial",
    networkInterpretation: "Global connectivity ensures no subnet is quarantined or stranded.",
    cyberImplication: "Network partitioning prevents communication between distributed database nodes or authentication servers.",
    example: "If the WAN gateway drops, the graph decomposes into 2 disconnected components: local LAN and remote internet.",
  },
  {
    id: "vertex_cut",
    name: "Vertex Cut & Articulation Points",
    category: "Graph Theory",
    definition: "A vertex whose removal increases the number of connected components in G.",
    mathNotation: "c(G - {v}) > c(G)",
    networkInterpretation: "Single Point of Failure (SPOF) core router or firewall.",
    cyberImplication: "Targeting an articulation vertex in a cyber attack partitions the network without cutting every wire.",
    example: "A single border router connecting an entire university campus to the national research network.",
  },
  {
    id: "edge_cut",
    name: "Edge Cut & Bridges",
    category: "Graph Theory",
    definition: "An edge whose removal strictly increases the number of connected components in G.",
    mathNotation: "c(G - {e}) > c(G)",
    networkInterpretation: "A single critical transmission link or un-replicated fiber optic backhaul.",
    cyberImplication: "Cutting a bridge link instantly isolates downstream switches.",
    example: "The submarine trunk cable connecting branch office server rack to headquarters.",
  },
  {
    id: "trees",
    name: "Trees & Hierarchical Structures",
    category: "Trees",
    definition: "A connected undirected graph containing no cycles. A tree with n vertices always has exactly n - 1 edges.",
    mathNotation: "|E| = |V| - 1, acyclic and connected",
    networkInterpretation: "A loop-free distribution tree or hierarchical domain directory (LDAP/Active Directory).",
    cyberImplication: "Guarantees exactly one unique simple path between any two devices, preventing packet multiplication.",
    example: "Spine-leaf hierarchical active network without loops.",
  },
  {
    id: "spanning_trees",
    name: "Spanning Trees",
    category: "Trees",
    definition: "A subgraph of G that includes all vertices of G and is a tree.",
    mathNotation: "T = (V, E_T), E_T ⊆ E, |E_T| = |V| - 1",
    networkInterpretation: "The active forwarding topology created by Spanning Tree Protocol (IEEE 802.1D STP).",
    cyberImplication: "Disables redundant backup ports logically until an active bridge link fails.",
    example: "Selecting 6 links out of 10 in a 7-node network to eliminate all loops.",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Algorithms",
    definition: "Greedy algorithm that solves the single-source shortest path problem on non-negative weighted graphs.",
    mathNotation: "O((|V| + |E|) log |V|)",
    networkInterpretation: "The algorithmic engine of OSPF and IS-IS link-state IP routing protocols.",
    cyberImplication: "Finds the fastest route for packet delivery or the lowest-risk path through verified network segments.",
    example: "Iteratively relaxing edge distances from Gateway to Application Server.",
  },
  {
    id: "prim",
    name: "Prim's Algorithm",
    category: "Algorithms",
    definition: "Greedy algorithm that grows a single minimum spanning tree from an arbitrary root by choosing min-weight cut edges.",
    mathNotation: "O(|E| log |V|)",
    networkInterpretation: "Centrally controlled broadcast tree generation starting from a designated root switch.",
    cyberImplication: "Minimizes total cable installation or lease cost across corporate campus sites.",
    example: "Growing tree node-by-node from Root Gateway.",
  },
  {
    id: "kruskal",
    name: "Kruskal's Algorithm",
    category: "Algorithms",
    definition: "Greedy algorithm that constructs an MST by sorting all edges and adding them if they do not create a cycle using Disjoint Sets.",
    mathNotation: "O(|E| log |E|)",
    networkInterpretation: "Distributed minimum cost backbone synthesis without global central root coordination.",
    cyberImplication: "Rejects cycle-forming links using Disjoint Set Union (DSU) to avoid broadcast loop vulnerabilities.",
    example: "Sorting all links by latency, rejecting edges where Find(u) == Find(v).",
  },
];

export default function DmConceptsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredConcepts = CONCEPTS_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.networkInterpretation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
              Discrete Mathematics Curriculum
            </span>
            <span className="text-xs text-slate-400 font-mono">Formal Definitions & Applied Network Models</span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider mt-1">
            DISCRETE MATHEMATICS BEHIND CYBER NEXUS
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Comprehensive reference cards bridging academic discrete structures (Sets, Relations, Graphs, Matrices, Trees) with computer network security engineering.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search DM concept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-48"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Graph Theory">Graph Theory</option>
            <option value="Trees">Trees</option>
            <option value="Algebraic Representation">Algebraic Representation</option>
            <option value="Algorithms">Algorithms</option>
          </select>
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConcepts.map((c) => (
          <div
            key={c.id}
            className="glass-panel p-5 rounded-xl border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {c.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {c.mathNotation}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {c.name}
              </h3>

              {/* Definition */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Discrete Math Definition:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {c.definition}
                </p>
              </div>

              {/* Network Interpretation */}
              <div className="space-y-1 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Network Interpretation:
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  {c.networkInterpretation}
                </p>
              </div>

              {/* Cyber Security Implication */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                  Security & Resilience Impact:
                </span>
                <p className="text-xs text-slate-400 leading-snug">
                  {c.cyberImplication}
                </p>
              </div>
            </div>

            {/* Example */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{c.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
