import os
import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import ModelRunHistory
from backend.ml.train import train_and_evaluate
from backend.ml.predictor import predictor
from backend.ml.dataset import load_credit_data, get_feature_summary, DEFAULT_DATA_PATH

router = APIRouter(prefix="/api/training", tags=["Training & Datasets"])

@router.post("/retrain")
def retrain_model_endpoint(db: Session = Depends(get_db)):
    """Triggers 5-Fold Stratified GridSearchCV hyperparameter tuning on the dataset and reloads the model."""
    try:
        meta = train_and_evaluate()
        predictor.load()

        # Save to database audit history
        metrics = meta.get("metrics", {})
        best_p = meta.get("best_hyperparameters", {})
        
        audit_record = ModelRunHistory(
            model_name=meta.get("model_name"),
            algorithm=meta.get("algorithm"),
            accuracy=metrics.get("accuracy", 0.0),
            precision=metrics.get("precision", 0.0),
            recall=metrics.get("recall", 0.0),
            f1_score=metrics.get("f1_score", 0.0),
            roc_auc=metrics.get("roc_auc", 0.0),
            best_c=best_p.get("C"),
            best_penalty=best_p.get("penalty"),
            best_solver=best_p.get("solver"),
            total_samples=meta.get("total_samples", 690)
        )
        db.add(audit_record)
        db.commit()

        return {
            "status": "success",
            "message": "Model successfully retrained and hyperparameter-tuned with GridSearchCV.",
            "trained_at": meta.get("trained_at"),
            "best_hyperparameters": best_p,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@router.post("/upload-dataset")
async def upload_dataset_and_retrain(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a new credit card dataset CSV and automatically retrains the ML model."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV: {str(e)}")

    if len(df) < 20:
        raise HTTPException(status_code=400, detail="Dataset must contain at least 20 records to support cross-validation.")

    # Save to custom dataset path
    custom_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
    custom_path = os.path.join(custom_dir, "custom_credit_approval.csv")
    df.to_csv(custom_path, index=False)

    try:
        meta = train_and_evaluate(custom_path)
        predictor.load()
        return {
            "status": "success",
            "message": f"Successfully loaded dataset with {len(df)} records and retrained model.",
            "metrics": meta.get("metrics")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training with custom dataset failed: {str(e)}")

@router.get("/dataset-info")
def get_dataset_info():
    """Returns dataset summary statistics and preview records."""
    try:
        df = load_credit_data()
        summary = get_feature_summary(df)
        sample_rows = df.head(10).to_dict(orient="records")
        return {
            "summary": summary,
            "sample_rows": sample_rows
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset info: {str(e)}")
