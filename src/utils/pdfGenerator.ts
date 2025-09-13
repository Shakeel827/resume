// src/utils/generateResumePDF.ts
import { jsPDF } from "jspdf";
import { getTemplateById } from "../data/resumeTemplates";

// Resume data type
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
}

// Convert HEX → RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Wrap text helper
const addWrappedText = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 11,
  lineHeight = 1.4,
  fontStyle: "normal" | "bold" | "italic" = "normal",
  color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 }
) => {
  if (!text || text.trim() === "") return y;

  pdf.setFont("helvetica", fontStyle);
  pdf.setFontSize(fontSize);
  pdf.setTextColor(color.r, color.g, color.b);

  const lines = pdf.splitTextToSize(text, maxWidth);
  const lineSpacing = fontSize * lineHeight;

  lines.forEach((line: string, index: number) => {
    pdf.text(line, x, y + index * lineSpacing);
  });

  return y + lines.length * lineSpacing + fontSize * 0.5;
};

// Section header helper
const addSectionHeader = (
  pdf: jsPDF,
  title: string,
  y: number,
  color: { r: number; g: number; b: number },
  margin: number,
  contentWidth: number
) => {
  y += 15;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.text(title.toUpperCase(), margin, y);

  // underline
  pdf.setDrawColor(color.r, color.g, color.b);
  pdf.setLineWidth(1.5);
  const textWidth = pdf.getTextWidth(title.toUpperCase());
  pdf.line(margin, y + 3, margin + Math.min(textWidth, contentWidth), y + 3);

  return y + 20;
};

// Main PDF generator
export const generateResumePDF = (
  data: ResumeData,
  templateId: string
) => {
  const template = getTemplateById(templateId);
  if (!template) {
    console.error("Template not found");
    return;
  }

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primary = hexToRgb(template.colors.primary);
  const secondary = hexToRgb(template.colors.secondary);
  const accent = hexToRgb(template.colors.accent);
  const textColor = hexToRgb(template.colors.text);

  // Header block
  pdf.setFillColor(primary.r, primary.g, primary.b);
  pdf.rect(0, 0, pageWidth, 120, "F");

  // Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  const name = data.personalInfo.name || "Your Name";
  pdf.text(name, margin, 70);

  // Contact info
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  let contactY = 90;
  if (data.personalInfo.email) {
    pdf.text(`📧 ${data.personalInfo.email}`, margin, contactY);
    contactY += 18;
  }
  if (data.personalInfo.phone) {
    pdf.text(`📱 ${data.personalInfo.phone}`, margin, contactY);
    contactY += 18;
  }
  if (data.personalInfo.location) {
    pdf.text(`📍 ${data.personalInfo.location}`, margin, contactY);
    contactY += 18;
  }

  // Social links
  if (data.personalInfo.linkedin) {
    pdf.text(`🔗 ${data.personalInfo.linkedin}`, margin, contactY);
    contactY += 18;
  }
  if (data.personalInfo.github) {
    pdf.text(`💻 ${data.personalInfo.github}`, margin, contactY);
  }

  y = 150;

  // Summary
  if (data.personalInfo.summary) {
    y = addSectionHeader(pdf, "PROFESSIONAL SUMMARY", y, primary, margin, contentWidth);
    y = addWrappedText(pdf, data.personalInfo.summary, margin, y, contentWidth, 12, 1.5, "normal", textColor);
    y += 10;
  }

  // Experience
  if (data.experience?.length) {
    y = addSectionHeader(pdf, "WORK EXPERIENCE", y, primary, margin, contentWidth);
    data.experience.forEach((exp) => {
      // Title and company
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(exp.title, margin, y);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(secondary.r, secondary.g, secondary.b);
      pdf.text(exp.company, margin, y + 20);
      
      // Duration on the right
      if (exp.duration) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        const durationWidth = pdf.getTextWidth(exp.duration);
        pdf.text(exp.duration, pageWidth - margin - durationWidth, y);
      }

      y += 35;

      // Description
      if (exp.description) {
        y = addWrappedText(pdf, exp.description, margin, y, contentWidth, 11, 1.4, "normal", textColor);
      }
      y += 20;
    });
  }

  // Education
  if (data.education?.length) {
    y = addSectionHeader(pdf, "EDUCATION", y, primary, margin, contentWidth);
    data.education.forEach((edu) => {
      // Degree
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(edu.degree, margin, y);
      
      // Year on the right
      if (edu.year) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        const yearWidth = pdf.getTextWidth(edu.year);
        pdf.text(edu.year, pageWidth - margin - yearWidth, y);
      }

      y += 20;
      
      // Institution and GPA
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(textColor.r, textColor.g, textColor.b);
      let institutionText = edu.institution;
      if (edu.gpa) {
        institutionText += ` | GPA: ${edu.gpa}`;
      }
      pdf.text(institutionText, margin, y);
      y += 30;
    });
  }

  // Skills
  if (data.skills?.length) {
    y = addSectionHeader(pdf, "TECHNICAL SKILLS", y, primary, margin, contentWidth);

    const skillsPerRow = 3;
    const skillWidth = contentWidth / skillsPerRow;
    let currentCol = 0;
    let currentRow = 0;

    data.skills.forEach((skill) => {
      if (currentCol >= skillsPerRow) {
        currentCol = 0;
        currentRow++;
      }

      const x = margin + currentCol * skillWidth;
      const skillY = y + currentRow * 30;

      pdf.setFillColor(primary.r, primary.g, primary.b);
      pdf.roundedRect(x, skillY - 15, skillWidth - 15, 22, 4, 4, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      const text = skill.length > 15 ? skill.slice(0, 15) + "..." : skill;
      const tWidth = pdf.getTextWidth(text);
      pdf.text(text, x + (skillWidth - 15 - tWidth) / 2, skillY);

      currentCol++;
    });

    y += (currentRow + 1) * 30 + 20;
  }

  // Projects
  if (data.projects?.length) {
    y = addSectionHeader(pdf, "PROJECTS", y, primary, margin, contentWidth);
    data.projects.forEach((proj) => {
      // Project name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(proj.name, margin, y);
      y += 20;

      // Description
      if (proj.description) {
        y = addWrappedText(pdf, proj.description, margin, y, contentWidth, 11, 1.4, "normal", textColor);
      }

      // Technologies
      if (proj.technologies) {
        y += 10;
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.setTextColor(secondary.r, secondary.g, secondary.b);
        pdf.text(`Technologies: ${proj.technologies}`, margin, y);
      }

      // Link
      if (proj.link) {
        y += 15;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(accent.r, accent.g, accent.b);
        pdf.text(`🔗 ${proj.link}`, margin, y);
      }

      y += 25;
    });
  }

  // Save with template in filename
  const cleanName = (data.personalInfo.name || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
  const cleanTemplate = template.name.replace(/[^a-zA-Z0-9]/g, "_");
  pdf.save(`${cleanName}_${cleanTemplate}.pdf`);
};
