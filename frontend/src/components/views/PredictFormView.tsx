import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CreditCard,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileDown,
  Sparkles,
  Sliders,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Zap
} from "lucide-react";
import { api } from "../../services/api";
import type { ApplicantPayload, PredictionResult } from "../../services/api";
import { ShimmerButton } from "../magicui/ShimmerButton";
import { BorderBeam } from "../magicui/BorderBeam";
import { HoloCreditCard } from "../magicui/HoloCreditCard";
import { generateCreditReportPDF } from "../../services/pdfExport";

interface PredictFormViewProps {
  onShowToast?: (type: "success" | "error" | "info", title: string, desc?: string) => void;
}

export const PredictFormView: React.FC<PredictFormViewProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState<ApplicantPayload>({
    applicant_name: "Eleanor Vance",
    Gender: "Female",
    Age: 32.5,
    Debt: 2.5,
    Married: "Married",
    BankCustomer: "Yes",
    EducationLevel: "Bachelor",
    Ethnicity: "White",
    YearsEmployed: 4.5,
    PriorDefault: "No",
    Employed: "Yes",
    CreditScore: 740,
    DriversLicense: "Yes",
    Citizen: "ByBirth",
    ZipCode: 94107,
    Income: 75000,
    threshold: 0.50,
    save_to_db: true,
  });

  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSamplePersonas().then(setSamples).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    let val: any = value;
    if (
      type === "number" ||
      name === "Age" ||
      name === "Debt" ||
      name === "YearsEmployed" ||
      name === "CreditScore" ||
      name === "ZipCode" ||
      name === "Income"
    ) {
      val = parseFloat(value) || 0;
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleApplyPersona = (persona: any) => {
    setFormData((prev) => ({
      ...prev,
      applicant_name: persona.applicant_name,
      Gender: persona.Gender,
      Age: persona.Age,
      Debt: persona.Debt,
      Married: persona.Married,
      BankCustomer: persona.BankCustomer,
      EducationLevel: persona.EducationLevel,
      Ethnicity: persona.Ethnicity,
      YearsEmployed: persona.YearsEmployed,
      PriorDefault: persona.PriorDefault,
      Employed: persona.Employed,
      CreditScore: persona.CreditScore,
      DriversLicense: persona.DriversLicense,
      Citizen: persona.Citizen,
      ZipCode: persona.ZipCode,
      Income: persona.Income,
    }));
    setResult(null);
    onShowToast?.("info", "Persona Loaded", `Applied ${persona.applicant_name}'s credentials to the underwriting form.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.predict(formData);
      setResult(res);

      if (res.approved) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10B981", "#6EE7B7", "#6366F1", "#F59E0B"],
        });
        onShowToast?.("success", "Application Approved!", `${res.applicant_name} approved with ${res.approval_percentage}% probability.`);
      } else {
        onShowToast?.("error", "Application Declined", `${res.applicant_name} rejected under risk policy (${res.approval_percentage}%).`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process underwriting prediction");
      onShowToast?.("error", "Prediction Error", err.message || "Backend request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1-Click Persona Pre-fills Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            1-Click Benchmark Personas:
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {samples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPersona(s)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>{s.label.split("(")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                <CreditCard className="size-5 text-emerald-400" />
                <span>Underwriting Candidate Information</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Authentic 15-attribute UCI feature matrix normalized for regularized logistic inference
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs text-slate-300 font-bold">Log to DB</span>
              <input
                type="checkbox"
                checked={formData.save_to_db}
                onChange={(e) => setFormData((p) => ({ ...p, save_to_db: e.target.checked }))}
                className="rounded bg-slate-950 border-white/10 text-emerald-500 focus:ring-emerald-500 size-4"
              />
            </label>
          </div>

          {/* Section 1: Demographics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User className="size-4 text-indigo-400" />
              <span>Personal Identity & Demographics</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Applicant Name
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Age (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Marital Status
                </label>
                <select
                  name="Married"
                  value={formData.Married}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Other">Divorced / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Citizenship
                </label>
                <select
                  name="Citizen"
                  value={formData.Citizen}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ByBirth">Citizen By Birth</option>
                  <option value="ByOtherMeans">Naturalized</option>
                  <option value="Temporary">Temporary Visa</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Education Level
                </label>
                <select
                  name="EducationLevel"
                  value={formData.EducationLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Doctorate">Doctorate / Terminal</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="HighSchool">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Ethnicity Group
                </label>
                <select
                  name="Ethnicity"
                  value={formData.Ethnicity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Asian">Asian</option>
                  <option value="Latino">Latino</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Driver's License
                </label>
                <select
                  name="DriversLicense"
                  value={formData.DriversLicense}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Financial & Employment */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-400" />
              <span>Financial Footprint & Employment</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Annual Income ($)
                </label>
                <input
                  type="number"
                  name="Income"
                  value={formData.Income}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Debt Load Ratio
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="Debt"
                  value={formData.Debt}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Existing Customer
                </label>
                <select
                  name="BankCustomer"
                  value={formData.BankCustomer}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes (Primary Bank Customer)</option>
                  <option value="No">No (New Applicant)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Currently Employed
                </label>
                <select
                  name="Employed"
                  value={formData.Employed}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Years Employed
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="YearsEmployed"
                  value={formData.YearsEmployed}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Zip Code
                </label>
                <input
                  type="number"
                  name="ZipCode"
                  value={formData.ZipCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-white/10 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Credit Risk Drivers */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck className="size-4 text-rose-400" />
              <span>Credit Bureau History & Historical Defaults</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#070D1B] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Prior Default Record</label>
                  <span className="text-[10px] text-amber-400 font-extrabold font-mono">HIGHEST WEIGHT</span>
                </div>
                <select
                  name="PriorDefault"
                  value={formData.PriorDefault}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none transition ${
                    formData.PriorDefault === "Yes"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-300"
                      : "bg-slate-900 border-emerald-500/40 text-emerald-400"
                  }`}
                >
                  <option value="No">No Prior Defaults (Clean Track Record)</option>
                  <option value="Yes">Yes (Prior Delinquency / Default On Record)</option>
                </select>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Clean default records drive high positive log-odds in the model.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070D1B] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Credit Score Rating</label>
                  <span className="text-xs font-black font-mono text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                    {formData.CreditScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="850"
                  step="5"
                  name="CreditScore"
                  value={formData.CreditScore}
                  onChange={handleChange}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>300 (Subprime)</span>
                  <span>670 (Prime)</span>
                  <span>850 (Super-Prime)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cutoff Slider */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sliders className="size-4" />
                <span>Underwriting Cutoff Threshold</span>
              </div>
              <span className="text-xs font-black font-mono text-indigo-300 px-2.5 py-0.5 rounded-md bg-indigo-500/20">
                {Math.round((formData.threshold || 0.50) * 100)}% Confidence
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              className="w-full accent-indigo-400"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              Calibrate the decision boundary between conservative risk mitigation and aggressive portfolio growth.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <ShimmerButton type="submit" disabled={loading} className="w-full py-4 text-sm font-black">
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="size-4 animate-spin text-emerald-400" />
                  <span>Computing Logistic Regression Decision Matrix...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-emerald-400 fill-current" />
                  <span>Execute ML Underwriting Evaluation</span>
                </div>
              )}
            </ShimmerButton>
          </div>
        </form>

        {/* Results & Live 3D Card Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dynamic Floating Holo Card reflecting live inputs */}
          <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Live Cardholder Simulation
            </span>
            <HoloCreditCard
              applicantName={formData.applicant_name}
              creditScore={formData.CreditScore}
              tierName={
                result
                  ? result.credit_tier.toUpperCase()
                  : formData.CreditScore >= 740
                  ? "TIER 1 • PRIME PRIVILEGE"
                  : formData.CreditScore >= 620
                  ? "TIER 2 • NEAR PRIME"
                  : "TIER 3 • REBUILDER"
              }
              approved={result ? result.approved : formData.CreditScore >= 620}
            />
          </div>

          {/* Prediction Result Display */}
          {result && (
            <div className="relative rounded-3xl glass-card p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden animate-float">
              <BorderBeam
                size={240}
                duration={7}
                colorFrom={result.approved ? "#10B981" : "#EF4444"}
                colorTo="#6366F1"
              />

              {/* Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Underwriting Verdict
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{result.applicant_name}</h3>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    result.approved
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  }`}
                >
                  {result.approved ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                  <span>{result.status}</span>
                </div>
              </div>

              {/* Approval Probability Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300">Approval Confidence</span>
                  <span className="text-3xl font-black font-mono text-white">
                    {result.approval_percentage}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-950 border border-white/5 overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.approved
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#10B981]"
                        : "bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_12px_#EF4444]"
                    }`}
                    style={{ width: `${result.approval_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Cutoff: {Math.round(result.threshold_used * 100)}%</span>
                  <span className="font-bold" style={{ color: result.risk_color }}>
                    {result.risk_level} ({result.credit_tier})
                  </span>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Model Decision Explanations
                </h4>
                <div className="space-y-2">
                  {result.factors.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/70 border border-white/5 text-xs flex items-start gap-2.5"
                    >
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase mt-0.5 ${
                          f.impact === "Positive"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {f.impact}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{f.factor}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Advisory Action Steps
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download Report Button */}
              <button
                type="button"
                onClick={() => {
                  generateCreditReportPDF(result);
                  onShowToast?.("success", "PDF Report Downloaded", `Exported underwriting report for ${result.applicant_name}`);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
              >
                <FileDown className="size-4" />
                <span>Download Official Decision PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
