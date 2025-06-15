
import React from 'react';
import { Link } from 'react-router-dom';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center space-y-2 text-center w-28 h-28 p-2 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white transition-all"
    >
      <Icon className="w-12 h-12 text-black" />
      <span className="text-sm text-black select-none">{label}</span>
    </Link>
  );
};

export default DesktopIcon;
