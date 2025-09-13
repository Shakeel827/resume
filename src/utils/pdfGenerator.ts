// src/utils/pdfGenerator.ts
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

// Main PDF generator - EXACT match by capturing the preview HTML
export const generateResumePDF = async (
  previewElement: HTMLElement,
  data: ResumeData,
  templateId: string
) => {
  try {
    // Capture the preview element as canvas
    const canvas = await html2canvas(previewElement, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Save with template in filename
    const cleanName = (data.personalInfo.name || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
    const cleanTemplate = templateId.replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`${cleanName}_${cleanTemplate}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
