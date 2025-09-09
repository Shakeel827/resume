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
    id: 'neon-chronos',
    name: 'Neon Chronos',
    category: 'futuristic',
    preview:
      'https://images.unsplash.com/photo-1603470182120-6b4c6f97a7d4?w=400&h=300&fit=crop',
    description:
      'Futuristic neon-themed portfolio that feels like a sci-fi movie intro. Animated holograms, 3D cards, and glowing typography give it a cyberpunk vibe.',
    features: [
      '3D Holographic Timeline',
      'Glowing Card Navigation',
      'AI-generated Backgrounds',
      'Matrix-style Animations',
      'Voice-controlled Interactions',
    ],
    technologies: ['Three.js', 'React', 'WebGL', 'GSAP', 'TensorFlow.js'],
    colors: {
      primary: '#0FF1CE',
      secondary: '#FF00F7',
      accent: '#FFD300',
      background: '#0D0D1A',
      text: '#E0E0E0',
    },
    layout: 'timeline', // vertical glowing timeline
    animations: ['Neon Pulse', 'Card Flip', 'Glitch Fade', 'Hologram Rotate'],
    seoOptimized: true,
  },

  // ------------------------- Template 2 -------------------------
  {
    id: 'eco-atelier',
    name: 'Eco Atelier',
    category: 'artistic',
    preview:
      'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=300&fit=crop',
    description:
      'An artistic portfolio with watercolor strokes, fluid grids, and playful parallax illustrations. Feels like browsing through a creative sketchbook.',
    features: [
      'Hand-painted Backgrounds',
      'Fluid Masonry Grid',
      'Organic Shapes',
      'Interactive Watercolor Animations',
      'Nature-inspired Palette',
    ],
    technologies: ['Vue.js', 'Paper.js', 'CSS Houdini', 'GreenSock', 'SVG'],
    colors: {
      primary: '#6FB98F',
      secondary: '#A7D489',
      accent: '#FF7043',
      background: '#FFF9F0',
      text: '#2E2E2E',
    },
    layout: 'masonry', // flowing uneven card layout
    animations: ['Water Ripple', 'Leaf Grow', 'Ink Spread', 'Scroll Fade'],
    seoOptimized: true,
  },

  // ------------------------- Template 3 -------------------------
  {
    id: 'corporate-split',
    name: 'Corporate Split',
    category: 'business',
    preview:
      'https://images.unsplash.com/photo-1564866657312-6c1997b9c2a8?w=400&h=300&fit=crop',
    description:
      'Professional corporate portfolio with a split-screen design: analytics and charts on one side, company story and services on the other.',
    features: [
      'Split-screen Layout',
      'Animated Charts',
      'Modular Business Sections',
      'Data-driven Infographics',
      'Professional Typography',
    ],
    technologies: ['Angular', 'D3.js', 'TailwindCSS', 'Chart.js', 'RxJS'],
    colors: {
      primary: '#1E3A8A',
      secondary: '#2563EB',
      accent: '#F59E0B',
      background: '#F3F4F6',
      text: '#111827',
    },
    layout: 'split-screen', // left/right divide
    animations: ['Chart Reveal', 'Panel Slide', 'Counter Up', 'Hover Elevation'],
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
