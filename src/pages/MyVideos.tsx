
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';

interface VideoProject {
  id: string;
  title: string;
  description: {
    en: string;
    de: string;
    es: string;
  };
  links: Array<{
    url: string;
    label: string;
  }>;
}

const MyVideos = () => {
  const { theme, t } = useSettings();
  const { isAuthenticated } = useGlobalAuth();

  const videos: VideoProject[] = [
    {
      id: '1',
      title: 'Ute Uphues',
      description: {
        en: 'Teen coaching videos created for Ute\'s TikTok and Instagram',
        de: 'Teen-Coaching-Videos für Utes TikTok und Instagram erstellt',
        es: 'Videos de coaching para adolescentes creados para TikTok e Instagram de Ute'
      },
      links: [
        {
          url: 'https://www.tiktok.com/@ute.uphues',
          label: 'TikTok'
        }
      ]
    },
    {
      id: '2',
      title: 'Real Estate Internship (Mallorca)',
      description: {
        en: 'A creative and content-focused internship at FALC Real Estate in Cala Millor',
        de: 'Ein kreatives und inhaltsfokussiertes Praktikum bei FALC Real Estate in Cala Millor',
        es: 'Una pasantía creativa y enfocada en contenido en FALC Real Estate en Cala Millor'
      },
      links: [
        {
          url: 'https://www.instagram.com/p/DIjcdGZIAcr/',
          label: 'Instagram'
        }
      ]
    },
    {
      id: '3',
      title: 'HenriAWB – Blackstories with a Hook',
      description: {
        en: 'Entertaining TikToks with surprising twists, hooks, and storytelling',
        de: 'Unterhaltsame TikToks mit überraschenden Wendungen, Hooks und Storytelling',
        es: 'TikToks entretenidos con giros sorprendentes, ganchos y narrativa'
      },
      links: [
        {
          url: 'https://www.youtube.com/@Henriawb',
          label: 'YouTube'
        }
      ]
    },
    {
      id: '4',
      title: 'Henri.abenteuer',
      description: {
        en: 'My storytelling identity for vlogs, creative clips, and travel adventures',
        de: 'Meine Storytelling-Identität für Vlogs, kreative Clips und Reiseabenteuer',
        es: 'Mi identidad narrativa para vlogs, clips creativos y aventuras de viaje'
      },
      links: [
        {
          url: 'https://www.tiktok.com/@henri.abenteuer',
          label: 'TikTok'
        },
        {
          url: 'https://www.youtube.com/@Thistimefr',
          label: 'YouTube'
        }
      ]
    },
    {
      id: '5',
      title: 'More Videos',
      description: {
        en: 'Additional videos from various projects and collaborations',
        de: 'Weitere Videos aus verschiedenen Projekten und Kooperationen',
        es: 'Videos adicionales de varios proyectos y colaboraciones'
      },
      links: [
        {
          url: 'https://www.youtube.com/watch?v=jr0z7nFgE7Q',
          label: 'YouTube Video'
        },
        {
          url: 'https://www.instagram.com/reel/C2Il3BRoCV5/',
          label: 'Instagram Reel'
        },
        {
          url: 'https://heriburg-gymnasium.de/projektwoche-2025/',
          label: 'Project Week'
        }
      ]
    }
  ];

  // Get folder color scheme for space mood theme
  const getFolderTheme = () => {
    if (theme === 'space-mood') {
      return 'folder-green'; // Green theme for videos folder
    }
    return '';
  };

  const getWindowStyles = () => {
    const folderTheme = getFolderTheme();
    
    if (theme === 'space-mood' && folderTheme) {
      return {
        windowFrame: 'bg-gradient-to-br from-green-300 via-green-400 to-green-600',
        titleBar: 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700',
        windowContent: 'bg-gradient-to-br from-green-200 via-green-300 to-green-400',
        text: 'text-green-900',
        button: 'bg-gradient-to-br from-green-500 via-green-600 to-green-800 hover:from-green-400 hover:via-green-500 hover:to-green-700 text-white',
        input: 'bg-green-50 border-green-600 text-green-900',
        link: 'text-green-800 hover:text-green-900',
        cardBg: 'bg-green-50 border-green-600',
      };
    }
    
    // Default fallback for space-mood theme
    return {
      windowFrame: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
      titleBar: 'bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700',
      windowContent: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
      text: 'text-blue-100',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      input: 'bg-slate-800 border-blue-400/30 text-blue-200',
      link: 'text-blue-300 hover:text-blue-200',
      cardBg: 'bg-slate-800 border-blue-400/30',
    };
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      input: 'bg-white border-black text-black',
      link: 'text-blue-800 hover:text-blue-900',
      cardBg: 'bg-white border-black',
    };
  };

  const styles = getWindowStyles();

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderTheme()}`}>
        <div className={`p-2 border-2 border-black/30 w-full max-w-md shadow-2xl rounded-lg ${styles.windowFrame}`}>
          <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <p className={`${styles.text} font-pixel text-lg`}>Please authenticate first to access videos.</p>
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
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderTheme()}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('My Videos')}</span>
          </div>
        </div>
        
        <div className={`p-4 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Videos')} ]</h1>
            
            <div className="grid gap-8 text-left w-full max-w-2xl">
              {videos.map((video) => (
                <div key={video.id} className={`p-6 border-2 ${styles.cardBg}`}>
                  <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel ${styles.text}`}>
                    {video.title}
                  </h3>
                  <p className={`mb-4 font-pixel ${styles.text}`}>
                    {t('language') === 'deutsch' ? video.description.de : t('language') === 'español' ? video.description.es : video.description.en}
                  </p>
                  <div className="space-y-2">
                    {video.links.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                         className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                        {link.label} <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-8 p-4 border-2 ${styles.cardBg} rounded`}>
              <p className={`font-pixel text-sm ${styles.text}`}>
                {t('More Videos Available on the TV App')}
              </p>
            </div>

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

export default MyVideos;
