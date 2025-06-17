
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const About = () => {
  const { theme, t } = useSettings();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
        text: 'text-blue-900',
        link: 'text-blue-800 hover:text-blue-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-green-600 via-green-700 to-green-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-green-400 hover:text-green-300',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-orange-800 hover:text-orange-900',
    };
  };

  const styles = getWindowStyles();

  const getAboutText = () => {
    if (t('language') === 'deutsch') {
      return {
        title: 'Ein Spaziergang durch mein Gehirn',
        paragraphs: [
          'Ich bin Henri – ein 17-jähriger Kreativer mit einer Leidenschaft dafür, Ideen in echte, visuelle Erfahrungen zu verwandeln. Ob durch Videobearbeitung, Fotografie, das Gestalten digitaler Räume oder die Planung ganzer Content-Flows – ich liebe es, Dinge zu schaffen, die intentional, emotional und ein wenig anders sind.',
          'Ich bin nicht jemand, der in einer Spur bleibt. Ich bewege mich zwischen Visuellem und Strategie, zwischen Intuition und Struktur. Ich genieße es, Projekte von Anfang bis Ende zu bearbeiten – nicht nur den kreativen Funken, sondern auch die Bearbeitung, die Planung und den finalen Schliff.',
          'Meine Fähigkeiten sind breit gefächert, aber sie laufen alle auf eines hinaus: Dinge zu schaffen, die verbinden. Ich weiß, wie man eine Geschichte erzählt, wie man Atmosphäre durch Ton und Visuals aufbaut und wie man die Details hinter den Kulissen verwaltet. Ich arbeite gerne selbstständig, wenn nötig, aber ich liebe auch die Zusammenarbeit – Ideen austauschen, gemeinsam aufbauen und von anderen lernen.',
          'Ich bin inspiriert von Kontrasten – zwischen digital und analog, alter Schule und modernen Tools. Ich jage keine Trends. Ich schaffe Räume, die widerspiegeln, was sich für mich wahr anfühlt, und ich lerne gerne durch Handeln, nicht durch Warten auf Erlaubnis.',
          'Diese Seite ist ein Spiegelbild davon, wie ich denke: neugierig, praktisch und immer in Entwicklung.'
        ]
      };
    }
    
    return {
      title: 'A Walk Through My Brain',
      paragraphs: [
        'I\'m Henri – a 17-year-old creative with a passion for turning ideas into real, visual experiences. Whether it\'s through editing videos, taking photos, designing digital spaces, or planning entire content flows, I love making things that feel intentional, emotional, and a little different.',
        'I\'m not someone who sticks to one lane. I move between visuals and strategy, between intuition and structure. I enjoy working on projects from start to finish – not just the creative spark, but also the editing, the planning, and the final polish.',
        'My skills are broad, but they all come down to one thing: creating things that connect. I know how to tell a story, how to build atmosphere through sound and visuals, and how to manage the details behind the scenes. I enjoy working independently when needed, but I also love collaborating – bouncing ideas, building together, and learning from others.',
        'I\'m inspired by contrast – between digital and analog, old-school energy and modern tools. I don\'t chase trends. I create spaces that reflect what feels true to me, and I enjoy learning by doing, not waiting for permission.',
        'This site is a reflection of how I think: curious, hands-on, and always evolving.'
      ]
    };
  };

  const aboutContent = getAboutText();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-3xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">About.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-start">
            <h1 className={`text-4xl mb-6 font-pixel drop-shadow-lg self-start ${styles.text}`}>[ {aboutContent.title} ]</h1>
            <div className={`space-y-4 text-lg text-left ${styles.text}`}>
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index} className="drop-shadow-sm">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors font-pixel drop-shadow-sm self-start ${styles.link}`}>
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
