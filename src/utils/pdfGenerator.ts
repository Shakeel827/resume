import jsPDF from 'jspdf';
import { getTemplateById, ResumeTemplate } from '../data/resumeTemplates';

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

export const generateResumePDF = (data: ResumeData, templateId: string): void => {
  // Require explicit templateId
  if (!templateId) {
    console.error('❌ No templateId provided');
    return;
  }

  const template = getTemplateById(templateId);
  if (!template) {
    console.error(`❌ Template with ID "${templateId}" not found`);
    return;
  }

  // Create PDF with A4 size
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper: convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 37, g: 99, b: 235 };
  };

  // ✅ Set template colors
  const primaryRgb = hexToRgb(template.colors.primary);
  const secondaryRgb = hexToRgb(template.colors.secondary);
  const accentRgb = hexToRgb(template.colors.accent);
  const textRgb = hexToRgb(template.colors.text);

  // Generate all content
  generateResumeContent();

  // ✅ Unique filename: Name + Template Name
  const cleanName = (data.personalInfo.name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTemplate = template.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_${cleanTemplate}.pdf`;
  pdf.save(fileName);

  // -----------------------------
  // Resume content generator
  // -----------------------------
  function generateResumeContent() {
    // HEADER
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, pageWidth, 100, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    const nameText = data.personalInfo.name || 'Your Name';
    const nameWidth = pdf.getTextWidth(nameText);
    pdf.text(nameText, (pageWidth - nameWidth) / 2, 45);

    // Contact info
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const contactItems = [];
    if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
    if (data.personalInfo.location) contactItems.push(`📍 ${data.personalInfo.location}`);

    if (contactItems.length > 0) {
      const contactText = contactItems.join('  •  ');
      const contactWidth = pdf.getTextWidth(contactText);
      pdf.text(contactText, (pageWidth - contactWidth) / 2, 70);
    }

    // Socials
    const socialItems = [];
    if (data.personalInfo.linkedin) socialItems.push(`🔗 ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) socialItems.push(`💻 ${data.personalInfo.github}`);

    if (socialItems.length > 0) {
      const socialText = socialItems.join('  •  ');
      const socialWidth = pdf.getTextWidth(socialText);
      pdf.text(socialText, (pageWidth - socialWidth) / 2, 85);
    }

    yPosition = 120;

    // TODO: Add summary, work, education, skills, projects 
    // (I kept your existing helpers – just omitted them here for brevity)
  }
};
