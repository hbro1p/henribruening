
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const getIconStyles = (label: string, theme: string) => {
  // Space Mood theme - Clean Windows XP-style 2000s aesthetic
  if (theme === 'space-mood') {
    const colors = {
      'My Pictures': 'from-blue-400 to-blue-600',
      'Meine Bilder': 'from-blue-400 to-blue-600',
      'My Videos': 'from-red-400 to-red-600',
      'Meine Videos': 'from-red-400 to-red-600',
      'My Projects': 'from-green-400 to-green-600',
      'Meine Projekte': 'from-green-400 to-green-600',
      'About Me': 'from-orange-400 to-orange-600',
      'Über Mich': 'from-orange-400 to-orange-600',
      'Contact': 'from-purple-400 to-purple-600',
      'Kontakt': 'from-purple-400 to-purple-600',
      'Settings': 'from-gray-400 to-gray-600',
      'Einstellungen': 'from-gray-400 to-gray-600',
      'Game.exe': 'from-yellow-400 to-yellow-600',
      'Spiel.exe': 'from-yellow-400 to-yellow-600',
    };
    
    return {
      gradient: colors[label as keyof typeof colors] || 'from-blue-400 to-blue-600',
      border: 'border-gray-300',
      hoverBorder: 'group-hover:border-gray-400',
      shadow: 'shadow-md group-hover:shadow-lg',
      highlight: 'bg-gradient-to-br from-white/40 to-transparent',
    };
  }
  
  // Dark VHS theme
  if (theme === 'dark-vhs') {
    return {
      gradient: 'from-gray-600 via-gray-700 to-gray-900',
      border: 'border-white/20',
      hoverBorder: 'group-hover:border-white/40',
      shadow: 'shadow-lg shadow-white/10 group-hover:shadow-white/20',
      highlight: 'bg-gradient-to-br from-white/30 to-transparent',
    };
  }
  
  // Matrix Terminal theme
  if (theme === 'matrix-terminal') {
    return {
      gradient: 'from-green-600 via-green-700 to-black',
      border: 'border-green-500/30',
      hoverBorder: 'group-hover:border-green-400/50',
      shadow: 'shadow-lg shadow-green-500/20 group-hover:shadow-green-400/30',
      highlight: 'bg-gradient-to-br from-green-200/40 to-transparent',
    };
  }
  
  // Retro Chrome theme
  if (theme === 'retro-chrome') {
    return {
      gradient: 'from-slate-400 via-blue-500 to-slate-600',
      border: 'border-blue-300/30',
      hoverBorder: 'group-hover:border-blue-200/50',
      shadow: 'shadow-lg shadow-blue-500/20 group-hover:shadow-blue-400/30',
      highlight: 'bg-gradient-to-br from-white/40 to-transparent',
    };
  }
  
  // Default fallback
  return {
    gradient: 'from-gray-500 to-gray-700',
    border: 'border-black/30',
    hoverBorder: 'group-hover:border-black/50',
    shadow: 'shadow-lg',
    highlight: 'bg-gradient-to-br from-white/30 to-transparent',
  };
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  const { theme } = useSettings();
  const styles = getIconStyles(label, theme);
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-200 hover:scale-105"
    >
      <div className="w-20 h-20 flex items-center justify-center">
        <div className={`relative w-16 h-16 bg-gradient-to-br ${styles.gradient} rounded border-2 ${styles.border} ${styles.hoverBorder} ${styles.shadow} transition-all duration-200 flex items-center justify-center`}>
          {/* Windows XP-style highlight */}
          <div className={`absolute top-1 left-1 w-8 h-4 ${styles.highlight} rounded blur-sm`}></div>
          
          {/* Icon */}
          <Icon className="w-8 h-8 text-white drop-shadow-sm relative z-10" />
        </div>
      </div>
      
      <div className="h-8 flex items-center">
        <span className={`text-sm font-pixel select-none px-2 py-1 rounded transition-all duration-200 ${
          theme === 'space-mood' 
            ? 'text-white bg-blue-600/80 border border-gray-300 group-hover:bg-blue-500/80'
            : theme === 'dark-vhs'
            ? 'text-white bg-black/70 border border-white/20 group-hover:border-white/40'
            : theme === 'matrix-terminal'
            ? 'text-green-100 bg-black/70 border border-green-500/20 group-hover:border-green-400/40'
            : theme === 'retro-chrome'
            ? 'text-blue-100 bg-slate-800/70 border border-blue-400/30 group-hover:border-blue-300/50'
            : 'text-white bg-black/60 border border-white/20'
        }`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default DesktopIcon;
