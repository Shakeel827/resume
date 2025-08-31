import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, FileText, User, Sparkles, LogOut, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  user?: any;
  onLogin: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Detect mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    // Handle storage events to sync logout across tabs
    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'user' && !event.newValue) {
        console.log('Storage event: User logged out from another tab');
        setShowUserMenu(false);
      }
    }

    // Handle escape key to close menu
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const { theme, toggleTheme } = useTheme();

  // Commented out unused scroll effect to fix lint warning
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', href: '#home', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Resume Builder', href: '#resume', icon: <FileText className="w-4 h-4" /> },
    { name: 'Portfolio', href: '#portfolio', icon: <User className="w-4 h-4" /> },
    { name: 'Career Portal', href: '#careers', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full">
      <nav aria-label="Main navigation" className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-3 sm:py-0">
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center w-full sm:w-auto space-x-0 sm:space-x-2 mb-2 sm:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-14 h-14 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
                {/* Panda Logo */}
                <span className="text-2xl sm:text-lg">🐼</span>
              </div>
              <span className="hidden xs:inline text-xl sm:text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent tracking-wide drop-shadow pl-3 sm:pl-0">CareerPanda</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={(e) => handleNavigation(e, item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </motion.a>
              ))}
              
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
              
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMobile) {
                        setIsOpen(!isOpen);
                      } else {
                        setShowUserMenu(prev => !prev);
                      }
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`} 
                      alt={user.name || 'User'}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`;
                      }}
                    />
                    <span>{user.name || user.email?.split('@')[0] || 'User'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.email?.split('@')[0] || 'User'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowSettings(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        
                        <button 
                          onClick={async (e) => {
                            console.group('=== Desktop Logout Click ===');
                            try {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('1. Calling onLogout handler');
                              
                              // Close the menu first to avoid UI glitches
                              setShowUserMenu(false);
                              
                              // Add a small delay to allow the menu to close
                              await new Promise(resolve => setTimeout(resolve, 100));
                              
                              // Call the logout handler
                              onLogout();
                              
                              console.log('2. Logout handler completed');
                            } catch (error) {
                              console.error('Logout error in Navigation:', error);
                              // Force a hard refresh if something goes wrong
                              window.location.reload();
                            } finally {
                              console.groupEnd();
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={onLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
              
              {!user && (
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  whileTap={{ scale: 0.9 }}
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={(e) => {
                        handleNavigation(e, item.href);
                        setIsOpen(false);
                      }}
                      whileHover={{ x: 10 }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </motion.a>
                  ))}
                  
                  {user && isMobile && (
                    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'U')}`} 
                          alt={user.name || 'User'}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email?.charAt(0) || 'U')}`;
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.email?.split('@')[0] || 'User'}</p>
                          {user.email && <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          console.log('Mobile logout button clicked');
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Calling onLogout from Navigation (mobile)');
                          onLogout();
                          setIsOpen(false);
                          console.log('Mobile menu closed after logout');
                        }}
                        className="w-full text-left text-red-600 dark:text-red-400 text-sm py-2 px-3 -mx-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                  {!user && (
                    <motion.div className="px-3 py-2">
                      <button 
                        onClick={() => {
                          onLogin();
                          setIsOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Get Started
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </header>
  );
};

export default Navigation;