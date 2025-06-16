
import React from 'react';
import { Link } from 'react-router-dom';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const iconColors = {
  'My Pictures': 'from-orange-500 via-red-500 to-pink-600',
  'Meine Bilder': 'from-orange-500 via-red-500 to-pink-600',
  'My Videos': 'from-purple-500 via-blue-500 to-cyan-500',
  'Meine Videos': 'from-purple-500 via-blue-500 to-cyan-500',
  'My Projects': 'from-green-500 via-emerald-500 to-teal-500',
  'Meine Projekte': 'from-green-500 via-emerald-500 to-teal-500',
  'About Me': 'from-indigo-500 via-purple-500 to-pink-500',
  'Über Mich': 'from-indigo-500 via-purple-500 to-pink-500',
  'Contact': 'from-blue-500 via-cyan-500 to-teal-500',
  'Kontakt': 'from-blue-500 via-cyan-500 to-teal-500',
  'Settings': 'from-slate-500 via-gray-500 to-zinc-500',
  'Einstellungen': 'from-slate-500 via-gray-500 to-zinc-500',
  'Game.exe': 'from-yellow-500 via-orange-500 to-red-500',
  'Spiel.exe': 'from-yellow-500 via-orange-500 to-red-500',
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  const gradientClass = iconColors[label as keyof typeof iconColors] || 'from-gray-500 to-gray-700';
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-300 hover:scale-105 transform-gpu"
    >
      {/* Fixed size container for consistent layout */}
      <div className="w-20 h-20 flex items-center justify-center">
        <div className={`relative w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 flex items-center justify-center border-2 border-black/30 group-hover:border-black/40`}>
          {/* Realistic depth effects */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/25 via-transparent to-black/15 rounded-xl"></div>
          <div className="absolute inset-1 bg-gradient-to-tl from-white/15 via-transparent to-transparent rounded-lg"></div>
          
          {/* Icon with enhanced contrast */}
          <Icon className="w-8 h-8 text-white drop-shadow-lg relative z-10 filter brightness-110 contrast-125" />
          
          {/* Highlight gloss */}
          <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>
          
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-lime-400 via-green-500 to-green-600 rounded-full border-2 border-black/30 shadow-lg">
            <div className="absolute inset-0.5 bg-gradient-to-br from-lime-300 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Fixed height label container */}
      <div className="h-8 flex items-center">
        <span className="text-sm text-white font-pixel select-none drop-shadow-lg bg-gradient-to-b from-black/60 to-black/80 px-3 py-1 rounded-md backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="absolute inset-x-0.5 top-0 h-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-t"></div>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default DesktopIcon;
