
import React from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import { Folder, User, Mail, Joystick, Video, Code, Settings } from 'lucide-react';
import Clock from '@/components/Clock';

const Desktop = () => {
  return (
    <div className="min-h-screen w-full flex items-start justify-start p-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8">
        <DesktopIcon icon={Folder} label="My Pictures" to="/pictures" />
        <DesktopIcon icon={Video} label="My Videos" to="/videos" />
        <DesktopIcon icon={Code} label="My Projects" to="/projects" />
        <DesktopIcon icon={User} label="About Me" to="/about" />
        <DesktopIcon icon={Mail} label="Contact" to="/contact" />
        <DesktopIcon icon={Settings} label="Settings" to="/settings" />
        <DesktopIcon icon={Joystick} label="Game.exe" to="/game" />
      </div>
      <Clock />
    </div>
  );
};

export default Desktop;
