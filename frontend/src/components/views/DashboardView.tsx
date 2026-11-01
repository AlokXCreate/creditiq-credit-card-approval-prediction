import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Users,
  Target,
  FileSpreadsheet,
  LineChart,
  Zap,
  TrendingUp
} from "lucide-react";
import { api } from "../../services/api";
import type { AnalyticsSummary, HistoryItem } from "../../services/api";
import { NumberTicker } from "../magicui/NumberTicker";
import { BorderBeam } from "../magicui/BorderBeam";
import { ShimmerButton } from "../magicui/ShimmerButton";
import { HoloCreditCard } from "../magicui/HoloCreditCard";
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
        api.getHistory(undefined, undefined, undefined, 5, 0),
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
    average_approval_probability: 72.5,
  };

  const riskDist = summary?.risk_distribution || [
    { name: "Low Risk (Prime)", count: 4, color: "#10B981" },
    { name: "Moderate Risk (Near Prime)", count: 1, color: "#F59E0B" },
    { name: "High Risk (Subprime)", count: 2, color: "#EF4444" },
  ];

  const totalRiskCount = riskDist.reduce((acc, r) => acc + r.count, 0) || 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section with Floating 3D Card */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 shadow-2xl">
        <BorderBeam size={280} duration={9} colorFrom="#10B981" colorTo="#6366F1" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Sparkles className="size-3.5 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
              <span>Algorithmic Underwriting Engine Active</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Next-Gen Precision{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Credit Card Approval
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Automated institutional risk assessment combining Scikit-Learn Logistic Regression with 5-Fold Stratified GridSearchCV optimization. Delivering 86.2% accuracy and real-time decision explainability.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ShimmerButton onClick={() => setActiveTab("predict")}>
                <Zap className="size-4" />
                <span>Evaluate New Applicant</span>
              </ShimmerButton>

              <button
                onClick={() => setActiveTab("batch")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition active:scale-95 shadow-lg"
              >
                <FileSpreadsheet className="size-4 text-indigo-400" />
                <span>Upload Batch CSV</span>
              </button>

              <button
                onClick={loadData}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition"
                title="Refresh metrics"
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Right Floating 3D Holographic Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HoloCreditCard
              applicantName="ALEXANDER STERLING"
              creditScore={790}
              tierName="CREDITIQ PLATINUM PRIME"
              approved={true}
            />
          </div>
        </div>
      </div>

      {/* Floating KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Evaluated */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Evaluated Applications</span>
            <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="size-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-white tracking-tight">
            <NumberTicker value={kpis.total_applications} />
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2 pt-3 border-t border-white/5">
            <span className="text-emerald-400 font-bold">{kpis.total_approved} Approved</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{kpis.total_rejected} Rejected</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Approval Rate</span>
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-400 tracking-tight flex items-baseline gap-1">
            <NumberTicker value={kpis.approval_rate} decimalPlaces={1} suffix="%" />
          </div>
          <div className="mt-3 text-xs text-slate-400 pt-3 border-t border-white/5">
            Avg Probability: <span className="text-slate-200 font-bold">{kpis.average_approval_probability}%</span>
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Model Accuracy</span>
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Target className="size-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
            <NumberTicker value={kpis.model_accuracy} decimalPlaces={1} suffix="%" />
          </div>
          <div className="mt-3 text-xs text-slate-400 pt-3 border-t border-white/5 flex justify-between">
            <span>ROC-AUC Score:</span>
            <span className="text-purple-400 font-bold font-mono">{kpis.model_roc_auc}</span>
          </div>
        </div>

        {/* Avg Credit Score */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Avg FICO Rating</span>
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-amber-400 tracking-tight">
            <NumberTicker value={kpis.average_credit_score} />
          </div>
          <div className="mt-3 text-xs text-slate-400 pt-3 border-t border-white/5 flex justify-between">
            <span>Avg Annual Income:</span>
            <span className="text-slate-200 font-bold">${kpis.average_income.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Risk Distribution & Quick Command Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Credit Risk Tier Stratification</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Portfolio</span>
          </div>

          <div className="space-y-4 pt-1">
            {riskDist.map((tier) => {
              const pct = Math.round((tier.count / totalRiskCount) * 100);
              return (
                <div key={tier.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-bold">{tier.name}</span>
                    <span className="text-slate-400 font-mono font-bold">{tier.count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-950 border border-white/5 overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: tier.color,
                        boxShadow: `0 0 12px ${tier.color}60`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-slate-400 leading-relaxed space-y-1.5">
            <p className="font-semibold text-slate-300">Calibrated Risk Classification Rules:</p>
            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-center">
                <span className="font-bold text-emerald-400 block">Prime</span>
                <span className="text-[10px] text-slate-400">≥ 70% Prob</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-center">
                <span className="font-bold text-amber-400 block">Near Prime</span>
                <span className="text-[10px] text-slate-400">40% - 69%</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-center">
                <span className="font-bold text-rose-400 block">Subprime</span>
                <span className="text-[10px] text-slate-400">&lt; 40% Prob</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Command Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: Batch Upload */}
          <div
            onClick={() => setActiveTab("batch")}
            className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg shadow-indigo-500/10">
                <FileSpreadsheet className="size-6" />
              </div>
              <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition">
                Bulk Batch Processing
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ingest multi-applicant CSV files to score entire loan books simultaneously with instant risk tier badges and exportable reports.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <span>Open Batch Terminal</span>
              <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </div>
          </div>

          {/* Card 2: Model Analytics */}
          <div
            onClick={() => setActiveTab("analytics")}
            className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg shadow-emerald-500/10">
                <LineChart className="size-6" />
              </div>
              <h4 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition">
                Model Diagnostics & ROC
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review 5-Fold Stratified Cross-Validation, interactive 2x2 Confusion Matrix, and feature log-odds ratios from GridSearchCV.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>Inspect ML Telemetry</span>
              <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Feed */}
      <div className="glass-card rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white">Latest Underwriting Decisions</h3>
            <p className="text-xs text-slate-400">Real-time decisions generated by the active machine learning engine</p>
          </div>
          <button
            onClick={() => setActiveTab("history")}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition"
          >
            <span>View Full Audit Ledger</span>
            <ArrowUpRight className="size-4" />
          </button>
        </div>

        {recentApps.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No application decisions logged yet. Click "Evaluate New Applicant" above to test the pipeline!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Applicant Name</th>
                  <th className="py-3 px-3">Demographics</th>
                  <th className="py-3 px-3">FICO Score</th>
                  <th className="py-3 px-3">Annual Income</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Decision</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3 text-right">PDF Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      {app.applicant_name}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {app.age} yrs • {app.gender}
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-mono font-bold">
                      {app.credit_score}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">
                      ${app.income.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-200 font-mono">
                      {app.approval_percentage}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                          app.approved
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                        }`}
                      >
                        {app.approved ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: app.risk_color || (app.approved ? "#10B981" : "#EF4444") }}
                      >
                        {app.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => generateCreditReportPDF(app)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-bold transition inline-flex items-center gap-1.5 border border-white/10 active:scale-95"
                      >
                        <FileText className="size-3.5 text-emerald-400" />
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
