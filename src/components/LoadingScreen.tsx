import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// Memoize the loading messages to prevent re-renders
const LOADING_MESSAGES = [
  "🐼 Initializing CareerPanda...",
  "🚀 Loading AI-powered features...",
  "📄 Preparing resume templates...",
  "💼 Setting up career portal...",
  "✨ Almost ready to help you succeed!"
] as const;

// Pre-calculate the total number of messages
const TOTAL_MESSAGES = LOADING_MESSAGES.length;

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  progress = 0, 
  message = "Loading CareerPanda..." 
}) => {
  // Use state for dynamic values
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [count, setCount] = useState(0);
  
  // Memoize the current message to prevent unnecessary re-renders
  const currentMessage = useMemo(() => 
    LOADING_MESSAGES[currentMessageIndex % TOTAL_MESSAGES], 
    [currentMessageIndex]
  );

  // Refs for animation control
  const animationRef = React.useRef<number>();
  const dotsIntervalRef = React.useRef<ReturnType<typeof setInterval>>();
  const progressRef = React.useRef<HTMLDivElement>(null);
  const lastCountRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(0);
  const animationFrameRef = React.useRef<number>();
  
  // Easing function for smooth animation (using useCallback to prevent recreation)
  const easeOutQuart = useCallback((t: number): number => 1 - Math.pow(1 - t, 4), []);

  // Combined animation and message update effect for better performance
  useEffect(() => {
    if (!isLoading) return;

    const DURATION = 3000; // Reduced from 4000ms to 3000ms for faster loading
    const MESSAGE_INTERVAL = 2500; // Slightly faster message rotation
    const DOTS_INTERVAL = 500;
    
    // Initialize state
    setCount(0);
    setCurrentMessageIndex(0);
    setDots('');
    
    // Animation frame function
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const easedProgress = easeOutQuart(progress);
      
      // Update progress bar using CSS custom property (most performant way)
      if (progressRef.current) {
        progressRef.current.style.setProperty('--progress', `${easedProgress * 100}%`);
      }
      
      // Update count (throttled to reduce re-renders)
      const newCount = Math.floor(easedProgress * 100);
      if (newCount !== lastCountRef.current) {
        lastCountRef.current = newCount;
        setCount(newCount);
      }
      
      // Continue animation if not complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    startTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Set up message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % TOTAL_MESSAGES);
    }, MESSAGE_INTERVAL);
    
    // Set up dots animation
    dotsIntervalRef.current = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, DOTS_INTERVAL);
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (dotsIntervalRef.current) {
        clearInterval(dotsIntervalRef.current);
      }
      clearInterval(messageInterval);
      lastCountRef.current = 0;
      startTimeRef.current = 0;
    };
  }, [isLoading, easeOutQuart]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [null, -100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 3,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 text-center">
          {/* CareerPanda Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ 
              duration: 2.5, 
              ease: [0.16, 1, 0.3, 1],
              rotate: { 
                type: 'spring',
                damping: 10,
                stiffness: 60,
                mass: 1.5
              }
            }}
            className="mb-8"
          >
            <div className="relative">
              {/* Panda Logo */}
              <motion.div
                animate={{ 
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 1],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-2xl"
              >
                🐼
              </motion.div>
            </div>
          </motion.div>

          {/* Loading Text - Optimized for mobile */}
          <motion.div 
            className="text-center mb-4 sm:mb-6 w-full max-w-md px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
              {currentMessage}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Loading{dots}
            </p>
          </motion.div>

          {/* Progress Bar - Optimized for mobile */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-1.5 sm:h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden mx-4">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-transform duration-300 ease-out"
              style={{
                transform: 'scaleX(var(--progress, 0))',
                transformOrigin: 'left center',
                width: '100%',
                willChange: 'transform',
                content: '""', // Force GPU acceleration
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
          </div>
          <div className="text-center mt-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
            {count}%
          </div>

          {/* Loading Dots - Lighter animation for mobile */}
          <motion.div 
            className="mt-6 sm:mt-8 flex space-x-2 sm:space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500/90 dark:bg-blue-400/90 rounded-full"
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          
          {/* Subtle hint for mobile users */}
          <motion.p 
            className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs px-4"
            initial={{ opacity: 0 }}
            >
              🐼
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Text - Optimized for mobile */}
        <motion.div 
          className="text-center mb-4 sm:mb-6 w-full max-w-md px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
            {currentMessage}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Loading{dots}
          </p>
        </motion.div>

        {/* Progress Bar - Optimized for mobile */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-1.5 sm:h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden mx-4">
          <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-transform duration-300 ease-out"
            style={{
              transform: 'scaleX(var(--progress, 0))',
              transformOrigin: 'left center',
              width: '100%',
              willChange: 'transform',
              content: '""', // Force GPU acceleration
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          />
        </div>
        <div className="text-center mt-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
          {count}%
        </div>

        {/* Loading Dots - Lighter animation for mobile */}
        <motion.div 
          className="mt-6 sm:mt-8 flex space-x-2 sm:space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500/90 dark:bg-blue-400/90 rounded-full"
              animate={{
                y: [0, -6, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Subtle hint for mobile users */}
        <motion.p 
          className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
        >
          Optimizing for your device...
        </motion.p>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {['📄', '💼', '🎯', '⭐', '🚀', '💡', '🏆', '📊'][i]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  </AnimatePresence>
);

export default React.memo(LoadingScreen);