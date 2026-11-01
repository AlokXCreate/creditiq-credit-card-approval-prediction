# CREDITIQ Machine Learning Pipeline & Interpretability

## 1. Dataset Overview

CREDITIQ utilizes the benchmark **UCI Credit Approval Dataset** (`crx.data`), consisting of 690 real-world credit application instances with 15 attributes:

| Feature | Type | Description | Handling |
| :--- | :--- | :--- | :--- |
| **Gender** | Categorical | Applicant gender (Male / Female) | One-Hot Encoded |
| **Age** | Numerical | Age in years (18 - 80) | Median Imputation + StandardScaler |
| **Debt** | Numerical | Outstanding debt ratio | Median Imputation + StandardScaler |
| **Married** | Categorical | Marital status (Married / Single / Other) | One-Hot Encoded |
| **BankCustomer** | Categorical | Existing banking customer (Yes / No) | One-Hot Encoded |
| **EducationLevel** | Categorical | Education attainment category | One-Hot Encoded |
| **Ethnicity** | Categorical | Demographic group | One-Hot Encoded |
| **YearsEmployed** | Numerical | Continuous employment duration (years) | Median Imputation + StandardScaler |
| **PriorDefault** | Categorical | Historical default recorded (Yes / No) | One-Hot Encoded (Primary Driver) |
| **Employed** | Categorical | Current employment status (Yes / No) | One-Hot Encoded |
| **CreditScore** | Numerical | Credit rating / bureau activity count | Median Imputation + StandardScaler |
| **DriversLicense** | Categorical | Identification flag (Yes / No) | One-Hot Encoded |
| **Citizen** | Categorical | Citizenship status (ByBirth / Other / Temp) | One-Hot Encoded |
| **ZipCode** | Numerical | Postal identifier | Median Imputation + StandardScaler |
| **Income** | Numerical | Annual earnings | Median Imputation + StandardScaler |
| **Approved** | Binary Target | Approval status (1 = Approved, 0 = Rejected) | Stratified Target |

## 2. Preprocessing & Feature Engineering

1. **Missing Value Imputation**:
   - Numerical columns: Missing values (`?`) are imputed with the median of each respective column.
   - Categorical columns: Imputed using the most frequent mode.
2. **ColumnTransformer Pipeline**:
   - `StandardScaler`: Applied to all 6 numerical attributes to achieve zero mean and unit variance ($z = \frac{x - \mu}{\sigma}$).
   - `OneHotEncoder`: Applied to all 9 categorical attributes with `handle_unknown="ignore"` to safeguard against out-of-vocabulary categories in production.

## 3. GridSearchCV Hyperparameter Optimization

A 5-fold stratified cross-validation search evaluates regularized Logistic Regression over the following parameter space:

```python
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
```

### Optimal Hyperparameters Found:
- **C**: `1.0` (Optimal inverse regularization strength)
- **Penalty**: `l1` (Lasso regularization encouraging feature sparsity)
- **Solver**: `liblinear` (Robust coordinate descent for binary classification)
- **Mean Cross-Validation ROC-AUC**: `0.9177`

## 4. Test Set Evaluation Metrics

Evaluated on an independent 20% holdout test set (138 instances):

- **Accuracy**: `86.23%`
- **ROC-AUC Score**: `0.9636`
- **F1 Score**: `0.8480`
- **Precision**: `82.81%`
- **Recall**: `86.89%`

### Confusion Matrix (Holdout Test Set)

| Actual \ Predicted | Predicted Rejected (0) | Predicted Approved (1) |
| :--- | :--- | :--- |
| **Actual Rejected (0)** | 66 (True Negatives) | 11 (False Positives) |
| **Actual Approved (1)** | 8 (False Negatives) | 53 (True Positives) |

## 5. Model Interpretability & Odds Ratios

Logistic Regression outputs log-odds:

$$\ln\left(\frac{P}{1-P}\right) = \beta_0 + \sum_{i=1}^p \beta_i X_i$$

Odds Ratio (OR) is computed as $\text{OR}_i = e^{\beta_i}$:
- **PriorDefault = No**: Largest positive contributor to approval probability ($\text{OR} > 4.5$).
- **CreditScore**: Substantial positive coefficient per standard deviation increase.
- **Income & YearsEmployed**: Statistically significant positive drivers of loan approval.
- **PriorDefault = Yes & High Debt**: Strongest negative drivers of credit card rejection.
