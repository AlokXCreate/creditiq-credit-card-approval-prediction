import os
import re
import pandas as pd
import numpy as np

def prepare():
    raw_path = r"C:\Users\Alok\.gemini\antigravity-ide\brain\47e5daee-6858-4944-9bc4-c3be0fd54894\.system_generated\steps\105\content.md"
    crx_path = r"c:\Users\Alok\Desktop\SD Project\data\crx.data"
    csv_path = r"c:\Users\Alok\Desktop\SD Project\data\credit_approval_cleaned.csv"
    batch_path = r"c:\Users\Alok\Desktop\SD Project\data\sample_batch_applicants.csv"

    # Extract raw rows from content.md
    with open(raw_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    data_lines = []
    for line in lines:
        line = line.strip()
        if re.match(r"^[ab\?],[0-9\.]+", line) or (',' in line and ('+' in line or '-' in line) and len(line.split(',')) == 16):
            data_lines.append(line)

    print(f"Extracted {len(data_lines)} valid rows from UCI data.")

    # Save crx.data
    with open(crx_path, "w", encoding="utf-8") as f:
        for line in data_lines:
            f.write(line + "\n")

    # Column names for UCI Credit Approval
    columns = [
        "Gender", "Age", "Debt", "Married", "BankCustomer", "EducationLevel",
        "Ethnicity", "YearsEmployed", "PriorDefault", "Employed", "CreditScore",
        "DriversLicense", "Citizen", "ZipCode", "Income", "Approved"
    ]

    records = [row.split(",") for row in data_lines]
    df = pd.DataFrame(records, columns=columns)

    # Clean missing values '?'
    df.replace("?", np.nan, inplace=True)

    # Convert numeric columns
    numeric_cols = ["Age", "Debt", "YearsEmployed", "CreditScore", "ZipCode", "Income"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        # Impute with median
        df[col] = df[col].fillna(df[col].median())

    # Categorical columns imputation with mode
    cat_cols = ["Gender", "Married", "BankCustomer", "EducationLevel", "Ethnicity", "PriorDefault", "Employed", "DriversLicense", "Citizen"]
    for col in cat_cols:
        df[col] = df[col].fillna(df[col].mode()[0])

    # Standardize Approved label to 1 (+) and 0 (-)
    df["Approved"] = df["Approved"].apply(lambda x: 1 if str(x).strip() == "+" else 0)

    # Standardize binary indicators to Yes/No or readable strings
    df["Gender"] = df["Gender"].map({"a": "Female", "b": "Male"}).fillna("Male")
    df["Married"] = df["Married"].map({"u": "Married", "y": "Single", "l": "Other", "t": "Other"}).fillna("Married")
    df["BankCustomer"] = df["BankCustomer"].map({"g": "Yes", "p": "No", "gg": "Other"}).fillna("Yes")
    df["PriorDefault"] = df["PriorDefault"].map({"t": "Yes", "f": "No"}).fillna("No")
    df["Employed"] = df["Employed"].map({"t": "Yes", "f": "No"}).fillna("No")
    df["DriversLicense"] = df["DriversLicense"].map({"t": "Yes", "f": "No"}).fillna("No")
    df["Citizen"] = df["Citizen"].map({"g": "ByBirth", "p": "ByOtherMeans", "s": "Temporary"}).fillna("ByBirth")

    # Round numeric values for clean representation
    df["Age"] = df["Age"].round(1)
    df["Debt"] = df["Debt"].round(2)
    df["YearsEmployed"] = df["YearsEmployed"].round(2)
    df["CreditScore"] = df["CreditScore"].astype(int)
    df["ZipCode"] = df["ZipCode"].astype(int)
    df["Income"] = df["Income"].astype(int)

    # Save cleaned CSV
    df.to_csv(csv_path, index=False)
    print(f"Saved cleaned dataset to {csv_path} with shape {df.shape}")

    # Generate sample batch applicants CSV for demo / upload testing
    sample_batch = df.drop(columns=["Approved"]).sample(n=15, random_state=42).reset_index(drop=True)
    sample_batch.insert(0, "ApplicantName", [
        "Eleanor Vance", "Marcus Sterling", "Aria Montgomery", "Jonathan Hayes",
        "Sophia Chen", "Liam O'Connor", "David Kim", "Isabella Rossi",
        "Nathaniel Brooks", "Zoe Saldana", "Lucas Wright", "Amara Okafor",
        "Ethan Tremblay", "Chloe Bennett", "Julian Thorne"
    ])
    sample_batch.to_csv(batch_path, index=False)
    print(f"Saved sample batch dataset to {batch_path} with shape {sample_batch.shape}")

if __name__ == "__main__":
    prepare()
