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
  // ------------------------- Template 1 -------------------------
  {
    id: 'cyber-timeline',
    name: 'Cyber Timeline',
    category: 'futuristic',
    preview:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    description:
      'A vertical timeline where each project is a holographic “checkpoint.” Scrolling feels like moving through a cyberpunk tunnel.',
    features: [
      'Vertical Timeline Navigation',
      'Checkpoint-based Sections',
      '3D Hover Effects',
      'Glitchy Background',
      'Voice-assisted Scrolling',
    ],
    technologies: ['Three.js', 'React', 'WebGL', 'GSAP'],
    colors: {
      primary: '#0FF1CE',
      secondary: '#FF0077',
      accent: '#FFD300',
      background: '#0D0D1A',
      text: '#E0E0E0',
    },
    layout: 'timeline',
    animations: ['Glitch Fade', 'Neon Pulse', 'Checkpoint Glow'],
    seoOptimized: true,
  },

  // ------------------------- Template 2 -------------------------
  {
    id: 'sketchbook-parallax',
    name: 'Sketchbook Parallax',
    category: 'artistic',
    preview:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    description:
      'Looks like a personal sketchbook. Pages flip as you scroll. Background has watercolor parallax illustrations.',
    features: [
      'Page-flip Animations',
      'Parallax Watercolor Layers',
      'Sticky Notes for Highlights',
      'Hand-drawn Icons',
      'Paper-texture Background',
    ],
    technologies: ['Vue.js', 'Paper.js', 'GreenSock', 'SVG'],
    colors: {
      primary: '#6FB98F',
      secondary: '#A7D489',
      accent: '#FF7043',
      background: '#FFF9F0',
      text: '#2E2E2E',
    },
    layout: 'parallax',
    animations: ['Page Flip', 'Ink Spread', 'Leaf Grow'],
    seoOptimized: true,
  },

  // ------------------------- Template 3 -------------------------
  {
    id: 'executive-dashboard',
    name: 'Executive Dashboard',
    category: 'business',
    preview:
      'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&h=300&fit=crop',
    description:
      'Feels like a corporate dashboard. Left panel shows navigation, right panel has animated charts, KPIs, and service highlights.',
    features: [
      'Sidebar Navigation',
      'Data-driven Dashboard',
      'Live KPI Counters',
      'Dynamic Infographics',
      'Client Testimonial Carousel',
    ],
    technologies: ['Angular', 'D3.js', 'Chart.js', 'TailwindCSS'],
    colors: {
      primary: '#1E3A8A',
      secondary: '#2563EB',
      accent: '#F59E0B',
      background: '#F9FAFB',
      text: '#111827',
    },
    layout: 'card-based',
    animations: ['Counter Up', 'Panel Slide', 'Chart Reveal'],
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
