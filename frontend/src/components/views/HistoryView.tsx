import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  Download,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  X
} from "lucide-react";
import { api } from "../../services/api";
import type { HistoryItem } from "../../services/api";
import { generateCreditReportPDF } from "../../services/pdfExport";

export const HistoryView: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(
        search || undefined,
        statusFilter !== "ALL" ? statusFilter : undefined,
        riskFilter !== "ALL" ? riskFilter : undefined,
        100,
        0
      );
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete application #${id}?`)) return;
    try {
      await api.deleteHistoryItem(id);
      loadHistory();
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (e) {
      alert("Failed to delete record.");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear ALL historical underwriting records? This cannot be undone.")) return;
    try {
      await api.clearHistory();
      loadHistory();
      setSelectedItem(null);
    } catch (e) {
      alert("Failed to clear records.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="size-5 text-emerald-400" />
              <span>Underwriting Audit Trail & Application History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Persistent SQLite audit storage ({total} total decisions logged)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={api.getExportHistoryUrl()}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
            >
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold transition"
            >
              <Trash2 className="size-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-2 relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant name, tier, or education..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </form>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Decisions</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="LOW">Low Risk (Prime)</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="HIGH">High Risk (Subprime)</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin text-emerald-400" />
            <span>Loading application records...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No application records match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Date / ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Credit Score</th>
                  <th className="py-2.5 px-3">Income / Debt</th>
                  <th className="py-2.5 px-3">Prior Default</th>
                  <th className="py-2.5 px-3">Decision</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      #{app.id} <span className="text-[10px] block text-slate-400">{app.created_at?.split(" ")[0]}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {app.applicant_name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {app.age} yrs • {app.gender}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-200">
                      {app.credit_score}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      ${app.income.toLocaleString()}
                      <span className="block text-[10px] text-slate-400">
                        Debt: {app.debt}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      <span className={app.prior_default === "Yes" ? "text-rose-400" : "text-emerald-400"}>
                        {app.prior_default}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
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
                    <td className="py-2.5 px-3 font-bold text-slate-200">
                      {app.approval_percentage}%
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: app.risk_color || (app.approved ? "#10B981" : "#EF4444") }}
                      >
                        {app.risk_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItem(app)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="View Details"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          onClick={() => generateCreditReportPDF(app)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Download PDF"
                        >
                          <FileText className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id!)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Application Record #{selectedItem.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedItem.applicant_name}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Decision Status</span>
                <span className={`font-bold ${selectedItem.approved ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedItem.status} ({selectedItem.approval_percentage}%)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Risk Tier</span>
                <span className="font-bold text-slate-200">{selectedItem.risk_level}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Credit Score</span>
                <span className="font-bold text-slate-200">{selectedItem.credit_score}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Annual Income</span>
                <span className="font-bold text-slate-200">${selectedItem.income.toLocaleString()}</span>
              </div>
            </div>

            {selectedItem.factors && selectedItem.factors.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Decision Factors</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedItem.factors.map((f, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
                      <span className={`font-bold ${f.impact === "Positive" ? "text-emerald-400" : "text-rose-400"}`}>
                        [{f.impact}] {f.factor}
                      </span>
                      <p className="text-slate-400 mt-0.5">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => generateCreditReportPDF(selectedItem)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="size-3.5" />
                <span>Download PDF Report</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
