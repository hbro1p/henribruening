
import React from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import { Folder, User, Mail, Video, Code, Settings } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Desktop = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen w-full flex items-start justify-start p-6">
      {/* Consistent grid layout with proper spacing */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full">
        <DesktopIcon icon={Folder} label={t('My Pictures')} to="/pictures" />
        <DesktopIcon icon={Video} label={t('My Videos')} to="/videos" />
        <DesktopIcon icon={Code} label={t('My Projects')} to="/projects" />
        <DesktopIcon icon={User} label={t('About Me')} to="/about" />
        <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
        <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
      </div>
    </div>
  );
};

export default Desktop;
