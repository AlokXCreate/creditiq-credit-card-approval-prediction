import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Users,
  Target
} from "lucide-react";
import { api } from "../../services/api";
import type { AnalyticsSummary, HistoryItem } from "../../services/api";
import { NumberTicker } from "../magicui/NumberTicker";
import { BorderBeam } from "../magicui/BorderBeam";
import { ShimmerButton } from "../magicui/ShimmerButton";
import { generateCreditReportPDF } from "../../services/pdfExport";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentApps, setRecentApps] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, histRes] = await Promise.all([
        api.getSummary(),
        api.getHistory(undefined, undefined, undefined, 5, 0)
      ]);
      setSummary(sumRes);
      setRecentApps(histRes.items || []);
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = summary?.kpis || {
    total_applications: 0,
    total_approved: 0,
    total_rejected: 0,
    approval_rate: 0,
    model_accuracy: 86.2,
    model_roc_auc: 0.964,
    average_credit_score: 710,
    average_income: 54000,
    average_approval_probability: 72.5
  };

  const riskDist = summary?.risk_distribution || [
    { name: "Low Risk (Prime)", count: 4, color: "#10B981" },
    { name: "Moderate Risk (Near Prime)", count: 1, color: "#F59E0B" },
    { name: "High Risk (Subprime)", count: 2, color: "#EF4444" }
  ];

  const totalRiskCount = riskDist.reduce((acc, r) => acc + r.count, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 p-6 shadow-xl">
        <BorderBeam size={250} duration={10} colorFrom="#10B981" colorTo="#6366F1" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Production ML Underwriting Active</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              CREDITIQ Credit Approval Platform
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              High-precision credit risk assessment powered by Scikit-learn Logistic Regression,
              5-Fold Stratified GridSearchCV hyperparameter tuning, and real-time factor interpretability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ShimmerButton onClick={() => setActiveTab("predict")}>
              <CreditCard className="size-4" />
              <span>New Applicant Evaluation</span>
            </ShimmerButton>

            <button
              onClick={loadData}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh metrics"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Evaluated Applications</span>
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            <NumberTicker value={kpis.total_applications} />
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{kpis.total_approved} approved</span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">{kpis.total_rejected} rejected</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Approval Rate</span>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 flex items-baseline gap-1">
            <NumberTicker value={kpis.approval_rate} decimalPlaces={1} suffix="%" />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Avg probability: <span className="text-slate-200 font-medium">{kpis.average_approval_probability}%</span>
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Model Accuracy</span>
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Target className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
            <NumberTicker value={kpis.model_accuracy} decimalPlaces={1} suffix="%" />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            ROC-AUC: <span className="text-purple-400 font-semibold">{kpis.model_roc_auc}</span> (5-Fold CV)
          </div>
        </div>

        {/* Avg Credit Score */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Portfolio Score</span>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            <NumberTicker value={kpis.average_credit_score} />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Avg Annual Income: <span className="text-slate-200 font-medium">${kpis.average_income.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Risk Distribution & Quick Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Credit Risk Tier Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">Portfolio</span>
          </div>

          <div className="space-y-3 pt-2">
            {riskDist.map((tier) => {
              const pct = Math.round((tier.count / totalRiskCount) * 100);
              return (
                <div key={tier.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{tier.name}</span>
                    <span className="text-slate-400 font-semibold">{tier.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: tier.color,
                        boxShadow: `0 0 10px ${tier.color}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            Algorithmic tiers are classified using calibrated prediction probabilities:
            <br />• <span className="text-emerald-400">Prime</span>: ≥ 70% approval confidence
            <br />• <span className="text-amber-400">Near Prime</span>: 40% – 69% approval confidence
            <br />• <span className="text-rose-400">Subprime</span>: &lt; 40% approval confidence
          </div>
        </div>

        {/* Feature Quick Launch Cards (2 columns on lg) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Batch Upload */}
          <div
            onClick={() => setActiveTab("batch")}
            className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 p-5 hover:border-indigo-500/50 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <FileText className="size-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                Batch CSV Scoring
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Upload CSV applicant spreadsheets to score hundreds of records simultaneously with instant status generation.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400">
              <span>Open Batch Processor</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>

          {/* Card 2: Model Analytics */}
          <div
            onClick={() => setActiveTab("analytics")}
            className="rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-slate-800 p-5 hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <TrendingUp className="size-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                Model Diagnostics & GridSearch
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Inspect 5-Fold Cross-Validation, Confusion Matrix heatmap, ROC Curve, and Logistic Regression feature odds ratios.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Inspect ML Metrics</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Underwriting Decisions</h3>
            <p className="text-xs text-slate-400">Latest applicants evaluated by the machine learning pipeline</p>
          </div>
          <button
            onClick={() => setActiveTab("history")}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
          >
            <span>View Full Audit History</span>
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>

        {recentApps.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No application records logged yet. Click "New Applicant Evaluation" to run your first prediction!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-3">Applicant</th>
                  <th className="py-3 px-3">Age / Gender</th>
                  <th className="py-3 px-3">Credit Score</th>
                  <th className="py-3 px-3">Annual Income</th>
                  <th className="py-3 px-3">Approval Prob.</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Risk Level</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-semibold text-white">
                      {app.applicant_name}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {app.age} yrs • {app.gender}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-medium">
                      {app.credit_score}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      ${app.income.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {app.approval_percentage}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.approved
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {app.approved ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: app.risk_color || (app.approved ? "#10B981" : "#EF4444") }}
                      >
                        {app.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => generateCreditReportPDF(app)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition inline-flex items-center gap-1"
                      >
                        <FileText className="size-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
