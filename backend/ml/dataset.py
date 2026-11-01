import os
import pandas as pd
import numpy as np

NUMERICAL_COLS = ["Age", "Debt", "YearsEmployed", "CreditScore", "ZipCode", "Income"]
CATEGORICAL_COLS = [
    "Gender", "Married", "BankCustomer", "EducationLevel",
    "Ethnicity", "PriorDefault", "Employed", "DriversLicense", "Citizen"
]
TARGET_COL = "Approved"

DEFAULT_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "credit_approval_cleaned.csv"))

def load_credit_data(filepath: str = None) -> pd.DataFrame:
    """Loads and returns the cleaned credit approval dataset."""
    path = filepath or DEFAULT_DATA_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Credit dataset not found at {path}")
    
    df = pd.read_csv(path)
    # Ensure types
    for col in NUMERICAL_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(df[col].median() if col in df else 0)
            
    for col in CATEGORICAL_COLS:
        if col in df.columns:
            df[col] = df[col].astype(str).fillna("Unknown")
            
    if TARGET_COL in df.columns:
        df[TARGET_COL] = df[TARGET_COL].astype(int)
        
    return df

def get_feature_summary(df: pd.DataFrame) -> dict:
    """Provides key statistical summaries for dataset exploration."""
    summary = {
        "total_records": len(df),
        "total_approved": int((df[TARGET_COL] == 1).sum()) if TARGET_COL in df else 0,
        "total_rejected": int((df[TARGET_COL] == 0).sum()) if TARGET_COL in df else 0,
        "approval_rate": round(float((df[TARGET_COL] == 1).mean() * 100), 2) if TARGET_COL in df else 0.0,
        "features": {
            "numerical": {},
            "categorical": {}
        }
    }
    
    for col in NUMERICAL_COLS:
        if col in df.columns:
            summary["features"]["numerical"][col] = {
                "mean": round(float(df[col].mean()), 2),
                "std": round(float(df[col].std()), 2),
                "min": round(float(df[col].min()), 2),
                "max": round(float(df[col].max()), 2),
                "median": round(float(df[col].median()), 2)
            }
            
    for col in CATEGORICAL_COLS:
        if col in df.columns:
            val_counts = df[col].value_counts().head(5).to_dict()
            summary["features"]["categorical"][col] = {k: int(v) for k, v in val_counts.items()}
            
    return summary
