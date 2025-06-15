
import React from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import { Folder, User, Mail } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import GlitchClock from '@/components/GlitchClock';

const Desktop = () => {
  return (
    <div className="min-h-screen w-full flex items-start justify-start p-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8">
        <DesktopIcon icon={Folder} label="My Pictures" to="/pictures" />
        <DesktopIcon icon={User} label="About Me" to="/about" />
        <DesktopIcon icon={Mail} label="Contact" to="/contact" />
      </div>
      <GlitchClock />
      <MusicPlayer />
    </div>
  );
};

export default Desktop;
