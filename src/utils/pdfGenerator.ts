// install first: npm install pdfkit @types/pdfkit

import PDFDocument from "pdfkit";
import fs from "fs";
import { resumeTemplates } from "./resumeTemplates"; // your provided data

function generateResumePDF(templateId: string) {
  const template = resumeTemplates.find(t => t.id === templateId);

  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `${templateId}.pdf`;
  doc.pipe(fs.createWriteStream(fileName));

  // ------------------- HEADER -------------------
  doc
    .fontSize(24)
    .fillColor(template.colors.primary)
    .font(template.typography.headingFont || "Helvetica-Bold")
    .text(template.name, { align: "center" });

  doc
    .moveDown()
    .fontSize(12)
    .fillColor(template.colors.text)
    .font(template.typography.bodyFont || "Helvetica")
    .text(template.description, { align: "center" });

  doc.moveDown(2);

  // ------------------- SECTION: TEMPLATE INFO -------------------
  doc
    .fontSize(14)
    .fillColor(template.colors.secondary)
    .text("Template Information", { underline: true });

  doc
    .moveDown(0.5)
    .fontSize(12)
    .fillColor(template.colors.text)
    .text(`Category: ${template.category}`)
    .text(`Layout: ${template.layout}`)
    .text(`Typography: ${template.typography.headingFont} (Headings), ${template.typography.bodyFont} (Body)`)
    .text(`ATS Score: ${template.atsScore}%`)
    .text(`Overall Rating: ${template.overallRating}/10`);

  doc.moveDown();

  // ------------------- SECTION: FEATURES -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Features", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.features.forEach((feature) => {
    doc.text(`• ${feature}`);
  });
  doc.moveDown();

  // ------------------- SECTION: STRENGTHS / WEAKNESSES -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Strengths", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.strengths.forEach((s) => doc.text(`✔ ${s}`));
  doc.moveDown();

  doc.fillColor(template.colors.secondary).fontSize(14).text("Weaknesses", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.weaknesses.forEach((w) => doc.text(`✘ ${w}`));
  doc.moveDown();

  // ------------------- SECTION: SUGGESTIONS -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Suggestions", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.suggestions.forEach((s) => doc.text(`👉 ${s}`));
  doc.moveDown();

  // ------------------- SECTION: JOB MATCHES -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Best Job Matches", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.jobMatches.forEach((job) => doc.text(`• ${job}`));
  doc.moveDown();

  // ------------------- SECTION: SKILL GAPS -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Skill Gaps", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.skillGaps.forEach((gap) => doc.text(`⚠ ${gap}`));
  doc.moveDown();

  // ------------------- SECTION: TRENDS + INSIGHTS -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Industry Trends", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12);
  template.industryTrends.forEach((trend) => doc.text(`• ${trend}`));
  doc.moveDown();

  doc.fillColor(template.colors.secondary).fontSize(14).text("Salary Insights", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12).text(template.salaryInsights);
  doc.moveDown();

  // ------------------- SECTION: KEYWORDS -------------------
  doc.fillColor(template.colors.secondary).fontSize(14).text("Keywords", { underline: true });
  doc.fillColor(template.colors.text).fontSize(12).text(template.keywords.join(", "));
  doc.moveDown(2);

  // ------------------- FOOTER -------------------
  doc
    .fontSize(10)
    .fillColor(template.colors.accent)
    .text(`Generated Resume Template: ${template.name}`, { align: "center" });

  doc.end();
  console.log(`✅ PDF generated: ${fileName}`);
}

// Example usage: generate PDF for one template
generateResumePDF("career-catalyst");

// Or loop to generate all templates
// resumeTemplates.forEach(t => generateResumePDF(t.id));
