import io
import json
import pandas as pd
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import CreditApplication
from backend.schemas import (
    CreditApplicationInput, PredictionResult, BatchPredictionResponse
)
from backend.ml.predictor import predictor

router = APIRouter(prefix="/api/predict", tags=["Prediction"])

@router.post("", response_model=PredictionResult)
def predict_credit_approval(payload: CreditApplicationInput, db: Session = Depends(get_db)):
    """Evaluate single credit card application and optionally persist to database."""
    data = payload.dict()
    save_to_db = data.pop("save_to_db", True)
    threshold = data.pop("threshold", 0.50)
    name = data.get("applicant_name") or "Anonymous Applicant"

    try:
        res = predictor.predict_one(data, threshold=threshold)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    record_id = None
    if save_to_db:
        app_record = CreditApplication(
            applicant_name=name,
            gender=data.get("Gender", "Male"),
            age=float(data.get("Age", 30.0)),
            debt=float(data.get("Debt", 0.0)),
            married=data.get("Married", "Married"),
            bank_customer=data.get("BankCustomer", "Yes"),
            education_level=data.get("EducationLevel", "Bachelor"),
            ethnicity=data.get("Ethnicity", "White"),
            years_employed=float(data.get("YearsEmployed", 0.0)),
            prior_default=data.get("PriorDefault", "No"),
            employed=data.get("Employed", "Yes"),
            credit_score=int(data.get("CreditScore", 0)),
            drivers_license=data.get("DriversLicense", "No"),
            citizen=data.get("Citizen", "ByBirth"),
            zip_code=int(data.get("ZipCode", 10001)),
            income=int(data.get("Income", 0)),
            approved=res["approved"],
            status=res["status"],
            approval_probability=res["approval_probability"],
            risk_level=res["risk_level"],
            credit_tier=res["credit_tier"],
            factors_json=json.dumps(res["factors"]),
            recommendations_json=json.dumps(res["recommendations"])
        )
        db.add(app_record)
        db.commit()
        db.refresh(app_record)
        record_id = app_record.id

    return PredictionResult(
        id=record_id,
        applicant_name=name,
        approved=res["approved"],
        status=res["status"],
        approval_probability=res["approval_probability"],
        approval_percentage=res["approval_percentage"],
        risk_level=res["risk_level"],
        credit_tier=res["credit_tier"],
        risk_color=res["risk_color"],
        threshold_used=threshold,
        factors=res["factors"],
        recommendations=res["recommendations"],
        input_summary=data,
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    )

@router.post("/batch-csv", response_model=BatchPredictionResponse)
async def predict_batch_csv(
    file: UploadFile = File(...),
    threshold: float = 0.50,
    save_to_db: bool = True,
    db: Session = Depends(get_db)
):
    """Upload a CSV file with applicants and get instant batch credit evaluations."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV formatting: {str(e)}")

    if len(df) == 0:
        raise HTTPException(status_code=400, detail="CSV file is empty.")

    batch_evals = predictor.predict_batch(df, threshold=threshold)
    
    approved_count = sum(1 for item in batch_evals if item["approved"])
    total_count = len(batch_evals)
    approval_rate = round((approved_count / total_count) * 100, 2) if total_count > 0 else 0.0

    if save_to_db:
        db_records = []
        for item in batch_evals:
            d = item["input_summary"]
            app_record = CreditApplication(
                applicant_name=item.get("applicant_name", "Batch Applicant"),
                gender=d.get("Gender", "Male"),
                age=float(d.get("Age", 30.0)),
                debt=float(d.get("Debt", 0.0)),
                married=d.get("Married", "Married"),
                bank_customer=d.get("BankCustomer", "Yes"),
                education_level=d.get("EducationLevel", "Bachelor"),
                ethnicity=d.get("Ethnicity", "White"),
                years_employed=float(d.get("YearsEmployed", 0.0)),
                prior_default=d.get("PriorDefault", "No"),
                employed=d.get("Employed", "Yes"),
                credit_score=int(d.get("CreditScore", 0)),
                drivers_license=d.get("DriversLicense", "No"),
                citizen=d.get("Citizen", "ByBirth"),
                zip_code=int(d.get("ZipCode", 10001)),
                income=int(d.get("Income", 0)),
                approved=item["approved"],
                status=item["status"],
                approval_probability=item["approval_probability"],
                risk_level=item["risk_level"],
                credit_tier=item["credit_tier"],
                factors_json=json.dumps(item["factors"]),
                recommendations_json=json.dumps(item["recommendations"])
            )
            db_records.append(app_record)
        db.bulk_save_objects(db_records)
        db.commit()

    return BatchPredictionResponse(
        total_processed=total_count,
        total_approved=approved_count,
        total_rejected=total_count - approved_count,
        approval_rate=approval_rate,
        results=batch_evals
    )

@router.get("/samples")
def get_sample_applicants():
    """Returns curated personas (Prime, Near-Prime, High-Risk) for quick testing in UI."""
    return [
        {
            "label": "Prime Applicant (High Approval Probability)",
            "applicant_name": "Eleanor Sterling",
            "Gender": "Female",
            "Age": 38.5,
            "Debt": 1.25,
            "Married": "Married",
            "BankCustomer": "Yes",
            "EducationLevel": "Master",
            "Ethnicity": "White",
            "YearsEmployed": 7.5,
            "PriorDefault": "No",
            "Employed": "Yes",
            "CreditScore": 810,
            "DriversLicense": "Yes",
            "Citizen": "ByBirth",
            "ZipCode": 94107,
            "Income": 95000
        },
        {
            "label": "Moderate / Borderline Applicant",
            "applicant_name": "Marcus Vance",
            "Gender": "Male",
            "Age": 26.0,
            "Debt": 4.5,
            "Married": "Single",
            "BankCustomer": "Yes",
            "EducationLevel": "Bachelor",
            "Ethnicity": "Asian",
            "YearsEmployed": 1.8,
            "PriorDefault": "No",
            "Employed": "Yes",
            "CreditScore": 640,
            "DriversLicense": "Yes",
            "Citizen": "ByBirth",
            "ZipCode": 60601,
            "Income": 42000
        },
        {
            "label": "High-Risk Applicant (Prior Default)",
            "applicant_name": "Julian Hayes",
            "Gender": "Male",
            "Age": 44.0,
            "Debt": 12.8,
            "Married": "Single",
            "BankCustomer": "No",
            "EducationLevel": "HighSchool",
            "Ethnicity": "Latino",
            "YearsEmployed": 0.5,
            "PriorDefault": "Yes",
            "Employed": "No",
            "CreditScore": 510,
            "DriversLicense": "No",
            "Citizen": "Temporary",
            "ZipCode": 30301,
            "Income": 18000
        }
    ]
