from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class CreditApplicationInput(BaseModel):
    applicant_name: Optional[str] = Field("Anonymous Applicant", description="Name of the applicant")
    Gender: str = Field("Male", description="Gender: Male or Female")
    Age: float = Field(30.0, ge=18.0, le=100.0, description="Age in years")
    Debt: float = Field(2.5, ge=0.0, description="Outstanding debt ratio/amount")
    Married: str = Field("Married", description="Marital status: Married, Single, Other")
    BankCustomer: str = Field("Yes", description="Has account with bank: Yes, No")
    EducationLevel: str = Field("Bachelor", description="Education level category or code")
    Ethnicity: str = Field("White", description="Ethnicity group")
    YearsEmployed: float = Field(2.0, ge=0.0, description="Years in current or prior employment")
    PriorDefault: str = Field("No", description="Prior default flag: Yes, No")
    Employed: str = Field("Yes", description="Currently employed: Yes, No")
    CreditScore: int = Field(680, ge=0, le=900, description="Credit score rating or count")
    DriversLicense: str = Field("Yes", description="Driver's license flag: Yes, No")
    Citizen: str = Field("ByBirth", description="Citizenship status: ByBirth, ByOtherMeans, Temporary")
    ZipCode: int = Field(10001, description="Postal code")
    Income: int = Field(50000, ge=0, description="Annual income")
    
    threshold: Optional[float] = Field(0.50, ge=0.1, le=0.9, description="Decision probability threshold")
    save_to_db: Optional[bool] = Field(True, description="Save to SQLite database")

class FactorExplanation(BaseModel):
    factor: str
    impact: str
    description: str

class PredictionResult(BaseModel):
    id: Optional[int] = None
    applicant_name: str
    approved: bool
    status: str
    approval_probability: float
    approval_percentage: float
    risk_level: str
    credit_tier: str
    risk_color: str
    threshold_used: float
    factors: List[FactorExplanation]
    recommendations: List[str]
    input_summary: Dict[str, Any]
    created_at: Optional[str] = None

class BatchApplicantItem(BaseModel):
    ApplicantName: Optional[str] = "Batch Applicant"
    Gender: Optional[str] = "Male"
    Age: Optional[float] = 32.0
    Debt: Optional[float] = 1.5
    Married: Optional[str] = "Married"
    BankCustomer: Optional[str] = "Yes"
    EducationLevel: Optional[str] = "Bachelor"
    Ethnicity: Optional[str] = "White"
    YearsEmployed: Optional[float] = 3.5
    PriorDefault: Optional[str] = "No"
    Employed: Optional[str] = "Yes"
    CreditScore: Optional[int] = 720
    DriversLicense: Optional[str] = "Yes"
    Citizen: Optional[str] = "ByBirth"
    ZipCode: Optional[int] = 10001
    Income: Optional[int] = 65000

class BatchPredictionResponse(BaseModel):
    total_processed: int
    total_approved: int
    total_rejected: int
    approval_rate: float
    results: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    model_loaded: bool
    database_connected: bool
    timestamp: str

class RetrainResponse(BaseModel):
    status: str
    message: str
    trained_at: str
    best_hyperparameters: Dict[str, Any]
    metrics: Dict[str, float]
