// API Service for CreditIQ
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ApplicantPayload {
  applicant_name?: string;
  Gender: string;
  Age: number;
  Debt: number;
  Married: string;
  BankCustomer: string;
  EducationLevel: string;
  Ethnicity: string;
  YearsEmployed: number;
  PriorDefault: string;
  Employed: string;
  CreditScore: number;
  DriversLicense: string;
  Citizen: string;
  ZipCode: number;
  Income: number;
  threshold?: number;
  save_to_db?: boolean;
}

export interface FactorItem {
  factor: string;
  impact: "Positive" | "Negative";
  description: string;
}

export interface PredictionResult {
  id?: number;
  applicant_name: string;
  approved: boolean;
  status: "APPROVED" | "REJECTED";
  approval_probability: number;
  approval_percentage: number;
  risk_level: string;
  credit_tier: string;
  risk_color: string;
  threshold_used: number;
  factors: FactorItem[];
  recommendations: string[];
  input_summary: Record<string, any>;
  created_at?: string;
}

export interface BatchPredictionResponse {
  total_processed: number;
  total_approved: number;
  total_rejected: number;
  approval_rate: number;
  results: PredictionResult[];
}

export interface ModelMetrics {
  model_name: string;
  algorithm: string;
  hyperparameter_tuning: string;
  trained_at: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  best_hyperparameters: {
    C: number;
    penalty: string;
    solver: string;
  };
  best_cv_roc_auc: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  confusion_matrix: {
    matrix: number[][];
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  intercept: number;
  roc_curve: Array<{ fpr: number; tpr: number }>;
  pr_curve: Array<{ recall: number; precision: number }>;
  top_features: Array<{
    feature: string;
    coefficient: number;
    odds_ratio: number;
    abs_coef: number;
    impact: string;
  }>;
  grid_search_summary: Array<{
    params: Record<string, any>;
    mean_test_roc_auc: number;
    std_test_roc_auc: number;
    rank: number;
  }>;
}

export interface AnalyticsSummary {
  kpis: {
    total_applications: number;
    total_approved: number;
    total_rejected: number;
    approval_rate: number;
    model_accuracy: number;
    model_roc_auc: number;
    average_credit_score: number;
    average_income: number;
    average_approval_probability: number;
  };
  risk_distribution: Array<{
    name: string;
    count: number;
    color: string;
  }>;
}

export interface HistoryItem extends PredictionResult {
  gender: string;
  age: number;
  debt: number;
  married: string;
  bank_customer: string;
  education_level: string;
  ethnicity: string;
  years_employed: number;
  prior_default: string;
  employed: string;
  credit_score: number;
  drivers_license: string;
  citizen: string;
  zip_code: number;
  income: number;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  async predict(payload: ApplicantPayload): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Prediction request failed");
    }
    return res.json();
  },

  async predictBatchCSV(file: File, threshold: number = 0.50): Promise<BatchPredictionResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/predict/batch-csv?threshold=${threshold}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Batch prediction failed");
    }
    return res.json();
  },

  async getSamplePersonas(): Promise<ApplicantPayload[]> {
    const res = await fetch(`${API_BASE_URL}/api/predict/samples`);
    if (!res.ok) throw new Error("Failed to fetch personas");
    return res.json();
  },

  async getMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE_URL}/api/analytics/metrics`);
    if (!res.ok) throw new Error("Failed to load model metrics");
    return res.json();
  },

  async getSummary(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE_URL}/api/analytics/summary`);
    if (!res.ok) throw new Error("Failed to load summary analytics");
    return res.json();
  },

  async getHistory(search?: string, status?: string, risk?: string, limit: number = 50, offset: number = 0) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status && status !== "ALL") params.append("status", status);
    if (risk && risk !== "ALL") params.append("risk", risk);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const res = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load application history");
    return res.json();
  },

  async deleteHistoryItem(id: number) {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete record");
    return res.json();
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE_URL}/api/history`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to clear history");
    return res.json();
  },

  getExportHistoryUrl() {
    return `${API_BASE_URL}/api/history/export/csv`;
  },

  async triggerRetrain() {
    const res = await fetch(`${API_BASE_URL}/api/training/retrain`, { method: "POST" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Retraining failed");
    }
    return res.json();
  },

  async uploadDatasetAndRetrain(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/training/upload-dataset`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Dataset upload and retraining failed");
    }
    return res.json();
  },

  async getDatasetInfo() {
    const res = await fetch(`${API_BASE_URL}/api/training/dataset-info`);
    if (!res.ok) throw new Error("Failed to load dataset info");
    return res.json();
  }
};
