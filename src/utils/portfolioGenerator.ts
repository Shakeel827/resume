import { saveAs } from 'file-saver';

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
    image?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
}

const portfolioTemplates = {
  cyberpunk: {
    name: 'Cyberpunk Matrix',
    primaryColor: '#00ff41',
    secondaryColor: '#ff0080',
    accentColor: '#00d4ff',
    backgroundColor: '#0a0a0a',
    cardBackground: '#1a1a2e',
    textColor: '#ffffff',
    glowColor: '#00ff41'
  },
  neon: {
    name: 'Neon Grid',
    primaryColor: '#ff00ff',
    secondaryColor: '#00ffff',
    accentColor: '#ffff00',
    backgroundColor: '#000010',
    cardBackground: 'rgba(0, 0, 30, 0.7)',
    textColor: '#ffffff',
    glowColor: '#ff00ff'
  },
  particle: {
    name: 'Particle Flow',
    primaryColor: '#ff6b35',
    secondaryColor: '#004e98',
    accentColor: '#00cfc1',
    backgroundColor: '#010103',
    cardBackground: 'rgba(15, 15, 35, 0.8)',
    textColor: '#e6e6e6',
    glowColor: '#ff6b35'
  }
};

// Helper function to generate the common HTML structure
const generateCommonHTML = (data: PortfolioData, theme: any, templateName: string): string => {
  const title = `${data.personalInfo.name || templateName} - Portfolio`;
  const subtitle = data.personalInfo.summary || 
    (templateName === 'Cyberpunk Matrix' ? 'Digital Architect | Code Warrior | Future Builder' :
     templateName === 'Neon Grid' ? 'Neon Designer | Grid Weaver | Interface Architect' :
     'Particle Developer | Flow Creator | Motion Designer');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${data.personalInfo.summary || `${templateName} portfolio showcasing skills and projects`}">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
        :root {
            --primary: ${theme.primaryColor};
            --secondary: ${theme.secondaryColor};
            --accent: ${theme.accentColor};
            --bg: ${theme.backgroundColor};
            --card-bg: ${theme.cardBackground};
            --text: ${theme.textColor};
            --glow: ${theme.glowColor};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${templateName === 'Neon Grid' ? "'Exo 2', sans-serif" : templateName === 'Particle Flow' ? "'Montserrat', sans-serif" : "'Rajdhani', sans-serif"};
            background: var(--bg);
            color: var(--text);
            overflow-x: hidden;
            ${templateName === 'Neon Grid' ? `
            background-image: 
                linear-gradient(rgba(0, 0, 10, 0.7), rgba(0, 0, 20, 0.7)),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0v100M20 0v100M40 0v100M60 0v100M80 0v100M100 0v100M0 0h100M0 20h100M0 40h100M0 60h100M0 80h100M0 100h100' stroke='rgba(0, 255, 255, 0.1)' stroke-width='0.5' fill='none'/%3E%3C/svg%3E");
            background-size: cover;
            ` : templateName === 'Particle Flow' ? `
            background-image: radial-gradient(circle at 15% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 25%),
                              radial-gradient(circle at 85% 30%, rgba(0, 78, 152, 0.1) 0%, transparent 25%),
                              radial-gradient(circle at 50% 80%, rgba(0, 207, 193, 0.1) 0%, transparent 25%);
            ` : ''}
        }
        
        /* Custom Cursor */
        .cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }
        
        .cursor-trail {
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--secondary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.7;
        }
        
        ${templateName === 'Cyberpunk Matrix' ? `
        /* Matrix Rain Background */
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.1;
        }
        
        .matrix-char {
            position: absolute;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            color: var(--primary);
            animation: matrixFall linear infinite;
        }
        
        @keyframes matrixFall {
            0% { transform: translateY(-100vh); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        ` : templateName === 'Neon Grid' ? `
        /* Neon Grid Background */
        .grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.1;
            background-image: 
                linear-gradient(to right, var(--primary) 1px, transparent 1px),
                linear-gradient(to bottom, var(--primary) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
        }
        
        .neon-line {
            position: absolute;
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);
            animation: neonPulse 2s ease-in-out infinite alternate;
        }
        
        .neon-line.horizontal {
            height: 1px;
            width: 100%;
        }
        
        .neon-line.vertical {
            width: 1px;
            height: 100%;
        }
        ` : templateName === 'Particle Flow' ? `
        /* Particle Canvas Background */
        .particle-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        ` : ''}
        
        /* Glitch Effect */
        .glitch {
            position: relative;
            display: inline-block;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch::before {
            animation: glitch-1 0.5s infinite;
            color: var(--secondary);
            z-index: -1;
        }
        
        .glitch::after {
            animation: glitch-2 0.5s infinite;
            color: var(--accent);
            z-index: -2;
        }
        
        @keyframes glitch-1 {
            0%, 14%, 15%, 49%, 50%, 99%, 100% { transform: translate(0); }
            15%, 49% { transform: translate(-2px, 2px); }
        }
        
        @keyframes glitch-2 {
            0%, 20%, 21%, 62%, 63%, 99%, 100% { transform: translate(0); }
            21%, 62% { transform: translate(2px, -2px); }
        }
        
        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            ${templateName === 'Cyberpunk Matrix' ? `
            background: radial-gradient(circle at center, rgba(0,255,65,0.1) 0%, transparent 70%);
            ` : templateName === 'Neon Grid' ? `
            background: radial-gradient(ellipse at center, rgba(255, 0, 255, 0.1) 0%, rgba(0, 0, 20, 0.5) 50%, rgba(0, 0, 10, 0.8) 100%);
            ` : templateName === 'Particle Flow' ? `
            background: radial-gradient(ellipse at center, rgba(255, 107, 53, 0.1) 0%, rgba(1, 1, 3, 0.7) 70%);
            ` : ''}
            overflow: hidden;
        }
        
        .hero-content {
            z-index: 2;
            position: relative;
        }
        
        .hero h1 {
            font-family: ${templateName === 'Neon Grid' ? "'Exo 2', sans-serif" : "'Orbitron', monospace"};
            font-size: clamp(3rem, 8vw, 6rem);
            font-weight: 900;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary), 0 0 60px var(--primary);
            animation: neonPulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes neonPulse {
            from { text-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary), 0 0 60px var(--primary); }
            to { text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary), 0 0 30px var(--primary); }
        }
        
        .hero .subtitle {
            font-size: clamp(1.2rem, 3vw, 2rem);
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: typewriter 3s steps(40) 1s forwards;
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid var(--primary);
            width: 0;
        }
        
        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }
        
        .cyber-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            color: var(--bg);
            text-decoration: none;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            ${templateName === 'Cyberpunk Matrix' ? `
            clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%);
            ` : templateName === 'Neon Grid' ? `
            border-radius: 30px;
            box-shadow: 0 0 15px var(--primary), inset 0 0 10px rgba(255, 255, 255, 0.3);
            ` : templateName === 'Particle Flow' ? `
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            ` : ''}
        }
        
        .cyber-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }
        
        .cyber-button:hover::before {
            left: 100%;
        }
        
        .cyber-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px var(--primary);
        }
        
        /* Floating Particles */
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-30px) rotate(120deg); }
            66% { transform: translateY(30px) rotate(240deg); }
        }
        
        /* Section Styling */
        .section {
            padding: 100px 0;
            position: relative;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .section-title {
            font-family: ${templateName === 'Neon Grid' ? "'Exo 2', sans-serif" : "'Orbitron', monospace"};
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            text-align: center;
            margin-bottom: 4rem;
            position: relative;
            text-shadow: 0 0 20px var(--glow);
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
            border-radius: 2px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        /* Skills Section */
        ${templateName === 'Cyberpunk Matrix' ? `
        .skills-matrix {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .skill-node {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid var(--primary);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            animation: skillGlow 3s ease-in-out infinite alternate;
        }
        
        .skill-node::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, var(--primary), var(--secondary), var(--accent), var(--primary));
            animation: rotate 4s linear infinite;
            z-index: -1;
        }
        
        .skill-node::after {
            content: '';
            position: absolute;
            inset: 2px;
            background: var(--card-bg);
            border-radius: 13px;
            z-index: -1;
        }
        
        @keyframes skillGlow {
            from { box-shadow: 0 0 20px var(--primary); }
            to { box-shadow: 0 0 40px var(--secondary), 0 极 60px var(--accent); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .skill-node:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 50px rgba(0,255,65,0.3);
        }
        
        .skill-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--primary);
            text-shadow: 0 0 10px var(--primary);
        }
        ` : templateName === 'Neon Grid' ? `
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .skill-card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .skill-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--primary), var(--secondary), var(--accent), var(--primary));
            z-index: -1;
            animation: borderRotate 3s linear infinite;
        }
        
        .skill-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        @keyframes borderRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .skill-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 10px 25px var(--primary);
        }
        
        .skill-card:hover::after {
            opacity: 0.1;
        }
        
        .skill-name {
            font-family: 'Exo 2', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
            color: var(--text);
            margin-bottom: 1rem;
        }
        
        .skill-level {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 3px;
            animation: fillBar 2s ease-in-out;
            width: 0;
        }
        
        @keyframes fillBar {
            from { width: 0; }
        }
        ` : templateName === 'Particle Flow' ? `
        .skills-flow {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .skill-orb {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: var(--card-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all 0.5s ease;
            box-shadow: 0 极 20px rgba(0, 0, 0, 0.2);
            animation: floatOrb 4s ease-in-out infinite;
        }
        
        .skill-orb::before {
            content: '';
            position: absolute;
            inset: -5px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary), var(--secondary), var(--accent));
            z-index: -1;
            animation: rotate 4s linear infinite;
        }
        
        .skill-orb::after {
            content: '';
            position: absolute;
            inset: 2px;
            border-radius: 50%;
            background: var(--card-bg);
            z-index: -1;
        }
        
        @keyframes floatOrb {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        
        .skill-极:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px var(--primary);
        }
        
        .skill-name {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            text-align: center;
            color: var(--text);
            z-index: 2;
        }
        
        .skill-icon {
            position: absolute;
            font-size: 2rem;
            color: var(--primary);
            opacity: 0.3;
            z-index: 1;
        }
        ` : ''}
        
        /* Projects Section */
        ${templateName === 'Cyberpunk Matrix' ? `
        .projects-hex-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .project-hex {
            width: 350px;
            height: 400px;
            background: var(--card-bg);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            position: relative;
            transition: all 0.5s ease;
            cursor: pointer;
            overflow: hidden;
        }
        
极        .project-hex::before {
            content: '';
            position: absolute;
            inset: 3px;
            background: var(--card-bg);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            z-index: 1;
        }
        
        .project-hex::after {
            content: '';
            position: absolute;
            inset: 0;
            background: conic-gradient(from 0deg, var(--primary), var极(--secondary), var(--accent), var(--primary));
            animation: rotate 6s linear infinite;
            z-index: 0;
        }
        
        .project-hex:hover {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 0 30px var(--primary));
        }
        
        .project-content {
            position: absolute;
            inset: 20px;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
        }
        ` : templateName === 'Neon Grid' ? `
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
极        }
        
        .project-card {
            background: var(--card-bg);
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.4s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
        }
        
        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 极%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4极 ease;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px var(--primary);
        }
        
        .project-card:hover::before {
            transform: scaleX(1);
        }
        
        .project-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .project-content {
            padding: 1.5rem;
        }
        ` : templateName === 'Particle Flow' ? `
        .projects-flow {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            margin-top: 3rem;
        }
        
        .project-item {
            display: flex;
            align-items: center;
            gap: 2rem;
            padding: 2rem;
            background: var(--card-bg);
            border-radius: 15px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .project-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .project-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: -1;
        }
        
        .project-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .project-item:hover::before {
            opacity: 0.1;
        }
        
        .project-image {
            width: 300px;
            height: 200px;
            border-radius: 10px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.5rem;
            flex-shrink: 0;
        }
        
        .project-content {
            flex: 1;
        }
        ` : ''}
        
        .project-content h3 {
            font-family: ${templateName === 'Neon Grid' ? "'Exo 2', sans-serif" : templateName === 'Particle Flow' ? "'Montserrat', sans-serif" : "'Orbitron', monospace"};
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--primary);
            text-shadow: 0 0 10px var(--primary);
        }
        
        .project-content p {
            font-size: 0.9rem;
            line-height: 1.4;
            margin-bottom: 1rem;
            opacity: 0.9;
        }
        
        .tech-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
            margin-bottom: 1rem;
        }
        
        .tech-chip {
            background: linear-gradient(45极, var(--secondary), var(--accent));
            color: var(--bg);
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Experience Section */
        ${templateName === 'Cyberpunk Matrix' ? `
        .cyber-timeline {
            position: relative;
            margin-top: 3rem;
        }
        
        .cyber-timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, var(--primary), var(--secondary), var(--accent));
            transform: translateX(-50%);
            animation: pulse 2s ease-in-out infinite;
        }
        
        .timeline-item {
            display:极 flex;
            align-items: center;
            margin-bottom: 4rem;
            position: relative;
        }
        
        .timeline-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .timeline-content {
            flex: 1;
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 20px;
            margin: 0 2rem;
            border: 2px solid var(--primary);
            position: relative;
            transition: all 0.3s ease;
            animation: slideInFromSide 0.8s ease-out;
        }
        
        .timeline-content::before {
            content: '';
            position: absolute;
            top: 50%;
            width: 0;
            height: 0;
            border: 15px solid transparent;
            transform: translateY(-50%);
        }
        
        .timeline-item:nth-child(odd) .timeline-content::before {
            right: -30px;
            border-left-color: var(--primary);
        }
        
        .timeline-item:nth-child(even极) .timeline极-content::before {
            left: -30px;
            border-right-color: var(--primary);
        }
        
        .timeline-content:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px var(--primary);
        }
        
        .timeline-node {
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            border: 4px solid var(--bg);
            box-shadow: 0 0 20px var(--primary);
            z-index: 2;
            animation: nodePulse 2s ease-in-out infinite;
        }
        
        @keyframes nodePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        ` : templateName === 'Neon Grid' ? `
        .neon-timeline {
            position: relative;
            margin-top: 3rem;
        }
        
        .neon-timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, var(--primary), var(--secondary), var(--accent));
            transform: translateX(-50%);
            box-shadow: 0 0 10px var(--primary), 0 0 20极 var(--primary);
        }
        
        .timeline-item {
            display: flex;
            margin-bottom: 4rem;
            position: relative;
        }
        
        .timeline-item:nth-child(odd) {
            justify-content: flex-start;
        }
        
        .timeline-item:nth-child(even) {
            justify-content: flex-end;
        }
        
        .timeline-content {
            width: 45%;
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .timeline-content::before {
            content: '';
            position: absolute;
            top: 20px;
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--primary);
极        }
        
        .timeline-item:nth-child(odd) .timeline-content::before {
            right: -30px;
        }
        
        .timeline-item:nth-child(even) .timeline-content::before {
            left: -30极;
        }
        
        .timeline-content:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px var(--primary);
        }
        
        .timeline-date {
            font-size: 0.9rem;
            color: var(--primary);
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        ` : templateName === 'Particle Flow' ? `
        .flow-timeline {
            position: relative;
            margin-top: 3rem;
        }
        
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 4rem;
            position: relative;
        }
        
        .timeline-item:nth-child(odd) {
            flex-direction: row;
        }
        
        .timeline-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .timeline-content {
            flex: 1;
            background: var(--card-b极);
            padding: 2rem;
            border-radius: 15px;
            margin: 0 2rem;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .timeline-content::before {
            content: '';
            position: absolute;
            top: 50%;
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        
        .timeline-item:nth-child(odd) .timeline-content::before {
            right: -30px;
        }
        
        .timeline-item:nth-child(even) .timeline-content::before {
            left: -30px;
        }
        
        .timeline-content:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .timeline-node {
            width: 15px;
            height: 15px;
            background: var(--primary);
            border-radius: 50%;
            box-shadow: 0 0 15px var(--primary);
            z-index: 2;
            position: relative;
        }
        
        .timeline-node::after {
            content: '';
            position: absolute;
            width: 35px;
            height: 35px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
            opacity: 0.5;
        }
        ` : ''}
        
        @keyframes slideInFromSide {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* Education Section */
        ${templateName === 'Cyberpunk Matrix' ? `
        .education-matrix {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .edu-card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid var(--primary);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .edu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px var(--primary);
        }
        
        .edu-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        }
        
        .edu-card:hover::before {
            transform: scaleX(1);
        }
        ` : templateName === 'Neon Grid' ? `
        .education-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .edu-card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
极            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .edu-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2极;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--primary), var(--secondary), var(--accent), var(--primary));
            z-index: -1;
            animation: borderRotate 3s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .edu-card:hover::before {
            opacity: 1;
        }
        
        .edu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px var(--primary);
        }
        ` : templateName === 'Particle Flow' ? `
        .education-flow {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .edu-item {
            display: flex;
            align-items: center;
            gap: 2rem;
            padding: 2rem;
            background: var(--card-bg);
            border-radius: 15px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .edu-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .edu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .edu-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .edu-item:hover::before {
            opacity: 0.1;
        }
        
        .edu-icon {
            width: 80px;
            height: 80极;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .edu-content {
            flex: 1;
        }
        ` : ''}
        
        /* Terminal Contact */
        .terminal {
            background: #000;
            border-radius: 10px;
            padding: 1rem;
            margin: 2rem 0;
            border: 2px solid var(--primary);
            font-family: 'Courier New', monospace;
            position: relative;
        }
        
        .terminal::before {
            content: '● ● ●';
            position: absolute;
            top: 10px;
            left: 15px;
            color: var(--primary);
            font-size: 12px;
        }
        
        .terminal-content {
            margin-top: 30px;
            color: var(--primary);
            font-size: 14px;
            line-height: 1.4;
        }
        
        .typing-animation {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 3s steps(40) infinite;
        }
        
        @keyframes typing {
            0%, 50% { width: 0; }
            100% { width: 100%; }
        }
        
        /* Enhanced Animations */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes slideInFromBottom {
极            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes rotate3d {
            0% { transform: rotateY(0极); }
            100% { transform: rotateY(360deg); }
        }
        
        /* Enhanced Footer */
        .cyber-footer {
            background: linear-gradient(to top, var(--card-bg), var(--bg));
            padding: 60px 0 30px;
            position: relative;
            overflow: hidden;
            border-top: 2px solid var(--primary);
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .footer-section h3 {
            font-family: ${templateName === 'Neon Grid' ? "'Exo 2', sans-serif" : templateName === 'Particle Flow' ? "'Montserrat', sans-serif" : "'Orbitron', monospace"};
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: var(--primary);
            text-shadow: 0 0 10px var(--primary);
        }
        
        .footer-section p {
            line-height: 1.6;
            margin-bottom: 15px;
            opacity: 0.8;
        }
        
极        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 12px;
        }
        
        .footer-links a {
            color: var(--text);
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
        }
        
        .footer-links a:hover {
            color:极 var(--primary);
            transform: translateX(5px);
            text-shadow: 0 0 10px var(--primary);
        }
        
        .social-icons {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        
        .social-icon {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: var(--card-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.2rem;
            transition: all 极.3s ease;
            border: 2px solid var(--primary);
            animation: pulse 2s infinite;
        }
        
        .social-icon:hover {
            background: var(--primary);
            color: var(--bg);
            transform: translateY(-5px) rotate(10deg);
            box-shadow: 0 5px 15px rgba(0,255,65,0.4);
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid rgba(0,255,65,0.3);
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: var(--bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
           极 justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
            box-shadow: 0 0 20px var(--primary);
        }
        
        .back-to-top.active {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 5px 25px var(--primary);
        }
        
        /* Floating shapes animation */
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
        }
        
        .shape {
            position: absolute;
            background: var(--primary);
            opacity: 0.1;
            animation: floatAround 20s infinite linear;
        }
        
        .shape:nth-child(1) {
            width: 40px;
            height: 40px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
            animation-duration: 18s;
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        
        .shape:n极-child(2) {
            width: 60px;
            height: 60px;
            top: 20%;
            right: 15%;
            animation-delay: 2极;
            animation-duration: 22s;
            border-radius: 50%;
        }
        
        .shape:nth-child(3) {
            width: 50px;
            height: 50px;
            bottom: 25%;
            left: 15%;
            animation-delay: 4s;
            animation-duration: 20s;
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        
        .shape:nth-child(4) {
            width: 70px;
            height: 70px;
            bottom: 15%;
            right: 10%;
            animation-delay: 6s;
            animation-duration: 24s;
            clip-path: polygon(50% 0%, 极00% 50%, 50% 100%, 0% 50%);
        }
        
        @keyframes floatAround {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(30px, 50px) rotate(90deg);
            }
            50% {
                transform: translate(0, 100px) rotate(180deg);
            }
            75% {
                transform: translate(-30px, 50px) rotate(270deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            ${templateName === 'Cyberpunk Matrix' ? `
            .cyber-timeline::before { left: 30px; }
            .timeline-item { flex-direction: column !important; }
            .timeline-content { margin: 1rem 0 1rem 60px; }
            .timeline-content::before { display: none; }
            ` : templateName === 'Neon Grid' ? `
            .neon-timeline::before { left: 30px; }
            .timeline-item { justify-content: flex-start !important; }
            .timeline-content { width: 80%; margin-left: 60px; }
            .timeline-content::before { left: -30px !important; right: auto !important; }
            ` : templateName === 'Particle Flow' ? `
            .timeline-item { flex-direction: column !important; }
            .timeline-content { margin: 1rem 0; }
            .timeline-content::before { display: none; }
            ` : ''}
            
            .projects-hex-grid, .projects-grid, .projects-flow { flex-direction: column; align-items: center; }
            .project-hex { width: 300px; height: 350px; }
            .project-item, .project-item:nth-child(even) { flex-direction: column; }
            .project-image { width: 100%; }
            .skills-matrix, .skills-grid, .skills-flow { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
            .footer-content { grid-template-columns: 1fr; text-align: center; }
            .social-icons { justify-content: center; }
            .edu-item, .edu-item:nth-child(even) { flex-direction: column; text-align: center; }
        }
        
        /* Scroll Animations */
        .fade-in {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .slide-in-left {
            opacity: 0;
            transform: translateX(-100px);
            transition: all 0.8s ease;
        }
        
        .slide-in-left.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .slide-in-right {
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.8s ease;
        }
        
        .slide-in-right.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .zoom-in {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.极s ease;
        }
        
        .zoom-in.visible {
            opacity: 1;
            transform: scale(1);
        }
    </style>
</head>
<body>
    <div class="cursor"></div>
    ${templateName === 'Cyberpunk Matrix' ? `
    <div class="matrix-bg"></div>
    ` : templateName === 'Neon Grid' ? `
    <div class="grid-bg"></div>
    <div class="neon-line horizontal" style="top: 25%"></div>
    <div class="neon-line horizontal" style="top: 50%"></div>
    <div class="neon-line horizontal" style="top: 75%"></div>
    <div class="neon-line vertical" style="left: 25%"></div>
    <div class="neon-line vertical" style="left: 50%"></div>
    <div class="neon-line vertical" style="left: 75%"></div>
    ` : templateName === 'Particle Flow' ? `
    <canvas class="particle-canvas"></canvas>
    ` : ''}
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class极="shape"></div>
    </div>
    
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="glitch" data-text="${data.personalInfo.name || templateName}">${data.personalInfo.name || templateName}</h1>
            <p class="subtitle">${subtitle}</p>
            <div style="margin-top: 2rem;">
                ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="cyber-button">CONNECT</a>` : ''}
            </div>
        </div>
    </section>
    
    <!-- Skills Matrix -->
    <section class="section" id="skills">
        <div class="container">
            <h2 class="section-title fade-in">SKILL_MATRIX</h2>
            ${templateName === 'Cyberpunk Matrix' ? `
            <div class="skills-matrix">
                ${data.skills.map((skill, index) => `
                    <div class="skill-node fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="skill-name">${skill}</div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Neon Grid' ? `
            <极 class="skills-grid">
                ${data.skills.map((skill, index) => `
                    <div class="skill-card fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="skill-name">${skill}</div>
                        <div class="skill-level">
                            <div class="skill-progress" style="width: ${70 + (index * 5) % 30}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Particle Flow' ? `
            <div class="skills-flow">
                ${data.skills.map((skill, index) => `
                    <div class="skill-orb fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="skill-icon"><i class="fas fa-code"></i></div>
                        <div class="skill-name">${skill}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>
    
    <!-- Projects Section -->
    <section class="section" id="projects">
        <div class="container">
            <h2 class="section-title fade-in">PROJECT_NEXUS</h2>
            ${templateName === 'Cyberpunk Matrix' ? `
            <div class="projects-hex-grid">
                ${data.projects.map((project, index) => `
                    <div class="project-hex fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <div class="tech-chips">
                                ${project.technologies.split(',').map(tech => `
                                    <span class="tech-chip">${tech.trim()}</span>
                                `).join('')}
                            </div>
                            ${project.link ? `<a href="${project.link}" class="cyber-button" style="font-size: 0.8rem; padding: 10px 20px;">ACCESS</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Neon Grid' ? `
            <div class="projects-grid">
                ${data.projects.map((project, index) => `
                    <div class极="project-card fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="project-image">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <div class="tech-chips">
                                ${project.technologies.split(',').map(tech => `
                                    <span class="tech-chip">${tech.trim()}</span>
                                `).join('')}
                            </div>
                            ${project.link ? `<a href="${project.link}" class="cyber-button" style="font-size: 0.8rem; padding: 10px 20px; margin-top: 1rem;">VIEW PROJECT</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Particle Flow' ? `
            <div class="projects-flow">
                ${data.projects.map((project, index) => `
                    <div class="project-item fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="project-image">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <div class="tech-chips">
                                ${project.technologies.split(',').map(tech => `
                                    <span class="tech-chip">${tech.trim()}</span>
                                `).join('')}
                            </div>
                            ${project.link ? `<a href="${project.link}" class="cyber-button" style="font-size: 0.8rem; padding: 10px 20px; margin-top: 1rem;">VIEW PROJECT</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>
    
    <!-- Experience Timeline -->
    <section class="section" id="experience">
        <div class="container">
            <h2 class="section-title fade-in">EXPERIENCE_LOG</h2>
            ${templateName === 'Cyberpunk Matrix' ? `
            <div class="cyber-t极eline">
                ${data.experience.map((exp, index) => `
                    <div class="timeline-item fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="timeline-content">
                            <h3 style="font-family: 'Orbitron', monospace; color: var(--primary); font-size: 1.5rem; margin-bottom: 0.5rem;">${exp.title}</h3>
                            <p style="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${exp.company} | ${exp.duration}</p>
                            <p style="opacity: 0.9; line-height: 1.6;">${exp.description}</p>
                        </div>
                        <div class="timeline-node"></div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Neon Grid' ? `
            <div class="neon-timeline">
                ${data.experience.map((exp, index) => `
                    <div class="timeline-item fade-in" style="animation-delay: ${index * 0.2}s">
                        <极 class="timeline-content">
                            <div class="timeline-date">${exp.duration}</div>
                            <h3 style="font-family: 'Exo 2', sans-serif; color: var(--primary); font-size: 1.5rem; margin-bottom: 0.5rem;">${exp.title}</h3>
                            <p style="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${exp.company}</p>
                            <p style="opacity: 0.9; line-height: 1.6;">${exp.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Particle Flow' ? `
            <div class="flow-timeline">
                ${data.experience.map((exp, index) => `
                    <div class="timeline-item fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="timeline-content">
                            <h3 style="font-family: 'Montserrat', sans-serif; color: var(--primary); font-size: 1.5rem; margin-bottom: 0.5rem;">${exp.title}</h3>
                            <p style极="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${exp.company} | ${exp.duration}</p>
                            <p style="opacity: 0.9; line-height: 1.6;">${极.description}</p>
                        </div>
                        <div class="timeline-node"></div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>
    
    <!-- Education Section -->
    <section class="section"极 id="education">
        <div class="container">
            <h2 class="section-title fade-in">EDUCATION_MATRIX</h2>
            ${templateName === 'Cyberpunk Matrix' ? `
            <div class="education-matrix">
                ${data.education.map((edu, index) => `
                    <div class="edu-card fade-in" style="animation-delay: ${index * 0.2}s">
                        <h3 style="font-family: 'Orbitron', monospace; color: var(--primary); font-size: 1.2rem; margin-bottom: 0.5rem;">${edu.degree}</h3>
                        <p style="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${edu.institution} | ${edu.year}</p>
                        ${edu.gpa ? `<p style="opacity: 0.9;">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Neon Grid' ? `
            <div class="education-grid">
                ${data.education.map((edu, index) => `
                    <div class="edu-card fade-in" style="animation-delay: ${index * 0.2}s">
                        <h3 style="font-family: 'Exo 2', sans-serif; color: var(--primary); font-size: 1.2rem; margin-bottom: 极.5rem;">${edu.degree}</h3>
                        <p style="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${edu.institution} | ${edu.year}</p>
                        ${edu.gpa ? `<p style="opacity: 0.9;">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : templateName === 'Particle Flow' ? `
            <div class="education-flow">
                ${data.education.map((edu, index) => `
                    <div class="edu-item fade-in" style="animation-delay: ${index * 0.2}s">
                        <div class="edu-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="edu-content">
                            <h3 style="font-family: 'Montserrat', sans-serif; color: var(--primary); font-size: 1.2rem; margin-bottom: 0.5rem;">${edu.degree}</h3>
                            <p style="color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem;">${edu.institution} | ${edu.year}</p>
                            ${edu.gpa ? `<p style="opacity: 0.9;">GPA: ${edu.gpa}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>
    
    <!-- Terminal Contact -->
    <section class="section" id="contact">
        <div class="container">
            <div class="terminal fade-in">
                <div class="terminal-content">
                    <div class="typing-animation">$ whoami</div>
                    <div>${data.personalInfo.name || 'cyber_warrior'}</div>
                    <div class="typing-animation">$ contact --info</div>
                    <div>Email: ${data.personalInfo.email || 'classified@matrix.net'}</div>
                    <div>Phone: ${data.personalInfo.phone || 'encrypted'}</div>
                    <div>Location: ${data.personalInfo.location || 'The Grid'}</div>
                    <div class="typing-animation">$ status</div>
                    <div style="color: var(--primary);">READY_FOR_MISSION</div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="cyber-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section slide-in-left">
                    <h3>ABOUT_ME</h3>
                    <p>${data.personalInfo.summary || 'Digital architect building the future one line of code at a time.'}</p>
                    <div class="social-icons">
                        ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" class="social-icon"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" class="social-icon"><i class="fab fa-github"></i></a>` : ''}
                        ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="social-icon"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
                
                <div class="footer-section zoom-in">
                    <h3>QUICK_LINKS</h3>
                    <ul class="footer-links">
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#experience">Experience</a></li>
                        <li><a href="#education">Education</a></li>
                        <极><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section slide-in-right">
                    <h3>CONTACT_INFO</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${data.personalInfo.location || 'Digital Realm'}</p>
                    <p><i class="fas fa-phone"></i> ${data.personalInfo.phone || 'Encrypted'}</p>
                    <p><i class="fas fa-envelope"></i> ${data.personalInfo.email || 'contact@matrix.com'}</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${data.personalInfo.name || 'Cyber Matrix'}. All rights reserved. | Designed with <i class="fas fa-heart" style="color: var(--secondary);"></i> in the digital realm</p>
            </div>
        </div>
    </footer>
    
    <div class="back-to-top">
        <i class="fas fa-arrow-up"></i>
    </div>

    <script>
        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const trails = [];
        
        for (let i = 0; i < 10; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trails.push(trail);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            trails.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = mouseX + 'px';
                    trail.style.top = mouseY + 'px';
                }, index * 50);
            });
        });
        
        ${templateName === 'Cyberpunk Matrix' ? `
        // Matrix Rain
        function createMatrixRain() {
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const matrixBg = document.querySelector('.matrix-bg');
            
            for (let i = 0; i < 50; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = (Math.random() * 3 + 2) + 's';
                char.style.animationDelay = Math.random() * 2 + 's';
                matrixBg.appendChild(char);
            }
        }
        ` : templateName === 'Particle Flow' ? `
        // Particle Flow Background
        function initParticleFlow() {
            const canvas = document.querySelector('.particle-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const particles = [];
            const particleCount = 100;
            
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 3 + 1;
                    this.speedX = Math.random() * 2 - 1;
                    this.speedY = Math.random() * 2 - 1;
                    this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
                }
                
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    if (this.x > canvas.width || this.x < 0) {
                        this.speedX = -this.speedX;
                    }
                    
                    if (this.y > canvas.height || this.y < 0) {
                        this.speedY = -this.speedY;
                    }
                }
                
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            function createParticles() {
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }
            
            function connectParticles() {
                const opacity = 0.2;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].极 - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 150) {
                            ctx.strokeStyle = 'rgba(' + hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()) + ', ' + opacity + ')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : '0,0,0';
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
                
                connectParticles();
                requestAnimationFrame(animate);
            }
            
            createParticles();
            animate();
            
            window.addEventListener('resize', ()极 {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
        ` : ''}
        
        // Floating Particles
        function createParticles() {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                document.body.appendChild(particle);
            }
        }
        
        // Scroll Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    ${templateName === 'Neon Grid' ? `
                    if (entry.target.classList.contains('skill-card')) {
                        const progressBar = entry.target.querySelector('.skill-progress');
                        if (progressBar) {
                            setTimeout(() => {
                                progressBar.style.width = progressBar.style.width;
                            }, 300);
                        }
                    }
                    ` : ''}
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in').forEach(el => {
            observer.observe(el);
        });
        
        // Back to top button
        const backToTopButton = document.querySelector('.back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Glitch effect on hover
        document.querySelectorAll('.glitch').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'glitch-1 0.3s ease-in-out';
            });
        });
        
        // Enhanced hover effects for cards
        document.querySelectorAll('.skill-node, .project-hex, .timeline-content, .skill-card, .project-card, .project-item, .edu-card, .edu-item').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = card.style.transform + ' rotate(1deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.style.transform.replace(' rotate(1deg)', '');
            });
        });
        
        // Initialize
        ${templateName === 'Cyberpunk Matrix' ? 'createMatrixRain();' : templateName === 'Particle Flow' ? 'initParticleFlow();' : ''}
        createParticles();
        
        console.log('%c🔥 ${templateName.toUpperCase()} PORTFOLIO LOADED 🔥', 'color: ${theme.primaryColor}; font-size: 20px; font-weight: bold;');
        console.log('%c🚀 ENHANCED WITH ADVANCED ANIMATIONS & FOOTER 🚀', 'color: ${theme.accentColor}; font-size: 16px;');
    </script>
</body>
</html>`;
};

export const generateCyberpunkPortfolio = (data: PortfolioData): string => {
  const theme = portfolioTemplates.cyberpunk;
  return generateCommonHTML(data, theme, theme.name);
};

export const generateNeonPortfolio = (data: PortfolioData): string => {
  const theme = portfolioTemplates.neon;
  return generateCommonHTML(data, theme, theme.name);
};

export const generateParticlePortfolio = (data: PortfolioData): string => {
  const theme = portfolioTemplates.particle;
  return generateCommonHTML(data, theme, theme.name);
};

export const generatePortfolioHTML = (data: PortfolioData, template: string = 'cyberpunk'): string => {
  switch (template) {
    case 'cyberpunk':
    case 'modern':
      return generateCyberpunkPortfolio(data);
    case 'neon':
    case 'grid':
      return generateNeonPortfolio(data);
    case 'particle':
    case 'flow':
      return generateParticlePortfolio(data);
    default:
      return generateCyberpunkPortfolio(data);
  }
};

export const downloadPortfolio = (data: PortfolioData, template: string = 'cyberpunk'): void => {
  const htmlContent = generatePortfolioHTML(data, template);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const cleanName = (data.personalInfo.name || 'Portfolio').replace(/[^a-zA-Z0-9]/g, '_');
  const templateName = template.charAt(0).toUpperCase() + template.slice(1);
  const fileName = `${cleanName}_${templateName}_Portfolio.html`;
  saveAs(blob, fileName);
};

export const generateGitHubPages = (data: PortfolioData, template: string = 'cyberpunk'): string => {
  return generatePortfolioHTML(data, template);
};
