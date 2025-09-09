export interface PortfolioTemplate {
  id: string;
  name: string;
  category: 'modern' | 'creative' | 'developer' | 'business' | 'minimal' | 'artistic' | 'corporate' | 'startup' | 'academic' | 'futuristic';
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
  layout: 'single-page' | 'multi-section' | 'parallax' | 'grid' | 'masonry' | 'timeline' | 'card-based' | 'split-screen';
  animations: string[];
  seoOptimized: boolean;
}

export const portfolioTemplates: PortfolioTemplate[] = [
  // ------------------------- Template 1 -------------------------
  {
    id: 'neon-chronos',
    name: 'Neon Chronos',
    category: 'futuristic',
    preview: 'https://images.unsplash.com/photo-1603470182120-6b4c6f97a7d4?w=400&h=300&fit=crop',
    description: 'Futuristic neon-themed timeline with dynamic 3D holograms and kinetic typography.',
    features: ['3D Holographic Cards', 'Interactive Timeline', 'Kinetic Text Animations', 'Neon Glow Effects', 'AI-generated Backgrounds'],
    technologies: ['Three.js', 'GSAP', 'React', 'WebGL', 'TensorFlow.js'],
    colors: {
      primary: '#0FF1CE',
      secondary: '#FF00F7',
      accent: '#FFD300',
      background: '#1A1A2E',
      text: '#E0E0E0'
    },
    layout: 'timeline',
    animations: ['Hologram Rotate', 'Neon Pulse', 'Card Flip', 'Glow Fade'],
    seoOptimized: true
  },

  // ------------------------- Template 2 -------------------------
  {
    id: 'eco-atelier',
    name: 'Eco Atelier',
    category: 'artistic',
    preview: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=300&fit=crop',
    description: 'Organic design inspired by nature with fluid layouts, watercolor textures, and soft motion graphics.',
    features: ['Fluid Grid Layout', 'Hand-drawn Icons', 'Watercolor Backgrounds', 'Interactive Illustrations', 'Eco-friendly Palette'],
    technologies: ['Vue.js', 'Paper.js', 'CSS Houdini', 'SVG Animations', 'GreenSock'],
    colors: {
      primary: '#8BC34A',
      secondary: '#CDDC39',
      accent: '#FF5722',
      background: '#FFF9F0',
      text: '#3E2723'
    },
    layout: 'masonry',
    animations: ['Water Ripple', 'Leaf Grow', 'Ink Spread', 'Color Fade'],
    seoOptimized: true
  },

  // ------------------------- Template 3 -------------------------
  {
    id: 'corporate-grid',
    name: 'Corporate Grid',
    category: 'business',
    preview: 'https://images.unsplash.com/photo-1564866657312-6c1997b9c2a8?w=400&h=300&fit=crop',
    description: 'Professional corporate portfolio with a strict grid, clean typography, and modular sections for analytics and services.',
    features: ['Modular Grid Layout', 'Data-driven Sections', 'Infographic Panels', 'Animated Charts', 'Service Highlights'],
    technologies: ['Angular', 'D3.js', 'TailwindCSS', 'Chart.js', 'RxJS'],
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#F59E0B',
      background: '#F3F4F6',
      text: '#111827'
    },
    layout: 'grid',
    animations: ['Chart Reveal', 'Section Slide', 'Panel Fade', 'Hover Elevation'],
    seoOptimized: true
  }
];

// ------------------------- Utility Functions -------------------------
export const getPortfolioTemplateById = (id: string) => {
  return portfolioTemplates.find(template => template.id === id);
};

export const getPortfolioTemplatesByCategory = (category: string) => {
  return portfolioTemplates.filter(template => template.category === category);
};
