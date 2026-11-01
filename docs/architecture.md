# CREDITIQ System Architecture

CREDITIQ is an enterprise-grade Machine Learning FinTech web application for automated credit card approval prediction, risk tier assessment, and portfolio underwriting analytics.

## 1. High-Level Architecture

```
[ Client Browser (React + Vite + Tailwind CSS + MagicUI) ]
                         │
                         ▼ HTTPS / REST
[ FastAPI High-Performance Backend (Python 3.14 + Uvicorn) ]
       │                                     │
       ▼                                     ▼
[ SQLite Database (creditiq.db) ]    [ Scikit-Learn Pipeline ]
  • credit_applications table         • ColumnTransformer (StandardScaler + OneHotEncoder)
  • model_run_history table           • LogisticRegression (Tuned via 5-Fold GridSearchCV)
                                      • Probability Calibration & Feature Interpretability
```

## 2. Component Specifications

### Frontend Layer
- **Framework**: React 18 + TypeScript + Vite.
- **Styling**: Tailwind CSS with custom FinTech theme tokens (Emerald, Indigo, Slate, Rose).
- **Component Enhancements**: Magic UI components (`NumberTicker`, `ShimmerButton`, `BorderBeam`, `DotPattern`, `AnimatedShinyText`).
- **Icons**: Lucide React.
- **Visual Feedback**: Canvas Confetti for approval celebration, custom SVG ROC curve visualization, interactive Confusion Matrix heatmap.
- **Reporting**: Browser-side PDF generation via `jsPDF` and `jspdf-autotable`.

### Backend Layer
- **Framework**: FastAPI (Asynchronous Python REST API).
- **Server**: Uvicorn ASGI server with multi-worker support.
- **Data Validation**: Pydantic v2 schemas for request validation and serialization.
- **Persistence**: SQLite database via SQLAlchemy ORM with automatic schema initialization and initial seed data.

### Machine Learning Layer
- **Dataset**: UCI Credit Screening Benchmark (690 instances, 15 attributes + 1 target).
- **Algorithm**: Logistic Regression with L1/L2 regularization (`liblinear` / `lbfgs` solvers).
- **Hyperparameter Optimization**: 5-Fold Stratified `GridSearchCV` optimizing ROC-AUC score.
- **Test Performance**:
  - **Accuracy**: 86.23%
  - **ROC-AUC**: 0.9636
  - **F1 Score**: 0.8480
  - **Precision**: 82.81%
  - **Recall**: 86.89%
- **Interpretability**: Extraction of model coefficients and odds ratios (`exp(coef)`) mapped back to original features for actionable underwriting explanation.
