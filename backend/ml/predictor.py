import os
import json
import joblib
import pandas as pd
import numpy as np

from backend.ml.dataset import NUMERICAL_COLS, CATEGORICAL_COLS

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "artifacts"))
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "credit_model.joblib")
META_PATH = os.path.join(ARTIFACTS_DIR, "model_meta.json")

class CreditPredictor:
    def __init__(self):
        self.model = None
        self.meta = None
        self.load()

    def load(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        if os.path.exists(META_PATH):
            with open(META_PATH, "r", encoding="utf-8") as f:
                self.meta = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None and self.meta is not None

    def predict_one(self, data: dict, threshold: float = 0.50) -> dict:
        if not self.is_ready():
            self.load()
            if not self.is_ready():
                raise RuntimeError("CreditIQ model is not trained yet. Run model training first.")

        # Prepare 1-row DataFrame
        df_row = pd.DataFrame([data])
        for col in NUMERICAL_COLS:
            if col in df_row:
                df_row[col] = pd.to_numeric(df_row[col], errors="coerce").fillna(0)
            else:
                df_row[col] = 0.0

        for col in CATEGORICAL_COLS:
            if col in df_row:
                df_row[col] = df_row[col].astype(str)
            else:
                df_row[col] = "Unknown"

        X = df_row[NUMERICAL_COLS + CATEGORICAL_COLS]
        proba = float(self.model.predict_proba(X)[0][1])
        approved = proba >= threshold

        # Risk level determination
        if proba >= 0.70:
            risk_level = "LOW RISK"
            credit_tier = "Tier 1 (Prime)"
            risk_color = "#10B981"
        elif proba >= 0.40:
            risk_level = "MODERATE RISK"
            credit_tier = "Tier 2 (Near Prime)"
            risk_color = "#F59E0B"
        else:
            risk_level = "HIGH RISK"
            credit_tier = "Tier 3 (Subprime)"
            risk_color = "#EF4444"

        # Key Explanatory factors
        factors = []
        if str(data.get("PriorDefault")).strip().lower() in ["no", "f", "0", "false"]:
            factors.append({
                "factor": "Clean Credit History",
                "impact": "Positive",
                "description": "No prior defaults recorded, significantly boosting approval probability."
            })
        else:
            factors.append({
                "factor": "Prior Default Recorded",
                "impact": "Negative",
                "description": "Historical default flags present elevated risk in credit evaluation."
            })

        cs = float(data.get("CreditScore", 0))
        if cs >= 6 or cs >= 650:
            factors.append({
                "factor": "Strong Credit Rating",
                "impact": "Positive",
                "description": f"Credit score rating ({cs}) indicates solid debt repayment behavior."
            })
        elif cs <= 1:
            factors.append({
                "factor": "Limited Credit Bureau History",
                "impact": "Negative",
                "description": "Low credit activity count or score requires additional collateral."
            })

        emp_years = float(data.get("YearsEmployed", 0))
        if emp_years >= 3.0:
            factors.append({
                "factor": "High Employment Stability",
                "impact": "Positive",
                "description": f"{emp_years:.1f} years of steady employment demonstrates income reliability."
            })

        income = float(data.get("Income", 0))
        if income >= 2000:
            factors.append({
                "factor": "Favorable Annual Income",
                "impact": "Positive",
                "description": f"Reported income level (${income:,.0f}) supports proposed credit limit."
            })

        debt = float(data.get("Debt", 0))
        if debt > 5.0:
            factors.append({
                "factor": "Elevated Debt Load",
                "impact": "Negative",
                "description": f"Debt ratio ({debt}) is above optimal threshold."
            })

        # Recommendations
        recommendations = []
        if approved:
            recommendations.append("Applicant qualifies for premium card rewards program.")
            recommendations.append("Recommend setting credit limit in Tier A based on income ratio.")
            recommendations.append("Offer auto-pay setup for 0% promotional APR period.")
        else:
            if str(data.get("PriorDefault")).strip().lower() in ["yes", "t", "1", "true"]:
                recommendations.append("Resolve outstanding delinquent balances to rebuild credit standing.")
            if debt > 3.0:
                recommendations.append("Lower debt utilization ratio below 30% before reapplying.")
            recommendations.append("Consider secured credit line or co-signer for re-evaluation in 90 days.")

        return {
            "approved": bool(approved),
            "status": "APPROVED" if approved else "REJECTED",
            "approval_probability": round(proba, 4),
            "approval_percentage": round(proba * 100, 1),
            "risk_level": risk_level,
            "credit_tier": credit_tier,
            "risk_color": risk_color,
            "threshold_used": threshold,
            "factors": factors,
            "recommendations": recommendations,
            "input_summary": data
        }

    def predict_batch(self, df_records: pd.DataFrame, threshold: float = 0.50) -> list:
        results = []
        for _, row in df_records.iterrows():
            row_dict = row.to_dict()
            name = row_dict.get("ApplicantName", f"Applicant #{len(results) + 1}")
            pred = self.predict_one(row_dict, threshold=threshold)
            pred["applicant_name"] = name
            results.append(pred)
        return results

predictor = CreditPredictor()
