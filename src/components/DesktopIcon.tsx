
import React from 'react';
import { Link } from 'react-router-dom';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const getIconStyles = (label: string, theme: string) => {
  // Space Mood theme - Clean Windows XP-style 2000s aesthetic
  if (theme === 'space-mood') {
    const spaceColors = {
      'My Pictures': 'from-blue-500 via-blue-600 to-blue-700',
      'Meine Bilder': 'from-blue-500 via-blue-600 to-blue-700',
      'My Videos': 'from-red-500 via-red-600 to-red-700',
      'Meine Videos': 'from-red-500 via-red-600 to-red-700',
      'My Projects': 'from-green-500 via-green-600 to-green-700',
      'Meine Projekte': 'from-green-500 via-green-600 to-green-700',
      'About Me': 'from-orange-500 via-orange-600 to-orange-700',
      'Über Mich': 'from-orange-500 via-orange-600 to-orange-700',
      'Contact': 'from-purple-500 via-purple-600 to-purple-700',
      'Kontakt': 'from-purple-500 via-purple-600 to-purple-700',
      'Settings': 'from-gray-500 via-gray-600 to-gray-700',
      'Einstellungen': 'from-gray-500 via-gray-600 to-gray-700',
      'Game.exe': 'from-yellow-500 via-yellow-600 to-yellow-700',
      'Spiel.exe': 'from-yellow-500 via-yellow-600 to-yellow-700',
    };
    
    return {
      gradient: spaceColors[label as keyof typeof spaceColors] || 'from-blue-500 to-blue-700',
      border: 'border-white/40',
      hoverBorder: 'group-hover:border-white/60',
      glowEffect: 'shadow-lg shadow-black/30 group-hover:shadow-lg group-hover:shadow-white/20',
      innerGlow: 'bg-gradient-to-br from-white/30 via-white/10 to-transparent',
      highlight: 'bg-gradient-to-br from-white/60 to-transparent',
      statusGlow: 'from-white via-gray-200 to-gray-400 shadow-lg shadow-white/40'
    };
  }
  
  // Dark VHS theme - Monochrome with subtle white glow
  if (theme === 'dark-vhs') {
    return {
      gradient: 'from-gray-600 via-gray-700 to-gray-900',
      border: 'border-white/20',
      hoverBorder: 'group-hover:border-white/40',
      glowEffect: 'shadow-lg shadow-white/10 group-hover:shadow-white/20',
      innerGlow: 'bg-gradient-to-br from-white/20 via-transparent to-black/10',
      highlight: 'bg-gradient-to-br from-white/30 to-transparent',
      statusGlow: 'from-white via-gray-300 to-gray-500 shadow-lg shadow-white/30'
    };
  }
  
  // Matrix Terminal theme - Green matrix style
  if (theme === 'matrix-terminal') {
    return {
      gradient: 'from-green-600 via-green-700 to-black',
      border: 'border-green-500/30',
      hoverBorder: 'group-hover:border-green-400/50',
      glowEffect: 'shadow-lg shadow-green-500/20 group-hover:shadow-green-400/30',
      innerGlow: 'bg-gradient-to-br from-green-300/20 via-transparent to-black/10',
      highlight: 'bg-gradient-to-br from-green-200/40 to-transparent',
      statusGlow: 'from-green-300 via-green-400 to-green-600 shadow-lg shadow-green-400/50'
    };
  }
  
  // Retro Chrome theme - Silver/blue metallic
  if (theme === 'retro-chrome') {
    return {
      gradient: 'from-slate-400 via-blue-500 to-slate-600',
      border: 'border-blue-300/30',
      hoverBorder: 'group-hover:border-blue-200/50',
      glowEffect: 'shadow-lg shadow-blue-500/20 group-hover:shadow-blue-400/30',
      innerGlow: 'bg-gradient-to-br from-white/25 via-blue-100/20 to-transparent',
      highlight: 'bg-gradient-to-br from-white/40 to-transparent',
      statusGlow: 'from-blue-300 via-cyan-400 to-blue-500 shadow-lg shadow-blue-400/50'
    };
  }
  
  // Default fallback
  return {
    gradient: 'from-gray-500 to-gray-700',
    border: 'border-black/30',
    hoverBorder: 'group-hover:border-black/50',
    glowEffect: 'shadow-lg',
    innerGlow: 'bg-gradient-to-br from-white/20 via-transparent to-black/10',
    highlight: 'bg-gradient-to-br from-white/30 to-transparent',
    statusGlow: 'from-gray-400 via-gray-500 to-gray-600'
  };
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  // Get theme from body class
  const theme = document.body.className.replace('theme-', '') || 'space-mood';
  const styles = getIconStyles(label, theme);
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-300 hover:scale-105 transform-gpu"
    >
      {/* Fixed size container for consistent layout */}
      <div className="w-20 h-20 flex items-center justify-center">
        <div className={`relative w-16 h-16 bg-gradient-to-br ${styles.gradient} rounded transition-all duration-300 flex items-center justify-center border-2 ${styles.border} ${styles.hoverBorder} ${styles.glowEffect}`}>
          {/* Windows XP-style depth effects for Space Mood */}
          <div className={`absolute inset-0.5 ${styles.innerGlow} rounded`}></div>
          <div className="absolute inset-1 bg-gradient-to-tl from-white/20 via-transparent to-transparent rounded"></div>
          
          {/* Icon with enhanced styling */}
          <Icon className="w-8 h-8 text-white drop-shadow-lg relative z-10 filter brightness-110" />
          
          {/* Clean highlight for Windows XP feel */}
          <div className={`absolute top-1 left-1 w-6 h-3 ${styles.highlight} rounded blur-sm`}></div>
          
          {/* Clean status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br ${styles.statusGlow} rounded-full border border-black/20`}>
            <div className="absolute inset-0.5 bg-gradient-to-br from-white/50 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Clean label styling for Windows XP aesthetic */}
      <div className="h-8 flex items-center">
        <span className={`text-sm font-pixel select-none drop-shadow-lg px-2 py-1 rounded backdrop-blur-sm border transition-all duration-300 ${
          theme === 'space-mood' 
            ? 'text-white bg-gradient-to-b from-blue-600/80 to-blue-800/90 border-white/30 group-hover:border-white/50 group-hover:bg-gradient-to-b group-hover:from-blue-500/80 group-hover:to-blue-700/90'
            : theme === 'dark-vhs'
            ? 'text-white bg-gradient-to-b from-black/70 to-gray-900/90 border-white/20 group-hover:border-white/40'
            : theme === 'matrix-terminal'
            ? 'text-green-100 bg-gradient-to-b from-black/70 to-green-900/90 border-green-500/20 group-hover:border-green-400/40'
            : theme === 'retro-chrome'
            ? 'text-blue-100 bg-gradient-to-b from-slate-800/70 to-blue-900/90 border-blue-400/30 group-hover:border-blue-300/50'
            : 'text-white bg-gradient-to-b from-black/60 to-black/80 border-white/20'
        }`}>
          <div className={`absolute inset-x-0.5 top-0 h-0.5 rounded-t ${
            theme === 'space-mood' 
              ? 'bg-gradient-to-b from-white/40 to-transparent'
              : theme === 'dark-vhs'
              ? 'bg-gradient-to-b from-white/20 to-transparent'
              : theme === 'matrix-terminal'
              ? 'bg-gradient-to-b from-green-400/30 to-transparent'
              : theme === 'retro-chrome'
              ? 'bg-gradient-to-b from-blue-300/30 to-transparent'
              : 'bg-gradient-to-b from-white/20 to-transparent'
          }`}></div>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default DesktopIcon;
