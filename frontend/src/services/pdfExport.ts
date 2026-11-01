import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PredictionResult } from "./api";

export function generateCreditReportPDF(result: PredictionResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors
  const primaryColor: [number, number, number] = result.approved ? [16, 185, 129] : [239, 68, 68];
  const darkBg: [number, number, number] = [15, 23, 42];

  // Top FinTech Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 32, "F");

  // Logo / Header
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CREDITIQ", 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Automated Machine Learning Credit Underwriting Decision Report", 14, 23);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toUTCString()}`, 145, 16);
  doc.text(`Application ID: #${result.id || "LIVE-EVAL"}`, 145, 23);

  // Status Badge Block
  doc.setFillColor(...primaryColor);
  doc.roundedRect(14, 38, 182, 22, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`DECISION: ${result.status}`, 22, 49);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Approval Probability: ${result.approval_percentage}%  |  Risk Assessment: ${result.risk_level}  |  Tier: ${result.credit_tier}`, 22, 55);

  // Applicant Profile Table
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Applicant Profile & Financial Snapshot", 14, 70);

  const inp = result.input_summary || {};
  const applicantRows = [
    ["Applicant Name", result.applicant_name, "Credit Bureau Score", `${inp.CreditScore ?? "N/A"}`],
    ["Age / Gender", `${inp.Age ?? "N/A"} yrs / ${inp.Gender ?? "N/A"}`, "Annual Income", `$${Number(inp.Income || 0).toLocaleString()}`],
    ["Marital Status", `${inp.Married ?? "N/A"}`, "Outstanding Debt Ratio", `${inp.Debt ?? "N/A"}`],
    ["Employment Longevity", `${inp.YearsEmployed ?? "N/A"} years`, "Prior Default Flag", `${inp.PriorDefault ?? "No"}`],
    ["Education Level", `${inp.EducationLevel ?? "N/A"}`, "Existing Bank Customer", `${inp.BankCustomer ?? "Yes"}`],
    ["Citizenship Status", `${inp.Citizen ?? "ByBirth"}`, "Postal Zip Code", `${inp.ZipCode ?? "N/A"}`]
  ];

  autoTable(doc, {
    startY: 74,
    head: [["Attribute", "Record Detail", "Financial Attribute", "Record Detail"]],
    body: applicantRows,
    theme: "striped",
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
  });

  // Decision Factors Table
  let currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("Machine Learning Interpretability & Decision Factors", 14, currentY);

  const factorRows = (result.factors || []).map((f) => [
    f.factor,
    f.impact,
    f.description
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [["Risk Factor", "Impact", "Underwriting Context & Model Contribution"]],
    body: factorRows.length > 0 ? factorRows : [["Automated Assessment", "Neutral", "Balanced credit profile against standard underwriting threshold."]],
    theme: "grid",
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45 },
      1: { cellWidth: 25 },
      2: { cellWidth: 112 }
    },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  // Recommendations
  currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("Underwriting Advisory & Next Steps", 14, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const recs = result.recommendations || [];
  let recY = currentY + 6;
  recs.forEach((rec) => {
    doc.text(`•  ${rec}`, 18, recY);
    recY += 5;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Confidential — CREDITIQ Algorithmic Credit Evaluation is powered by Logistic Regression with GridSearchCV 5-Fold Stratified Cross-Validation.",
    14,
    285
  );

  doc.save(`CreditIQ_Decision_Report_${result.applicant_name.replace(/\s+/g, "_")}.pdf`);
}
