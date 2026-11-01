import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  PlusCircle,
  RefreshCw,
  XCircle
} from "lucide-react";
import { api } from "../../services/api";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await api.getHealth();
      setApiOnline(res.status === "healthy");
    } catch (e) {
      setApiOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Executive Underwriting Dashboard",
      subtitle: "Portfolio health, model KPI metrics, and real-time approval rates"
    },
    predict: {
      title: "Instant Credit Card Evaluation",
      subtitle: "Predict creditworthiness with Logistic Regression & factor explanation"
    },
    batch: {
      title: "Batch Applicant Processing",
      subtitle: "Upload applicant spreadsheets for bulk credit evaluation and analytics"
    },
    analytics: {
      title: "Model Performance & GridSearchCV",
      subtitle: "Confusion matrix, ROC-AUC curve, hyperparameter search, and coefficient odds"
    },
    dataset: {
      title: "UCI Credit Dataset Explorer",
      subtitle: "690 records, feature distributions, missing value handling, and custom training"
    },
    history: {
      title: "Underwriting Audit History",
      subtitle: "Persistent SQLite decision logs, searchable records, and CSV export"
    },
    deployment: {
      title: "System Architecture & Live Deployment",
      subtitle: "Cloud architecture, production configuration, and live endpoints"
    }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0A0F1D]/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
      <div>
        <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          {current.title}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Backend Badge */}
        <div
          onClick={checkStatus}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
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
              <span className="text-[11px] font-semibold text-emerald-400">FastAPI Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <XCircle className="size-3.5 text-rose-500" />
              <span className="text-[11px] font-semibold text-rose-400">API Offline</span>
            </div>
          )}
        </div>

        {/* GitHub Repo Button */}
        <a
          href="https://github.com/AlokXCreate/creditiq-credit-card-approval-prediction"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <PlusCircle className="size-3.5" />
            <span>New Application</span>
          </button>
        )}
      </div>
    </header>
  );
};
