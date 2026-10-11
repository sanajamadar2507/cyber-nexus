"use client";

import React from "react";
import {
  LayoutDashboard,
  Network,
  Grid,
  BarChart2,
  Route,
  GitFork,
  Binary,
  ShieldAlert,
  BookOpen,
  ListOrdered,
  FileCheck2,
  Workflow,
  Info,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, category: "Core" },
  { id: "lab", label: "Network Lab", icon: Network, badge: "Editor", category: "Core" },
  { id: "representation", label: "Graph Matrices", icon: Grid, category: "Discrete Math" },
  { id: "analysis", label: "Graph Analysis", icon: BarChart2, category: "Discrete Math" },
  { id: "security", label: "Structural Security", icon: ShieldAlert, badge: "Cuts", category: "Analysis" },
  { id: "routing", label: "Routing (Dijkstra)", icon: Route, category: "Algorithms" },
  { id: "mst", label: "Spanning Trees (MST)", icon: GitFork, category: "Algorithms" },
  { id: "trees", label: "Tree Lab & Traversal", icon: Binary, category: "Algorithms" },
  { id: "resilience", label: "Cyber Resilience Lab", icon: ShieldAlert, badge: "Signature", category: "Simulation" },
  { id: "concepts", label: "DM Concepts", icon: BookOpen, category: "Academic" },
  { id: "algorithms", label: "Algorithm Steps", icon: ListOrdered, category: "Academic" },
  { id: "methodology", label: "Project Methodology", icon: Workflow, category: "Academic" },
  { id: "syllabus", label: "Syllabus Alignment", icon: FileCheck2, category: "Academic" },
  { id: "about", label: "About Project", icon: Info, category: "Academic" },
];

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-cyber-950/95 backdrop-blur-md border-r border-slate-800 transition-transform duration-300 overflow-y-auto flex flex-col justify-between ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            System Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-mono rounded ${
                      item.badge === "Signature"
                        ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Academic Course Badge at Sidebar Bottom */}
        <div className="p-3 m-3 rounded-lg bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Discrete Mathematics
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Second Year Engg Course Project (Graph Theory & Trees).
          </p>
        </div>
      </aside>
    </>
  );
}
