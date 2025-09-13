// src/components/ResumePreview.tsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import { getTemplateById } from '../data/resumeTemplates';
import TemplateRenderer from './TemplateRenderer';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string;
  onDownload: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
  onDownload
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const previewRef = useRef<HTMLDivElement>(null);
  const template = getTemplateById(templateId);

  if (!isOpen || !template) return null;

  const getPreviewClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-96 h-[500px]';
      default:
        return 'w-full max-w-4xl h-[700px]';
    }
  };

  // Updated download handler for Vercel compatibility
  const handleDownloadResume = async () => {
    try {
      // Dynamically import the PDF generator (client-side only)
      const { generateResumePDF } = await import('../utils/pdfGenerator');
      const pdfGenerator = generateResumePDF(resumeData, templateId);
      
      // Generate PDF on client side
      await pdfGenerator.generate();
      onDownload();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('AI Resume Analysis', 15, 20);

    doc.setFontSize(14);
    doc.setTextColor(39, 174, 96);
    doc.text(`ATS Score: ${template.atsScore}`, 15, 35);
    doc.setTextColor(241, 196, 15);
    doc.text(`Overall Rating: ${template.overallRating}/10`, 80, 35);

    let y = 50;
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Strengths:', 15, y);
    y += 7;
    template.strengths.forEach((s) => {
      doc.setTextColor(39, 174, 96);
      doc.text(`• ${s}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(231, 76, 60);
    doc.text('Areas for Improvement:', 15, y);
    y += 7;
    template.weaknesses.forEach((w) => {
      doc.setTextColor(231, 76, 60);
      doc.text(`• ${w}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(155, 89, 182);
    doc.text('Actionable Suggestions:', 15, y);
    y += 7;
    template.suggestions.forEach((s) => {
      doc.setTextColor(155, 89, 182);
      doc.text(`• ${s}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(41, 128, 185);
    doc.text('Job Matches:', 15, y);
    y += 7;
    template.jobMatches.forEach((j) => {
      doc.setTextColor(41, 128, 185);
      doc.text(`• ${j}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(243, 156, 18);
    doc.text('Skill Gaps:', 15, y);
    y += 7;
    template.skillGaps.forEach((g) => {
      doc.setTextColor(243, 156, 18);
      doc.text(`• ${g}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(52, 73, 94);
    doc.text('Industry Trends:', 15, y);
    y += 7;
    template.industryTrends.forEach((t) => {
      doc.setTextColor(52, 73, 94);
      doc.text(`• ${t}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(39, 174, 96);
    doc.text('Salary Insights:', 15, y);
    y += 7;
    doc.setTextColor(39, 174, 96);
    doc.text(template.salaryInsights, 20, y);
    y += 10;
    doc.setTextColor(231, 76, 60);
    doc.text('Recommended Keywords:', 15, y);
    y += 7;
    template.keywords.forEach((k) => {
      doc.setTextColor(231, 76, 60);
      doc.text(`• ${k}`, 20, y);
      y += 7;
    });
    doc.save('AI_Resume_Report.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume Preview
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {template.name} Template • ATS Score: {template.atsScore}%
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[
                { mode: 'desktop' as const, icon: Monitor },
                { mode: 'tablet' as const, icon: Tablet },
                { mode: 'mobile' as const, icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  aria-label={`Switch to ${mode} view`}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadResume}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Resume</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </motion.button>

            <button
              aria-label="Close preview"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-center">
            <div 
              ref={previewRef}
              className={`${getPreviewClasses()} bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300`}
            >
              <div className="w-full h-full overflow-auto">
                <TemplateRenderer 
                  templateId={templateId} 
                  resumeData={resumeData} 
                  preview={true} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: template.colors.primary }}
              />
              <span>{template.category} Template</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Press ESC to close
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ResumePreview;
