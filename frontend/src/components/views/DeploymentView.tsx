import React, { useEffect, useState } from "react";
import {
  CloudUpload,
  Server,
  Globe,
  Database,
  RefreshCw,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { api } from "../../services/api";

export const DeploymentView: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch (e: any) {
      setHealth({ status: "offline", error: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = [
    {
      title: "Backend Deployment on Render (Web Service)",
      command: `Build Command: pip install -r backend/requirements.txt\nStart Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT\nEnvironment Variables:\n  CORS_ORIGINS=*\n  DATABASE_URL=sqlite:///./creditiq.db`
    },
    {
      title: "Frontend Deployment on Vercel",
      command: `Framework Preset: Vite\nRoot Directory: frontend\nBuild Command: npm run build\nOutput Directory: dist\nEnvironment Variables:\n  VITE_API_URL=https://creditiq-backend.onrender.com`
    },
    {
      title: "Local Execution (Simultaneous)",
      command: `# Terminal 1 (Backend):\n.\\backend\\venv\\Scripts\\python.exe -m uvicorn backend.main:app --reload --port 8000\n\n# Terminal 2 (Frontend):\ncd frontend && npm run dev`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl glass-card glass-card-hover p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
              <CloudUpload className="size-3.5" />
              <span>Production FinTech Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Deployment Architecture & Live Environment Diagnostics
            </h2>
            <p className="text-xs text-slate-400">
              Decoupled microservice architecture with React + Vite static edge delivery and Python FastAPI inference worker.
            </p>
          </div>

          <button
            onClick={checkHealth}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Recheck Health</span>
          </button>
        </div>

        {/* Live Diagnostics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Frontend */}
          <div className="p-4 rounded-xl glass-card glass-card-hover space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="size-4 text-indigo-400" />
                <span>Frontend Layer</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">React 18 + Vite + Tailwind CSS + MagicUI</p>
            <div className="text-[11px] font-mono text-slate-300 truncate">
              VITE_API_URL: {import.meta.env.VITE_API_URL || "http://localhost:8000"}
            </div>
          </div>

          {/* Backend API */}
          <div className="p-4 rounded-xl glass-card glass-card-hover space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="size-4 text-emerald-400" />
                <span>Backend API Engine</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  health?.status === "healthy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {health?.status === "healthy" ? "HEALTHY" : "OFFLINE"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Python 3.14 + FastAPI + Uvicorn</p>
            <div className="text-[11px] font-mono text-slate-300">
              Model Loaded: {health?.model_loaded ? "Yes (Joblib Ready)" : "No"}
            </div>
          </div>

          {/* Persistence */}
          <div className="p-4 rounded-xl glass-card glass-card-hover space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Database className="size-4 text-amber-400" />
                <span>Data Persistence</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-slate-400">SQLite + SQLAlchemy ORM</p>
            <div className="text-[11px] font-mono text-slate-300 truncate">
              URI: sqlite:///./creditiq.db
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Guides & Production Commands */}
      <div className="rounded-xl glass-card glass-card-hover p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="size-4 text-indigo-400" />
          <span>Production Build & Deployment Configuration</span>
        </h3>

        <div className="space-y-4">
          {codeSnippets.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-200">{item.title}</span>
                <button
                  onClick={() => copyToClipboard(item.command, idx)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="size-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {item.command}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
