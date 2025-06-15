
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon as LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon: Icon, label, to }) => {
  return (
    <Link to={to} className="flex flex-col items-center space-y-2 text-center w-24 h-24 p-2 hover:bg-white/10 rounded-md transition-colors">
      <Icon className="w-12 h-12" />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default DesktopIcon;
