
import React from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import { Folder, User, Mail } from 'lucide-react';

const Desktop = () => {
  return (
    <div className="min-h-screen w-full flex items-start justify-start p-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8">
        <DesktopIcon icon={Folder} label="My Pictures" to="/pictures" />
        <DesktopIcon icon={User} label="About Me" to="/about" />
        <DesktopIcon icon={Mail} label="Contact" to="/contact" />
      </div>
      <div className="fixed bottom-8 right-8 bg-yellow-200 text-black p-4 font-pixel text-lg shadow-lg transform -rotate-3 border-2 border-black">
        <p>"Click something.</p>
        <p>I'm watching 👀"</p>
      </div>
    </div>
  );
};

export default Desktop;
