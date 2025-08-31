import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, FileText, User, Sparkles, LogOut, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

interface NavigationProps {
  user?: UserData | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const settingsModalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Toggle functions with proper state management
  const toggleMobileMenu = useRef(() => {
    setIsOpen(prev => !prev);
    // Ensure only one menu is open at a time
    setShowUserMenu(false);
  }).current;

  const toggleUserMenu = useRef(() => {
    setShowUserMenu(prev => !prev);
    // Ensure only one menu is open at a time
    setIsOpen(false);
  }).current;

  // Close all menus
  const closeAllMenus = useRef(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }).current;

  // Detect mobile view and handle cleanup
  useEffect(() => {
    const checkIfMobile = () => {
      if (!isMounted.current) return;
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // Close mobile menu when switching to desktop
      if (!mobile) {
        closeAllMenus();
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize with debounce
    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(checkIfMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout.current);
    };
  }, [closeAllMenus]);

  // Handle click outside and keyboard events
  useEffect(() => {
    if (!isMounted.current) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on a menu button
      if (target.closest('button[aria-label*="menu"], button[aria-label*="settings"]')) {
        return;
      }
      
      // Close settings modal if click is outside
      if (showSettings && settingsModalRef.current && !settingsModalRef.current.contains(target)) {
        setShowSettings(false);
      }
      
      // Close user menu if click is outside
      if (showUserMenu && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      
      // Close mobile menu if click is outside
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    // Handle storage events to sync logout across tabs
    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'user' && !event.newValue) {
        closeAllMenus();
      }
    }

    // Handle escape key to close menus
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAllMenus();
        setShowSettings(false);
      }
    }

      // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isOpen, showUserMenu, showSettings, isMobile]);

  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close menus on navigation
    setIsOpen(false);
    setShowUserMenu(false);
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
                        toggleMobileMenu();
                      } else {
                        toggleUserMenu();
                      }
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'U')}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <span className="truncate max-w-[120px] font-semibold">
                      {user.name || (user.email ? user.email.split('@')[0].toLowerCase() : 'user')}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md py-1 z-[9999] border border-gray-200 dark:border-gray-700 shadow-2xl"
                        style={{
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <button 
                          onClick={() => {
                            setShowSettings(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors duration-150"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        
                        <button 
                          onClick={async (e) => {
                            try {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              // Close the menu first to avoid UI glitches
                              setShowUserMenu(false);
                              
                              // Add a small delay to allow the menu to close
                              await new Promise(resolve => setTimeout(resolve, 100));
                              
                              // Call the logout handler
                              onLogout();
                            } catch (error) {
                              console.error('Logout error:', error);
                              window.location.reload();
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-150"
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
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
              
              <motion.button
                onClick={() => {
                  if (user) {
                    toggleUserMenu();
                  } else {
                    toggleMobileMenu();
                  }
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                whileTap={{ scale: 0.9 }}
                aria-label={user ? "User menu" : "Navigation menu"}
              >
                {user ? (
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'U')}`} 
                    alt={user.name || 'User'}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'U')}`;
                    }}
                  />
                ) : isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
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
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
            ref={settingsModalRef}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;