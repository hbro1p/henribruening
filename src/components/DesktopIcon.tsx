
import React from 'react';
import { Link } from 'react-router-dom';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const iconColors = {
  'My Pictures': 'from-pink-400 via-purple-400 to-indigo-400',
  'My Videos': 'from-red-400 via-orange-400 to-yellow-400',
  'My Projects': 'from-green-400 via-teal-400 to-blue-400',
  'About Me': 'from-purple-400 via-pink-400 to-rose-400',
  'Contact': 'from-blue-400 via-cyan-400 to-teal-400',
  'Game.exe': 'from-yellow-400 via-orange-400 to-red-400',
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  const gradientClass = iconColors[label as keyof typeof iconColors] || 'from-gray-400 to-gray-600';
  
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center space-y-3 text-center w-32 h-32 p-3 transition-all duration-300 hover:scale-110 transform-gpu"
    >
      <div className={`relative w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white/30 group-hover:border-white/50`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
        <Icon className="w-8 h-8 text-white drop-shadow-lg relative z-10" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full border-2 border-white shadow-sm"></div>
      </div>
      <span className="text-sm text-white font-pixel select-none drop-shadow-lg bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20">
        {label}
      </span>
    </Link>
  );
};

export default DesktopIcon;
