import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the ResumeData interface
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

interface ResumeImporterProps {
  onDataImported: (data: ResumeData) => void;
  onClose: () => void;
}

// Declare pdfjsLib with type any since we're loading it from a CDN
declare const pdfjsLib: any;

const ResumeImporter: React.FC<ResumeImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load pdf.js library on component mount
  useEffect(() => {
    // Check if pdfjsLib is already available
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfjsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      // Set the worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfjsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragleave' || e.type === 'dragover') {
      setDragActive(e.type !== 'dragleave');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Extract text from PDF using pdf.js
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let extractedText = '';
          
          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            extractedText += pageText + '\n';
          }
          
          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (file: File) => {
    console.log('Handling file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    const allowedTypes = ['application/pdf', 'text/plain'];
    const allowedExtensions = ['.pdf', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload a PDF or TXT file.`);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setUploading(true);
    setProcessingStep('Reading file...');
    
    try {
      let text = '';
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isPDF) {
        if (!pdfjsLoaded) {
          toast.error('PDF library is still loading. Please try again in a moment.');
          setUploading(false);
          return;
        }
        
        setProcessingStep('Extracting text from PDF...');
        text = await extractTextFromPDF(file);
      } else {
        // Handle text files directly
        setProcessingStep('Reading text file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }
      
      if (!text || text.trim().length < 10) {
        throw new Error('No readable text found in the file. The PDF might be scanned or image-based.');
      }
      
      setProcessingStep('Analyzing content...');
      const parsedData = await parseResumeTextAdvanced(text);
      setExtractedData(parsedData);
      toast.success('Resume data extracted successfully!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing file:', error);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  // Improved resume parsing function
  const parseResumeTextAdvanced = async (text: string): Promise<ResumeData> => {
    // Remove extra whitespace and normalize text
    text = text.replace(/\s+/g, ' ').trim();
    
    const resumeData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };

    // Enhanced email extraction
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    if (emailMatch) resumeData.personalInfo.email = emailMatch[0];

    // Enhanced phone extraction with multiple patterns
    const phonePatterns = [
      /(\+91[-.\s]?)?[6-9]\d{9}/g, // Indian mobile numbers
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // International
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g // US format
    ];
    
    let phoneMatch = null;
    for (const pattern of phonePatterns) {
      phoneMatch = text.match(pattern);
      if (phoneMatch) break;
    }
    if (phoneMatch) resumeData.personalInfo.phone = phoneMatch[0];

    // Enhanced LinkedIn extraction
    const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9\-_]+)/gi);
    if (linkedinMatch) {
      resumeData.personalInfo.linkedin = linkedinMatch[0].startsWith('http') 
        ? linkedinMatch[0] 
        : `https://${linkedinMatch[0]}`;
    }

    // Enhanced GitHub extraction
    const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9\-_]+)/gi);
    if (githubMatch) {
      resumeData.personalInfo.github = githubMatch[0].startsWith('http') 
        ? githubMatch[0] 
        : `https://${githubMatch[0]}`;
    }

    // Enhanced name extraction with multiple patterns
    const namePatterns = [
      /(?:^|\n)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*(?:\n|$)/m, // Name on its own line
      /(?:name|fullname|contact)\s*[:-\s]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i, // After name label
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const extractedName = match[1].trim();
        if (extractedName.length > 3 && extractedName.length < 50) {
          resumeData.personalInfo.name = extractedName;
          break;
        }
      }
    }

    // Enhanced location extraction
    const locationMatch = text.match(/(?:location|address)[\s:]*([^\n,]+(?:,\s*[^\n,]+)*)/i);
    if (locationMatch) {
      resumeData.personalInfo.location = locationMatch[1].trim();
    }

    // Enhanced summary extraction
    const summaryMatch = text.match(/(?:summary|objective|profile)[\s:]*([^]+?)(?=\n\s*(?:experience|education|skills|projects|$))/i);
    if (summaryMatch && summaryMatch[1].length > 30) {
      resumeData.personalInfo.summary = summaryMatch[1].trim().replace(/\s+/g, ' ');
    }

    // Enhanced skills extraction
    const skillsSectionMatch = text.match(/(?:skills|technologies|technical skills)[\s:]*([^]+?)(?=\n\s*(?:experience|education|projects|$))/i);
    if (skillsSectionMatch) {
      const skillsText = skillsSectionMatch[1];
      const skillsList = skillsText.split(/[,•·\-–—\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 2 && skill.length < 30);
      
      resumeData.skills = [...new Set(skillsList)]; // Remove duplicates
    }

    // Enhanced experience extraction
    const experienceSection = text.match(/(?:experience|work history|employment)[\s:]*([^]+?)(?=\n\s*(?:education|skills|projects|$))/i);
    if (experienceSection) {
      const experienceText = experienceSection[1];
      const experienceItems = experienceText.split(/(?=\d{4}[-–—]|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
      
      experienceItems.forEach(item => {
        const titleMatch = item.match(/([^•·\-–—\n]+)/);
        const companyMatch = item.match(/(?:at|@|in|,)\s*([^\n•·\-–—]+)/i);
        const durationMatch = item.match(/(\d{4}[-–—]\d{4}|\d{4}[-–—](?:present|current)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}[-–—](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{4}[-–—]\s*(?:present|current))/i);
        
        if (titleMatch && companyMatch) {
          resumeData.experience.push({
            title: titleMatch[1].trim(),
            company: companyMatch[1].trim(),
            duration: durationMatch ? durationMatch[1].trim() : '',
            description: item.replace(titleMatch[1], '').replace(companyMatch[0], '').trim()
          });
        }
      });
    }

    // Enhanced education extraction
    const educationSection = text.match(/(?:education|academic|qualifications)[\s:]*([^]+?)(?=\n\s*(?:experience|skills|projects|$))/i);
    if (educationSection) {
      const educationText = educationSection[1];
      const educationItems = educationText.split(/(?=\d{4}[-–—]|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
      
      educationItems.forEach(item => {
        const degreeMatch = item.match(/(bach|master|phd|m\.?tech|b\.?tech|m\.?sc|b\.?sc|m\.?a|b\.?a|m\.?com|b\.?com|diploma|certificate)/i);
        const institutionMatch = item.match(/(university|college|institute|school|academy)/i);
        const yearMatch = item.match(/(\d{4}[-–—]\d{4}|\d{4}[-–—](?:present|current)|\d{4})/i);
        
        if (degreeMatch && institutionMatch) {
          resumeData.education.push({
            degree: item.substring(0, item.search(/(university|college|institute|school|academy)/i)).trim(),
            institution: item.substring(item.search(/(university|college|institute|school|academy)/i)).trim(),
            year: yearMatch ? yearMatch[1].trim() : '',
            gpa: item.match(/(gpa|grade|score)[\s:]*([\d\.]+)/i)?.[2] || ''
          });
        }
      });
    }

    // Enhanced projects extraction
    const projectsSection = text.match(/(?:projects|portfolio)[\s:]*([^]+?)(?=\n\s*(?:experience|education|skills|$))/i);
    if (projectsSection) {
      const projectsText = projectsSection[1];
      const projectItems = projectsText.split(/(?=\n\s*[•·\-–—]|\n\s*\d+\.)/);
      
      projectItems.forEach(item => {
        if (item.trim().length > 10) {
          resumeData.projects.push({
            name: item.substring(0, 50).trim(),
            description: item.substring(0, 200).trim(),
            technologies: '',
            link: ''
          });
        }
      });
    }

    console.log('Parsed resume data:', resumeData);
    return resumeData;
  };

  const handleManualTextProcess = async () => {
    if (!manualText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setUploading(true);
    setProcessingStep('Processing text...');
    
    try {
      const parsedData = await parseResumeTextAdvanced(manualText);
      setExtractedData(parsedData);
      setShowManualInput(false);
      toast.success('Resume data extracted successfully!');
    } catch (error) {
      console.error('Error processing manual text:', error);
      toast.error('Failed to process text. Please try again.');
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  const handleManualEntry = () => {
    const templateData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: ''
      },
      experience: [{
        title: '',
        company: '',
        duration: '',
        description: ''
      }],
      education: [{
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      }],
      skills: [],
      projects: []
    };
    
    onDataImported(templateData);
    toast.success('Manual entry template loaded!');
    onClose();
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Import Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your existing resume to auto-fill the form
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!extractedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="flex flex-col items-center justify-center h-40">
                  <motion.div
                    animate={{ y: uploading ? [0, -10, 0] : 0 }}
                    transition={{ duration: 2, repeat: uploading ? Infinity : 0 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {uploading ? 'Processing...' : 'Drag & Drop or Click to Upload'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    PDF or TXT files, max 10MB
                  </span>
                  
                  {uploading && (
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600 text-sm">{processingStep}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alternative Options */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowManualInput(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paste Text</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleManualEntry}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Start Fresh</span>
                  </motion.button>
                </div>

                {/* Manual Text Input */}
                {showManualInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                      📋 Paste Your Resume Text:
                    </h4>
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Paste your resume text here..."
                      className="w-full h-32 p-3 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-3 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleManualTextProcess}
                        disabled={uploading || !manualText.trim()}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
                      >
                        <Brain className="w-4 h-4" />
                        <span>{uploading ? 'Processing...' : 'Extract Data'}</span>
                      </motion.button>
                      <button
                        onClick={() => setShowManualInput(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Data extracted successfully!</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Extracted Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.name || 'Not found'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.email || 'Not found'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.phone || 'Not found'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.skills.length} skills found</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.experience.length} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Education:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.education.length} entries</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDataImported(extractedData);
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Use Extracted Data
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExtractedData(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeImporter;
