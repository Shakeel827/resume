// src/components/TemplateRenderer.tsx
import React from 'react';
import { ResumeData } from '../utils/generateResumePDF';
import { getTemplateById } from '../data/resumeTemplates';

interface TemplateRendererProps {
  templateId: string;
  resumeData: ResumeData;
  preview?: boolean;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  resumeData,
  preview = false
}) => {
  const template = getTemplateById(templateId);
  
  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div 
      className="p-8 h-full"
      style={{ 
        backgroundColor: template.colors.background,
        color: template.colors.text,
        fontFamily: template.typography.bodyFont
      }}
    >
      {/* Header */}
      <div 
        className="p-6 mb-6 text-white"
        style={{ backgroundColor: template.colors.primary }}
      >
        <h1 
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: template.typography.headingFont }}
        >
          {resumeData.personalInfo.name}
        </h1>
        
        <div className="space-y-2 text-sm">
          {resumeData.personalInfo.email && (
            <div>📧 {resumeData.personalInfo.email}</div>
          )}
          {resumeData.personalInfo.phone && (
            <div>📱 {resumeData.personalInfo.phone}</div>
          )}
          {resumeData.personalInfo.location && (
            <div>📍 {resumeData.personalInfo.location}</div>
          )}
          {resumeData.personalInfo.linkedin && (
            <div>🔗 {resumeData.personalInfo.linkedin}</div>
          )}
          {resumeData.personalInfo.github
