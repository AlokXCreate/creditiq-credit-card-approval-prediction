import type { ModelMetrics, PredictionResult, ApplicantPayload, AnalyticsSummary, HistoryItem } from "./api";

export const FALLBACK_MODEL_METRICS: ModelMetrics = {
  model_name: "CreditIQ Logistic Regression Classifier",
  algorithm: "Logistic Regression with L1/L2 Regularization (ElasticNet/Liblinear)",
  hyperparameter_tuning: "5-Fold Stratified GridSearchCV",
  trained_at: "2026-11-01 12:36:12 UTC",
  total_samples: 690,
  train_samples: 552,
  test_samples: 138,
  best_hyperparameters: {
    C: 1.0,
    penalty: "l1",
    solver: "liblinear"
  },
  best_cv_roc_auc: 0.9177,
  metrics: {
    accuracy: 0.8623,
    precision: 0.8281,
    recall: 0.8689,
    f1_score: 0.848,
    roc_auc: 0.9636
  },
  confusion_matrix: {
    matrix: [
      [66, 11],
      [8, 53]
    ],
    true_negatives: 66,
    false_positives: 11,
    false_negatives: 8,
    true_positives: 53
  },
  intercept: 0.0,
  roc_curve: [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.0, tpr: 0.2459 },
    { fpr: 0.013, tpr: 0.6557 },
    { fpr: 0.026, tpr: 0.6885 },
    { fpr: 0.039, tpr: 0.8033 },
    { fpr: 0.0649, tpr: 0.8197 },
    { fpr: 0.0779, tpr: 0.8361 },
    { fpr: 0.1169, tpr: 0.8525 },
    { fpr: 0.1429, tpr: 0.9836 },
    { fpr: 0.1688, tpr: 1.0 },
    { fpr: 1.0, tpr: 1.0 }
  ],
  pr_curve: [
    { recall: 1.0, precision: 0.442 },
    { recall: 0.9836, precision: 0.8219 },
    { recall: 0.8525, precision: 0.8254 },
    { recall: 0.8033, precision: 0.9245 },
    { recall: 0.6066, precision: 0.9737 },
    { recall: 0.2131, precision: 1.0 }
  ],
  top_features: [
    { feature: "Income", coefficient: 1.7702, odds_ratio: 5.8721, abs_coef: 1.7702, impact: "Positive" },
    { feature: "PriorDefault_No", coefficient: 1.5432, odds_ratio: 4.6795, abs_coef: 1.5432, impact: "Positive" },
    { feature: "CreditScore", coefficient: 1.4219, odds_ratio: 4.1450, abs_coef: 1.4219, impact: "Positive" },
    { feature: "YearsEmployed", coefficient: 0.9521, odds_ratio: 2.5911, abs_coef: 0.9521, impact: "Positive" },
    { feature: "Debt", coefficient: -0.8412, odds_ratio: 0.4312, abs_coef: 0.8412, impact: "Negative" },
    { feature: "EducationLevel_ff", coefficient: -1.7563, odds_ratio: 0.1727, abs_coef: 1.7563, impact: "Negative" },
    { feature: "PriorDefault_Yes", coefficient: -1.6821, odds_ratio: 0.1859, abs_coef: 1.6821, impact: "Negative" }
  ],
  grid_search_summary: [
    { params: { C: 1.0, penalty: "l1", solver: "liblinear" }, mean_test_roc_auc: 0.9177, std_test_roc_auc: 0.021, rank: 1 },
    { params: { C: 0.5, penalty: "l1", solver: "liblinear" }, mean_test_roc_auc: 0.9124, std_test_roc_auc: 0.023, rank: 2 },
    { params: { C: 1.0, penalty: "l2", solver: "lbfgs" }, mean_test_roc_auc: 0.9085, std_test_roc_auc: 0.025, rank: 3 },
    { params: { C: 2.0, penalty: "l2", solver: "lbfgs" }, mean_test_roc_auc: 0.9042, std_test_roc_auc: 0.024, rank: 4 },
    { params: { C: 0.1, penalty: "l1", solver: "liblinear" }, mean_test_roc_auc: 0.8951, std_test_roc_auc: 0.028, rank: 5 }
  ]
};

export const FALLBACK_PERSONAS: ApplicantPayload[] = [
  {
    applicant_name: "Eleanor Vance",
    Gender: "Female",
    Age: 32.5,
    Debt: 2.5,
    Married: "Married",
    BankCustomer: "Yes",
    EducationLevel: "Bachelor's Degree",
    Ethnicity: "White",
    YearsEmployed: 4.5,
    PriorDefault: "No",
    Employed: "Yes",
    CreditScore: 740,
    DriversLicense: "Yes",
    Citizen: "Citizen By Birth",
    ZipCode: 94107,
    Income: 75000,
    threshold: 0.50
  },
  {
    applicant_name: "Marcus Sterling",
    Gender: "Male",
    Age: 26.0,
    Debt: 5.2,
    Married: "Single",
    BankCustomer: "Yes",
    EducationLevel: "Bachelor's Degree",
    Ethnicity: "Asian",
    YearsEmployed: 1.8,
    PriorDefault: "No",
    Employed: "Yes",
    CreditScore: 650,
    DriversLicense: "Yes",
    Citizen: "Citizen By Birth",
    ZipCode: 60601,
    Income: 48000,
    threshold: 0.50
  },
  {
    applicant_name: "Julian Hayes",
    Gender: "Male",
    Age: 44.0,
    Debt: 11.5,
    Married: "Single",
    BankCustomer: "No",
    EducationLevel: "High School",
    Ethnicity: "Latino",
    YearsEmployed: 0.6,
    PriorDefault: "Yes",
    Employed: "No",
    CreditScore: 520,
    DriversLicense: "No",
    Citizen: "Temporary Resident",
    ZipCode: 30301,
    Income: 21000,
    threshold: 0.50
  }
];

export const FALLBACK_DATASET_INFO = {
  summary: {
    total_records: 690,
    total_approved: 307,
    total_rejected: 383,
    approval_rate: 44.49,
    features: {
      numerical: {
        Age: { mean: "31.56", median: "28.46", std: "11.89", min: "13.75", max: "80.25" },
        Debt: { mean: "4.76", median: "2.75", std: "4.98", min: "0.0", max: "28.0" },
        YearsEmployed: { mean: "2.22", median: "1.0", std: "3.35", min: "0.0", max: "28.5" },
        CreditScore: { mean: "2.40", median: "0.0", std: "4.87", min: "0.0", max: "67.0" },
        ZipCode: { mean: "184.01", median: "160.0", std: "173.81", min: "0.0", max: "2000.0" },
        Income: { mean: "1017.39", median: "5.0", std: "5210.10", min: "0.0", max: "100000.0" }
      }
    }
  },
  sample_rows: [
    { Gender: "Male", Age: 30.83, Debt: 0.0, Married: "Married", BankCustomer: "Yes", EducationLevel: "Undergraduate", YearsEmployed: 1.25, PriorDefault: "No", CreditScore: 1, Income: 0, Approved: 1 },
    { Gender: "Female", Age: 58.67, Debt: 4.46, Married: "Married", BankCustomer: "Yes", EducationLevel: "Vocational", YearsEmployed: 3.04, PriorDefault: "No", CreditScore: 6, Income: 560, Approved: 1 },
    { Gender: "Female", Age: 24.50, Debt: 0.5, Married: "Married", BankCustomer: "Yes", EducationLevel: "Vocational", YearsEmployed: 1.50, PriorDefault: "No", CreditScore: 0, Income: 824, Approved: 1 },
    { Gender: "Male", Age: 27.83, Debt: 1.54, Married: "Married", BankCustomer: "Yes", EducationLevel: "Undergraduate", YearsEmployed: 3.75, PriorDefault: "No", CreditScore: 5, Income: 3, Approved: 1 },
    { Gender: "Male", Age: 20.17, Debt: 5.625, Married: "Married", BankCustomer: "Yes", EducationLevel: "Undergraduate", YearsEmployed: 1.71, PriorDefault: "No", CreditScore: 0, Income: 0, Approved: 1 },
    { Gender: "Male", Age: 32.08, Debt: 4.00, Married: "Married", BankCustomer: "Yes", EducationLevel: "Master's", YearsEmployed: 2.50, PriorDefault: "No", CreditScore: 0, Income: 0, Approved: 1 },
    { Gender: "Male", Age: 33.17, Debt: 1.04, Married: "Married", BankCustomer: "Yes", EducationLevel: "Doctorate", YearsEmployed: 6.50, PriorDefault: "No", CreditScore: 0, Income: 31285, Approved: 1 },
    { Gender: "Female", Age: 22.92, Debt: 11.585, Married: "Married", BankCustomer: "Yes", EducationLevel: "Undergraduate", YearsEmployed: 0.04, PriorDefault: "Yes", CreditScore: 0, Income: 1349, Approved: 0 },
    { Gender: "Male", Age: 54.42, Debt: 0.50, Married: "Single", BankCustomer: "No", EducationLevel: "High School", YearsEmployed: 3.96, PriorDefault: "Yes", CreditScore: 0, Income: 614, Approved: 0 },
    { Gender: "Male", Age: 42.50, Debt: 4.915, Married: "Single", BankCustomer: "No", EducationLevel: "High School", YearsEmployed: 3.165, PriorDefault: "Yes", CreditScore: 0, Income: 1442, Approved: 0 }
  ]
};

export const INITIAL_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 1,
    applicant_name: "Eleanor Vance",
    gender: "Female",
    age: 32.5,
    debt: 2.5,
    married: "Married",
    bank_customer: "Yes",
    education_level: "Bachelor's Degree",
    ethnicity: "White",
    years_employed: 4.5,
    prior_default: "No",
    employed: "Yes",
    credit_score: 740,
    drivers_license: "Yes",
    citizen: "Citizen By Birth",
    zip_code: 94107,
    income: 75000,
    approved: true,
    status: "APPROVED",
    approval_probability: 0.942,
    approval_percentage: 94.2,
    risk_level: "Low Risk (Prime)",
    credit_tier: "Tier 1 (Prime Privilege)",
    risk_color: "#10B981",
    threshold_used: 0.5,
    factors: [
      { factor: "Clean Credit History", impact: "Positive", description: "Applicant has zero historical credit defaults recorded." },
      { factor: "Prime Credit Rating", impact: "Positive", description: "Credit score is 740, well above risk thresholds." },
      { factor: "Stable Employment", impact: "Positive", description: "4.5 years of continuous verified professional employment." }
    ],
    recommendations: [
      "Fast-track approval with standard tier 1 premium APR (14.24%).",
      "Assign introductory credit limit between $15,000 and $25,000."
    ],
    input_summary: {},
    created_at: "2026-11-01 12:45:00"
  },
  {
    id: 2,
    applicant_name: "Julian Hayes",
    gender: "Male",
    age: 44.0,
    debt: 11.5,
    married: "Single",
    bank_customer: "No",
    education_level: "High School",
    ethnicity: "Latino",
    years_employed: 0.6,
    prior_default: "Yes",
    employed: "No",
    credit_score: 520,
    drivers_license: "No",
    citizen: "Temporary Resident",
    zip_code: 30301,
    income: 21000,
    approved: false,
    status: "REJECTED",
    approval_probability: 0.082,
    approval_percentage: 8.2,
    risk_level: "High Risk (Subprime)",
    credit_tier: "Tier 4 (High Risk / Subprime)",
    risk_color: "#EF4444",
    threshold_used: 0.5,
    factors: [
      { factor: "Prior Credit Default", impact: "Negative", description: "Prior credit default severely suppresses institutional approval probability." },
      { factor: "High Debt-to-Income", impact: "Negative", description: "Debt ratio is elevated relative to reported income profile." }
    ],
    recommendations: [
      "Require secured card collateral deposit of $500.",
      "Encourage 6 months of verified utility payments before re-evaluating."
    ],
    input_summary: {},
    created_at: "2026-11-01 12:48:10"
  }
];

export function clientPredict(payload: ApplicantPayload): PredictionResult {
  let score = 0.0;

  // Intercept & base
  if (payload.PriorDefault === "No") score += 2.8;
  else score -= 3.2;

  // Credit Score effect
  const cs = payload.CreditScore || 600;
  if (cs >= 720) score += 2.2;
  else if (cs >= 640) score += 0.8;
  else if (cs < 580) score -= 2.0;

  // Income effect
  const inc = payload.Income || 30000;
  if (inc >= 80000) score += 1.8;
  else if (inc >= 45000) score += 0.7;
  else if (inc < 25000) score -= 1.2;

  // Debt ratio effect
  const debt = payload.Debt || 2.0;
  if (debt > 10.0) score -= 1.5;
  else if (debt < 3.0) score += 0.6;

  // Employment effect
  const years = payload.YearsEmployed || 1.0;
  if (years >= 5.0) score += 1.1;
  else if (years < 1.0) score -= 0.6;

  if (payload.Employed === "No") score -= 1.4;

  // Sigmoid probability
  const prob = 1 / (1 + Math.exp(-score));
  const threshold = payload.threshold ?? 0.50;
  const approved = prob >= threshold;

  const percentage = Math.round(prob * 1000) / 10;
  let risk_level = "Moderate Risk";
  let credit_tier = "Tier 2 (Standard Prime)";
  let risk_color = "#F59E0B";

  if (prob >= 0.75) {
    risk_level = "Low Risk (Prime)";
    credit_tier = "Tier 1 (Prime Privilege)";
    risk_color = "#10B981";
  } else if (prob < 0.35) {
    risk_level = "High Risk (Subprime)";
    credit_tier = "Tier 4 (High Risk / Subprime)";
    risk_color = "#EF4444";
  }

  const factors: PredictionResult["factors"] = [];
  if (payload.PriorDefault === "No") {
    factors.push({ factor: "Clean Credit Record", impact: "Positive", description: "Zero historical default events on credit history." });
  } else {
    factors.push({ factor: "Recorded Historical Default", impact: "Negative", description: "Prior default record significantly reduces approval odds." });
  }

  if (cs >= 680) {
    factors.push({ factor: "Robust Credit Rating", impact: "Positive", description: `Credit score of ${cs} exceeds prime tier benchmark.` });
  } else {
    factors.push({ factor: "Credit Score Vulnerability", impact: "Negative", description: `Credit score of ${cs} indicates elevated risk profile.` });
  }

  if (inc >= 50000) {
    factors.push({ factor: "Strong Income Footprint", impact: "Positive", description: `Annual income of $${inc.toLocaleString()} demonstrates debt capacity.` });
  }

  return {
    applicant_name: payload.applicant_name || "Applicant",
    approved,
    status: approved ? "APPROVED" : "REJECTED",
    approval_probability: Math.round(prob * 10000) / 10000,
    approval_percentage: percentage,
    risk_level,
    credit_tier,
    risk_color,
    threshold_used: threshold,
    factors,
    recommendations: approved
      ? ["Eligible for instant automated credit facility.", "Recommend card limit between $10,000 and $20,000."]
      : ["Manual credit committee review required.", "Consider adding a qualified co-signer to elevate application."],
    input_summary: payload,
    created_at: new Date().toISOString().replace("T", " ").substring(0, 19)
  };
}

export function getClientSummary(history: HistoryItem[]): AnalyticsSummary {
  const total = history.length;
  const approved = history.filter(h => h.approved).length;
  const rejected = total - approved;
  const rate = total > 0 ? Math.round((approved / total) * 1000) / 10 : 50;
  const avgProb = total > 0 ? Math.round((history.reduce((a, b) => a + b.approval_percentage, 0) / total) * 10) / 10 : 50;

  return {
    kpis: {
      total_applications: total,
      total_approved: approved,
      total_rejected: rejected,
      approval_rate: rate,
      model_accuracy: 86.2,
      model_roc_auc: 0.9636,
      average_credit_score: 715,
      average_income: 67000,
      average_approval_probability: avgProb
    },
    risk_distribution: [
      { name: "Low Risk (Prime)", count: history.filter(h => h.risk_level.includes("Low")).length, color: "#10B981" },
      { name: "Moderate Risk", count: history.filter(h => h.risk_level.includes("Moderate")).length, color: "#F59E0B" },
      { name: "High Risk", count: history.filter(h => h.risk_level.includes("High")).length, color: "#EF4444" }
    ]
  };
}
