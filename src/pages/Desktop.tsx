
import React, { useState } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import RadioApp from '@/components/RadioApp';
import TvApp from '@/components/TvApp';
import ChallengeApp from '@/components/ChallengeApp';
import RatingApp from '@/components/RatingApp';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv, Clock, Star } from 'lucide-react';

const Desktop = () => {
  console.log('Desktop component rendering...');
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  console.log('Desktop component rendered, isTvOpen:', isTvOpen);

  return (
    <>
      <div className="min-h-screen w-full flex items-start justify-start p-6">
        {/* Consistent grid layout with proper spacing */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full">
          <DesktopIcon icon={Folder} label="My Pictures" to="/pictures" />
          <DesktopIcon icon={Video} label="My Videos" to="/videos" />
          <DesktopIcon icon={Code} label="My Projects" to="/projects" />
          
          {/* Radio App Icon */}
          <DesktopIcon 
            icon={Radio} 
            label="Radio"
            onClick={() => {
              console.log('Radio icon clicked');
              setIsRadioOpen(true);
            }}
          />

          {/* TV App Icon */}
          <DesktopIcon 
            icon={Tv} 
            label="TV"
            onClick={() => {
              console.log('TV icon clicked, opening TV app');
              setIsTvOpen(true);
            }}
          />

          {/* Challenge App Icon */}
          <DesktopIcon 
            icon={Clock} 
            label="Challenge"
            onClick={() => {
              console.log('Challenge icon clicked, opening Challenge app');
              setIsChallengeOpen(true);
            }}
          />

          {/* Rating/Idea App Icon */}
          <DesktopIcon 
            icon={Star} 
            label="Idea Lab"
            onClick={() => {
              console.log('Rating/Idea icon clicked, opening Rating app');
              setIsRatingOpen(true);
            }}
          />

          <DesktopIcon icon={User} label="About Me" to="/about" />
          <DesktopIcon icon={Mail} label="Contact" to="/contact" />
          <DesktopIcon icon={Settings} label="Settings" to="/settings" />
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

      {/* Rating/Idea App Modal */}
      <RatingApp 
        isOpen={isRatingOpen} 
        onClose={() => {
          console.log('Closing Rating app');
          setIsRatingOpen(false);
        }} 
      />
    </>
  );
};

export default Desktop;
