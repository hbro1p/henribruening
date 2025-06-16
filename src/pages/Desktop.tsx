
import React from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import { Folder, User, Mail, Joystick, Video, Code, Settings } from 'lucide-react';
import Clock from '@/components/Clock';
import { useSettings } from '@/contexts/SettingsContext';

const Desktop = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen w-full flex items-start justify-start p-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8">
        <DesktopIcon icon={Folder} label={t('My Pictures')} to="/pictures" />
        <DesktopIcon icon={Video} label={t('My Videos')} to="/videos" />
        <DesktopIcon icon={Code} label={t('My Projects')} to="/projects" />
        <DesktopIcon icon={User} label={t('About Me')} to="/about" />
        <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
        <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
        <DesktopIcon icon={Joystick} label={t('Game.exe')} to="/game" />
      </div>
      <Clock />
    </div>
  );
};

export default Desktop;
