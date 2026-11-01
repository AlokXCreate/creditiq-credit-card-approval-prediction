from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text
from backend.database import Base

class CreditApplication(Base):
    __tablename__ = "credit_applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    applicant_name = Column(String(128), default="Anonymous Applicant")
    
    # Financial and demographic inputs
    gender = Column(String(16), default="Male")
    age = Column(Float, nullable=False)
    debt = Column(Float, nullable=False)
    married = Column(String(32), default="Married")
    bank_customer = Column(String(16), default="Yes")
    education_level = Column(String(64), default="Bachelor")
    ethnicity = Column(String(64), default="White")
    years_employed = Column(Float, nullable=False)
    prior_default = Column(String(16), default="No")
    employed = Column(String(16), default="Yes")
    credit_score = Column(Integer, default=0)
    drivers_license = Column(String(16), default="No")
    citizen = Column(String(32), default="ByBirth")
    zip_code = Column(Integer, default=10001)
    income = Column(Integer, default=0)

    # ML Output
    approved = Column(Boolean, nullable=False)
    status = Column(String(32), nullable=False) # APPROVED, REJECTED
    approval_probability = Column(Float, nullable=False)
    risk_level = Column(String(32), nullable=False) # LOW RISK, MODERATE RISK, HIGH RISK
    credit_tier = Column(String(64), default="Tier 2 (Near Prime)")
    
    # Explanations stored as JSON string
    factors_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class ModelRunHistory(Base):
    __tablename__ = "model_run_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name = Column(String(128), default="CreditIQ Logistic Regression")
    algorithm = Column(String(128))
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    best_c = Column(Float, nullable=True)
    best_penalty = Column(String(16), nullable=True)
    best_solver = Column(String(32), nullable=True)
    total_samples = Column(Integer, default=690)
    trained_at = Column(DateTime, default=datetime.utcnow)
