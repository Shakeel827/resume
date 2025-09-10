import { saveAs } from 'file-saver';

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin: string;
    github: string;
  };
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
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
    gpa: string;
  }>;
}

export const generateGitHubPages = (data: PortfolioData, template: string = 'cyberpunk'): string => {
  const templates = {
    cyberpunk: generateCyberpunkTemplate(data),
    holographic: generateHolographicTemplate(data),
    quantum: generateQuantumTemplate(data)
  };

  return templates[template as keyof typeof templates] || templates.cyberpunk;
};

export const downloadPortfolio = (data: PortfolioData, template: string = 'cyberpunk'): void => {
  const htmlContent = generateGitHubPages(data, template);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const fileName = `${(data.personalInfo.name || 'portfolio').replace(/\s+/g, '_').toLowerCase()}_${template}_portfolio.html`;
  saveAs(blob, fileName);
};

const generateCyberpunkTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Cyberpunk Portfolio</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <meta name="keywords" content="${data.skills.join(', ')}, portfolio, developer, ${data.personalInfo.name}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: #0a0a0a;
            color: #00ff87;
            overflow-x: hidden;
            cursor: none;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00ff87, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }
        
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.1;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
            flex: 1;
        }
        
        .header {
            text-align: center;
            padding: 60px 0;
            background: linear-gradient(45deg, rgba(0,255,135,0.1), rgba(0,123,255,0.1));
            border: 2px solid #00ff87;
            border-radius: 20px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
            animation: borderPulse 3s infinite alternate;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0,255,135,0.1), transparent);
            animation: rotate 4s linear infinite;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .name {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            text-shadow: 0 0 20px #00ff87;
            margin-bottom: 20px;
            animation: glow 2s ease-in-out infinite alternate, float 6s ease-in-out infinite;
        }
        
        .title {
            font-size: 1.5rem;
            color: #007bff;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 3px;
            animation: fadeIn 2s ease-out;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .contact-item {
            background: rgba(0,255,135,0.1);
            padding: 10px 20px;
            border: 1px solid #00ff87;
            border-radius: 25px;
            transition: all 0.3s ease;
            animation: slideIn 1s ease-out;
        }
        
        .contact-item:hover {
            background: rgba(0,255,135,0.2);
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0,255,135,0.5);
        }
        
        .section {
            margin: 60px 0;
            padding: 40px;
            background: rgba(0,20,40,0.8);
            border: 1px solid #00ff87;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            position: relative;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff87, transparent);
            animation: scan 3s linear infinite;
        }
        
        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, transparent, #00ff87, transparent);
        }
        
        .summary {
            font-size: 1.2rem;
            line-height: 1.8;
            text-align: center;
            color: #b0b0b0;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .skill-item {
            background: linear-gradient(45deg, rgba(0,255,135,0.1), rgba(0,123,255,0.1));
            padding: 15px 25px;
            border: 1px solid #00ff87;
            border-radius: 10px;
            text-align: center;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .skill-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0,255,135,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .skill-item:hover::before {
            left: 100%;
        }
        
        .skill-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,255,135,0.3);
        }
        
        .experience-item, .project-item, .education-item {
            background: rgba(0,40,80,0.6);
            border: 1px solid #007bff;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .experience-item:hover, .project-item:hover, .education-item:hover {
            transform: translateX(10px);
            border-color: #00ff87;
            box-shadow: -5px 0 15px rgba(0,255,135,0.2);
        }
        
        .item-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 700;
            color: #00ff87;
            margin-bottom: 10px;
        }
        
        .item-subtitle {
            font-size: 1.3rem;
            color: #007bff;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .item-description {
            line-height: 1.6;
            color: #b0b0b0;
            font-size: 1.1rem;
        }
        
        .tech-stack {
            margin-top: 15px;
            font-style: italic;
            color: #00ff87;
            font-weight: 500;
        }
        
        .project-link {
            display: inline-block;
            margin-top: 15px;
            color: #007bff;
            text-decoration: none;
            border: 1px solid #007bff;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.3s ease;
        }
        
        .project-link:hover {
            background: #007bff;
            color: #000;
            transform: scale(1.05);
        }
        
        /* Footer Styles */
        .footer {
            background: rgba(0, 20, 40, 0.9);
            border-top: 2px solid #00ff87;
            padding: 40px 20px;
            text-align: center;
            margin-top: 60px;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff87, transparent);
            animation: scan 3s linear infinite;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #00ff87;
            text-decoration: none;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            padding: 5px 10px;
        }
        
        .footer-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: #00ff87;
            transition: width 0.3s ease;
        }
        
        .footer-link:hover::after {
            width: 100%;
        }
        
        .footer-link:hover {
            text-shadow: 0 0 10px #00ff87;
        }
        
        .footer-text {
            color: #b0b0b0;
            font-size: 1rem;
            margin-top: 20px;
        }
        
        /* Animations */
        @keyframes glow {
            from { text-shadow: 0 0 20px #00ff87; }
            to { text-shadow: 0 0 30px #00ff87, 0 0 40px #00ff87; }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes matrix {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0;
                transform: translateX(-20px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes borderPulse {
            0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 135, 0.5); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 135, 0.8); }
        }
        
        .matrix-char {
            position: absolute;
            color: #00ff87;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            animation: matrix 10s linear infinite;
            opacity: 0.3;
        }
        
        @media (max-width: 768px) {
            .name { font-size: 2.5rem; }
            .section-title { font-size: 2rem; }
            .contact-info { flex-direction: column; align-items: center; }
            .skills-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
            .footer-links { flex-direction: column; gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="custom-cursor"></div>
    <div class="matrix-bg"></div>
    
    <div class="container">
        <header class="header">
            <div class="header-content">
                <h1 class="name">${data.personalInfo.name || 'CYBER DEVELOPER'}</h1>
                <p class="title">${data.experience[0]?.title || 'Full Stack Developer'}</p>
                <div class="contact-info">
                    ${data.personalInfo.email ? `<div class="contact-item">📧 ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo.location ? `<div class="contact-item">📍 ${data.personalInfo.location}</div>` : ''}
                    ${data.personalInfo.linkedin ? `<div class="contact-item"><a href="${data.personalInfo.linkedin}" target="_blank" style="color: inherit; text-decoration: none;">💼 LinkedIn</a></div>` : ''}
                    ${data.personalInfo.github ? `<div class="contact-item"><a href="${data.personalInfo.github}" target="_blank" style="color: inherit; text-decoration: none;">🔗 GitHub</a></div>` : ''}
                </div>
            </div>
        </header>
        
        ${data.personalInfo.summary ? `
        <section class="section">
            <h2 class="section-title">System Overview</h2>
            <p class="summary">${data.personalInfo.summary}</p>
        </section>
        ` : ''}
        
        ${data.skills.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Core Modules</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
        </section>
        ` : ''}
        
        ${data.experience.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Mission History</h2>
            ${data.experience.map(exp => `
                <div class="experience-item">
                    <h3 class="item-title">${exp.title}</h3>
                    <p class="item-subtitle">${exp.company} | ${exp.duration}</p>
                    <p class="item-description">${exp.description}</p>
                </div>
            `).join('')}
        </section>
        ` : ''}
        
        ${data.projects && data.projects.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Project Archives</h2>
            ${data.projects.map(project => `
                <div class="project-item">
                    <h3 class="item-title">${project.name}</h3>
                    <p class="item-description">${project.description}</p>
                    ${project.technologies ? `<p class="tech-stack">Tech Stack: ${project.technologies}</p>` : ''}
                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">Access Project</a>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}
        
        ${data.education.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Training Protocols</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <h3 class="item-title">${edu.degree}</h3>
                    <p class="item-subtitle">${edu.institution} | ${edu.year}</p>
                    ${edu.gpa ? `<p class="item-description">Performance Index: ${edu.gpa}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}
    </div>
    
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link">Email</a>` : ''}
                ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank" class="footer-link">LinkedIn</a>` : ''}
                ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank" class="footer-link">GitHub</a>` : ''}
                <a href="#" class="footer-link">Back to Top</a>
            </div>
            <p class="footer-text">© ${new Date().getFullYear()} ${data.personalInfo.name || 'Portfolio'}. All systems operational.</p>
        </div>
    </footer>
    
    <script>
        // Custom cursor
        const cursor = document.querySelector('.custom-cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Matrix rain effect
        function createMatrixRain() {
            const matrixBg = document.querySelector('.matrix-bg');
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            
            for (let i = 0; i < 50; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDelay = Math.random() * 10 + 's';
                char.style.animationDuration = (Math.random() * 10 + 5) + 's';
                matrixBg.appendChild(char);
            }
        }
        
        createMatrixRain();
        
        // Glitch effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            document.querySelector('.matrix-bg').style.transform = \`translateY(\${rate}px)\`;
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });

        // Back to top functionality
        document.querySelector('.footer-link[href="#"]').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    </script>
</body>
</html>`;
};

const generateHolographicTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Holographic Portfolio</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Exo 2', sans-serif;
            background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .holographic-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
            animation: holographicShift 8s ease-in-out infinite;
            z-index: -1;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
            flex: 1;
        }
        
        .header {
            text-align: center;
            padding: 80px 0;
            position: relative;
        }
        
        .name {
            font-size: 5rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            animation: holographicGlow 3s ease-in-out infinite, float 6s ease-in-out infinite;
        }
        
        .holographic-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .holographic-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.8s ease;
        }
        
        .holographic-card:hover::before {
            left: 100%;
        }
        
        .holographic-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
        }
        
        .section-title {
            font-size: 3rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(45deg, #8338ec, #3a86ff, #ff006e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .skills-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .skill-orb {
            background: linear-gradient(135deg, rgba(131, 56, 236, 0.3), rgba(255, 0, 110, 0.3));
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            padding: 20px;
            text-align: center;
            font-weight: 600;
            transition: all 0.4s ease;
            position: relative;
            animation: pulse 2s infinite alternate;
        }
        
        .skill-orb:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 0 30px rgba(131, 56, 236, 0.6);
        }
        
        /* Footer Styles */
        .footer {
            background: rgba(26, 26, 46, 0.9);
            border-top: 2px solid rgba(131, 56, 236, 0.5);
            padding: 40px 20px;
            text-align: center;
            margin-top: 60px;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #8338ec, transparent);
            animation: scan 3s linear infinite;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #3a86ff;
            text-decoration: none;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            padding: 5px 10px;
        }
        
        .footer-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: #3a86ff;
            transition: width 0.3s ease;
        }
        
        .footer-link:hover::after {
            width: 100%;
        }
        
        .footer-link:hover {
            color: #ff006e;
        }
        
        .footer-text {
            color: #b0b0b0;
            font-size: 1rem;
            margin-top: 20px;
        }
        
        /* Animations */
        @keyframes holographicGlow {
            0%, 100% { filter: hue-rotate(0deg) brightness(1); }
            50% { filter: hue-rotate(90deg) brightness(1.2); }
        }
        
        @keyframes holographicShift {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(2deg); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }
        
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @media (max-width: 768px) {
            .name { font-size: 3rem; }
            .section-title { font-size: 2rem; }
            .skills-container { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
            .footer-links { flex-direction: column; gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="holographic-bg"></div>
    
    <div class="container">
        <header class="header">
            <h1 class="name">${data.personalInfo.name || 'HOLOGRAPHIC DEVELOPER'}</h1>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 30px;">
                ${data.personalInfo.email ? `<div style="color: #8338ec; animation: slideIn 1s ease-out;">📧 ${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div style="color: #3a86ff; animation: slideIn 1s ease-out;">📱 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div style="color: #ff006e; animation: slideIn 1s ease-out;">📍 ${data.personalInfo.location}</div>` : ''}
            </div>
        </header>
        
        ${data.personalInfo.summary ? `
        <div class="holographic-card">
            <h2 class="section-title">Dimensional Overview</h2>
            <p style="font-size: 1.3rem; line-height: 1.8; text-align: center; color: #e0e0e0;">${data.personalInfo.summary}</p>
        </div>
        ` : ''}
        
        ${data.skills.length > 0 ? `
        <div class="holographic-card">
            <h2 class="section-title">Quantum Abilities</h2>
            <div class="skills-container">
                ${data.skills.map(skill => `<div class="skill-orb">${skill}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${data.experience.length > 0 ? `
        <div class="holographic-card">
            <h2 class="section-title">Timeline Experiences</h2>
            ${data.experience.map(exp => `
                <div style="margin-bottom: 40px; padding: 30px; background: rgba(131, 56, 236, 0.1); border-radius: 15px; border-left: 4px solid #8338ec;">
                    <h3 style="font-size: 2rem; color: #8338ec; margin-bottom: 10px;">${exp.title}</h3>
                    <p style="font-size: 1.4rem; color: #3a86ff; margin-bottom: 15px;">${exp.company} | ${exp.duration}</p>
                    <p style="color: #e0e0e0; line-height: 1.6; font-size: 1.1rem;">${exp.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.projects && data.projects.length > 0 ? `
        <div class="holographic-card">
            <h2 class="section-title">Project Dimensions</h2>
            ${data.projects.map(project => `
                <div style="margin-bottom: 40px; padding: 30px; background: rgba(255, 0, 110, 0.1); border-radius: 15px; border-left: 4px solid #ff006e;">
                    <h3 style="font-size: 2rem; color: #ff006e; margin-bottom: 10px;">${project.name}</h3>
                    <p style="color: #e0e0e0; line-height: 1.6; margin-bottom: 15px; font-size: 1.1rem;">${project.description}</p>
                    ${project.technologies ? `<p style="color: #8338ec; font-style: italic; margin-bottom: 15px;">Technologies: ${project.technologies}</p>` : ''}
                    ${project.link ? `<a href="${project.link}" target="_blank" style="color: #3a86ff; text-decoration: none; border: 1px solid #3a86ff; padding: 10px 20px; border-radius: 25px; display: inline-block; transition: all 0.3s ease;">🔗 Explore Project</a>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.education.length > 0 ? `
        <div class="holographic-card">
            <h2 class="section-title">Knowledge Matrix</h2>
            ${data.education.map(edu => `
                <div style="margin-bottom: 30px; padding: 25px; background: rgba(58, 134, 255, 0.1); border-radius: 15px; border-left: 4px solid #3a86ff;">
                    <h3 style="font-size: 1.8rem; color: #3a86ff; margin-bottom: 10px;">${edu.degree}</h3>
                    <p style="color: #e0e0e0; font-size: 1.2rem;">${edu.institution} | ${edu.year}</p>
                    ${edu.gpa ? `<p style="color: #8338ec; margin-top: 10px;">Academic Performance: ${edu.gpa}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
    
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link">Email</a>` : ''}
                ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank" class="footer-link">LinkedIn</a>` : ''}
                ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank" class="footer-link">GitHub</a>` : ''}
                <a href="#" class="footer-link">Back to Top</a>
            </div>
            <p class="footer-text">© ${new Date().getFullYear()} ${data.personalInfo.name || 'Portfolio'}. All dimensions secured.</p>
        </div>
    </footer>
    
    <script>
        // Particle system
        function createParticles() {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '2px';
                particle.style.height = '2px';
                particle.style.background = \`hsl(\${Math.random() * 360}, 70%, 60%)\`;
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '-1';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = \`float \${Math.random() * 6 + 4}s ease-in-out infinite\`;
                document.body.appendChild(particle);
            }
        }
        
        createParticles();
        
        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to { 
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        \`;
        document.head.appendChild(style);
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.holographic-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.8s ease';
            observer.observe(card);
        });

        // Back to top functionality
        document.querySelector('.footer-link[href="#"]').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    </script>
</body>
</html>`;
};

const generateQuantumTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Quantum Portfolio</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            min-height: 100vh;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .quantum-field {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
            flex: 1;
        }
        
        .header {
            text-align: center;
            padding: 100px 0;
            position: relative;
        }
        
        .name {
            font-size: 5rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
            animation: quantumPulse 4s ease-in-out infinite, float 6s ease-in-out infinite;
        }
        
        .quantum-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 50px;
            margin: 50px 0;
            position: relative;
            transition: all 0.5s ease;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .quantum-card:hover {
            transform: scale(1.02) rotateY(5deg);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }
        
        .section-title {
            font-size: 3rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 40px;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        .skills-quantum {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
            margin-top: 40px;
        }
        
        .skill-quantum {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 25px;
            text-align: center;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            animation: pulse 2s infinite alternate;
        }
        
        .skill-quantum::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
            transition: all 0.4s ease;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .skill-quantum:hover::before {
            width: 200px;
            height: 200px;
        }
        
        .skill-quantum:hover {
            transform: translateY(-10px) scale(1.05);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        /* Footer Styles */
        .footer {
            background: rgba(102, 126, 234, 0.1);
            backdrop-filter: blur(10px);
            border-top: 2px solid rgba(255, 255, 255, 0.2);
            padding: 40px 20px;
            text-align: center;
            margin-top: 60px;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
            animation: scan 3s linear infinite;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #ffffff;
            text-decoration: none;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            padding: 5px 10px;
        }
        
        .footer-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: #ffffff;
            transition: width 0.3s ease;
        }
        
        .footer-link:hover::after {
            width: 100%;
        }
        
        .footer-link:hover {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }
        
        .footer-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            margin-top: 20px;
        }
        
        /* Animations */
        @keyframes quantumPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes quantumFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }
        
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @media (max-width: 768px) {
            .name { font-size: 3rem; }
            .section-title { font-size: 2rem; }
            .skills-quantum { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
            .footer-links { flex-direction: column; gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="quantum-field"></div>
    
    <div class="container">
        <header class="header">
            <h1 class="name">${data.personalInfo.name || 'QUANTUM DEVELOPER'}</h1>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 40px; font-size: 1.2rem;">
                ${data.personalInfo.email ? `<div style="animation: slideIn 1s ease-out;">📧 ${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div style="animation: slideIn 1s ease-out;">📱 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div style="animation: slideIn 1s ease-out;">📍 ${data.personalInfo.location}</div>` : ''}
            </div>
        </header>
        
        ${data.personalInfo.summary ? `
        <div class="quantum-card">
            <h2 class="section-title">Quantum State</h2>
            <p style="font-size: 1.4rem; line-height: 1.8; text-align: center; color: #f0f0f0;">${data.personalInfo.summary}</p>
        </div>
        ` : ''}
        
        ${data.skills.length > 0 ? `
        <div class="quantum-card">
            <h2 class="section-title">Quantum Abilities</h2>
            <div class="skills-quantum">
                ${data.skills.map(skill => `<div class="skill-quantum">${skill}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${data.experience.length > 0 ? `
        <div class="quantum-card">
            <h2 class="section-title">Temporal Experiences</h2>
            ${data.experience.map(exp => `
                <div style="margin-bottom: 40px; padding: 30px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; border-left: 5px solid #667eea;">
                    <h3 style="font-size: 2.2rem; color: #ffffff; margin-bottom: 15px;">${exp.title}</h3>
                    <p style="font-size: 1.5rem; color: #b0b0ff; margin-bottom: 20px;">${exp.company} | ${exp.duration}</p>
                    <p style="color: #e0e0e0; line-height: 1.7; font-size: 1.2rem;">${exp.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.projects && data.projects.length > 0 ? `
        <div class="quantum-card">
            <h2 class="section-title">Quantum Projects</h2>
            ${data.projects.map(project => `
                <div style="margin-bottom: 40px; padding: 30px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; border-left: 5px solid #764ba2;">
                    <h3 style="font-size: 2.2rem; color: #ffffff; margin-bottom: 15px;">${project.name}</h3>
                    <p style="color: #e0e0e0; line-height: 1.7; margin-bottom: 20px; font-size: 1.2rem;">${project.description}</p>
                    ${project.technologies ? `<p style="color: #b0b0ff; font-style: italic; margin-bottom: 20px; font-size: 1.1rem;">Technologies: ${project.technologies}</p>` : ''}
                    ${project.link ? `<a href="${project.link}" target="_blank" style="color: #667eea; text-decoration: none; border: 2px solid #667eea; padding: 12px 24px; border-radius: 30px; display: inline-block; transition: all 0.3s ease; font-weight: 600;">🚀 Launch Project</a>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.education.length > 0 ? `
        <div class="quantum-card">
            <h2 class="section-title">Knowledge Acquisition</h2>
            ${data.education.map(edu => `
                <div style="margin-bottom: 30px; padding: 25px; background: rgba(255, 255, 255, 0.05); border-radius: 15px;">
                    <h3 style="font-size: 2rem; color: #ffffff; margin-bottom: 10px;">${edu.degree}</h3>
                    <p style="color: #b0b0ff; font-size: 1.3rem; margin-bottom: 10px;">${edu.institution}</p>
                    <p style="color: #e0e0e0; font-size: 1.1rem;">${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
    
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link">Email</a>` : ''}
                ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank" class="footer-link">LinkedIn</a>` : ''}
                ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank" class="footer-link">GitHub</a>` : ''}
                <a href="#" class="footer-link">Back to Top</a>
            </div>
            <p class="footer-text">© ${new Date().getFullYear()} ${data.personalInfo.name || 'Portfolio'}. Quantum entangled.</p>
        </div>
    </footer>
    
    <script>
        // Quantum field animation
        function createQuantumField() {
            const field = document.querySelector('.quantum-field');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = \`hsl(\${Math.random() * 60 + 200}, 70%, 60%)\`;
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = \`quantumFloat \${Math.random() * 8 + 6}s ease-in-out infinite\`;
                particle.style.animationDelay = Math.random() * 4 + 's';
                field.appendChild(particle);
            }
        }
        
        createQuantumField();
        
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.quantum-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            card.style.transition = 'all 1s ease';
            observer.observe(card);
        });

        // Back to top functionality
        document.querySelector('.footer-link[href="#"]').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    </script>
</body>
</html>`;
};
