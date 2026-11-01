import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, precision_recall_curve
)

from backend.ml.dataset import (
    load_credit_data, NUMERICAL_COLS, CATEGORICAL_COLS, TARGET_COL
)

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "artifacts"))
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "credit_model.joblib")
META_PATH = os.path.join(ARTIFACTS_DIR, "model_meta.json")

def train_and_evaluate(custom_data_path: str = None) -> dict:
    """Trains the Logistic Regression model using GridSearchCV and saves artifacts."""
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    # 1. Load Data
    df = load_credit_data(custom_data_path)
    X = df[NUMERICAL_COLS + CATEGORICAL_COLS]
    y = df[TARGET_COL]

    # 2. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Preprocessing ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_COLS),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_COLS)
        ]
    )

    # 4. Pipeline
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=2000, random_state=42))
        ]
    )

    # 5. GridSearchCV Parameter Space
    param_grid = [
        {
            "classifier__C": [0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0],
            "classifier__penalty": ["l1", "l2"],
            "classifier__solver": ["liblinear"]
        },
        {
            "classifier__C": [0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0],
            "classifier__penalty": ["l2"],
            "classifier__solver": ["lbfgs"]
        }
    ]

    print("Running GridSearchCV for Logistic Regression...")
    grid_search = GridSearchCV(
        pipeline,
        param_grid=param_grid,
        cv=5,
        scoring="roc_auc",
        refit=True,
        return_train_score=True,
        n_jobs=-1
    )

    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    best_params = grid_search.best_params_
    best_cv_score = float(grid_search.best_score_)

    # 6. Evaluation on Test Set
    y_pred = best_model.predict(X_test)
    y_proba = best_model.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # ROC Curve coordinates (downsampled for smooth chart rendering)
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_points = [
        {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
        for f, t in zip(fpr[::max(1, len(fpr) // 25)], tpr[::max(1, len(tpr) // 25)])
    ]
    if roc_points[-1]["fpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})

    # Precision-Recall Curve coordinates
    precisions, recalls, _ = precision_recall_curve(y_test, y_proba)
    pr_points = [
        {"recall": round(float(r), 4), "precision": round(float(p), 4)}
        for r, p in zip(recalls[::max(1, len(recalls) // 25)], precisions[::max(1, len(precisions) // 25)])
    ]

    # 7. Extract Feature Names and Coefficients
    # Get one-hot encoder feature names
    cat_encoder = best_model.named_steps["preprocessor"].named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_COLS))
    all_feature_names = NUMERICAL_COLS + cat_feature_names

    coefficients = best_model.named_steps["classifier"].coef_[0]
    intercept = float(best_model.named_steps["classifier"].intercept_[0])

    features_impact = []
    for name, coef in zip(all_feature_names, coefficients):
        odds_ratio = float(np.exp(coef))
        features_impact.append({
            "feature": name,
            "coefficient": round(float(coef), 4),
            "odds_ratio": round(odds_ratio, 4),
            "abs_coef": round(abs(float(coef)), 4),
            "impact": "Positive" if coef > 0 else "Negative"
        })

    features_impact.sort(key=lambda x: x["abs_coef"], reverse=True)

    # 8. Top Grid Search Iterations summary
    cv_results = grid_search.cv_results_
    top_grid_runs = []
    for i in range(len(cv_results["params"])):
        top_grid_runs.append({
            "params": {k.replace("classifier__", ""): v for k, v in cv_results["params"][i].items()},
            "mean_test_roc_auc": round(float(cv_results["mean_test_score"][i]), 4),
            "std_test_roc_auc": round(float(cv_results["std_test_score"][i]), 4),
            "rank": int(cv_results["rank_test_score"][i])
        })
    top_grid_runs.sort(key=lambda x: x["rank"])
    top_grid_runs = top_grid_runs[:10]  # top 10

    # 9. Meta Dictionary
    meta = {
        "model_name": "CreditIQ Logistic Regression Classifier",
        "algorithm": "Logistic Regression with L1/L2 Regularization (ElasticNet/Liblinear)",
        "hyperparameter_tuning": "5-Fold Stratified GridSearchCV",
        "trained_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "best_hyperparameters": {k.replace("classifier__", ""): v for k, v in best_params.items()},
        "best_cv_roc_auc": round(best_cv_score, 4),
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4)
        },
        "confusion_matrix": {
            "matrix": cm,
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "intercept": round(intercept, 4),
        "roc_curve": roc_points,
        "pr_curve": pr_points,
        "top_features": features_impact[:20],
        "grid_search_summary": top_grid_runs
    }

    # 10. Save Artifacts
    joblib.dump(best_model, MODEL_PATH)
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print(f"Model saved to {MODEL_PATH}")
    print(f"Metrics: Accuracy={acc:.4f}, ROC-AUC={auc:.4f}, F1={f1:.4f}")
    return meta

if __name__ == "__main__":
    train_and_evaluate()
