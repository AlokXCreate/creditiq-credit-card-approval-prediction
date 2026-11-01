import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  FileSpreadsheet,
  LineChart,
  Database,
  History,
  CloudUpload,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: "Overview"
    },
    {
      id: "predict",
      label: "Credit Evaluation",
      icon: CreditCard,
      badge: "ML Realtime"
    },
    {
      id: "batch",
      label: "Batch Scoring",
      icon: FileSpreadsheet,
      badge: "CSV Bulk"
    },
    {
      id: "analytics",
      label: "Model & Tuning",
      icon: LineChart,
      badge: "GridSearch"
    },
    {
      id: "dataset",
      label: "Dataset Explorer",
      icon: Database,
      badge: "UCI 690"
    },
    {
      id: "history",
      label: "Audit History",
      icon: History,
      badge: "SQLite"
    },
    {
      id: "deployment",
      label: "Live Deployment",
      icon: CloudUpload,
      badge: "Live"
    }
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-slate-800 bg-[#0A0F1D]/90 backdrop-blur-xl transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Brand */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="size-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider text-white bg-gradient-to-r from-emerald-400 to-indigo-300 bg-clip-text text-transparent">
                  CREDITIQ
                </span>
                <span className="block text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
                  FinTech ML Suite
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600">
              <ShieldCheck className="size-6 text-white" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex size-7 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider",
                      isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_#10B981]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Spec Badge at Bottom */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="size-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">Scikit-Learn ML</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Logistic Regression with 5-Fold Stratified GridSearchCV (86.2% Test Accuracy)
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-1" title="Logistic Regression Pipeline">
            <Cpu className="size-5 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
