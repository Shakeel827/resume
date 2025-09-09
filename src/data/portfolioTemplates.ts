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
  {
    id: 'quantum-pulse',
    name: 'Quantum Pulse',
    category: 'futuristic',
    preview: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    description: 'Holographic interface with quantum-inspired animations and neural network visuals',
    features: ['Neural Network Visualization', 'Quantum Particle Effects', 'Holographic UI', 'Voice Interaction', 'AI Integration'],
    technologies: ['Next.js', 'WebGL', 'TensorFlow.js', 'Three.js', 'WebRTC'],
    colors: {
      primary: '#7B61FF',
      secondary: '#00D1FF',
      accent: '#FF2A6D',
      background: '#0A0A18',
      text: '#E0E0FF'
    },
    layout: 'split-screen',
    animations: ['Quantum Entanglement', 'Neural Pulse', 'Hologram Flicker', 'Particle Orbit'],
    seoOptimized: true
  },
  {
    id: 'organic-studio',
    name: 'Organic Studio',
    category: 'artistic',
    preview: 'https://images.unsplash.com/photo-1536148935331-408321065b18?w=400&h=300&fit=crop',
    description: 'Biomorphic design with fluid animations and natural textures inspired by organic forms',
    features: ['Fluid Morphing', 'Organic Textures', 'Natural Color Transitions', 'Hand-drawn Elements', 'Eco-inspired Design'],
    technologies: ['Vue.js', 'Paper.js', 'CSS Houdini', 'SVG Animations', 'GreenSock'],
    colors: {
      primary: '#42B883',
      secondary: '#347474',
      accent: '#FF7A45',
      background: '#FAF6F0',
      text: '#2D334A'
    },
    layout: 'masonry',
    animations: ['Watercolor Bleed', 'Leaf Growth', 'Fluid Movement', 'Ink Spread'],
    seoOptimized: true
  },
  {
    id: 'cyber-matrix',
    name: 'Cyber Matrix',
    category: 'developer',
    preview: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
    description: 'Cyberpunk-inspired terminal interface with digital rain and glitch effects',
    features: ['Terminal Interface', 'Matrix Digital Rain', 'Glitch Effects', 'Code Visualization', 'Retro-Futuristic Design'],
    technologies: ['React', 'TypeScript', 'Canvas API', 'Glsl', 'Web Audio API'],
    colors: {
      primary: '#00FF41',
      secondary: '#008F11',
      accent: '#FF003C',
      background: '#011502',
      text: '#CCFFD6'
    },
    layout: 'card-based',
    animations: ['Digital Rain', 'Glitch Distortion', 'Terminal Typing', 'Hex Grid Pulse'],
    seoOptimized: true
  }
];

export const getPortfolioTemplateById = (id: string) => {
  return portfolioTemplates.find(template => template.id === id);
};

export const getPortfolioTemplatesByCategory = (category: string) => {
  return portfolioTemplates.filter(template => template.category === category);
};
