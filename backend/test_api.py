from fastapi.testclient import TestClient
from backend.main import app

def test_backend():
    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/api/health")
        print("Health check status:", res.status_code, res.json())
        assert res.status_code == 200
        assert res.json()["model_loaded"] == True

    # 2. Prediction test
    payload = {
        "applicant_name": "Test User",
        "Gender": "Female",
        "Age": 34.0,
        "Debt": 2.1,
        "Married": "Married",
        "BankCustomer": "Yes",
        "EducationLevel": "Bachelor",
        "Ethnicity": "White",
        "YearsEmployed": 4.5,
        "PriorDefault": "No",
        "Employed": "Yes",
        "CreditScore": 750,
        "DriversLicense": "Yes",
        "Citizen": "ByBirth",
        "ZipCode": 10001,
        "Income": 75000,
        "threshold": 0.50,
        "save_to_db": True
    }
    pred_res = client.post("/api/predict", json=payload)
    print("Predict status:", pred_res.status_code)
    pred_data = pred_res.json()
    print("Prediction Result:", pred_data["status"], f"Prob: {pred_data['approval_percentage']}%", pred_data["risk_level"])
    assert pred_res.status_code == 200
    assert "approved" in pred_data

    # 3. Analytics metrics
    metrics_res = client.get("/api/analytics/metrics")
    print("Metrics status:", metrics_res.status_code, "Accuracy:", metrics_res.json()["metrics"]["accuracy"])
    assert metrics_res.status_code == 200

    # 4. History check
    hist_res = client.get("/api/history")
    print("History count:", hist_res.json()["total"])
    assert hist_res.json()["total"] >= 1

    print("ALL BACKEND TESTS PASSED!")

if __name__ == "__main__":
    test_backend()
