
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
  'Settings': 'from-slate-600 via-gray-500 to-zinc-500',
  'Game.exe': 'from-yellow-600 via-orange-500 to-red-500',
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  const gradientClass = iconColors[label as keyof typeof iconColors] || 'from-gray-600 to-gray-800';
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center w-32 h-32 p-3 transition-all duration-300 hover:scale-105 transform-gpu"
    >
      <div className={`relative w-20 h-20 bg-gradient-to-br ${gradientClass} rounded-xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 flex items-center justify-center border-4 border-black/40 group-hover:border-black/50`}>
        {/* Realistic bevel effects */}
        <div className="absolute inset-1 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-lg"></div>
        <div className="absolute inset-2 bg-gradient-to-tl from-white/20 via-transparent to-transparent rounded-md"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-black/40 rounded-full blur-sm"></div>
        
        {/* Icon with metallic effect */}
        <Icon className="w-10 h-10 text-white drop-shadow-2xl relative z-10 filter brightness-110 contrast-125" />
        
        {/* Gloss highlight */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-sm"></div>
        
        {/* Status indicator with realistic depth */}
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-lime-400 via-green-500 to-green-700 rounded-full border-3 border-black/40 shadow-xl">
          <div className="absolute inset-1 bg-gradient-to-br from-lime-300 to-transparent rounded-full"></div>
          <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-black/30 rounded-full blur-sm"></div>
        </div>
      </div>
      
      <span className="text-sm text-white font-pixel select-none drop-shadow-2xl bg-gradient-to-b from-black/70 to-black/90 px-4 py-2 rounded-lg backdrop-blur-sm border-2 border-white/20 shadow-xl">
        <div className="absolute inset-x-1 top-0 h-1 bg-gradient-to-b from-white/30 to-transparent rounded-t"></div>
        {label}
      </span>
    </Link>
  );
};

export default DesktopIcon;
