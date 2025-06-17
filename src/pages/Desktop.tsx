
import React, { useState } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import RadioApp from '@/components/RadioApp';
import TvApp from '@/components/TvApp';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Desktop = () => {
  const { t } = useSettings();
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen w-full flex items-start justify-start p-6">
        {/* Consistent grid layout with proper spacing */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full">
          <DesktopIcon icon={Folder} label={t('My Pictures')} to="/pictures" />
          <DesktopIcon icon={Video} label={t('My Videos')} to="/videos" />
          <DesktopIcon icon={Code} label={t('My Projects')} to="/projects" />
          <DesktopIcon icon={User} label={t('About Me')} to="/about" />
          <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
          <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
          
          {/* Radio App Icon */}
          <div
            onClick={() => setIsRadioOpen(true)}
            className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded border-2 border-gray-400 group-hover:border-gray-500 shadow-lg group-hover:shadow-xl transition-all duration-200 flex items-center justify-center">
                <div className="absolute top-1 left-1 w-8 h-4 bg-gradient-to-br from-white/50 to-transparent rounded blur-sm" />
                <Radio className="w-8 h-8 text-white drop-shadow-sm relative z-10" />
              </div>
            </div>
            <div className="h-8 flex items-center">
              <span className="text-sm font-pixel select-none px-2 py-1 rounded transition-all duration-200 text-black bg-gray-200/90 border border-gray-400 group-hover:bg-gray-100/90">
                📻 Radio
              </span>
            </div>
          </div>

          {/* TV App Icon */}
          <div
            onClick={() => setIsTvOpen(true)}
            className="group flex flex-col items-center justify-center space-y-3 text-center transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded border-2 border-gray-400 group-hover:border-gray-500 shadow-lg group-hover:shadow-xl transition-all duration-200 flex items-center justify-center">
                <div className="absolute top-1 left-1 w-8 h-4 bg-gradient-to-br from-white/50 to-transparent rounded blur-sm" />
                <Tv className="w-8 h-8 text-white drop-shadow-sm relative z-10" />
              </div>
            </div>
            <div className="h-8 flex items-center">
              <span className="text-sm font-pixel select-none px-2 py-1 rounded transition-all duration-200 text-black bg-gray-200/90 border border-gray-400 group-hover:bg-gray-100/90">
                📺 TV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Radio App Modal */}
      <RadioApp isOpen={isRadioOpen} onClose={() => setIsRadioOpen(false)} />
      
      {/* TV App Modal */}
      <TvApp isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} />
    </>
  );
};

export default Desktop;
