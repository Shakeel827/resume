import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import AIAssistant from './components/AIAssistant';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import ResumeBuilder from './components/ResumeBuilder';
import Portfolio from './components/Portfolio';
import CareerPortal from './components/CareerPortal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { ResumeData } from './utils/pdfGenerator';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Handle storage events to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (e) {
          console.error('Failed to parse user data from storage:', e);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Simulate loading process
    const loadingSteps = [
      { progress: 20, delay: 500 },
      { progress: 40, delay: 800 },
      { progress: 60, delay: 1200 },
      { progress: 80, delay: 1500 },
      { progress: 100, delay: 2000 }
    ];

    loadingSteps.forEach(({ progress, delay }) => {
      setTimeout(() => {
        setLoadingProgress(progress);
        if (progress === 100) {
          setTimeout(() => setIsLoading(false), 500);
        }
      }, delay);
    });

    // Check for saved user data
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (e) {
        console.error('Failed to load user data:', e);
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    loadUser();

    // Load resume data
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (e) {
        console.error('Failed to load resume data:', e);
        localStorage.removeItem('resumeData');
        setResumeData(undefined);
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would be an API call to your authentication service
    const userData = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
    };
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // In a real app, this would be an API call to your authentication service
    const userData = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    try {
      // Clear all user-related data from localStorage
      localStorage.removeItem('user');
      // Clear any other user-related data if needed
      // localStorage.removeItem('userToken');
      
      // Reset user state
      setUser(null);
      
      // Close any open modals or dropdowns
      setShowAuthModal(false);
      
      // Force a re-render to ensure UI updates
      window.dispatchEvent(new Event('storage'));
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ThemeProvider>
      <LoadingScreen 
        isLoading={isLoading} 
        progress={loadingProgress}
        message="Preparing your career success platform..."
      />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #374151'
            }
          }}
        />
        
        <Navigation 
          user={user} 
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        <Hero />
        <Features />
        <ResumeBuilder />
        <Portfolio />
        <CareerPortal 
          isLoggedIn={!!user}
          resumeData={resumeData}
          onLogin={() => setShowAuthModal(true)}
        />
        <Footer />
        
        <AIAssistant 
          resumeData={resumeData}
          isLoggedIn={!!user}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;