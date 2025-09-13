import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ResumeTemplate } from "./resumeTemplates";

export function generateResumePDF(template: ResumeTemplate) {
  const doc = new jsPDF();

  // --- Title / Header ---
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(template.colors.primary || "#000000");
  doc.text(template.name, 105, 20, { align: "center" });

  // Category & ATS Score
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(template.colors.text || "#111111");
  doc.text(`Category: ${template.category}`, 20, 35);
  doc.text(`ATS Score: ${template.atsScore}%`, 150, 35);

  // Overall Rating
  doc.text(`Overall Rating: ${template.overallRating}/10`, 20, 45);

  // --- Description ---
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.setTextColor(template.colors.secondary || "#333333");
  doc.text("Description", 20, 60);

  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  doc.setTextColor(template.colors.text || "#111111");
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(template.description, 170), 20, 68);

  // --- Features ---
  autoTable(doc, {
    startY: 85,
    head: [["Features"]],
    body: template.features.map((f) => [f]),
    theme: "grid",
    styles: { fontSize: 10, textColor: template.colors.text },
    headStyles: { fillColor: template.colors.primary, textColor: "#fff" },
  });

  let y = (doc as any).lastAutoTable.finalY + 10;

  // --- Strengths ---
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.setTextColor(template.colors.secondary || "#333333");
  doc.text("Strengths", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.strengths.forEach((s) => {
    doc.text(`• ${s}`, 25, y);
    y += 6;
  });

  // --- Weaknesses ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Weaknesses", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.weaknesses.forEach((w) => {
    doc.text(`• ${w}`, 25, y);
    y += 6;
  });

  // --- Suggestions ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Suggestions", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.suggestions.forEach((s) => {
    doc.text(`• ${s}`, 25, y);
    y += 6;
  });

  // --- Job Matches ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Job Matches", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.jobMatches.forEach((j) => {
    doc.text(`• ${j}`, 25, y);
    y += 6;
  });

  // --- Skill Gaps ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Skill Gaps", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.skillGaps.forEach((sg) => {
    doc.text(`• ${sg}`, 25, y);
    y += 6;
  });

  // --- Industry Trends ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Industry Trends", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  template.industryTrends.forEach((trend) => {
    doc.text(`• ${trend}`, 25, y);
    y += 6;
  });

  // --- Salary Insights ---
  y += 6;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Salary Insights", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  const salaryText = doc.splitTextToSize(template.salaryInsights, 170);
  doc.text(salaryText, 25, y);
  y += salaryText.length * 6;

  // --- Keywords ---
  y += 10;
  doc.setFont(template.typography.headingFont || "helvetica", "bold");
  doc.text("Keywords", 20, y);
  y += 8;
  doc.setFont(template.typography.bodyFont || "helvetica", "normal");
  doc.text(template.keywords.join(", "), 25, y);

  // --- Save PDF ---
  doc.save(`${template.id}-resume.pdf`);
}
