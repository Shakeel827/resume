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
  y += 20;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.text(title.toUpperCase(), margin, y);

  // underline
  pdf.setDrawColor(color.r, color.g, color.b);
  pdf.setLineWidth(1.5);
  const textWidth = pdf.getTextWidth(title.toUpperCase());
  pdf.line(margin, y + 3, margin + Math.min(textWidth, contentWidth), y + 3);

  return y + 20;
};

// Main PDF generator - FIXED to use the selected template
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
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primary = hexToRgb(template.colors.primary);
  const secondary = hexToRgb(template.colors.secondary);
  const accent = hexToRgb(template.colors.accent);
  const textColor = hexToRgb(template.colors.text);

  // Header block
  pdf.setFillColor(primary.r, primary.g, primary.b);
  pdf.rect(0, 0, pageWidth, 100, "F");

  // Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  const name = data.personalInfo.name || "Your Name";
  const nameWidth = pdf.getTextWidth(name);
  pdf.text(name, (pageWidth - nameWidth) / 2, 45);

  // Contact info
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  let contactItems: string[] = [];
  if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
  if (data.personalInfo.location)
    contactItems.push(`📍 ${data.personalInfo.location}`);

  if (contactItems.length > 0) {
    const contactText = contactItems.join("  •  ");
    const contactWidth = pdf.getTextWidth(contactText);
    pdf.text(contactText, (pageWidth - contactWidth) / 2, 70);
  }

  // Social
  let socials: string[] = [];
  if (data.personalInfo.linkedin) socials.push(`🔗 ${data.personalInfo.linkedin}`);
  if (data.personalInfo.github) socials.push(`💻 ${data.personalInfo.github}`);
  if (socials.length > 0) {
    const socialText = socials.join("  •  ");
    const socialWidth = pdf.getTextWidth(socialText);
    pdf.text(socialText, (pageWidth - socialWidth) / 2, 85);
  }

  y = 120;

  // Summary
  if (data.personalInfo.summary) {
    y = addSectionHeader(pdf, "Professional Summary", y, primary, margin, contentWidth);
    y = addWrappedText(pdf, data.personalInfo.summary, margin, y, contentWidth, 11, 1.5, "normal", textColor);
  }

  // Experience
  if (data.experience?.length) {
    y = addSectionHeader(pdf, "Work Experience", y, primary, margin, contentWidth);
    data.experience.forEach((exp) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(exp.title, margin, y);

      if (exp.duration) {
        const durationWidth = pdf.getTextWidth(exp.duration);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(exp.duration, pageWidth - margin - durationWidth, y);
      }

      y += 18;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(secondary.r, secondary.g, secondary.b);
      pdf.text(exp.company, margin, y);
      y += 15;

      if (exp.description) {
        y = addWrappedText(pdf, exp.description, margin, y, contentWidth, 10, 1.4, "normal", textColor);
      }
      y += 10;
    });
  }

  // Education
  if (data.education?.length) {
    y = addSectionHeader(pdf, "Education", y, primary, margin, contentWidth);
    data.education.forEach((edu) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(edu.degree, margin, y);

      if (edu.year) {
        const yearWidth = pdf.getTextWidth(edu.year);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(edu.year, pageWidth - margin - yearWidth, y);
      }

      y += 15;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(textColor.r, textColor.g, textColor.b);
      pdf.text(
        `${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
        margin,
        y
      );
      y += 20;
    });
  }

  // Skills
  if (data.skills?.length) {
    y = addSectionHeader(pdf, "Technical Skills", y, primary, margin, contentWidth);

    const skillsPerRow = 4;
    const skillWidth = (contentWidth - 30) / skillsPerRow;
    let currentCol = 0;
    let currentRow = 0;

    data.skills.forEach((skill) => {
      if (currentCol >= skillsPerRow) {
        currentCol = 0;
        currentRow++;
      }

      const x = margin + currentCol * skillWidth;
      const skillY = y + currentRow * 25;

      pdf.setFillColor(primary.r, primary.g, primary.b);
      pdf.roundedRect(x, skillY - 12, skillWidth - 10, 18, 3, 3, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      const text = skill.length > 12 ? skill.slice(0, 12) + "..." : skill;
      const tWidth = pdf.getTextWidth(text);
      pdf.text(text, x + (skillWidth - 10 - tWidth) / 2, skillY);

      currentCol++;
    });

    y += (currentRow + 1) * 25 + 20;
  }

  // Projects
  if (data.projects?.length) {
    y = addSectionHeader(pdf, "Projects", y, primary, margin, contentWidth);
    data.projects.forEach((proj) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.text(proj.name, margin, y);
      y += 15;

      if (proj.description) {
        y = addWrappedText(pdf, proj.description, margin, y, contentWidth, 10, 1.4, "normal", textColor);
      }

      if (proj.technologies) {
        y = addWrappedText(
          pdf,
          `Technologies: ${proj.technologies}`,
          margin,
          y + 5,
          contentWidth,
          9,
          1.3,
          "italic",
          secondary
        );
      }

      if (proj.link) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(accent.r, accent.g, accent.b);
        pdf.text(`🔗 ${proj.link}`, margin, y + 10);
        y += 15;
      }

      y += 15;
    });
  }

  // Save with template in filename
  const cleanName = (data.personalInfo.name || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
  const cleanTemplate = template.name.replace(/[^a-zA-Z0-9]/g, "_");
  pdf.save(`${cleanName}_${cleanTemplate}.pdf`);
};
