import jsPDF from 'jspdf';
import { getTemplateById } from '../data/resumeTemplates';

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

export const generateResumePDF = (data: ResumeData, templateId: string = 'modern-1'): void => {
  const template = getTemplateById(templateId);
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Set template colors
  const primaryColor = template?.colors.primary || '#2563EB';
  const secondaryColor = template?.colors.secondary || '#1E40AF';
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);

  // Header with name and template styling
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.personalInfo.name || 'Your Name', 20, yPosition);
  yPosition += 15;

  // Add a colored line under the name
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.setLineWidth(2);
  pdf.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
  yPosition += 5;

  // Contact information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const contactInfo = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github
  ].filter(Boolean).join(' | ');
  
  yPosition = addWrappedText(contactInfo, 20, yPosition, pageWidth - 40);
  yPosition += 10;

  // Professional Summary
  if (data.personalInfo.summary) {
    pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL SUMMARY', 20, yPosition);
    yPosition += 8;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.personalInfo.summary, 20, yPosition, pageWidth - 40);
    yPosition += 10;
  }

  // Experience
  if (data.experience.length > 0) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('WORK EXPERIENCE', 20, yPosition);
    yPosition += 8;

    data.experience.forEach((exp) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.title, 20, yPosition);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${exp.company} | ${exp.duration}`, 20, yPosition + 6);
      yPosition += 12;

      if (exp.description) {
        pdf.setFontSize(10);
        yPosition = addWrappedText(exp.description, 20, yPosition, pageWidth - 40);
      }
      yPosition += 8;
    });
  }

  // Education
  if (data.education.length > 0) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', 20, yPosition);
    yPosition += 8;

    data.education.forEach((edu) => {
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(edu.degree, 20, yPosition);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      const eduInfo = `${edu.institution} | ${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
      pdf.text(eduInfo, 20, yPosition + 6);
      yPosition += 15;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SKILLS', 20, yPosition);
    yPosition += 8;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const skillsText = data.skills.join(' • ');
    yPosition = addWrappedText(skillsText, 20, yPosition, pageWidth - 40);
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROJECTS', 20, yPosition);
    yPosition += 8;

    data.projects.forEach((project) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(project.name, 20, yPosition);
      yPosition += 6;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      if (project.description) {
        yPosition = addWrappedText(project.description, 20, yPosition, pageWidth - 40);
      }
      
      if (project.technologies) {
        yPosition = addWrappedText(`Technologies: ${project.technologies}`, 20, yPosition + 2, pageWidth - 40);
      }
      
      if (project.link) {
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.text(project.link, 20, yPosition + 4);
        pdf.setTextColor(0, 0, 0);
        yPosition += 6;
      }
      yPosition += 8;
    });
  }

  // Footer with template info
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated with ResumeFlow - ${template?.name || 'Professional'} Template`, 20, pageHeight - 10);

  // Save the PDF
  const fileName = `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume_${template?.name.replace(/\s+/g, '_') || 'Professional'}.pdf` || 'Resume.pdf';
  pdf.save(fileName);
};
