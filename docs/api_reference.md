# CREDITIQ REST API Reference

All requests and responses use JSON formatting unless noted otherwise.

## Base URL
- **Local**: `http://localhost:8000`
- **Interactive OpenAPI Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 1. System Health
### `GET /api/health`
Checks server health, model availability, and database connectivity.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "CREDITIQ API",
  "version": "1.0.0",
  "model_loaded": true,
  "database_connected": true,
  "timestamp": "2026-11-01 12:39:10 UTC"
}
```

---

## 2. Prediction Endpoints
### `POST /api/predict`
Evaluates a single credit applicant using the trained Logistic Regression pipeline.

**Request Body:**
```json
{
  "applicant_name": "Eleanor Vance",
  "Gender": "Female",
  "Age": 32.5,
  "Debt": 2.5,
  "Married": "Married",
  "BankCustomer": "Yes",
  "EducationLevel": "Bachelor",
  "Ethnicity": "White",
  "YearsEmployed": 4.5,
  "PriorDefault": "No",
  "Employed": "Yes",
  "CreditScore": 740,
  "DriversLicense": "Yes",
  "Citizen": "ByBirth",
  "ZipCode": 94107,
  "Income": 75000,
  "threshold": 0.50,
  "save_to_db": true
}
```

**Response (200 OK):**
```json
{
  "id": 8,
  "applicant_name": "Eleanor Vance",
  "approved": true,
  "status": "APPROVED",
  "approval_probability": 0.962,
  "approval_percentage": 96.2,
  "risk_level": "LOW RISK",
  "credit_tier": "Tier 1 (Prime)",
  "risk_color": "#10B981",
  "threshold_used": 0.50,
  "factors": [
    {
      "factor": "Clean Credit History",
      "impact": "Positive",
      "description": "No prior defaults recorded, significantly boosting approval probability."
    }
  ],
  "recommendations": [
    "Applicant qualifies for premium card rewards program.",
    "Recommend setting credit limit in Tier A based on income ratio."
  ]
}
```

### `POST /api/predict/batch-csv?threshold=0.50`
Uploads a multipart CSV containing multi-applicant columns for bulk evaluation.

---

## 3. Analytics Endpoints
### `GET /api/analytics/metrics`
Returns complete model diagnostic metrics, 5-Fold Stratified GridSearchCV hyperparameter summary, confusion matrix, and ROC curve coordinates.

### `GET /api/analytics/summary`
Returns high-level portfolio KPIs: total applications, approval rate, average credit score, and risk distribution.

---

## 4. Audit History Endpoints
### `GET /api/history?search=&status=&risk=&limit=50&offset=0`
Returns paginated decision history.

### `GET /api/history/export/csv`
Downloads complete audit log as a CSV spreadsheet.

### `DELETE /api/history/{id}`
Deletes an application record by ID.
