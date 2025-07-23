
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useAppTheme } from '@/components/shared/AppColorSystem';

interface VideoProject {
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

const MyVideos = () => {
  const { theme, t } = useSettings();
  const { isAuthenticated } = useGlobalAuth();
  const styles = useAppTheme('green'); // Will auto-adapt to theme color

  const videos: VideoProject[] = [
    {
      id: '1',
      title: 'Ute Uphues',
      description: {
        en: 'Teen coaching videos created for Ute\'s TikTok and Instagram',
        de: 'Teen-Coaching-Videos für Utes TikTok und Instagram erstellt'
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
        de: 'Ein kreatives und inhaltsfokussiertes Praktikum bei FALC Real Estate in Cala Millor'
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
        de: 'Unterhaltsame TikToks mit überraschenden Wendungen, Hooks und Storytelling'
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
      title: 'ThisTimeFr',
      description: {
        en: 'My storytelling identity for vlogs, creative clips, and travel adventures',
        de: 'Meine Storytelling-Identität für Vlogs, kreative Clips und Reiseabenteuer'
      },
      links: [
        {
          url: 'https://www.tiktok.com/@thistimefrr',
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
        de: 'Weitere Videos aus verschiedenen Projekten und Kooperationen'
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


  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen p-4 ${styles.background}`}>
        <div className={`max-w-md mx-auto ${styles.container} rounded-2xl shadow-2xl p-8`}>
          <div className="text-center">
            <p className={`${styles.text} text-lg mb-4`}>Please authenticate first to access videos.</p>
            <Link to="/" className={`${styles.button} inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200`}>
              <ArrowLeft className="w-4 h-4" />
              {t('Back to Login')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${styles.background}`}>
      <div className={`max-w-4xl mx-auto ${styles.container} rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden`}>
        {/* Header */}
        <div className="p-8 shrink-0">
          <h1 className={`text-3xl font-bold text-center ${styles.text}`}>
            {t('My Videos')}
          </h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
          <div className="space-y-6">
            {videos.map((video) => (
              <div key={video.id} className={`p-6 rounded-lg border ${styles.card}`}>
                <h3 className={`text-xl font-semibold mb-3 ${styles.text}`}>
                  {video.title}
                </h3>
                <p className={`mb-4 ${styles.subText}`}>
                  {t('language') === 'deutsch' ? video.description.de : video.description.en}
                </p>
                <div className="space-y-2">
                  {video.links.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                       className={`inline-flex items-center gap-2 ${styles.accent} hover:underline`}>
                      {link.label} <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          
            <div className={`p-4 rounded-lg border ${styles.card} text-center`}>
              <p className={`text-sm ${styles.subText}`}>
                More videos available on the TV app...
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center shrink-0">
          <Link to="/desktop" className={`${styles.button} inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105`}>
            <ArrowLeft className="w-4 h-4" />
            {t('Back to Desktop')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyVideos;
