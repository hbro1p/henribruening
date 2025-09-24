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
    },
    {
      id: '3',
      title: 'Kebab Bros – Social Media Presence',
      description: {
        en: 'Created and managed engaging short-form videos for Kebab Bros Coesfeld. The videos achieved several tens of thousands of views across TikTok and Instagram.',
        de: 'Erstellung und Verwaltung ansprechender kurzer Videos für Kebab Bros Coesfeld. Die Videos erreichten mehrere zehntausend Aufrufe auf TikTok und Instagram.',
        es: 'Creé y gestioné videos cortos atractivos para Kebab Bros Coesfeld. Los videos alcanzaron varias decenas de miles de visualizaciones en TikTok e Instagram.'
      },
      links: [
        {
          url: 'https://www.instagram.com/kebab_bros_coesfeld/',
          label: 'Instagram'
        },
        {
          url: 'https://www.tiktok.com/@kebab_bros_coesfeld',
          label: 'TikTok'
        }
      ]
    },
    {
      id: '4',
      title: 'Website Design – Real Estate & Coaching',
      description: {
        en: 'Designed and launched professional websites for local businesses and initiatives: Modern one-page site for real estate valuation in Coesfeld and coaching & mentoring page with a clear and personal design.',
        de: 'Gestaltung und Umsetzung professioneller Websites für lokale Unternehmen und Initiativen: Moderne einseitige Website für Immobilienbewertung in Coesfeld und Coaching- & Mentoring-Seite mit klarem und persönlichem Design.',
        es: 'Diseñé e implementé sitios web profesionales para empresas e iniciativas locales: Sitio moderno de una página para evaluación inmobiliaria en Coesfeld y página de coaching y mentoría con un diseño claro y personal.'
      },
      links: [
        {
          url: 'https://immobilienbewertung-lamparter.de/',
          label: 'Immobilienbewertung Lamparter'
        },
        {
          url: 'https://uteuphues.de/',
          label: 'Ute Uphues Coaching'
        }
      ]
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
                      isCollapsible={project.id === '2'}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Contact section */}
            <div className="mt-12 text-center">
              <p className={`mb-4 ${styles.text}`}>
                {t('language') === 'deutsch' ? 'Du möchtest ein neues Projekt mit mir verwirklichen? Schreib mich gerne an!' :
                 t('language') === 'español' ? '¿Quieres realizar un nuevo proyecto conmigo? ¡No dudes en contactarme!' :
                 'Want to realize a new project with me? Feel free to reach out!'}
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <a 
                  href="https://www.linkedin.com/in/henribruening/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full border-2 transition-colors ${styles.button}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/henribruening/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full border-2 transition-colors ${styles.button}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:mail@henribrueningportfolio.com"
                  className={`p-3 rounded-full border-2 transition-colors ${styles.button}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h1.82L12 11.64l8.544-7.819h1.82c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </a>
              </div>
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
