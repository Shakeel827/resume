export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'executive' | 'technical' | 'minimalist' | 'artistic' | 'corporate' | 'startup' | 'academic';
  atsScore: number;
  preview: string;
  description: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: 'single-column' | 'two-column' | 'three-column' | 'sidebar' | 'header-focus' | 'timeline' | 'grid' | 'asymmetric';
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
  // AI Analysis properties
  overallRating: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  jobMatches: string[];
  skillGaps: string[];
  industryTrends: string[];
  salaryInsights: string;
  keywords: string[];
}

export const resumeTemplates: ResumeTemplate[] = [
  // Modern Templates with Unique Designs
  {
    id: 'quantum-edge',
    name: 'Quantum Edge',
    category: 'modern',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Geometric precision with sharp angles and modern data visualization elements',
    features: ['Dynamic Geometry', 'Data Visualization', 'Tech-Focused Layout', 'Modern Typography'],
    colors: {
      primary: '#2563EB',
      secondary: '#1E293B',
      accent: '#FF6B6B',
      text: '#334155',
      background: '#FFFFFF'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Source Sans Pro',
      fontSize: 'medium'
    },
    overallRating: 9.3,
    strengths: ['Excellent tech industry appeal', 'Modern visual hierarchy', 'Strong ATS performance', 'Innovative layout'],
    weaknesses: ['Too modern for conservative industries', 'Complex layout may confuse some ATS'],
    suggestions: ['Highlight technical achievements prominently', 'Use quantifiable metrics in geometric elements'],
    jobMatches: ['Data Scientist', 'UX Designer', 'Tech Lead', 'Software Architect'],
    skillGaps: ['Traditional business applications', 'Legacy system experience'],
    industryTrends: ['Data visualization', 'Geometric design trends', 'Tech-forward resumes'],
    salaryInsights: 'Tech roles: $110K - $190K depending on specialization',
    keywords: ['Innovation', 'Technology', 'Design', 'Data', 'Architecture']
  },
  {
    id: 'neo-classic',
    name: 'Neo Classic',
    category: 'classic',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Traditional structure reimagined with subtle modern accents and improved readability',
    features: ['Timeless Layout', 'Enhanced Readability', 'Professional Elegance', 'ATS Optimized'],
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      text: '#111827',
      background: '#F9FAFB'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Merriweather',
      fontSize: 'medium'
    },
    overallRating: 9.6,
    strengths: ['Highest ATS compatibility', 'Universal professional appeal', 'Clean traditional structure', 'Excellent readability'],
    weaknesses: ['May appear too conservative for creative roles', 'Limited visual creativity'],
    suggestions: ['Focus on content quality and achievements', 'Use traditional section organization'],
    jobMatches: ['Finance Professional', 'Legal Counsel', 'Healthcare Administrator', 'Corporate Executive'],
    skillGaps: ['Digital transformation experience', 'Modern tech stack knowledge'],
    industryTrends: ['Traditional professionalism', 'Content-focused resumes', 'Industry-standard formatting'],
    salaryInsights: 'Traditional industries: $85K - $160K for senior roles',
    keywords: ['Professional', 'Traditional', 'Executive', 'Management', 'Leadership']
  },
  {
    id: 'chroma-wave',
    name: 'Chroma Wave',
    category: 'creative',
    atsScore: 89,
    preview: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fluid color transitions and organic shapes for creative professionals',
    features: ['Gradient Effects', 'Organic Shapes', 'Creative Layout', 'Visual Impact'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FDF2F8'
    },
    layout: 'grid',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Nunito',
      fontSize: 'medium'
    },
    overallRating: 8.7,
    strengths: ['Exceptional visual appeal', 'Perfect for creative industries', 'Memorable design', 'Modern aesthetic'],
    weaknesses: ['Lower ATS performance', 'Not suitable for traditional roles'],
    suggestions: ['Balance creativity with content clarity', 'Ensure key information remains readable'],
    jobMatches: ['Creative Director', 'Brand Designer', 'Art Director', 'Marketing Innovator'],
    skillGaps: ['Traditional business skills', 'Corporate experience'],
    industryTrends: ['Gradient designs', 'Organic shapes', 'Visual storytelling'],
    salaryInsights: 'Creative roles: $75K - $140K depending on experience',
    keywords: ['Creative', 'Design', 'Innovation', 'Visual', 'Branding']
  },
  {
    id: 'executive-pinnacle',
    name: 'Executive Pinnacle',
    category: 'executive',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium executive template with gold accents and sophisticated typography',
    features: ['Premium Finishes', 'Executive Summary', 'Leadership Focus', 'Strategic Layout'],
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#D4AF37',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lora',
      fontSize: 'large'
    },
    overallRating: 9.5,
    strengths: ['Executive presence', 'Premium appearance', 'Excellent ATS performance', 'Strategic emphasis'],
    weaknesses: ['Overqualified appearance for junior roles', 'Too formal for some industries'],
    suggestions: ['Focus on strategic achievements and leadership impact', 'Highlight board-level experience'],
    jobMatches: ['CEO', 'CFO', 'CTO', 'VP Positions', 'Board Members'],
    skillGaps: ['Operational hands-on skills', 'Technical implementation experience'],
    industryTrends: ['Executive branding', 'Strategic leadership emphasis', 'Premium personal presentation'],
    salaryInsights: 'Executive roles: $180K - $500K+ depending on company size',
    keywords: ['Executive', 'Leadership', 'Strategy', 'Board', 'Governance']
  },
  {
    id: 'tech-circuit',
    name: 'Tech Circuit',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Circuit board inspired layout with technical precision and data-driven design',
    features: ['Technical Architecture', 'Code Integration', 'Data Visualization', 'Precision Layout'],
    colors: {
      primary: '#059669',
      secondary: '#0F172A',
      accent: '#10B981',
      text: '#1F2937',
      background: '#F0FDF4'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Fira Code',
      bodyFont: 'IBM Plex Mono',
      fontSize: 'medium'
    },
    overallRating: 9.2,
    strengths: ['Technical industry appeal', 'Excellent skill visualization', 'Modern tech aesthetic', 'Strong ATS performance'],
    weaknesses: ['Too technical for non-tech roles', 'May intimidate non-technical recruiters'],
    suggestions: ['Highlight technical achievements and specific technologies', 'Include code samples where appropriate'],
    jobMatches: ['Software Engineer', 'DevOps Specialist', 'Systems Architect', 'Technical Lead'],
    skillGaps: ['Business communication', 'Non-technical stakeholder management'],
    industryTrends: ['Technical specialization', 'Code integration in resumes', 'Precision design'],
    salaryInsights: 'Technical roles: $100K - $200K depending on specialization',
    keywords: ['Technical', 'Code', 'Architecture', 'Engineering', 'Development']
  },
  {
    id: 'essence-minimal',
    name: 'Essence Minimal',
    category: 'minimalist',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/316681/pexels-photo-316681.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ultra-clean design with maximum whitespace and essential information focus',
    features: ['Maximum Whitespace', 'Essential Information', 'Clean Typography', 'Content Focus'],
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#9CA3AF',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.4,
    strengths: ['Perfect ATS compatibility', 'Exceptional readability', 'Universal appeal', 'Professional simplicity'],
    weaknesses: ['May appear too simple for creative roles', 'Limited visual personality'],
    suggestions: ['Focus on high-quality content and achievements', 'Use precise, impactful language'],
    jobMatches: ['UX Researcher', 'Content Strategist', 'Analyst', 'Project Coordinator'],
    skillGaps: ['Visual presentation skills', 'Creative design ability'],
    industryTrends: ['Minimalist design', 'Content-focused resumes', 'Clean aesthetic'],
    salaryInsights: 'Analytical roles: $80K - $140K depending on experience',
    keywords: ['Minimal', 'Clean', 'Content', 'Analysis', 'Precision']
  },
  {
    id: 'artisan-craft',
    name: 'Artisan Craft',
    category: 'artistic',
    atsScore: 87,
    preview: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Handcrafted aesthetic with artisanal details and organic textures',
    features: ['Handcrafted Elements', 'Textured Backgrounds', 'Artistic Layout', 'Creative Expression'],
    colors: {
      primary: '#B45309',
      secondary: '#78350F',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFBEB'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Crimson Text',
      fontSize: 'medium'
    },
    overallRating: 8.5,
    strengths: ['Unique artistic expression', 'Memorable design', 'Perfect for creative fields', 'Handcrafted appeal'],
    weaknesses: ['Poor ATS performance', 'Not suitable for traditional industries'],
    suggestions: ['Use primarily for portfolio applications', 'Supplement with traditional resume for ATS systems'],
    jobMatches: ['Artisan', 'Craft Specialist', 'Creative Entrepreneur', 'Design Artist'],
    skillGaps: ['Digital skills', 'Corporate experience'],
    industryTrends: ['Handmade aesthetic', 'Artisanal craftsmanship', 'Unique personal branding'],
    salaryInsights: 'Creative arts: $50K - $90K depending on niche and reputation',
    keywords: ['Artisan', 'Craft', 'Creative', 'Handmade', 'Unique']
  },
  {
    id: 'corporate-nexus',
    name: 'Corporate Nexus',
    category: 'corporate',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional corporate design with network-inspired elements and business focus',
    features: ['Professional Network Elements', 'Business Focus', 'Corporate Branding', 'Strategic Layout'],
    colors: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#6366F1',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Calibri',
      bodyFont: 'Arial',
      fontSize: 'medium'
    },
    overallRating: 9.3,
    strengths: ['Excellent corporate appeal', 'Strong ATS performance', 'Professional network emphasis', 'Business-focused'],
    weaknesses: ['Too corporate for creative roles', 'Limited personal expression'],
    suggestions: ['Highlight business achievements and corporate experience', 'Focus on leadership and management skills'],
    jobMatches: ['Business Manager', 'Corporate Director', 'Strategy Consultant', 'Operations Lead'],
    skillGaps: ['Entrepreneurial experience', 'Startup environment familiarity'],
    industryTrends: ['Corporate networking', 'Business leadership', 'Strategic management'],
    salaryInsights: 'Corporate roles: $90K - $180K depending on level and company',
    keywords: ['Corporate', 'Business', 'Management', 'Strategy', 'Leadership']
  },
  {
    id: 'venture-spark',
    name: 'Venture Spark',
    category: 'startup',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Energetic startup template with dynamic elements and growth-focused design',
    features: ['Dynamic Elements', 'Growth Metrics', 'Innovation Focus', 'Modern Startup Aesthetic'],
    colors: {
      primary: '#DC2626',
      secondary: '#7C2D12',
      accent: '#EA580C',
      text: '#1F2937',
      background: '#FFF7ED'
    },
    layout: 'grid',
    typography: {
      headingFont: 'SF Pro Display',
      bodyFont: 'SF Pro Text',
      fontSize: 'medium'
    },
    overallRating: 9.0,
    strengths: ['Perfect for startup culture', 'Modern innovative appearance', 'Growth-focused design', 'Good ATS performance'],
    weaknesses: ['Too casual for corporate roles', 'May not appeal to traditional industries'],
    suggestions: ['Highlight growth achievements and innovation', 'Focus on metrics and impact'],
    jobMatches: ['Startup Founder', 'Growth Hacker', 'Product Manager', 'Innovation Lead'],
    skillGaps: ['Corporate experience', 'Traditional industry knowledge'],
    industryTrends: ['Startup culture', 'Growth mindset', 'Innovation focus'],
    salaryInsights: 'Startup roles: $80K - $150K plus equity potential',
    keywords: ['Startup', 'Growth', 'Innovation', 'Venture', 'Disruption']
  },
  {
    id: 'academic-precision',
    name: 'Academic Precision',
    category: 'academic',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Research-focused template with academic rigor and publication emphasis',
    features: ['Publication Highlight', 'Research Focus', 'Academic Credentials', 'Precision Layout'],
    colors: {
      primary: '#334155',
      secondary: '#1E293B',
      accent: '#64748B',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Georgia',
      fontSize: 'medium'
    },
    overallRating: 9.5,
    strengths: ['Perfect for academic applications', 'Excellent publication display', 'High ATS compatibility', 'Professional academic appearance'],
    weaknesses: ['Too formal for industry roles', 'Limited creative expression'],
    suggestions: ['Focus on research achievements and publications', 'Highlight academic credentials'],
    jobMatches: ['Research Scientist', 'Professor', 'Academic Researcher', 'Postdoctoral Fellow'],
    skillGaps: ['Industry application experience', 'Commercialization knowledge'],
    industryTrends: ['Academic research', 'Publication emphasis', 'Research impact'],
    salaryInsights: 'Academic roles: $70K - $130K depending on institution and field',
    keywords: ['Research', 'Academic', 'Publication', 'Analysis', 'Science']
  },
  {
    id: 'future-horizon',
    name: 'Future Horizon',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Forward-looking design with futuristic elements and innovative layout',
    features: ['Futuristic Design', 'Innovative Layout', 'Modern Aesthetic', 'Progressive Elements'],
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#A78BFA',
      text: '#1F2937',
      background: '#F5F3FF'
    },
    layout: 'timeline',
    typography: {
      headingFont: 'Exo 2',
      bodyFont: 'Ubuntu',
      fontSize: 'medium'
    },
    overallRating: 9.1,
    strengths: ['Modern innovative appearance', 'Excellent for tech and future-focused roles', 'Good ATS performance', 'Progressive design'],
    weaknesses: ['Too futuristic for traditional roles', 'May not appeal to conservative industries'],
    suggestions: ['Highlight innovation and future-focused skills', 'Emphasize adaptability and learning ability'],
    jobMatches: ['Futurist', 'Innovation Consultant', 'Tech Strategist', 'Digital Transformation Lead'],
    skillGaps: ['Traditional industry experience', 'Legacy system knowledge'],
    industryTrends: ['Future-focused skills', 'Innovation capability', 'Adaptability emphasis'],
    salaryInsights: 'Future-focused roles: $100K - $180K depending on specialization',
    keywords: ['Future', 'Innovation', 'Technology', 'Strategy', 'Transformation']
  },
  {
    id: 'heritage-classic',
    name: 'Heritage Classic',
    category: 'classic',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/733854/pexels-photo-733854.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Timeless traditional design with heritage elements and professional elegance',
    features: ['Timeless Design', 'Professional Heritage', 'Classic Layout', 'Elegant Typography'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#6B7280',
      text: '#111827',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Garamond',
      bodyFont: 'Palatino',
      fontSize: 'medium'
    },
    overallRating: 9.6,
    strengths: ['Universal professional appeal', 'Highest ATS compatibility', 'Timeless elegance', 'Industry standard'],
    weaknesses: ['Too traditional for creative roles', 'Limited modern appeal'],
    suggestions: ['Focus on proven experience and stable career progression', 'Emphasize reliability and expertise'],
    jobMatches: ['Lawyer', 'Accountant', 'Banker', 'Government Official'],
    skillGaps: ['Modern digital skills', 'Innovation experience'],
    industryTrends: ['Traditional values', 'Proven experience', 'Stability and reliability'],
    salaryInsights: 'Traditional professions: $90K - $170K depending on field and experience',
    keywords: ['Traditional', 'Professional', 'Expertise', 'Reliability', 'Heritage']
  }
];

export const getTemplatesByCategory = (category: string) => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return resumeTemplates.find(template => template.id === id);
};

export const getHighestATSTemplates = (limit: number = 10) => {
  return resumeTemplates
    .sort((a, b) => b.atsScore - a.atsScore)
    .slice(0, limit);
};

export const getTemplatesByAtsScore = (minScore: number = 90) => {
  return resumeTemplates.filter(template => template.atsScore >= minScore);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return resumeTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.category.toLowerCase().includes(searchTerm) ||
    template.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
};
