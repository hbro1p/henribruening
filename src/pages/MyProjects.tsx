import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import VideoGallery from '@/components/VideoGallery';

interface Project {
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
  videos?: {
    instagram: Array<{
      url: string;
      title: string;
    }>;
    tiktok: Array<{
      url: string;
      title: string;
    }>;
  };
}

const MyProjects = () => {
  const { theme, t } = useSettings();

  const projects: Project[] = [
    {
      id: '1',
      title: 'Internly',
      description: {
        en: 'Currently developing a platform to connect students with internships',
        de: 'Entwickle derzeit eine Plattform, um Studenten mit Praktikumsplätzen zu verbinden',
        es: 'Actualmente desarrollando una plataforma para conectar estudiantes con prácticas profesionales'
      },
      links: [
        {
          url: 'https://www.instagram.com/internly.de/',
          label: 'Instagram'
        }
      ]
    },
    {
      id: '2',
      title: 'Florian Klostermann – Social Media Unterstützung',
      description: {
        en: 'Campaign engagement videos: Successfully produced multiple videos for the Döner action. The videos achieved a total of more than 90,000 views across all platforms.',
        de: 'Wahlkampf-Engagement Videos: Erfolgreich mehrere Videos zur Döner-Aktion produziert. Die Videos haben insgesamt mehr als 90.000 Aufrufe auf allen Plattformen erzielt.',
        es: 'Videos de participación en campaña: Produje exitosamente múltiples videos para la acción Döner. Los videos lograron un total de más de 90,000 visualizaciones en todas las plataformas.'
      },
      links: [
        {
          url: 'https://www.instagram.com/florianklostermann/',
          label: 'Instagram'
        },
        {
          url: 'https://www.tiktok.com/@florianklostermann',
          label: 'TikTok'
        }
      ],
      videos: {
        instagram: [
          {
            url: 'https://www.instagram.com/reel/DL8DnBNq1Qs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
            title: 'Video 1'
          },
          {
            url: 'https://www.instagram.com/reel/DL9609GqBS6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
            title: 'Video 2'
          },
          {
            url: 'https://www.instagram.com/reel/DMS06m0qLCj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
            title: 'Video 3'
          }
        ],
        tiktok: [
          {
            url: 'https://www.tiktok.com/@florianklostermann/video/7524008300548082966?is_from_webapp=1&sender_device=pc&web_id=7543726847503500802',
            title: 'Video 1'
          },
          {
            url: 'https://www.tiktok.com/@florianklostermann/video/7524687424543280406?is_from_webapp=1&sender_device=pc&web_id=7543726847503500802',
            title: 'Video 2'
          },
          {
            url: 'https://www.tiktok.com/@florianklostermann/video/7525530991381777686?is_from_webapp=1&sender_device=pc&web_id=7543726847503500802',
            title: 'Video 3'
          },
          {
            url: 'https://www.tiktok.com/@florianklostermann/video/7525799413751680279?is_from_webapp=1&sender_device=pc&web_id=7543726847503500802',
            title: 'Video 4'
          }
        ]
      }
    }
  ];

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
    
    if (theme === 'adventure-canyon') {
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

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('My Projects')}</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Projects')} ]</h1>
            
            <div className="grid gap-8 text-left w-full max-w-2xl">
              {projects.map((project) => (
                <div key={project.id} className={`p-6 border-2 rounded-lg shadow-lg relative ${styles.cardBg}`}>
                  <div className="absolute inset-x-2 top-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                  <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel drop-shadow-sm ${styles.text}`}>
                    {project.title}
                  </h3>
                  <p className={`mb-4 drop-shadow-sm ${styles.text}`}>
                    {t('language') === 'deutsch' ? project.description.de : 
                     t('language') === 'español' ? project.description.es : 
                     project.description.en}
                  </p>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                         className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                        {link.label} <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                  
                  {/* Video Gallery */}
                  {project.videos && (
                    <VideoGallery
                      instagramVideos={project.videos.instagram || []}
                      tiktokVideos={project.videos.tiktok || []}
                      styles={styles}
                    />
                  )}
                </div>
              ))}
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

export default MyProjects;
