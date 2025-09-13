// src/utils/pdfGenerator.ts
import { jsPDF } from "jspdf";

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

// Main PDF generator - optimized for Vercel
export const generateResumePDF = (
  data: ResumeData,
  templateId: string
) => {
  // This will be loaded dynamically on the client side
  return {
    data,
    templateId,
    generate: async () => {
      // Dynamically import jsPDF on client side only
      const { jsPDF } = await import("jspdf");
      const template = await import("../data/resumeTemplates").then(module => 
        module.getTemplateById(templateId)
      );
      
      if (!template) {
        console.error("Template not found");
        return false;
      }

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
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
      pdf.rect(0, 0, pageWidth, 100, "F");

      // Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      const name = data.personalInfo.name || "Your Name";
      pdf.text(name, margin, 40);

      // Contact info
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      const contactItems = [];
      if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
      if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
      if (data.personalInfo.location) contactItems.push(`📍 ${data.personalInfo.location}`);
      if (data.personalInfo.linkedin) contactItems.push(`🔗 ${data.personalInfo.linkedin}`);
      if (data.personalInfo.github) contactItems.push(`💻 ${data.personalInfo.github}`);

      const contactText = contactItems.join("  •  ");
      pdf.text(contactText, margin, 60);

      y = 90;

      // Professional Summary
      if (data.personalInfo.summary) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(primary.r, primary.g, primary.b);
        pdf.text("PROFESSIONAL SUMMARY", margin, y);
        y += 20;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        y = addWrappedText(pdf, data.personalInfo.summary, margin, y, contentWidth, 11, 1.4);
        y += 20;
      }

      // Professional Experience
      if (data.experience?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(primary.r, primary.g, primary.b);
        pdf.text("PROFESSIONAL EXPERIENCE", margin, y);
        y += 25;

        data.experience.forEach((exp) => {
          // Title and company
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(primary.r, primary.g, primary.b);
          pdf.text(exp.title, margin, y);

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.setTextColor(textColor.r, textColor.g, textColor.b);
          pdf.text(exp.company, margin, y + 15);
          
          // Duration on the right
          if (exp.duration) {
            const durationWidth = pdf.getTextWidth(exp.duration);
            pdf.text(exp.duration, pageWidth - margin - durationWidth, y);
          }

          y += 30;

          // Description
          if (exp.description) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            y = addWrappedText(pdf, exp.description, margin, y, contentWidth, 10, 1.4);
          }
          y += 15;
        });
      }

      // Education
      if (data.education?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(primary.r, primary.g, primary.b);
        pdf.text("EDUCATION", margin, y);
        y += 25;

        data.education.forEach((edu) => {
          // Degree
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(primary.r, primary.g, primary.b);
          pdf.text(edu.degree, margin, y);
          
          // Year on the right
          if (edu.year) {
            const yearWidth = pdf.getTextWidth(edu.year);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(textColor.r, textColor.g, textColor.b);
            pdf.text(edu.year, pageWidth - margin - yearWidth, y);
          }

          y += 20;
          
          // Institution and GPA
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
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
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(primary.r, primary.g, primary.b);
        pdf.text("TECHNICAL SKILLS", margin, y);
        y += 25;

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
          pdf.roundedRect(x, skillY - 12, skillWidth - 15, 22, 4, 4, "F");

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          const text = skill.length > 15 ? skill.slice(0, 15) + "..." : skill;
          const tWidth = pdf.getTextWidth(text);
          pdf.text(text, x + (skillWidth - 15 - tWidth) / 2, skillY - 2);

          currentCol++;
        });

        y += (currentRow + 1) * 30 + 20;
      }

      // Projects
      if (data.projects?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(primary.r, primary.g, primary.b);
        pdf.text("PROJECTS", margin, y);
        y += 25;

        data.projects.forEach((proj) => {
          // Project name
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(primary.r, primary.g, primary.b);
          pdf.text(proj.name, margin, y);
          y += 20;

          // Description
          if (proj.description) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            y = addWrappedText(pdf, proj.description, margin, y, contentWidth, 10, 1.4);
          }

          // Technologies
          if (proj.technologies) {
            y += 10;
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(9);
            pdf.setTextColor(secondary.r, secondary.g, secondary.b);
            pdf.text(`Technologies: ${proj.technologies}`, margin, y);
          }

          // Link
          if (proj.link) {
            y += 15;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
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

      return true;
    }
  };
};
