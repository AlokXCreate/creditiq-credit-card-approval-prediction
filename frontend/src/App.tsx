import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { IntroSplash } from "./components/layout/IntroSplash";
import { FloatingAtmosphere } from "./components/layout/FloatingAtmosphere";
import { ToastContainer } from "./components/layout/Toast";
import type { ToastMessage } from "./components/layout/Toast";
import { DashboardView } from "./components/views/DashboardView";
import { PredictFormView } from "./components/views/PredictFormView";
import { BatchPredictView } from "./components/views/BatchPredictView";
import { AnalyticsView } from "./components/views/AnalyticsView";
import { DatasetView } from "./components/views/DatasetView";
import { HistoryView } from "./components/views/HistoryView";
import { DeploymentView } from "./components/views/DeploymentView";
import { DotPattern } from "./components/magicui/DotPattern";

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 5-Seconds Dynamic Opening Intro Splash Screen */}
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      {/* Ambient Floating Orbs & Spotlight Atmosphere */}
      <FloatingAtmosphere />

      {/* Subtle Dot Pattern */}
      <DotPattern
        width={32}
        height={32}
        cx={1.5}
        cy={1.5}
        cr={1.2}
        className="opacity-20 z-0"
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onReplayIntro={() => setShowIntro(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scroll-smooth">
          {activeTab === "dashboard" && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === "predict" && <PredictFormView onShowToast={addToast} />}
          {activeTab === "batch" && <BatchPredictView />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "dataset" && <DatasetView />}
          {activeTab === "history" && <HistoryView />}
          {activeTab === "deployment" && <DeploymentView />}

          {/* Branded Footer */}
          <footer className="pt-8 pb-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-wider">CREDITIQ</span>
              <span>•</span>
              <span>Autonomous Credit Risk & Underwriting Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Scikit-Learn • FastAPI • React 18</span>
              <span>•</span>
              <a
                href="https://github.com/AlokXCreate/creditiq-credit-card-approval-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition font-medium"
              >
                GitHub Repository
              </a>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
