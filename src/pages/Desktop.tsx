
import React, { useState } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import RadioApp from '@/components/RadioApp';
import TvApp from '@/components/TvApp';
import ChallengeApp from '@/components/ChallengeApp';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Desktop = () => {
  const { t } = useSettings();
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  console.log('Desktop component rendered, isTvOpen:', isTvOpen);

  return (
    <>
      <div className="min-h-screen w-full flex items-start justify-start p-6">
        {/* Consistent grid layout with proper spacing */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full">
          <DesktopIcon icon={Folder} label={t('My Pictures')} to="/pictures" />
          <DesktopIcon icon={Video} label={t('My Videos')} to="/videos" />
          <DesktopIcon icon={Code} label={t('My Projects')} to="/projects" />
          
          {/* Radio App Icon */}
          <DesktopIcon 
            icon={Radio} 
            label={t('Radio')}
            onClick={() => {
              console.log('Radio icon clicked');
              setIsRadioOpen(true);
            }}
          />

          {/* TV App Icon */}
          <DesktopIcon 
            icon={Tv} 
            label={t('TV')}
            onClick={() => {
              console.log('TV icon clicked, opening TV app');
              setIsTvOpen(true);
            }}
          />

          {/* Challenge App Icon */}
          <DesktopIcon 
            icon={Clock} 
            label={t('Challenge')}
            onClick={() => {
              console.log('Challenge icon clicked, opening Challenge app');
              setIsChallengeOpen(true);
            }}
          />

          <DesktopIcon icon={User} label={t('About Me')} to="/about" />
          <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
          <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
        </div>
      </div>

      {/* Radio App Modal */}
      <RadioApp 
        isOpen={isRadioOpen} 
        onClose={() => {
          console.log('Closing Radio app');
          setIsRadioOpen(false);
        }}
      />
      
      {/* TV App Modal */}
      <TvApp 
        isOpen={isTvOpen} 
        onClose={() => {
          console.log('Closing TV app');
          setIsTvOpen(false);
        }} 
      />
      
      {/* Challenge App Modal */}
      <ChallengeApp 
        isOpen={isChallengeOpen} 
        onClose={() => {
          console.log('Closing Challenge app');
          setIsChallengeOpen(false);
        }} 
      />
    </>
  );
};

export default Desktop;
