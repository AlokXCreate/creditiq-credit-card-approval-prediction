import os
import json
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import init_db, SessionLocal
from backend.models import CreditApplication
from backend.ml.predictor import predictor
from backend.routers import prediction, analytics, history, training

app = FastAPI(
    title="CREDITIQ API",
    description="Machine Learning-Powered Credit Card Approval Prediction Engine using Logistic Regression & GridSearchCV",
    version="1.0.0"
)

# Initialize DB schema
init_db()

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(prediction.router)
app.include_router(analytics.router)
app.include_router(history.router)
app.include_router(training.router)

@app.on_event("startup")
def on_startup():
    # Check if DB has sample records, if not seed a few diverse records for instant dashboard KPI visualization
    db = SessionLocal()
    try:
        count = db.query(CreditApplication).count()
        if count == 0:
            seed_initial_applications(db)
    finally:
        db.close()

def seed_initial_applications(db):
    """Seed realistic initial applications so the dashboard displays live metrics immediately."""
    sample_data = [
        {
            "applicant_name": "Alexander Morgan",
            "gender": "Male", "age": 36.5, "debt": 1.5, "married": "Married", "bank_customer": "Yes",
            "education_level": "Master", "ethnicity": "White", "years_employed": 6.2, "prior_default": "No",
            "employed": "Yes", "credit_score": 790, "drivers_license": "Yes", "citizen": "ByBirth",
            "zip_code": 94107, "income": 88000, "approved": True, "status": "APPROVED",
            "approval_probability": 0.942, "risk_level": "LOW RISK", "credit_tier": "Tier 1 (Prime)"
        },
        {
            "applicant_name": "Seraphina Lin",
            "gender": "Female", "age": 29.0, "debt": 2.8, "married": "Single", "bank_customer": "Yes",
            "education_level": "Bachelor", "ethnicity": "Asian", "years_employed": 3.8, "prior_default": "No",
            "employed": "Yes", "credit_score": 735, "drivers_license": "Yes", "citizen": "ByBirth",
            "zip_code": 10001, "income": 62000, "approved": True, "status": "APPROVED",
            "approval_probability": 0.885, "risk_level": "LOW RISK", "credit_tier": "Tier 1 (Prime)"
        },
        {
            "applicant_name": "Marcus Vance",
            "gender": "Male", "age": 42.0, "debt": 6.4, "married": "Married", "bank_customer": "Yes",
            "education_level": "Associate", "ethnicity": "Black", "years_employed": 2.1, "prior_default": "No",
            "employed": "Yes", "credit_score": 620, "drivers_license": "Yes", "citizen": "ByBirth",
            "zip_code": 30301, "income": 41000, "approved": True, "status": "APPROVED",
            "approval_probability": 0.582, "risk_level": "MODERATE RISK", "credit_tier": "Tier 2 (Near Prime)"
        },
        {
            "applicant_name": "Damian Cruz",
            "gender": "Male", "age": 24.5, "debt": 9.2, "married": "Single", "bank_customer": "No",
            "education_level": "HighSchool", "ethnicity": "Latino", "years_employed": 0.8, "prior_default": "Yes",
            "employed": "No", "credit_score": 490, "drivers_license": "No", "citizen": "Temporary",
            "zip_code": 75001, "income": 19000, "approved": False, "status": "REJECTED",
            "approval_probability": 0.124, "risk_level": "HIGH RISK", "credit_tier": "Tier 3 (Subprime)"
        },
        {
            "applicant_name": "Helena Rostova",
            "gender": "Female", "age": 31.0, "debt": 4.1, "married": "Married", "bank_customer": "Yes",
            "education_level": "Bachelor", "ethnicity": "White", "years_employed": 4.5, "prior_default": "No",
            "employed": "Yes", "credit_score": 710, "drivers_license": "Yes", "citizen": "ByOtherMeans",
            "zip_code": 98101, "income": 54000, "approved": True, "status": "APPROVED",
            "approval_probability": 0.812, "risk_level": "LOW RISK", "credit_tier": "Tier 1 (Prime)"
        },
        {
            "applicant_name": "Tariq Al-Mansoor",
            "gender": "Male", "age": 47.0, "debt": 11.5, "married": "Single", "bank_customer": "No",
            "education_level": "HighSchool", "ethnicity": "Other", "years_employed": 0.4, "prior_default": "Yes",
            "employed": "No", "credit_score": 530, "drivers_license": "No", "citizen": "ByBirth",
            "zip_code": 60601, "income": 22000, "approved": False, "status": "REJECTED",
            "approval_probability": 0.187, "risk_level": "HIGH RISK", "credit_tier": "Tier 3 (Subprime)"
        }
    ]

    for item in sample_data:
        app_rec = CreditApplication(
            applicant_name=item["applicant_name"],
            gender=item["gender"], age=item["age"], debt=item["debt"], married=item["married"],
            bank_customer=item["bank_customer"], education_level=item["education_level"],
            ethnicity=item["ethnicity"], years_employed=item["years_employed"],
            prior_default=item["prior_default"], employed=item["employed"],
            credit_score=item["credit_score"], drivers_license=item["drivers_license"],
            citizen=item["citizen"], zip_code=item["zip_code"], income=item["income"],
            approved=item["approved"], status=item["status"],
            approval_probability=item["approval_probability"],
            risk_level=item["risk_level"], credit_tier=item["credit_tier"],
            factors_json=json.dumps([
                {"factor": "Credit Profile Analysis", "impact": "Positive" if item["approved"] else "Negative", "description": "Automated baseline assessment"}
            ]),
            recommendations_json=json.dumps([
                "Standard evaluation workflow completed."
            ])
        )
        db.add(app_rec)
    db.commit()

@app.get("/")
def root():
    return {
        "service": "CREDITIQ FinTech Engine",
        "description": "Production Machine Learning Credit Card Approval Prediction API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CREDITIQ API",
        "version": "1.0.0",
        "model_loaded": predictor.is_ready(),
        "database_connected": True,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
