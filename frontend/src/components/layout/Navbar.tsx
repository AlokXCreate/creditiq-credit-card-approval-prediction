import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  RefreshCw,
  XCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { api } from "../../services/api";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onReplayIntro,
}) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await api.getHealth();
      setApiOnline(res.status === "healthy");
    } catch {
      setApiOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const titles: Record<string, { title: string; subtitle: string; icon: string }> = {
    dashboard: {
      title: "Executive Underwriting Command Center",
      subtitle: "Real-time portfolio credit risk telemetry and active underwriting distribution",
      icon: "📊"
    },
    predict: {
      title: "Instant Algorithmic Credit Evaluation",
      subtitle: "Calibrated Logistic Regression inference with dynamic factor explainability",
      icon: "⚡"
    },
    batch: {
      title: "High-Volume Batch Applicant Scoring",
      subtitle: "Parallel spreadsheet ingestion and bulk credit risk matrix processing",
      icon: "📂"
    },
    analytics: {
      title: "Model Intelligence & Hyperparameter Matrix",
      subtitle: "5-Fold Stratified GridSearchCV diagnostics, ROC-AUC curve, and log-odds",
      icon: "📈"
    },
    dataset: {
      title: "UCI Credit Screening Repository",
      subtitle: "690 benchmark records, statistical feature moments, and live dataset training",
      icon: "🗄️"
    },
    history: {
      title: "Institutional Audit & Decision Ledger",
      subtitle: "Immutable SQLite decision persistence, full-text search, and compliance export",
      icon: "📜"
    },
    deployment: {
      title: "Distributed Cloud Architecture & Telemetry",
      subtitle: "Production edge delivery specifications, health probes, and live environments",
      icon: "🚀"
    }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-[#070D1B]/70 backdrop-blur-2xl z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none filter drop-shadow">{current.icon}</span>
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Replay 5-sec Intro Button */}
        <button
          onClick={onReplayIntro}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition shadow-sm"
          title="Replay 5-second dynamic opening animation"
        >
          <Sparkles className="size-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="hidden sm:inline">Intro Animation</span>
        </button>

        {/* Live Backend Badge */}
        <div
          onClick={checkStatus}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
          title="Click to recheck API status"
        >
          {apiOnline === null || checking ? (
            <RefreshCw className="size-3.5 text-slate-400 animate-spin" />
          ) : apiOnline ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400">FastAPI Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <XCircle className="size-3.5 text-rose-500" />
              <span className="text-[11px] font-bold text-rose-400">API Offline</span>
            </div>
          )}
        </div>

        {/* GitHub Repo Button */}
        <a
          href="https://github.com/AlokXCreate/creditiq-credit-card-approval-prediction"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
          <ExternalLink className="size-3 text-slate-400" />
        </a>

        {/* New Application CTA */}
        {activeTab !== "predict" && (
          <button
            onClick={() => setActiveTab("predict")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition active:scale-95"
          >
            <Zap className="size-3.5 fill-current" />
            <span>Score Applicant</span>
          </button>
        )}
      </div>
    </header>
  );
};
