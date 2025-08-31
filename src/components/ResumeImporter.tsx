import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Brain } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface ResumeImporterProps {
  onDataImported: (data: ResumeData) => void;
  onClose: () => void;
}

const ResumeImporter: React.FC<ResumeImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain'
    ];
    const allowedExtensions = ['.pdf', '.txt'];
    
    // For Vercel deployment, use the API route
    const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || 
                    process.env.NODE_ENV === 'production';
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Please upload a PDF or TXT file');
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
      if (file.type === 'application/pdf') {
        try {
          setUploading(true);
          setProcessingStep('Extracting text from PDF...');
          
          const formData = new FormData();
          formData.append('file', file);
          
          // Use the correct API endpoint based on the environment
          const apiUrl = isVercel 
            ? '/api/parse-pdf' 
            : 'http://localhost:3000/api/parse-pdf';
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to parse PDF');
          }
          
          const result = await response.json();
          processExtractedText(result.text);
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error('Failed to extract data from resume. Please try the "Paste Text" option.');
        } finally {
          setUploading(false);
          setProcessingStep('');
        }
      } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      } else {
        throw new Error('Unsupported file type');
      }
      setExtractedText(text);
      setProcessingStep('Analyzing content...');
      const parsedData = await parseResumeTextAdvanced(text);
      setExtractedData(parsedData);
      toast.success('Resume data extracted successfully!');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to extract data from resume. Please try the "Paste Text" option.');
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  const parseResumeTextAdvanced = async (text: string): Promise<ResumeData> => {
    // Initialize resume data structure
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

    // Use AI-powered extraction techniques
    resumeData.personalInfo = await extractPersonalInfoAdvanced(text);
    resumeData.experience = await extractExperienceAdvanced(text);
    resumeData.education = await extractEducationAdvanced(text);
    resumeData.skills = await extractSkillsAdvanced(text);
    resumeData.projects = await extractProjectsAdvanced(text);

    // Log for debugging
    console.log('Extracted text (first 500 chars):', text.substring(0, 500));
    console.log('Extracted data:', resumeData);

    return resumeData;
  };

  const extractPersonalInfoAdvanced = async (text: string) => {
    const personalInfo = {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: ''
    };

    // Advanced email extraction
    const emailPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g
    ];
    
    for (const pattern of emailPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        personalInfo.email = matches[0];
        break;
      }
    }

    // Advanced phone extraction - improved patterns
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
      /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/g,
      /\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{4}/g,
      /\(\d{3}\)\s\d{3}-\d{4}/g
    ];
    
    for (const pattern of phonePatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Filter out false positives (like dates)
        const phone = matches[0];
        if (!phone.match(/^\d{8,}$/) && !phone.includes('2023') && !phone.includes('2024')) {
          personalInfo.phone = phone;
          break;
        }
      }
    }

    // Advanced LinkedIn extraction
    const linkedinPatterns = [
      /linkedin\.com\/in\/[\w-]+/gi,
      /linkedin\.com\/profile\/[\w-]+/gi
    ];
    
    for (const pattern of linkedinPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        personalInfo.linkedin = `https://${matches[0]}`;
        break;
      }
    }

    // Advanced GitHub extraction
    const githubPatterns = [
      /github\.com\/[\w-]+/gi,
      /github\.com\/[\w-]+\/[\w-]+/gi
    ];
    
    for (const pattern of githubPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        personalInfo.github = `https://${matches[0]}`;
        break;
      }
    }

    // Advanced name extraction - improved algorithm
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i];
      
      // Skip lines that are clearly not names
      if (line.includes('@') || 
          line.match(/\d{3}/) || 
          line.length < 3 || 
          line.length > 50 ||
          line.toLowerCase().includes('resume') ||
          line.toLowerCase().includes('cv') ||
          line.toLowerCase().includes('experience') ||
          line.toLowerCase().includes('education') ||
          line.toLowerCase().includes('skills') ||
          line.toLowerCase().includes('phone') ||
          line.toLowerCase().includes('email') ||
          line.toLowerCase().includes('summary') ||
          line.toLowerCase().includes('objective') ||
          line.toLowerCase().includes('profile')) {
        continue;
      }
      
      // Check if line looks like a name (improved pattern)
      if (line.match(/^[A-Za-z\s\-]+$/) && 
          line.split(' ').length >= 2 && 
          line.split(' ').length <= 4 &&
          line.split(' ').every(word => word.length > 1)) {
        personalInfo.name = line;
        break;
      }
    }

    // Advanced location extraction - improved patterns
    const locationPatterns = [
      /([A-Za-z\s]+,\s*[A-Za-z\s]+(?:,\s*\d{5})?)/g,
      /([A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5})/g,
      /([A-Za-z\s]+,\s*[A-Z]{2})/g,
      /([A-Za-z\s]+,\s*[A-Za-z\s]+)/g,
      /([A-Za-z\s]+,\s*[A-Za-z]+)/g
    ];
    
    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const location = matches[0];
        // Filter out false positives
        if (location.length > 5 && location.length < 50 && !location.includes('PDF')) {
          personalInfo.location = location;
          break;
        }
      }
    }

    // Advanced summary extraction
    const summaryKeywords = ['summary', 'objective', 'profile', 'about', 'overview', 'introduction'];
    for (const keyword of summaryKeywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^\\n]{30,500})`, 'i');
      const match = text.match(regex);
      if (match) {
        personalInfo.summary = match[1].trim();
        break;
      }
    }

    // Fallback: extract longer paragraphs
    if (!personalInfo.summary) {
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50 && p.trim().length < 300);
      if (paragraphs.length > 0) {
        personalInfo.summary = paragraphs[0].trim();
      }
    }

    return personalInfo;
  };

  const extractExperienceAdvanced = async (text: string) => {
    const experience = [];
    const experienceKeywords = ['experience', 'employment', 'work history', 'professional experience', 'work experience', 'career'];
    
    // Find experience section
    let experienceSection = '';
    for (const keyword of experienceKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=education|skills|projects|achievements|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        experienceSection = match[0];
        break;
      }
    }

    if (experienceSection) {
      // Multiple advanced patterns
      const jobPatterns = [
        // Pattern 1: Job Title - Company | Duration
        /([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s\d\-–—]+)/gi,
        // Pattern 2: Job Title at Company | Duration
        /([A-Za-z\s&,.-]+)\s+at\s+([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s\d\-–—]+)/gi,
        // Pattern 3: Company | Job Title | Duration
        /([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s\d\-–—]+)/gi,
        // Pattern 4: Simple format with dates
        /([A-Za-z\s&,.-]+)\s*[-–—]\s*([A-Za-z\s&,.-]+)\s*(\d{4}\s*[-–—]\s*(?:\d{4}|present|current))/gi
      ];
      
      for (const pattern of jobPatterns) {
        let match;
        while ((match = pattern.exec(experienceSection)) !== null) {
          const title = match[1].trim();
          const company = match[2].trim();
          const duration = match[3].trim();
          
          if (title.length < 3 || title.length > 100 || 
              company.length < 2 || company.length > 100 ||
              duration.length < 4 || duration.length > 50) {
            continue;
          }
          
          // Extract description
          const jobIndex = experienceSection.indexOf(match[0]);
          const nextJobIndex = experienceSection.indexOf('\n', jobIndex + match[0].length);
          let description = '';
          
          if (nextJobIndex > 0) {
            description = experienceSection.substring(jobIndex + match[0].length, nextJobIndex + 300).trim();
          } else {
            description = experienceSection.substring(jobIndex + match[0].length, jobIndex + 400).trim();
          }
          
          description = description.replace(/^\s*[-•]\s*/gm, '').trim();
          description = description.substring(0, 300) + (description.length > 300 ? '...' : '');
          
          experience.push({ title, company, duration, description });
        }
      }
    }

    // Fallback extraction
    if (experience.length === 0) {
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      for (let i = 0; i < lines.length - 2; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1];
        const thirdLine = lines[i + 2];
        
        if (line.length > 5 && line.length < 50 && 
            !line.includes('@') && 
            !line.match(/\d{3}/) &&
            (nextLine.includes('@') || nextLine.match(/\d{4}/))) {
          
          experience.push({
            title: line.trim(),
            company: nextLine.trim(),
            duration: thirdLine.trim(),
            description: 'Experience details extracted from resume.'
          });
        }
      }
    }

    return experience;
  };

  const extractEducationAdvanced = async (text: string) => {
    const education = [];
    const educationKeywords = ['education', 'academic', 'qualifications', 'academic background', 'degree'];
    
    // Find education section
    let educationSection = '';
    for (const keyword of educationKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|skills|projects|achievements|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        educationSection = match[0];
        break;
      }
    }

    if (educationSection) {
      const degreePatterns = [
        /(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?e\.?|m\.?e\.?)[^\\n]*([^\\n]*university|college|institute|school)[^\\n]*(\d{4})/gi,
        /([^\\n]*university|college|institute|school)[^\\n]*(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?e\.?|m\.?e\.?)[^\\n]*(\d{4})/gi,
        /(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?e\.?|m\.?e\.?)[^\\n]*(\d{4})/gi
      ];
      
      for (const pattern of degreePatterns) {
        let match;
        while ((match = pattern.exec(educationSection)) !== null) {
          let degree, institution, year;
          
          if (match[1] && match[2] && match[3]) {
            degree = match[1].trim();
            institution = match[2].trim();
            year = match[3];
          } else if (match[1] && match[2]) {
            degree = match[1].trim();
            year = match[2];
            institution = 'Institution';
          }
          
          if (degree && year) {
            education.push({
              degree,
              institution: institution || 'Institution',
              year,
              gpa: ''
            });
          }
        }
      }
    }

    // Fallback extraction
    if (education.length === 0) {
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1];
        
        if (line.toLowerCase().includes('university') || 
            line.toLowerCase().includes('college') ||
            line.toLowerCase().includes('institute') ||
            line.toLowerCase().includes('school')) {
          
          const yearMatch = nextLine.match(/\d{4}/);
          const degreeMatch = line.match(/(bachelor|master|phd|doctorate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?e\.?|m\.?e\.?)/i);
          
          education.push({
            degree: degreeMatch ? degreeMatch[0] : 'Degree',
            institution: line.trim(),
            year: yearMatch ? yearMatch[0] : 'Year',
            gpa: ''
          });
        }
      }
    }

    return education;
  };

  const extractSkillsAdvanced = async (text: string) => {
    const skills = [];
    const skillsKeywords = ['skills', 'technologies', 'technical skills', 'competencies', 'technologies used', 'tools', 'languages'];
    
    // Comprehensive skill list
    const commonSkills = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'TypeScript',
      // Web Technologies
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Symfony',
      // Frontend
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind', 'Material-UI', 'Ant Design', 'jQuery',
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase', 'DynamoDB',
      // Cloud & DevOps
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform',
      // Version Control
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
      // Design Tools
      'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'InDesign',
      // Other Tools
      'Jira', 'Confluence', 'Slack', 'Trello', 'Asana', 'Notion',
      // Methodologies
      'Project Management', 'Agile', 'Scrum', 'Kanban', 'Waterfall', 'Leadership', 'Team Management'
    ];

    // Find skills section
    let skillsSection = '';
    for (const keyword of skillsKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|education|projects|achievements|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        skillsSection = match[0];
        break;
      }
    }

    const searchText = skillsSection || text;
    
    // Look for common skills
    for (const skill of commonSkills) {
      if (searchText.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    }

    // Look for skills in various formats
    const skillListPatterns = [
      /(?:skills?|technologies?|tools?)[:,\s]+([^.\n]+)/gi,
      /([A-Za-z\s&,.-]+(?:,|•|\|)\s*)+/g,
      /([A-Za-z\s&,.-]+)\s*[,•|]\s*([A-Za-z\s&,.-]+)/g
    ];
    
    for (const pattern of skillListPatterns) {
      let match;
      while ((match = pattern.exec(searchText)) !== null) {
        if (match[1]) {
          const skillList = match[1].split(/[,•|]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
          skills.push(...skillList);
        }
      }
    }

    // Look for capitalized words that might be skills
    const capitalizedWords = searchText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    for (const word of capitalizedWords) {
      if (word.length > 3 && word.length < 30 && 
          !word.includes(' ') && 
          !skills.includes(word) &&
          !word.match(/^(The|And|Or|But|For|With|From|This|That|These|Those)$/i)) {
        skills.push(word);
      }
    }

    return [...new Set(skills)].slice(0, 25);
  };

  const extractProjectsAdvanced = async (text: string) => {
    const projects = [];
    const projectKeywords = ['projects', 'portfolio', 'works', 'applications'];
    
    // Find projects section
    let projectsSection = '';
    for (const keyword of projectKeywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=experience|education|skills|achievements|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        projectsSection = match[0];
        break;
      }
    }

    if (projectsSection) {
      const projectPattern = /([A-Za-z\s&,.-]+)[:.\s]+([^.\n]{50,200})/gi;
      let match;
      
      while ((match = projectPattern.exec(projectsSection)) !== null) {
        const name = match[1].trim();
        const description = match[2].trim();
        
        projects.push({
          name,
          description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
          technologies: '',
          link: ''
        });
      }
    }

    return projects;
  };

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/import-resume', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Import failed');
      const data = await response.json();
      onDataImported(data);
    } catch (e) {
      toast.error('Import failed. Using default data.');
      onDataImported({ personalInfo: { name: 'John Doe', email: '', phone: '', location: '', summary: '' }, experience: [], education: [], skills: [], projects: [] });
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

  const handleTestExtraction = () => {
    const sampleText = `JOHN DOE
Software Engineer
john.doe@email.com | (555) 123-4567 | New York, NY
linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development using JavaScript, React, Node.js, and Python. Passionate about creating scalable web applications and leading development teams.

WORK EXPERIENCE
Senior Software Engineer
Tech Company Inc. | 2020 - Present
• Led development of React-based web applications
• Managed team of 5 developers
• Implemented CI/CD pipelines using Jenkins

Software Developer
Startup XYZ | 2018 - 2020
• Developed REST APIs using Node.js and Express
• Worked with MongoDB and PostgreSQL databases
• Used Git for version control

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018

SKILLS
JavaScript, Python, React, Node.js, Express, MongoDB, PostgreSQL, Git, AWS, Docker, Agile, Scrum`;

    setExtractedText(sampleText);
    parseResumeTextAdvanced(sampleText).then(data => {
      setExtractedData(data);
      toast.success('Sample resume data loaded for testing!');
    });
  };

  const handleManualTextProcess = async () => {
    if (!manualText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setUploading(true);
    setProcessingStep('Processing text...');
    
    try {
      setExtractedText(manualText);
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-2 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Import Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base">
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
        <div className="p-2 sm:p-6">
          {!extractedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
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
                  aria-label="Upload resume file"
                  title="Click to upload resume file"
                />
                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🐼</span>
                    </div>
                  </motion.div>
                  <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">Drag & Drop or Tap to Upload</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">PDF or TXT, max 10MB</span>
                  {uploading && (
                    <div className="mt-2 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600 text-sm">🐼 AI is analyzing your resume...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Alternative Options */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Alternative Options:
                </h4>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowManualInput(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paste Text (Recommended)</span>
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
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTestExtraction}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Test Extraction</span>
                  </motion.button>
                </div>
              </div>

              {/* Manual Text Input */}
              {showManualInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                    📋 Paste Your Resume Text:
                  </h4>
                  <div className="mb-3 text-xs text-blue-700 dark:text-blue-300">
                    <p>💡 <strong>How to get text from PDF:</strong></p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Open your PDF in any PDF reader</li>
                      <li>Press Ctrl+A (or Cmd+A on Mac) to select all text</li>
                      <li>Press Ctrl+C (or Cmd+C on Mac) to copy</li>
                      <li>Paste it in the box below</li>
                    </ol>
                  </div>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Paste your resume text here... (You can copy from PDF, Word, or any text format)"
                    className="w-full h-32 p-3 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Resume text input"
                  />
                  <div className="flex space-x-3 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleManualTextProcess}
                      disabled={uploading || !manualText.trim()}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Brain className="w-4 h-4" />
                      <span>{uploading ? 'Processing...' : 'Extract Data'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowManualInput(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Supported Formats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FileText, name: 'PDF', color: 'text-red-500' },
                  { icon: FileText, name: 'TXT', color: 'text-gray-500' }
                ].map((format, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <format.icon className={`w-5 h-5 ${format.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{format.name}</span>
                  </div>
                ))}
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
                    <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.location || 'Not found'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.experience.length} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Education:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.education.length} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{extractedData.skills.length} skills</span>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.slice(0, 10).map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">{'>'}</span>
                          <span className="text-green-300">{skill}</span>
                        </div>
                      ))}
                      {extractedData.skills.length > 10 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{extractedData.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show extracted text for debugging */}
                {extractedText && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Extracted Text (first 200 chars):
                    </span>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border text-xs text-gray-600 dark:text-gray-300 max-h-20 overflow-y-auto">
                      {extractedText.substring(0, 200)}...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Please review and edit the extracted data as needed. The AI extraction may not be 100% accurate.
                </p>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (extractedData) {
                      onDataImported(extractedData);
                      onClose();
                    }
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