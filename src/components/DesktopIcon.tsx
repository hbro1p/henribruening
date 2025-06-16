
import React from 'react';
import { Link } from 'react-router-dom';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const iconColors = {
  'My Pictures': 'from-orange-600 via-red-500 to-pink-600',
  'My Videos': 'from-purple-600 via-blue-500 to-cyan-500',
  'My Projects': 'from-green-600 via-emerald-500 to-teal-500',
  'About Me': 'from-indigo-600 via-purple-500 to-pink-500',
  'Contact': 'from-blue-600 via-cyan-500 to-teal-500',
  'Game.exe': 'from-yellow-600 via-orange-500 to-red-500',
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  const gradientClass = iconColors[label as keyof typeof iconColors] || 'from-gray-600 to-gray-800';
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center w-32 h-32 p-3 transition-all duration-300 hover:scale-105 transform-gpu"
    >
      <div className={`relative w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-300 flex items-center justify-center border-2 border-black/20 group-hover:border-black/30`}>
        {/* Top highlight */}
        <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t-md"></div>
        {/* Side highlights */}
        <div className="absolute left-1 inset-y-1 w-1 bg-gradient-to-r from-white/30 to-transparent rounded-l-md"></div>
        <div className="absolute right-1 inset-y-1 w-1 bg-gradient-to-l from-black/20 to-transparent rounded-r-md"></div>
        {/* Bottom shadow */}
        <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-b-md"></div>
        
        <Icon className="w-8 h-8 text-white drop-shadow-2xl relative z-10 filter brightness-110" />
        
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-lime-400 to-green-600 rounded-full border-2 border-black/30 shadow-lg">
          <div className="absolute inset-0.5 bg-gradient-to-br from-lime-300 to-transparent rounded-full"></div>
        </div>
      </div>
      
      <span className="text-sm text-white font-pixel select-none drop-shadow-2xl bg-gradient-to-b from-black/60 to-black/80 px-3 py-1.5 rounded-md backdrop-blur-sm border border-white/10 shadow-lg">
        {label}
      </span>
    </Link>
  );
};

export default DesktopIcon;
