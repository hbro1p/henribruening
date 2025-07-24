
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
    
    if (theme === 'adventure-canyon') {
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
          'Ich bin Henri – ein Kreativer mit einer Leidenschaft dafür, Ideen in echte, visuelle Erfahrungen zu verwandeln. Ob durch Videobearbeitung, Fotografie, das Gestalten digitaler Räume oder die Planung ganzer Content-Flows – ich liebe es, Dinge zu schaffen, die intentional, emotional und ein wenig anders sind.',
          'Ich bin nicht jemand, der in einer Spur bleibt. Ich bewege mich zwischen Visuellem und Strategie, zwischen Intuition und Struktur. Ich genieße es, Projekte von Anfang bis Ende zu bearbeiten – nicht nur den kreativen Funken, sondern auch die Bearbeitung, die Planung und den finalen Schliff.',
          'Meine Fähigkeiten sind breit gefächert, aber sie laufen alle auf eines hinaus: Dinge zu schaffen, die verbinden. Ich weiß, wie man eine Geschichte erzählt, wie man Atmosphäre durch Ton und Visuals aufbaut und wie man die Details hinter den Kulissen verwaltet. Ich arbeite gerne selbstständig, wenn nötig, aber ich liebe auch die Zusammenarbeit – Ideen austauschen, gemeinsam aufbauen und von anderen lernen.',
          'Ich bin inspiriert von Kontrasten – zwischen digital und analog, alter Schule und modernen Tools. Ich jage keine Trends. Ich schaffe Räume, die widerspiegeln, was sich für mich wahr anfühlt, und ich lerne gerne durch Handeln, nicht durch Warten auf Erlaubnis.',
          'Diese Seite ist ein Spiegelbild davon, wie ich denke: neugierig, praktisch und immer in Entwicklung.'
        ],
        freeTimeTitle: 'Was ich in meiner Freizeit mache',
        freeTimeParagraphs: [
          'Abseits von Bearbeitung, Design und Projektarbeit verbringe ich die meiste Zeit mit Erkunden. Ich liebe Langstrecken-Radfahren – sei es eine Fahrt durch die Natur oder eine spontane Nachttour mit meinem Rennrad. Außerdem fotografiere ich gerne, filme kleine Momente, entwickle kreative Ideen und tauche in Nebenprojekte ein. An Wochenenden findet man mich oft auf Flohmärkten oder draußen mit Freunden. Ich sammle auch seltene Autogramme und Sammelkarten – darunter Pelé, Beckenbauer und Otto Waalkes. Und ja, manchmal werfe ich immer noch ein paar Darts zum Spaß.',
          'Aber was mich wirklich antreibt, ist Abenteuer. Ich habe mir zum Ziel gesetzt, jeden einzelnen Monat ein einzigartiges Abenteuer zu erleben – und ich dokumentiere diese Geschichten auf meinem Vlog-Kanal ThisTimeFr. Es geht nicht um Views – es geht um Erinnerungen. Eines Tages zurückblicken zu können und zu sagen: "Das habe ich gemacht. Das war ich."',
          'Im Januar machte ich eine 24-Stunden-Reise nach Paris – verließ Düsseldorf um 22 Uhr, kam um 6 Uhr an. Es war regnerisch, stürmisch, eisig – und unvergesslich. Im Februar flog ich für ein Wochenende nach Faro, Portugal – mein erster Flug ohne Eltern. März war ein Besuch in Egmond aan Zee, ein Ort voller Kindheitserinnerungen. Im April verbrachte ich 3 Wochen in Mallorca, lebte allein in einem neuen Land, arbeitete in der Immobilienbranche und verbesserte mein Spanisch.',
          'Und im Mai? Ich fuhr nachts mit dem Rad los mit der Idee, nach Amsterdam zu fahren – eine 400 km Rundfahrt. Ich schaffte es nicht ganz, aber ich radelte 200 km. Ich sah den surreal nebligen Sonnenaufgang unterwegs. Es lehrte mich etwas Wichtiges: manchmal muss man einfach anfangen. Man muss nicht alles durchdacht haben – nur den Mut zu beginnen. So lernt man, wer man wirklich ist. Danach lebe ich.'
        ]
      };
    }
    
    return {
      title: 'A Walk Through My Brain',
      paragraphs: [
        'I\'m Henri – a creative with a passion for turning ideas into real, visual experiences. Whether it\'s through editing videos, taking photos, designing digital spaces, or planning entire content flows, I love making things that feel intentional, emotional, and a little different.',
        'I\'m not someone who sticks to one lane. I move between visuals and strategy, between intuition and structure. I enjoy working on projects from start to finish – not just the creative spark, but also the editing, the planning, and the final polish.',
        'My skills are broad, but they all come down to one thing: creating things that connect. I know how to tell a story, how to build atmosphere through sound and visuals, and how to manage the details behind the scenes. I enjoy working independently when needed, but I also love collaborating – bouncing ideas, building together, and learning from others.',
        'I\'m inspired by contrast – between digital and analog, old-school energy and modern tools. I don\'t chase trends. I create spaces that reflect what feels true to me, and I enjoy learning by doing, not waiting for permission.',
        'This site is a reflection of how I think: curious, hands-on, and always evolving.'
      ],
      freeTimeTitle: 'What I Do in My Free Time',
      freeTimeParagraphs: [
        'Outside of editing, designing, and building projects, I spend most of my time exploring. I love long-distance cycling – whether it\'s just a ride through nature or a spontaneous night tour on my road bike. I also enjoy photography, filming small moments, developing creative ideas, and diving into side projects. On weekends, you\'ll often find me at flea markets or outside with friends. I also collect rare autographs and trading cards – including Pelé, Beckenbauer, and Otto Waalkes. And yes, sometimes I still throw a few darts for fun.',
        'But what really drives me is adventure. I\'ve made it a personal goal to go on one unique adventure every single month – and I document these stories on my vlog channel ThisTimeFr. It\'s not about views – it\'s about memories. Being able to one day look back and say: "This is what I did. This is who I was."',
        'In January, I took a 24-hour trip to Paris – left Düsseldorf at 10 PM, arrived at 6 AM. It was rainy, stormy, freezing – and unforgettable. In February, I flew to Faro, Portugal for a weekend – my first flight without parents. March was a visit to Egmond aan Zee, a place full of childhood memories. In April, I spent 3 weeks in Mallorca, living alone in a new country, working in real estate, and improving my Spanish.',
        'And in May? I left at night on my bike with the idea of riding to Amsterdam – a 400 km round trip. I didn\'t make it all the way there, but I did cycle 200 km. I watched the most surreal foggy sunrise on the way. It taught me something important: sometimes you just have to start. You don\'t need everything figured out – just the courage to begin. That\'s how you learn who you really are. That\'s what I live by.'
      ]
    };
  };

  const aboutContent = getAboutText();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
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
            
            {/* Content with image */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className={`space-y-4 text-lg text-left flex-1 ${styles.text}`}>
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <p key={index} className="drop-shadow-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Image */}
              <div className="flex-shrink-0 lg:w-80">
                <img 
                  src="/lovable-uploads/b3a7242d-f61a-4825-8f49-a55299aecc3e.png" 
                  alt="Henri as a child with his bike" 
                  className="w-full h-auto rounded-lg shadow-lg border-2 border-white/20"
                />
              </div>
            </div>
            
            {/* Free Time Section */}
            <h2 className={`text-3xl mt-8 mb-6 font-pixel drop-shadow-lg self-start ${styles.text}`}>[ {aboutContent.freeTimeTitle} ]</h2>
            <div className={`space-y-4 text-lg text-left ${styles.text}`}>
              {aboutContent.freeTimeParagraphs.map((paragraph, index) => (
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
