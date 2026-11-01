import React, { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  XCircle,
  FileDown,
  AlertCircle,
  RefreshCw,
  Search,
  Download
} from "lucide-react";
import { api } from "../../services/api";
import type { BatchPredictionResponse, PredictionResult } from "../../services/api";
import { generateCreditReportPDF } from "../../services/pdfExport";

export const BatchPredictView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState<number>(0.50);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<BatchPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleProcessBatch = async () => {
    if (!file) {
      setError("Please select a valid CSV spreadsheet first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.predictBatchCSV(file, threshold);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || "Failed to process batch CSV.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      "ApplicantName,Gender,Age,Debt,Married,BankCustomer,EducationLevel,Ethnicity,YearsEmployed,PriorDefault,Employed,CreditScore,DriversLicense,Citizen,ZipCode,Income\n" +
      "Eleanor Vance,Female,38.5,1.25,Married,Yes,Master,White,7.5,No,Yes,810,Yes,ByBirth,94107,95000\n" +
      "Marcus Sterling,Male,26.0,4.5,Single,Yes,Bachelor,Asian,1.8,No,Yes,640,Yes,ByBirth,60601,42000\n" +
      "Julian Hayes,Male,44.0,12.8,Single,No,HighSchool,Latino,0.5,Yes,No,510,No,Temporary,30301,18000\n" +
      "Sophia Chen,Female,31.2,2.1,Married,Yes,Bachelor,Asian,4.2,No,Yes,720,Yes,ByBirth,10001,65000\n" +
      "David Kim,Male,49.0,0.8,Married,Yes,Doctorate,Asian,10.5,No,Yes,790,Yes,ByBirth,98101,120000\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_batch_applicants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = (response?.results || []).filter((r) =>
    (r.applicant_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-emerald-400" />
              <span>Bulk Applicant Underwriting</span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload multi-applicant CSV sheets for instant scoring and portfolio aggregation
            </p>
          </div>

          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="size-3.5 text-emerald-400" />
            <span>Download CSV Template</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl bg-slate-950/60 cursor-pointer transition">
              <Upload className="size-8 text-emerald-400 mb-2" />
              <span className="text-xs font-semibold text-white">
                {file ? file.name : "Choose CSV Spreadsheet or Drag & Drop"}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Supports UCI formatted credit applicant columns
              </span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Batch Decision Cutoff:</span>
                <span className="text-emerald-400 font-bold">{Math.round(threshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <button
              onClick={handleProcessBatch}
              disabled={loading || !file}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>Processing Batch Matrix...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="size-4" />
                  <span>Score Batch Applicants</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Batch Results Output */}
      {response && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Total Processed</span>
              <span className="text-2xl font-black text-white">{response.total_processed}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Approved</span>
              <span className="text-2xl font-black text-emerald-400">{response.total_approved}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Rejected</span>
              <span className="text-2xl font-black text-rose-400">{response.total_rejected}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Approval Ratio</span>
              <span className="text-2xl font-black text-indigo-400">{response.approval_rate}%</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">Batch Evaluation Output</h4>
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter applicant name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Applicant Name</th>
                    <th className="py-2.5 px-3">Approval Prob.</th>
                    <th className="py-2.5 px-3">Decision</th>
                    <th className="py-2.5 px-3">Risk Assessment</th>
                    <th className="py-2.5 px-3">Credit Tier</th>
                    <th className="py-2.5 px-3 text-right">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredResults.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {r.applicant_name}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        {r.approval_percentage}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            r.approved
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {r.approved ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold" style={{ color: r.risk_color }}>
                          {r.risk_level}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {r.credit_tier}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => generateCreditReportPDF(r as PredictionResult)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition inline-flex items-center gap-1"
                        >
                          <FileDown className="size-3" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
