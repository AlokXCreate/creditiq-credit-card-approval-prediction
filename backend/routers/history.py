import io
import csv
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.database import get_db
from backend.models import CreditApplication

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("")
def list_application_history(
    search: Optional[str] = None,
    status: Optional[str] = None,
    risk: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve historical applications with optional search and filters."""
    query = db.query(CreditApplication)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (CreditApplication.applicant_name.ilike(search_filter)) |
            (CreditApplication.education_level.ilike(search_filter)) |
            (CreditApplication.credit_tier.ilike(search_filter))
        )

    if status and status.upper() in ["APPROVED", "REJECTED"]:
        is_approved = status.upper() == "APPROVED"
        query = query.filter(CreditApplication.approved == is_approved)

    if risk:
        query = query.filter(CreditApplication.risk_level.ilike(f"%{risk}%"))

    total = query.count()
    records = query.order_by(desc(CreditApplication.created_at)).offset(offset).limit(limit).all()

    items = []
    for r in records:
        factors = []
        recommendations = []
        try:
            if r.factors_json:
                factors = json.loads(r.factors_json)
            if r.recommendations_json:
                recommendations = json.loads(r.recommendations_json)
        except Exception:
            pass

        items.append({
            "id": r.id,
            "applicant_name": r.applicant_name,
            "gender": r.gender,
            "age": r.age,
            "debt": r.debt,
            "married": r.married,
            "bank_customer": r.bank_customer,
            "education_level": r.education_level,
            "ethnicity": r.ethnicity,
            "years_employed": r.years_employed,
            "prior_default": r.prior_default,
            "employed": r.employed,
            "credit_score": r.credit_score,
            "drivers_license": r.drivers_license,
            "citizen": r.citizen,
            "zip_code": r.zip_code,
            "income": r.income,
            "approved": r.approved,
            "status": r.status,
            "approval_probability": r.approval_probability,
            "approval_percentage": round(r.approval_probability * 100, 1),
            "risk_level": r.risk_level,
            "credit_tier": r.credit_tier,
            "factors": factors,
            "recommendations": recommendations,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if r.created_at else None
        })

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": items
    }

@router.get("/{app_id}")
def get_application_by_id(app_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of an application record."""
    r = db.query(CreditApplication).filter(CreditApplication.id == app_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Application record not found")

    factors = json.loads(r.factors_json) if r.factors_json else []
    recommendations = json.loads(r.recommendations_json) if r.recommendations_json else []

    return {
        "id": r.id,
        "applicant_name": r.applicant_name,
        "gender": r.gender,
        "age": r.age,
        "debt": r.debt,
        "married": r.married,
        "bank_customer": r.bank_customer,
        "education_level": r.education_level,
        "ethnicity": r.ethnicity,
        "years_employed": r.years_employed,
        "prior_default": r.prior_default,
        "employed": r.employed,
        "credit_score": r.credit_score,
        "drivers_license": r.drivers_license,
        "citizen": r.citizen,
        "zip_code": r.zip_code,
        "income": r.income,
        "approved": r.approved,
        "status": r.status,
        "approval_probability": r.approval_probability,
        "approval_percentage": round(r.approval_probability * 100, 1),
        "risk_level": r.risk_level,
        "credit_tier": r.credit_tier,
        "factors": factors,
        "recommendations": recommendations,
        "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if r.created_at else None
    }

@router.delete("/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db)):
    """Delete a specific application record."""
    r = db.query(CreditApplication).filter(CreditApplication.id == app_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(r)
    db.commit()
    return {"status": "success", "message": f"Application #{app_id} deleted"}

@router.delete("")
def clear_all_history(db: Session = Depends(get_db)):
    """Clear all application records."""
    deleted_count = db.query(CreditApplication).delete()
    db.commit()
    return {"status": "success", "message": f"Cleared {deleted_count} application records"}

@router.get("/export/csv")
def export_history_csv(db: Session = Depends(get_db)):
    """Export complete audit history as downloadable CSV file."""
    records = db.query(CreditApplication).order_by(desc(CreditApplication.created_at)).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "ID", "ApplicantName", "Gender", "Age", "Debt", "Married",
        "BankCustomer", "EducationLevel", "Ethnicity", "YearsEmployed",
        "PriorDefault", "Employed", "CreditScore", "DriversLicense",
        "Citizen", "ZipCode", "Income", "Approved", "Status",
        "ApprovalProbability", "RiskLevel", "CreditTier", "CreatedAt"
    ])
    
    for r in records:
        writer.writerow([
            r.id, r.applicant_name, r.gender, r.age, r.debt, r.married,
            r.bank_customer, r.education_level, r.ethnicity, r.years_employed,
            r.prior_default, r.employed, r.credit_score, r.drivers_license,
            r.citizen, r.zip_code, r.income, r.approved, r.status,
            r.approval_probability, r.risk_level, r.credit_tier,
            r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=creditiq_application_history.csv"}
    )
