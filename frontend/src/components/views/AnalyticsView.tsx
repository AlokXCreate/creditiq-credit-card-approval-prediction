import React, { useEffect, useState } from "react";
import {
  LineChart,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  BarChart3
} from "lucide-react";
import { api } from "../../services/api";
import type { ModelMetrics } from "../../services/api";
import { BorderBeam } from "../magicui/BorderBeam";

export const AnalyticsView: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getMetrics();
      setMetrics(data);
    } catch (e) {
      console.error("Failed to load metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainMsg(null);
    try {
      const res = await api.triggerRetrain();
      setRetrainMsg(res.message || "Model retrained and tuned with GridSearchCV successfully!");
      await loadMetrics();
    } catch (err: any) {
      setRetrainMsg(`Retraining failed: ${err.message}`);
    } finally {
      setRetraining(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="size-6 animate-spin text-emerald-400 mr-2" />
        <span>Loading Machine Learning Analytics & GridSearchCV results...</span>
      </div>
    );
  }

  const m = metrics.metrics;
  const cm = metrics.confusion_matrix;
  const totalTest = cm.true_negatives + cm.false_positives + cm.false_negatives + cm.true_positives;

  // Build SVG path for ROC Curve
  const rocPoints = metrics.roc_curve || [];
  const svgWidth = 320;
  const svgHeight = 220;
  const padding = 25;

  const pointsString = rocPoints
    .map((p) => {
      const x = padding + p.fpr * (svgWidth - 2 * padding);
      const y = svgHeight - padding - p.tpr * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Top Banner with Model Info and Retrain Action */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden shadow-xl">
        <BorderBeam size={220} duration={8} colorFrom="#6366F1" colorTo="#10B981" />
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Cpu className="size-3.5" />
            <span>Algorithm: {metrics.algorithm}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Logistic Regression Model Diagnostic Suite
          </h2>
          <p className="text-xs text-slate-400">
            Tuned with 5-Fold Stratified Cross-Validation on UCI Credit Dataset ({metrics.train_samples} train / {metrics.test_samples} test samples).
            Trained at: <span className="text-slate-300 font-medium">{metrics.trained_at}</span>
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${retraining ? "animate-spin" : ""}`} />
          <span>{retraining ? "Executing GridSearchCV..." : "Re-train & Tune Model"}</span>
        </button>
      </div>

      {retrainMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{retrainMsg}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Accuracy
          </span>
          <span className="text-2xl font-black text-white mt-1 block">
            {(m.accuracy * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Out-of-sample test</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            ROC-AUC Score
          </span>
          <span className="text-2xl font-black text-purple-400 mt-1 block">
            {m.roc_auc.toFixed(4)}
          </span>
          <span className="text-[10px] text-purple-400/80 mt-1 block">Discrimination power</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            F1 Score
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {m.f1_score.toFixed(4)}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Harmonic mean</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Precision
          </span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">
            {(m.precision * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">True approval quality</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Recall (Sensitivity)
          </span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {(m.recall * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Credit capture rate</span>
        </div>
      </div>

      {/* Row: Confusion Matrix + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="size-4 text-emerald-400" />
              <span>Confusion Matrix (N = {totalTest} Test Instances)</span>
            </h3>
            <span className="text-xs text-slate-400">Predicted vs Actual</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* True Negative */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                True Negatives (TN)
              </span>
              <span className="text-3xl font-black text-white mt-1 block">
                {cm.true_negatives}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Correctly Rejected Applicants ({((cm.true_negatives / totalTest) * 100).toFixed(1)}%)
              </span>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
              <span className="text-[11px] font-bold text-rose-400 block uppercase">
                False Positives (FP)
              </span>
              <span className="text-3xl font-black text-white mt-1 block">
                {cm.false_positives}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Type I Underwriting Error ({((cm.false_positives / totalTest) * 100).toFixed(1)}%)
              </span>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center">
              <span className="text-[11px] font-bold text-amber-400 block uppercase">
                False Negatives (FN)
              </span>
              <span className="text-3xl font-black text-white mt-1 block">
                {cm.false_negatives}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Type II Missed Opportunity ({((cm.false_negatives / totalTest) * 100).toFixed(1)}%)
              </span>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                True Positives (TP)
              </span>
              <span className="text-3xl font-black text-white mt-1 block">
                {cm.true_positives}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Correctly Approved Applicants ({((cm.true_positives / totalTest) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* ROC Curve Graph */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LineChart className="size-4 text-purple-400" />
              <span>Receiver Operating Characteristic (ROC)</span>
            </h3>
            <span className="text-xs font-bold text-purple-400">
              AUC = {m.roc_auc.toFixed(4)}
            </span>
          </div>

          <div className="flex justify-center items-center py-2">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              {/* Axes */}
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={svgHeight - padding}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Diagonal baseline (Random Classifier) */}
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={padding}
                stroke="#475569"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* ROC Curve Polyline */}
              <polyline
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
                points={pointsString}
              />

              {/* Axis Labels */}
              <text x={svgWidth / 2} y={svgHeight - 4} fill="#94A3B8" fontSize="10" textAnchor="middle">
                False Positive Rate (1 - Specificity)
              </text>
              <text
                x={-svgHeight / 2}
                y="12"
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
                transform="rotate(-90)"
              >
                True Positive Rate (Sensitivity)
              </text>
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            AUC score of <span className="text-purple-400 font-bold">{m.roc_auc.toFixed(4)}</span> denotes near-optimal separation between approved and default-risk credit applicants.
          </p>
        </div>
      </div>

      {/* Row: GridSearchCV Results & Coefficients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GridSearchCV Optimization Table */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="size-4 text-emerald-400" />
              <span>GridSearchCV Hyperparameter Optimization</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-400">
              Best CV AUC: {metrics.best_cv_roc_auc}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Optimal Selected Hyperparameters</span>
              <span className="text-white font-mono font-bold">
                C: {metrics.best_hyperparameters.C} • Penalty: {metrics.best_hyperparameters.penalty} • Solver: {metrics.best_hyperparameters.solver}
              </span>
            </div>
            <div className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              Rank #1 Best
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-2">C Value</th>
                  <th className="py-2 px-2">Penalty</th>
                  <th className="py-2 px-2">Solver</th>
                  <th className="py-2 px-2 text-right">Mean CV AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(metrics.grid_search_summary || []).map((run, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-2 px-2 font-bold text-slate-200">
                      #{run.rank}
                    </td>
                    <td className="py-2 px-2 font-mono text-slate-300">
                      {run.params.C}
                    </td>
                    <td className="py-2 px-2 font-mono text-slate-300">
                      {run.params.penalty}
                    </td>
                    <td className="py-2 px-2 font-mono text-slate-300">
                      {run.params.solver}
                    </td>
                    <td className="py-2 px-2 text-right font-semibold text-emerald-400">
                      {run.mean_test_roc_auc.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Importance / Coefficients Bar Chart */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="size-4 text-indigo-400" />
              <span>Logistic Regression Feature Weights & Odds Ratios</span>
            </h3>
            <span className="text-xs text-slate-400">Top Factors</span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {(metrics.top_features || []).slice(0, 10).map((feat, i) => {
              const isPos = feat.impact === "Positive";
              const widthPct = Math.min(Math.round((feat.abs_coef / 3.0) * 100), 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-[200px]">
                      {feat.feature}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-slate-400">Odds: {feat.odds_ratio}x</span>
                      <span
                        className={`font-bold ${
                          isPos ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPos ? "+" : ""}{feat.coefficient}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPos ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.max(widthPct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Features with positive coefficients increase approval log-odds (e.g. Clean Default History, High Credit Score, Higher Income). Negative coefficients lower approval probability.
          </p>
        </div>
      </div>
    </div>
  );
};
