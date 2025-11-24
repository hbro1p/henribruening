import React, { createContext, useContext, useState, useEffect } from 'react';

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAutoMode: boolean;
  toggleAutoMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    
    // Default to auto mode based on time
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6; // Dark mode between 8 PM and 6 AM
  });
  
  const [isAutoMode, setIsAutoMode] = useState(() => {
    const saved = localStorage.getItem('autoMode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('autoMode', isAutoMode.toString());
    
    if (isAutoMode) {
      const checkTime = () => {
        const hour = new Date().getHours();
        const shouldBeDark = hour >= 20 || hour < 6;
        setIsDarkMode(shouldBeDark);
      };
      
      checkTime();
      const interval = setInterval(checkTime, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isAutoMode]);

  const toggleDarkMode = () => {
    setIsAutoMode(false);
    setIsDarkMode(prev => !prev);
  };

  const toggleAutoMode = () => {
    setIsAutoMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isAutoMode, toggleAutoMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
