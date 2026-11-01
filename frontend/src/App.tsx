import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { DashboardView } from "./components/views/DashboardView";
import { PredictFormView } from "./components/views/PredictFormView";
import { BatchPredictView } from "./components/views/BatchPredictView";
import { AnalyticsView } from "./components/views/AnalyticsView";
import { DatasetView } from "./components/views/DatasetView";
import { HistoryView } from "./components/views/HistoryView";
import { DeploymentView } from "./components/views/DeploymentView";
import { DotPattern } from "./components/magicui/DotPattern";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#080C14] text-slate-100">
      {/* MagicUI Subtle Dot Pattern in Background */}
      <DotPattern
        width={30}
        height={30}
        cx={1.5}
        cy={1.5}
        cr={1.2}
        className="opacity-25"
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
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === "dashboard" && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === "predict" && <PredictFormView />}
          {activeTab === "batch" && <BatchPredictView />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "dataset" && <DatasetView />}
          {activeTab === "history" && <HistoryView />}
          {activeTab === "deployment" && <DeploymentView />}

          {/* Footer */}
          <footer className="pt-8 pb-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              <span className="font-semibold text-slate-300">CREDITIQ</span> • Machine Learning Credit Scoring Suite
            </div>
            <div className="flex items-center gap-4">
              <span>Powered by Scikit-Learn • FastAPI • React</span>
              <span>•</span>
              <a
                href="https://github.com/AlokXCreate/creditiq-credit-card-approval-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition"
              >
                GitHub Repository
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
