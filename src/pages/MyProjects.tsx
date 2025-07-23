import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAppTheme } from '@/components/shared/AppColorSystem';

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
  const { theme, t } = useSettings();
  const styles = useAppTheme('orange'); // Orange for projects

  const projects: Project[] = [
    {
      id: '1',
      title: 'Internly',
      description: {
        en: 'Currently developing a platform to connect students with internships',
        de: 'Entwickle derzeit eine Plattform, um Studenten mit Praktikumsplätzen zu verbinden'
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
      title: 'Echo Coesfeld',
      description: {
        en: 'A public voice project using QR codes & interviews to gather real opinions from people in Coesfeld',
        de: 'Ein öffentliches Stimme-Projekt mit QR-Codes und Interviews, um echte Meinungen von Menschen in Coesfeld zu sammeln'
      },
      links: [
        {
          url: 'https://www.instagram.com/echo.coesfeld/',
          label: 'Instagram'
        },
        {
          url: 'https://www.tiktok.com/@echo.coesfeld',
          label: 'TikTok'
        }
      ]
    }
  ];


  return (
    <div className={`min-h-screen p-4 ${styles.background}`}>
      <div className={`max-w-4xl mx-auto ${styles.container} rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden`}>
        {/* Header */}
        <div className="p-8 shrink-0">
          <h1 className={`text-3xl font-bold text-center ${styles.text}`}>
            {t('My Projects')}
          </h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className={`p-6 rounded-lg border ${styles.card}`}>
                <h3 className={`text-xl font-semibold mb-3 ${styles.text}`}>
                  {project.title}
                </h3>
                <p className={`mb-4 ${styles.subText}`}>
                  {t('language') === 'deutsch' ? project.description.de : project.description.en}
                </p>
                <div className="space-y-2">
                  {project.links.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                       className={`inline-flex items-center gap-2 ${styles.accent} hover:underline`}>
                      {link.label} <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
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

export default MyProjects;
