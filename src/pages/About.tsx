
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const About = () => {
  const { theme, t } = useSettings();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-teal-300 via-teal-400 to-teal-600',
        titleBar: 'bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800',
        windowContent: 'bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400',
        text: 'text-teal-900',
        link: 'text-teal-800 hover:text-teal-900',
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
          'Hi, ich bin Henri – ein kreativer Kopf mit einem Faible dafür, Ideen lebendig werden zu lassen.',
          'Ob Videoschnitt, Fotografie, digitales Design oder die Planung ganzer Content-Strategien – ich liebe es, Erlebnisse zu schaffen, die berühren, Sinn ergeben und ein bisschen aus der Reihe tanzen.',
          'Ich passe in keine feste Schublade. Mal bin ich voll im kreativen Flow, mal tief in strategischem Denken. Ich mag es, Projekte von Anfang bis Ende zu begleiten – von der ersten Idee bis zum Feinschliff. Dabei geht es mir nicht nur ums schöne Bild, sondern auch um Wirkung, Atmosphäre und Emotion.',
          'Was mich ausmacht? Ich kann vieles – aber vor allem kann ich verbinden: Menschen, Themen, Bilder und Geschichten. Ich erzähle gerne visuell, denke in Stimmungen und Details, und arbeite genauso gern eigenständig wie im Team. Ich bin inspiriert von Kontrasten – zwischen digital und analog, alter Schule und modernen Tools. Ich jage keine Trends. Ich schaffe Räume, die widerspiegeln, was sich für mich wahr anfühlt, und ich lerne gerne durch Handeln, nicht durch Warten auf Erlaubnis.',
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
    } else if (t('language') === 'español') {
      return {
        title: 'Un Paseo por Mi Mente',
        paragraphs: [
          'Hola, soy Henri – una mente creativa con pasión por dar vida a las ideas.',
          'Ya sea editando videos, capturando momentos a través de la fotografía, diseñando espacios digitales o planeando estrategias completas de contenido – amo crear experiencias que resuenen, tengan sentido y destaquen a su manera.',
          'No encajo perfectamente en una sola categoría. A veces estoy profundamente en flujo creativo, otras veces estoy completamente enfocado en estrategia. Disfruto trabajar en proyectos desde la primera chispa hasta el pulido final – no solo las imágenes, sino también el impacto, el ambiente y la emoción detrás de ellos.',
          '¿Qué me define? Conecto cosas – personas, ideas, imágenes e historias. Pienso visualmente, siento en atmósferas y detalles, y trabajo tan bien por mi cuenta como en equipo. La colaboración me energiza, y amo aprender de otros.',
          'Me inspiran los contrastes – entre analógico y digital, métodos de la vieja escuela y herramientas modernas. No persigo tendencias. Construyo espacios que se sienten auténticos para mí. Y creo en aprender haciendo, no esperando permiso.',
          'Esta página refleja cómo pienso: curioso, práctico y siempre evolucionando.'
        ],
        freeTimeTitle: 'Qué Hago en Mi Tiempo Libre',
        freeTimeParagraphs: [
          'Fuera de editar, diseñar y construir proyectos, paso la mayor parte de mi tiempo explorando. Amo el ciclismo de larga distancia – ya sea solo un paseo por la naturaleza o un tour nocturno espontáneo en mi bicicleta de carrera. También disfruto la fotografía, filmando pequeños momentos, desarrollando ideas creativas y sumergiéndome en proyectos paralelos. Los fines de semana, a menudo me encuentras en mercados de pulgas o afuera con amigos. También colecciono autógrafos raros y cartas coleccionables – incluyendo Pelé, Beckenbauer y Otto Waalkes. Y sí, a veces aún lanzo algunos dardos por diversión.',
          'Pero lo que realmente me impulsa es la aventura. Me he propuesto como meta personal vivir una aventura única cada mes – y documento estas historias en mi canal de vlogs ThisTimeFr. No se trata de visualizaciones – se trata de memorias. Poder mirar atrás algún día y decir: "Esto es lo que hice. Esto es quien fui."',
          'En enero, hice un viaje de 24 horas a París – salí de Düsseldorf a las 10 PM, llegué a las 6 AM. Estaba lluvioso, tormentoso, helado – e inolvidable. En febrero, volé a Faro, Portugal por un fin de semana – mi primer vuelo sin padres. Marzo fue una visita a Egmond aan Zee, un lugar lleno de memorias de la infancia. En abril, pasé 3 semanas en Mallorca, viviendo solo en un nuevo país, trabajando en bienes raíces y mejorando mi español.',
          '¿Y en mayo? Salí por la noche en mi bicicleta con la idea de ir a Ámsterdam – un viaje redondo de 400 km. No llegué hasta allá, pero sí pedalee 200 km. Vi el amanecer neblinoso más surrealista en el camino. Me enseñó algo importante: a veces solo tienes que empezar. No necesitas tener todo resuelto – solo el valor para comenzar. Así es como aprendes quién realmente eres. Así es como vivo.'
        ]
      };
    }
    
    return {
      title: 'A Walk Through My Brain',
      paragraphs: [
        "Hey, I'm Henri – a creative mind with a passion for bringing ideas to life.",
        "Whether it's editing videos, capturing moments through photography, designing digital spaces or mapping out full content strategies – I love creating experiences that resonate, make sense, and stand out in their own way.",
        "I don't fit neatly into one box. Sometimes I'm deep in creative flow, other times I'm fully focused on strategy. I enjoy working on projects from the very first spark to the final polish – not just the visuals, but also the impact, the mood, and the emotion behind them.",
        "What defines me? I connect things – people, ideas, images, and stories. I think visually, I feel in atmospheres and details, and I work just as well on my own as I do in a team. Collaboration energizes me, and I love learning from others.",
        "I'm inspired by contrasts – between analog and digital, old-school methods and modern tools. I don't chase trends. I build spaces that feel true to me. And I believe in learning by doing, not by waiting for permission.",
        "This page reflects how I think: curious, hands-on, and always evolving."
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
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-teal' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('About')}</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-start">
            <h1 className={`text-2xl sm:text-4xl mb-6 font-pixel drop-shadow-lg self-start ${styles.text}`}>[ {t('A Walk Through My Brain')} ]</h1>
            
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
            <h2 className={`text-xl sm:text-3xl mt-8 mb-6 font-pixel drop-shadow-lg self-start ${styles.text}`}>[ {aboutContent.freeTimeTitle} ]</h2>
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
