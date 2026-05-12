import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import VideoGallery from '@/components/VideoGallery';

interface Project {
  id: string;
  title: {
    en: string;
    de: string;
    es: string;
  };
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
      id: 'flohmarkt',
      title: {
        en: 'Coesfeld Flea Market',
        de: 'Coesfelder Flohmarkt',
        es: 'Mercadillo de Coesfeld'
      },
      description: {
        en: 'Together with Arne, I organized a free neighborhood flea market in Coesfeld. The idea: bring people from the area together, make sustainability local and easy, and give used items a second life. I handled the full organization — seller registration, communication with participants, cooperation with the city of Coesfeld, social media posts, flyers and public promotion. The project shows that I do not just plan ideas, but actually realize them and make them visible.',
        de: 'Gemeinsam mit Arne habe ich einen kostenlosen Nachbarschaftsflohmarkt in Coesfeld organisiert. Die Idee: Menschen aus der Umgebung zusammenbringen, Nachhaltigkeit lokal und einfach machen und gebrauchten Dingen ein zweites Leben geben. Dazu gehörten die komplette Organisation, die Anmeldung für Verkäufer, die Kommunikation mit Teilnehmern, die Zusammenarbeit mit der Stadt Coesfeld, Social-Media-Beiträge, Flyer und die öffentliche Bewerbung. Das Projekt zeigt, dass ich eigene Ideen nicht nur plane, sondern wirklich umsetze und sichtbar mache.',
        es: 'Junto con Arne organicé un mercadillo de barrio gratuito en Coesfeld. La idea: unir a la gente de la zona, hacer la sostenibilidad local y sencilla y darles una segunda vida a los objetos usados. Me encargué de toda la organización: inscripción de vendedores, comunicación con los participantes, cooperación con la ciudad de Coesfeld, publicaciones en redes sociales, flyers y promoción pública. El proyecto demuestra que no solo planeo ideas, sino que realmente las llevo a cabo y las hago visibles.'
      },
      links: [
        { url: 'https://www.instagram.com/coesfeld.flohmarkt/', label: 'Instagram' },
        { url: 'https://coesfeldflohmarkt.de/', label: 'Website' }
      ]
    },
    {
      id: 'falc',
      title: {
        en: 'FALC Immobilien Coesfeld – Social Media for Kelwin Lamparter',
        de: 'FALC Immobilien Coesfeld – Social Media für Kelwin Lamparter',
        es: 'FALC Immobilien Coesfeld – Redes sociales para Kelwin Lamparter'
      },
      description: {
        en: 'I support real estate agent Kelwin Lamparter (FALC Immobilien Coesfeld) in building his social media presence. I develop content ideas, hooks, scripts and Reels around real estate, sales and the everyday life of an agent. Within roughly two months, the account grew by about 1,400 followers. The focus was not only reach, but also building a clear local brand, creating trust and producing content that fits the target group.',
        de: 'Ich unterstütze den Makler Kelwin Lamparter (FALC Immobilien Coesfeld) beim Aufbau seines Social-Media-Auftritts. Ich entwickle Content-Ideen, Hooks, Skripte und Reels rund um Immobilien, Verkauf und den Alltag als Makler. Innerhalb von ca. zwei Monaten konnte der Account um etwa 1.400 Follower wachsen. Dabei ging es nicht nur um Reichweite, sondern auch darum, eine klare lokale Marke aufzubauen, Vertrauen zu schaffen und Inhalte zu produzieren, die zur Zielgruppe passen.',
        es: 'Apoyo al agente inmobiliario Kelwin Lamparter (FALC Immobilien Coesfeld) en la construcción de su presencia en redes sociales. Desarrollo ideas de contenido, hooks, guiones y Reels sobre inmobiliaria, ventas y el día a día como agente. En unos dos meses la cuenta creció aproximadamente 1.400 seguidores. El foco no era solo alcance, sino construir una marca local clara, generar confianza y producir contenido adaptado al público objetivo.'
      },
      links: [
        { url: 'https://www.instagram.com/kelwinlamparter/', label: 'Instagram' }
      ]
    },
    {
      id: 'facharbeit',
      title: {
        en: 'English Research Paper – The Fading American Dream?',
        de: 'Facharbeit Englisch – The Fading American Dream?',
        es: 'Trabajo de investigación de inglés – The Fading American Dream?'
      },
      description: {
        en: 'My English research paper "The Fading American Dream? Gentrification, Housing Affordability, and the Immigrant Experience in Brooklyn, New York" asks whether the American Dream is still reachable in Brooklyn today. After cold emails to brokers and activists barely worked, I found locals through a Reddit post that reached over 17,000 views and led to five video interviews with people from Brooklyn. I combined those personal perspectives with data and sources. Conclusion: the classic American Dream — especially owning a home — is barely reachable for many in Brooklyn, but the dream itself has shifted toward belonging, freedom and personal fulfillment.',
        de: 'In meiner Facharbeit „The Fading American Dream? Gentrification, Housing Affordability, and the Immigrant Experience in Brooklyn, New York" habe ich mich mit der Frage beschäftigt, ob der American Dream in Brooklyn heute noch erreichbar ist. Nachdem normale E-Mails an Makler und Aktivisten kaum funktionierten, habe ich über einen Reddit-Post mit über 17.000 Aufrufen Locals aus Brooklyn gefunden und fünf Video-Interviews geführt. So konnte ich persönliche Perspektiven mit Daten und Quellen verbinden. Ergebnis: Der klassische American Dream – vor allem das eigene Haus – ist für viele in Brooklyn kaum noch erreichbar, hat sich aber gewandelt und steht heute eher für Zugehörigkeit, Freiheit und persönliche Erfüllung.',
        es: 'En mi trabajo de investigación „The Fading American Dream? Gentrification, Housing Affordability, and the Immigrant Experience in Brooklyn, New York" me pregunté si el sueño americano sigue siendo alcanzable hoy en Brooklyn. Como los correos a agentes y activistas apenas funcionaron, encontré a locales mediante una publicación en Reddit con más de 17.000 visualizaciones y realicé cinco entrevistas en video. Así pude unir perspectivas personales con datos y fuentes. Conclusión: el sueño americano clásico — sobre todo tener casa propia — apenas es alcanzable para muchos en Brooklyn, pero ha cambiado y hoy significa más bien pertenencia, libertad y realización personal.'
      },
      links: [
        { url: 'https://drive.google.com/file/d/1i-K5SjLzHxTqLpM1ZwG8FGUhMXqZRKB1/view?usp=sharing', label: 'Read paper (PDF)' },
        { url: 'https://www.youtube.com/watch?v=OZNhzwlcP0M', label: 'Brooklyn interviews (YouTube)' }
      ]
    },
    {
      id: '1',
      title: {
        en: 'Internly',
        de: 'Internly',
        es: 'Internly'
      },
      description: {
        en: 'No longer active. I built Internly as a platform to connect students with internships and learned a huge amount along the way — about product, growth, marketing and what it really takes to launch something. In the end I decided to stop and focus on other projects, but the experience shaped how I approach everything I build today.',
        de: 'Nicht mehr aktiv. Ich habe Internly als Plattform aufgebaut, um Studenten mit Praktikumsplätzen zu verbinden, und dabei extrem viel gelernt – über Produkt, Wachstum, Marketing und was es wirklich braucht, etwas zu launchen. Am Ende habe ich entschieden aufzuhören und mich auf andere Projekte zu konzentrieren, aber die Erfahrung prägt bis heute, wie ich an neue Ideen herangehe.',
        es: 'Ya no está activo. Construí Internly como una plataforma para conectar estudiantes con prácticas y aprendí muchísimo en el camino: sobre producto, crecimiento, marketing y lo que realmente cuesta lanzar algo. Al final decidí parar y centrarme en otros proyectos, pero la experiencia marcó cómo enfoco hoy todo lo que construyo.'
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
      title: {
        en: 'Florian Klostermann – Social Media Support',
        de: 'Florian Klostermann – Social Media Unterstützung',
        es: 'Florian Klostermann – Apoyo en Redes Sociales'
      },
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
      title: {
        en: 'Kebab Bros – Social Media Presence',
        de: 'Kebab Bros – Social Media Präsenz',
        es: 'Kebab Bros – Presencia en Redes Sociales'
      },
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
      title: {
        en: 'Website Design – Real Estate & Coaching',
        de: 'Website Design – Immobilien & Coaching',
        es: 'Diseño Web – Inmobiliaria y Coaching'
      },
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
                    {t('language') === 'deutsch' ? project.title.de : 
                     t('language') === 'español' ? project.title.es : 
                     project.title.en}
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
