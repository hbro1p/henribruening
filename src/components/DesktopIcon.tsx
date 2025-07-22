
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  onClick?: () => void;
}

const getIconStyles = (label: string, theme: string) => {
  // Space Mood theme - Professional Windows XP-style with creative hover effects
  if (theme === 'space-mood') {
    const colors = {
      'My Pictures': 'from-blue-500 to-blue-700',
      'Meine Bilder': 'from-blue-500 to-blue-700',
      'My Videos': 'from-green-500 to-green-700',
      'Meine Videos': 'from-green-500 to-green-700',
      'My Projects': 'from-orange-500 to-orange-700',
      'Meine Projekte': 'from-orange-500 to-orange-700',
      'Radio': 'from-red-500 to-red-700',
      'TV': 'from-purple-500 to-purple-700',
      'Challenge': 'from-yellow-500 to-orange-600',
      'About Me': 'from-teal-500 to-teal-700',
      'Über Mich': 'from-teal-500 to-teal-700',
      'Contact': 'from-pink-500 to-pink-700',
      'Kontakt': 'from-pink-500 to-pink-700',
      'Settings': 'from-gray-500 to-gray-700',
      'Einstellungen': 'from-gray-500 to-gray-700',
    };

    const glowColors = {
      'My Pictures': 'group-hover:shadow-blue-400/60',
      'Meine Bilder': 'group-hover:shadow-blue-400/60',
      'My Videos': 'group-hover:shadow-green-400/60',
      'Meine Videos': 'group-hover:shadow-green-400/60',
      'My Projects': 'group-hover:shadow-orange-400/60',
      'Meine Projekte': 'group-hover:shadow-orange-400/60',
      'Radio': 'group-hover:shadow-red-400/60',
      'TV': 'group-hover:shadow-purple-400/60',
      'Challenge': 'group-hover:shadow-yellow-400/60',
      'About Me': 'group-hover:shadow-teal-400/60',
      'Über Mich': 'group-hover:shadow-teal-400/60',
      'Contact': 'group-hover:shadow-pink-400/60',
      'Kontakt': 'group-hover:shadow-pink-400/60',
      'Settings': 'group-hover:shadow-gray-400/60',
      'Einstellungen': 'group-hover:shadow-gray-400/60',
    };
    
    return {
      gradient: colors[label as keyof typeof colors] || 'from-blue-500 to-blue-700',
      border: 'border-gray-400',
      hoverBorder: 'group-hover:border-gray-500',
      shadow: `shadow-lg group-hover:shadow-2xl transition-all duration-300 ${glowColors[label as keyof typeof glowColors] || 'group-hover:shadow-blue-400/60'}`,
      highlight: 'bg-gradient-to-br from-white/50 to-transparent',
      iconGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300',
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

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to, onClick }) => {
  const { theme } = useSettings();
  const styles = getIconStyles(label, theme);
  
  const content = (
    <>
      <div className="w-20 h-20 flex items-center justify-center">
        <div className={`relative w-16 h-16 bg-gradient-to-br ${styles.gradient} rounded border-2 ${styles.border} ${styles.hoverBorder} ${styles.shadow} transition-all duration-200 flex items-center justify-center`}>
          {/* Windows XP-style highlight */}
          <div className={`absolute top-1 left-1 w-8 h-4 ${styles.highlight} rounded blur-sm`}></div>
          
          {/* Icon */}
          <Icon className={`w-8 h-8 text-white drop-shadow-sm relative z-10 ${styles.iconGlow || ''}`} />
        </div>
      </div>
      
      <div className="h-8 flex items-center">
        <span className={`text-sm font-pixel select-none px-2 py-1 rounded transition-all duration-200 ${
          theme === 'space-mood' 
            ? 'text-black bg-gray-200/90 border border-gray-400 group-hover:bg-gray-100/90'
            : theme === 'dark-vhs'
            ? 'text-white bg-black/70 border border-white/20 group-hover:border-white/40'
            : theme === 'retro-chrome'
            ? 'text-blue-100 bg-slate-800/70 border border-blue-400/30 group-hover:border-blue-300/50'
            : 'text-white bg-black/60 border border-white/20'
        }`}>
          {label}
        </span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to || '/'}
      className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-200 hover:scale-105"
    >
      {content}
    </Link>
  );
};

export default DesktopIcon;
