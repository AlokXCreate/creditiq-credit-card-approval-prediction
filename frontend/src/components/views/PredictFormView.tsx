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
  Info,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { api } from "../../services/api";
import type { ApplicantPayload, PredictionResult } from "../../services/api";
import { ShimmerButton } from "../magicui/ShimmerButton";
import { BorderBeam } from "../magicui/BorderBeam";
import { generateCreditReportPDF } from "../../services/pdfExport";

export const PredictFormView: React.FC = () => {
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
    save_to_db: true
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
    if (type === "number" || name === "Age" || name === "Debt" || name === "YearsEmployed" || name === "CreditScore" || name === "ZipCode" || name === "Income") {
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
      Income: persona.Income
    }));
    setResult(null);
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to process evaluation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1-Click Persona Pre-fills Bar */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">1-Click Test Personas:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPersona(s)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 hover:border-emerald-500/50 transition"
            >
              {s.label.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="size-5 text-emerald-400" />
                <span>Credit Applicant Information</span>
              </h3>
              <p className="text-xs text-slate-400">UCI Credit Scoring normalized feature input</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Save to DB:</label>
              <input
                type="checkbox"
                checked={formData.save_to_db}
                onChange={(e) => setFormData((p) => ({ ...p, save_to_db: e.target.checked }))}
                className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 size-4"
              />
            </div>
          </div>

          {/* Section 1: Demographics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="size-3.5 text-indigo-400" />
              <span>Personal & Identity Profile</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Applicant Name</label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Marital Status</label>
                <select
                  name="Married"
                  value={formData.Married}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Other">Divorced / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Citizenship</label>
                <select
                  name="Citizen"
                  value={formData.Citizen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ByBirth">Citizen By Birth</option>
                  <option value="ByOtherMeans">Naturalized</option>
                  <option value="Temporary">Temporary Visa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Education Level</label>
                <select
                  name="EducationLevel"
                  value={formData.EducationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Doctorate">Doctorate / Professional</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="HighSchool">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ethnicity Group</label>
                <select
                  name="Ethnicity"
                  value={formData.Ethnicity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Asian">Asian</option>
                  <option value="Latino">Latino</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Driver's License</label>
                <select
                  name="DriversLicense"
                  value={formData.DriversLicense}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Financial & Employment */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-emerald-400" />
              <span>Financial Standing & Employment</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Annual Income ($)</label>
                <input
                  type="number"
                  name="Income"
                  value={formData.Income}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Debt Ratio</label>
                <input
                  type="number"
                  step="0.1"
                  name="Debt"
                  value={formData.Debt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bank Customer</label>
                <select
                  name="BankCustomer"
                  value={formData.BankCustomer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes (Existing Customer)</option>
                  <option value="No">No (New to Bank)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Currently Employed</label>
                <select
                  name="Employed"
                  value={formData.Employed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Years Employed</label>
                <input
                  type="number"
                  step="0.1"
                  name="YearsEmployed"
                  value={formData.YearsEmployed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Postal Zip Code</label>
                <input
                  type="number"
                  name="ZipCode"
                  value={formData.ZipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Credit Risk Attributes */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-rose-400" />
              <span>Credit Bureau & Default History</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Prior Default Flag</label>
                  <span className="text-[10px] text-amber-400 font-semibold">Highest Coefficient Impact</span>
                </div>
                <select
                  name="PriorDefault"
                  value={formData.PriorDefault}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    formData.PriorDefault === "Yes"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                      : "bg-slate-900 border-slate-700 text-emerald-400 font-semibold"
                  }`}
                >
                  <option value="No">No Prior Defaults Recorded</option>
                  <option value="Yes">Yes (Has Prior Default on Record)</option>
                </select>
                <p className="text-[10px] text-slate-400">Applicants without prior defaults receive substantial log-odds boosts.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Credit Score / Activity Count</label>
                  <span className="text-xs font-semibold text-emerald-400">{formData.CreditScore}</span>
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
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>300 (Subprime)</span>
                  <span>650 (Fair)</span>
                  <span>850 (Exceptional)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Underwriting Decision Threshold */}
          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                <Sliders className="size-3.5" />
                <span>Decision Cutoff Threshold</span>
              </div>
              <span className="text-xs font-bold text-indigo-300">
                {Math.round((formData.threshold || 0.50) * 100)}% Probability
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
            <p className="text-[11px] text-slate-400">
              Applications with model approval probability above this cutoff are approved. Default is 50%.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <ShimmerButton type="submit" disabled={loading} className="w-full py-3.5">
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="size-4 animate-spin text-emerald-400" />
                  <span>Evaluating With Logistic Regression...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-emerald-400" />
                  <span>Execute ML Underwriting Evaluation</span>
                </div>
              )}
            </ShimmerButton>
          </div>
        </form>

        {/* Prediction Results Display (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl overflow-hidden">
              <BorderBeam
                size={220}
                duration={8}
                colorFrom={result.approved ? "#10B981" : "#EF4444"}
                colorTo="#6366F1"
              />

              {/* Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Applicant Result</span>
                  <h3 className="text-xl font-bold text-white">{result.applicant_name}</h3>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    result.approved
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                >
                  {result.approved ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                  <span>{result.status}</span>
                </div>
              </div>

              {/* Probability Radial Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-slate-300">Approval Confidence</span>
                  <span className="text-2xl font-black text-white">{result.approval_percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.approved ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-rose-500 to-amber-500"
                    }`}
                    style={{ width: `${result.approval_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Threshold: {Math.round(result.threshold_used * 100)}%</span>
                  <span className="font-semibold" style={{ color: result.risk_color }}>
                    {result.risk_level} ({result.credit_tier})
                  </span>
                </div>
              </div>

              {/* Decision Factors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Decision Explanations
                </h4>
                <div className="space-y-2">
                  {result.factors.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start gap-2"
                    >
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${
                          f.impact === "Positive"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {f.impact}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-200 block">{f.factor}</span>
                        <p className="text-[11px] text-slate-400">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Underwriting Action Steps
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

              {/* Download Official Report Button */}
              <button
                type="button"
                onClick={() => generateCreditReportPDF(result)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
              >
                <FileDown className="size-4 text-emerald-400" />
                <span>Download Official Decision PDF</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-8 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Info className="size-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Evaluation Output Ready</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Fill in applicant financial credentials or pick a test persona, then click Execute ML Underwriting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
