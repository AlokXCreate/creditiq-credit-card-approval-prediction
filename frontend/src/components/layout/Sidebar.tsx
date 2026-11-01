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
  ShieldCheck,
  Sparkles
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
  setCollapsed,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: "Core",
    },
    {
      id: "predict",
      label: "Credit Evaluation",
      icon: CreditCard,
      badge: "Realtime",
    },
    {
      id: "batch",
      label: "Batch Scoring",
      icon: FileSpreadsheet,
      badge: "Bulk",
    },
    {
      id: "analytics",
      label: "Model & Tuning",
      icon: LineChart,
      badge: "GridSearch",
    },
    {
      id: "dataset",
      label: "Dataset Explorer",
      icon: Database,
      badge: "UCI 690",
    },
    {
      id: "history",
      label: "Audit Ledger",
      icon: History,
      badge: "SQLite",
    },
    {
      id: "deployment",
      label: "Live Architecture",
      icon: CloudUpload,
      badge: "Cloud",
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-white/5 bg-[#060A16]/85 backdrop-blur-2xl transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex h-20 items-center justify-between px-4 border-b border-white/5">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 shadow-[0_0_25px_rgba(16,185,129,0.35)] p-[1.5px]">
                <div className="size-full rounded-2xl bg-[#070D1B] flex items-center justify-center">
                  <ShieldCheck className="size-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-wider text-white">
                    CREDIT
                  </span>
                  <span className="font-black text-xl tracking-wider text-emerald-400">
                    IQ
                  </span>
                </div>
                <span className="block text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  FINTECH ML SUITE
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-lg">
              <ShieldCheck className="size-6 text-white" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex size-7 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition border border-white/5"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all group relative cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-300 border border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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
                  <span className="flex-1 text-left tracking-wide whitespace-nowrap">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-emerald-500/25 text-emerald-300"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_12px_#10B981]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Specs Card at Bottom */}
      <div className="p-3 border-t border-white/5">
        {!collapsed ? (
          <div className="rounded-2xl bg-gradient-to-br from-[#0B1224] to-[#070D1B] border border-white/10 p-3.5 space-y-2 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu className="size-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Logistic Regression
                </span>
              </div>
              <Sparkles className="size-3 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              5-Fold Stratified GridSearchCV (86.2% Accuracy, 0.9636 ROC-AUC).
            </p>
            <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-emerald-400 font-bold border-t border-white/5">
              <span>PENALTY: L1</span>
              <span>C = 1.0</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2" title="Model Intelligence Active">
            <Cpu className="size-5 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
