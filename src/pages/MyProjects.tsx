
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: {
    en: string;
    de: string;
  };
  links: Array<{
    url: string;
    label: string;
  }>;
}

const MyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, t } = useSettings();
  const { isAuthenticated } = useGlobalAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-projects', {
        body: {}
      });
      
      if (error) throw error;
      
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400',
        text: 'text-orange-900',
        link: 'text-orange-800 hover:text-orange-900',
        button: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 border-2 border-black/30 text-orange-900 hover:from-orange-200 hover:via-orange-300 hover:to-orange-500',
        icon: 'text-orange-800',
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700',
        cardBg: 'bg-gradient-to-br from-white via-gray-100 to-gray-200 border-black/30',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-orange-400 hover:text-orange-300',
        button: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border-2 border-white/30 text-white hover:from-gray-500 hover:via-gray-600 hover:to-gray-700',
        icon: 'text-white',
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700',
        cardBg: 'bg-gray-800 border-white/20',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        button: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 border-2 border-blue-300/30 text-white hover:from-slate-400 hover:via-blue-500 hover:to-slate-600',
        icon: 'text-white',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
        cardBg: 'bg-slate-800 border-blue-400/30',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-green-600 via-green-700 to-teal-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-green-800 hover:text-green-900',
      button: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-3 border-black/40 hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 text-black',
      icon: 'text-white',
      iconBg: 'bg-gradient-to-br from-green-500 to-teal-600',
      cardBg: 'bg-gradient-to-br from-white via-gray-100 to-gray-200 border-black/30',
    };
  };

  const styles = getWindowStyles();

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
        <div className={`p-2 border-2 border-black/30 w-full max-w-md shadow-2xl rounded-lg ${styles.windowFrame}`}>
          <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <p className={`${styles.text} font-pixel text-lg`}>Please authenticate first to access projects.</p>
              <Link to="/" className={`mt-4 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
                <ArrowLeft className="w-5 h-5" />
                {t('Back to Login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Projects.exe</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Projects')} ]</h1>
            
            {isLoadingProjects ? (
              <div className={`${styles.text} font-pixel text-lg mb-8`}>Loading projects...</div>
            ) : error ? (
              <div className={`text-red-600 font-pixel text-lg mb-8`}>{error}</div>
            ) : (
              <div className="grid gap-8 text-left w-full max-w-2xl">
                {projects.map((project) => (
                  <div key={project.id} className={`p-6 border-2 rounded-lg shadow-lg relative ${styles.cardBg}`}>
                    <div className="absolute inset-x-2 top-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                    <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel drop-shadow-sm ${styles.text}`}>
                      {project.title}
                    </h3>
                    <p className={`mb-4 drop-shadow-sm ${styles.text}`}>
                      {t('language') === 'deutsch' ? project.description.de : project.description.en}
                    </p>
                    <div className="space-y-2">
                      {project.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                           className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                          {link.label} <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
              <ArrowLeft className="w-5 h-5" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
