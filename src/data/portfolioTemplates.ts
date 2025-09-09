export interface PortfolioTemplate {
  id: string;
  name: string;
  category:
    | 'modern'
    | 'creative'
    | 'developer'
    | 'business'
    | 'minimal'
    | 'artistic'
    | 'corporate'
    | 'startup'
    | 'academic'
    | 'futuristic';
  preview: string;
  description: string;
  features: string[];
  technologies: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout:
    | 'single-page'
    | 'multi-section'
    | 'parallax'
    | 'grid'
    | 'masonry'
    | 'timeline'
    | 'card-based'
    | 'split-screen';
  animations: string[];
  seoOptimized: boolean;
}

export const portfolioTemplates: PortfolioTemplate[] = [
  // ------------------------- Template 1: Minimal Developer -------------------------
  {
    id: 'minimal-dev',
    name: 'Minimal Developer',
    category: 'minimal',
    preview:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    description:
      'A clean, minimal portfolio focused on code and projects. Uses a monospace typography and subtle animations to highlight technical skills.',
    features: [
      'Code-inspired Design',
      'Syntax Highlighting Effects',
      'Minimal Navigation',
      'Project Showcase Grid',
      'Dark/Light Mode Toggle',
    ],
    technologies: ['React', 'TypeScript', 'CSS3', 'Framer Motion'],
    colors: {
      primary: '#2D5BFF',
      secondary: '#6C757D',
      accent: '#FF6B6B',
      background: '#FFFFFF',
      text: '#212529',
    },
    layout: 'grid',
    animations: ['Typewriter Effect', 'Code Fade-in', 'Subtle Hover'],
    seoOptimized: true,
  },

  // ------------------------- Template 2: Creative Showcase -------------------------
  {
    id: 'creative-showcase',
    name: 'Creative Showcase',
    category: 'creative',
    preview:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    description:
      'A visually striking portfolio with asymmetrical layouts and bold color transitions. Perfect for designers and artists.',
    features: [
      'Asymmetrical Layout',
      'Color Transition Effects',
      'Interactive Project Previews',
      'Custom Cursor Interactions',
      'Micro-interactions Throughout',
    ],
    technologies: ['GSAP', 'WebGL', 'Sass', 'React Spring'],
    colors: {
      primary: '#FF5E5B',
      secondary: '#00CECB',
      accent: '#FFED66',
      background: '#F7F7F7',
      text: '#2E2E2E',
    },
    layout: 'masonry',
    animations: ['Color Morph', 'Shape Transformation', 'Staggered Reveal'],
    seoOptimized: true,
  },

  // ------------------------- Template 3: Corporate Professional -------------------------
  {
    id: 'corporate-pro',
    name: 'Corporate Professional',
    category: 'corporate',
    preview:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
    description:
      'A sophisticated portfolio with a focus on professionalism and clean data presentation. Ideal for consultants and executives.',
    features: [
      'Professional Layout',
      'Data Visualization Integration',
      'Testimonial Sections',
      'Case Study Format',
      'Printable Resume Option',
    ],
    technologies: ['Vue.js', 'D3.js', 'Tailwind CSS', 'Chart.js'],
    colors: {
      primary: '#1A1A40',
      secondary: '#7B0D1E',
      accent: '#270082',
      background: '#FAFAFA',
      text: '#333333',
    },
    layout: 'card-based',
    animations: ['Smooth Scroll', 'Fade-up Elements', 'Progress Bars'],
    seoOptimized: true,
  },
];

// ------------------------- Utility Functions -------------------------
export const getPortfolioTemplateById = (id: string) => {
  return portfolioTemplates.find((template) => template.id === id);
};

export const getPortfolioTemplatesByCategory = (category: string) => {
  return portfolioTemplates.filter(
    (template) => template.category === category
  );
};
