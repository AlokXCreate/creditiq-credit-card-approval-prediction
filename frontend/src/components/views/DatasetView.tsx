import React, { useEffect, useState } from "react";
import {
  Database,
  Upload,
  RefreshCw,
  Table,
  CheckCircle2,
  AlertCircle,
  BarChart2
} from "lucide-react";
import { api } from "../../services/api";

export const DatasetView: React.FC = () => {
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const loadDataset = async () => {
    setLoading(true);
    try {
      const res = await api.getDatasetInfo();
      setDataInfo(res);
    } catch (e) {
      console.error("Failed to load dataset info:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataset();
  }, []);

  const handleUploadCustom = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadMsg(null);
    setUploadErr(null);
    try {
      const res = await api.uploadDatasetAndRetrain(uploadFile);
      setUploadMsg(res.message);
      await loadDataset();
    } catch (e: any) {
      setUploadErr(e.message || "Failed to upload and retrain with dataset.");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !dataInfo) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="size-6 animate-spin text-emerald-400 mr-2" />
        <span>Loading UCI Credit Approval dataset metrics...</span>
      </div>
    );
  }

  const summary = dataInfo.summary || {};
  const numStats = summary.features?.numerical || {};
  const sampleRows = dataInfo.sample_rows || [];

  return (
    <div className="space-y-6">
      {/* Top Dataset Metrics */}
      <div className="rounded-2xl glass-card glass-card-hover p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
              <Database className="size-3.5" />
              <span>UCI Machine Learning Repository Benchmark</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Credit Card Approval Benchmark Dataset (CRX)
            </h2>
            <p className="text-xs text-slate-400">
              690 cross-validated instances, missing values median/mode imputed, normalized continuous features.
            </p>
          </div>

          <button
            onClick={loadDataset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh dataset view"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-card glass-card-hover">
            <span className="text-xs text-slate-400 block font-medium">Total Instances</span>
            <span className="text-2xl font-black text-white">{summary.total_records}</span>
          </div>
          <div className="p-4 rounded-xl glass-card glass-card-hover">
            <span className="text-xs text-slate-400 block font-medium">Historical Approvals</span>
            <span className="text-2xl font-black text-emerald-400">{summary.total_approved}</span>
          </div>
          <div className="p-4 rounded-xl glass-card glass-card-hover">
            <span className="text-xs text-slate-400 block font-medium">Historical Rejections</span>
            <span className="text-2xl font-black text-rose-400">{summary.total_rejected}</span>
          </div>
          <div className="p-4 rounded-xl glass-card glass-card-hover">
            <span className="text-xs text-slate-400 block font-medium">Dataset Approval Rate</span>
            <span className="text-2xl font-black text-indigo-400">{summary.approval_rate}%</span>
          </div>
        </div>
      </div>

      {/* Numerical Attributes Statistics */}
      <div className="rounded-xl glass-card glass-card-hover p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart2 className="size-4 text-emerald-400" />
          <span>Continuous Feature Distributions (Statistical Moments)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Mean</th>
                <th className="py-2.5 px-3">Median</th>
                <th className="py-2.5 px-3">Std Dev</th>
                <th className="py-2.5 px-3">Min</th>
                <th className="py-2.5 px-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {Object.keys(numStats).map((col) => (
                <tr key={col} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">
                    {col}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {numStats[col].mean}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                    {numStats[col].median}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {numStats[col].std}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {numStats[col].min}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {numStats[col].max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Records Table */}
      <div className="rounded-xl glass-card glass-card-hover p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Table className="size-4 text-indigo-400" />
          <span>Training Records Explorer (Top 10 Sample Rows)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-2 px-2">Gender</th>
                <th className="py-2 px-2">Age</th>
                <th className="py-2 px-2">Debt</th>
                <th className="py-2 px-2">Married</th>
                <th className="py-2 px-2">BankCustomer</th>
                <th className="py-2 px-2">Education</th>
                <th className="py-2 px-2">YearsEmployed</th>
                <th className="py-2 px-2">PriorDefault</th>
                <th className="py-2 px-2">CreditScore</th>
                <th className="py-2 px-2">Income</th>
                <th className="py-2 px-2">Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sampleRows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="py-2 px-2 text-slate-300">{row.Gender}</td>
                  <td className="py-2 px-2 text-slate-300">{row.Age}</td>
                  <td className="py-2 px-2 text-slate-300">{row.Debt}</td>
                  <td className="py-2 px-2 text-slate-300">{row.Married}</td>
                  <td className="py-2 px-2 text-slate-300">{row.BankCustomer}</td>
                  <td className="py-2 px-2 text-slate-300">{row.EducationLevel}</td>
                  <td className="py-2 px-2 text-slate-300">{row.YearsEmployed}</td>
                  <td className="py-2 px-2 font-semibold">
                    <span className={row.PriorDefault === "Yes" ? "text-rose-400" : "text-emerald-400"}>
                      {row.PriorDefault}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono text-slate-200">{row.CreditScore}</td>
                  <td className="py-2 px-2 font-mono text-slate-200">${row.Income?.toLocaleString()}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.Approved === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {row.Approved === 1 ? "Approved (1)" : "Rejected (0)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Custom Dataset Section */}
      <div className="rounded-xl glass-card glass-card-hover p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Upload className="size-4 text-emerald-400" />
          <span>Upload Custom Dataset to Retrain Model</span>
        </h3>
        <p className="text-xs text-slate-400">
          Upload your institution's historical credit card application CSV to retrain and re-tune the Logistic Regression pipeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
            }}
            className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />

          <button
            onClick={handleUploadCustom}
            disabled={!uploadFile || uploading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2"
          >
            {uploading ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>Retraining on New Data...</span>
              </>
            ) : (
              <span>Upload & Retrain</span>
            )}
          </button>
        </div>

        {uploadMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{uploadMsg}</span>
          </div>
        )}

        {uploadErr && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{uploadErr}</span>
          </div>
        )}
      </div>
    </div>
  );
};
