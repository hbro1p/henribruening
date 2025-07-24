import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from '@/hooks/use-toast';

const getChallenges = (language: string) => {
  if (language === 'deutsch') {
    return [
      // Kreativität & Ideen (1 Minute)
      "Schreib 3 neue Ideen auf 💡",
      "Zeichne 1 Minute lang etwas Abstraktes ✏️",
      "Erfinde eine Geschichte in 3 Sätzen 📖",
      "Mach 3 Fotos aus verschiedenen Winkeln 📷",
      "Schreibe ein Haiku über deine Stimmung 🌸",
      "Summe eine Melodie für 1 Minute 🎼",
      "Skizziere ein einfaches Logo-Konzept 🎨",
      
      // Körper & Gesundheit (1 Minute)
      "Mach 10 Liegestütze 💪",
      "Trinke ein großes Glas Wasser 💧",
      "Atme 10 mal tief ein und aus 🫁",
      "Strecke dich für 1 Minute 🤸‍♂️",
      "Mach Jumping Jacks für 1 Minute 🏃‍♂️",
      "Geh auf der Stelle für 1 Minute 🚶‍♂️",
      "Mach 15 Kniebeugen 🦵",
      "Massiere deine Schultern für 1 Minute 👐",
      "Rolle deine Handgelenke 10 mal in jede Richtung 🔄",
      
      // Sozial & Beziehungen (1 Minute)
      "Schreibe eine kurze Dankesnachricht 💝",
      "Denke an 3 Menschen, die dir wichtig sind 🙏",
      "Schreibe ein Kompliment auf einen Zettel 😊",
      "Plane, wem du heute etwas Nettes sagen willst ✨",
      
      // Achtsamkeit & Reflexion (1 Minute)
      "Schau 1 Minute aus dem Fenster 🪟",
      "Lächle bewusst für 1 Minute 😊",
      "Denke an 5 Dinge, für die du dankbar bist 🙏",
      "Schreibe eine positive Affirmation auf ✨",
      "Schließe die Augen und höre bewusst zu 👂",
      "Beobachte deinen Atem für 1 Minute 🧘‍♀️",
      "Zähle 10 Dinge, die du gerade siehst 👀",
      
      // Produktivität & Organisation (1 Minute)
      "Räume deinen Schreibtisch auf 📋",
      "Lösche 5 alte Dateien vom Desktop 🗑️",
      "Schreibe 3 Ziele für heute auf 📅",
      "Sortiere deine letzten 10 Fotos 📁",
      "Organisiere deinen Browser-Tab 🌐",
      
      // Bewegung & Koordination (1 Minute)
      "Jongliere mit 2 Bällen (oder versuche es) 🤹‍♂️",
      "Schreibe deinen Namen mit der schwächeren Hand ✍️",
      "Balanciere auf einem Bein für 30 Sekunden pro Bein 🦶",
      "Mach 20 schnelle Hampelmänner 🏃‍♀️",
      "Zeichne Kreise in die Luft mit beiden Armen 🔄",
      
      // Kreativität & Ausdruck (1 Minute)
      "Höre einen Song und bewege dich dazu 🎵",
      "Mach 5 verschiedene Gesichtsausdrücke im Spiegel 😮",
      "Erfinde einen lustigen neuen Tanz-Move 💃",
      "Singe laut für 1 Minute 🎤",
      "Zeichne deine Stimmung als Form oder Farbe 🎨",
      
      // Mental & Logik (1 Minute)
      "Zähle rückwärts von 50 in 3er-Schritten 🔢",
      "Nenne 10 Tiere mit dem Buchstaben 'S' 🐍",
      "Denke an 5 Verwendungen für einen Löffel 🥄",
      "Buchstabiere deinen Namen rückwärts 🔤",
      "Zähle alle blauen Gegenstände in deiner Nähe 🔵",
      
      // Sinnliche Erfahrungen (1 Minute)
      "Rieche bewusst 3 verschiedene Düfte 👃",
      "Taste verschiedene Oberflächen ab 👋",
      "Höre genau hin: Was hörst du alles? 👂",
      "Schaue dir deine Hände genau an 🖐️",
      "Schmecke bewusst etwas, was du gerade isst/trinkst 👅"
    ];
  } else {
    return [
      // Creativity & Ideas (1 Minute)
      "Write down 3 new ideas 💡",
      "Draw something abstract for 1 minute ✏️",
      "Invent a story in 3 sentences 📖",
      "Take 3 photos from different angles 📷",
      "Write a haiku about your mood 🌸",
      "Hum a melody for 1 minute 🎼",
      "Sketch a simple logo concept 🎨",
      
      // Body & Health (1 Minute)
      "Do 10 push-ups 💪",
      "Drink a large glass of water 💧",
      "Take 10 deep breaths 🫁",
      "Stretch for 1 minute 🤸‍♂️",
      "Do jumping jacks for 1 minute 🏃‍♂️",
      "March in place for 1 minute 🚶‍♂️",
      "Do 15 squats 🦵",
      "Massage your shoulders for 1 minute 👐",
      "Roll your wrists 10 times each direction 🔄",
      
      // Social & Relationships (1 Minute)
      "Write a short thank you message 💝",
      "Think of 3 people who are important to you 🙏",
      "Write a compliment on a piece of paper 😊",
      "Plan who you want to say something nice to today ✨",
      
      // Mindfulness & Reflection (1 Minute)
      "Look out the window for 1 minute 🪟",
      "Smile consciously for 1 minute 😊",
      "Think of 5 things you're grateful for 🙏",
      "Write down a positive affirmation ✨",
      "Close your eyes and listen consciously 👂",
      "Observe your breath for 1 minute 🧘‍♀️",
      "Count 10 things you can see right now 👀",
      
      // Productivity & Organization (1 Minute)
      "Clean up your desk 📋",
      "Delete 5 old files from your desktop 🗑️",
      "Write down 3 goals for today 📅",
      "Organize your last 10 photos 📁",
      "Close unnecessary browser tabs 🌐",
      
      // Movement & Coordination (1 Minute)
      "Juggle with 2 balls (or try to) 🤹‍♂️",
      "Write your name with your weaker hand ✍️",
      "Balance on one leg for 30 seconds each 🦶",
      "Do 20 quick jumping jacks 🏃‍♀️",
      "Draw circles in the air with both arms 🔄",
      
      // Creativity & Expression (1 Minute)
      "Listen to a song and move to it 🎵",
      "Make 5 different facial expressions in the mirror 😮",
      "Invent a funny new dance move 💃",
      "Sing out loud for 1 minute 🎤",
      "Draw your mood as a shape or color 🎨",
      
      // Mental & Logic (1 Minute)
      "Count backwards from 50 in steps of 3 🔢",
      "Name 10 animals starting with 'S' 🐍",
      "Think of 5 uses for a spoon 🥄",
      "Spell your name backwards 🔤",
      "Count all blue objects near you 🔵",
      
      // Sensory Experiences (1 Minute)
      "Consciously smell 3 different scents 👃",
      "Feel different textures around you 👋",
      "Listen carefully: What can you hear? 👂",
      "Look closely at your hands 🖐️",
      "Taste something you're eating/drinking mindfully 👅"
    ];
  }
};

const Challenges = () => {
  const { t, language, theme } = useSettings();
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
        titleBar: 'bg-gradient-to-r from-yellow-600 via-yellow-700 to-orange-700',
        windowContent: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400',
        text: 'text-yellow-900',
        link: 'text-yellow-800 hover:text-yellow-900',
        button: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 text-white',
        cardBg: 'bg-yellow-50 border-yellow-600',
        progressBg: 'bg-yellow-900/20',
        progressBar: 'bg-gradient-to-r from-yellow-400 to-amber-500'
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-blue-800 hover:text-blue-900',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      cardBg: 'bg-white border-black',
      progressBg: 'bg-gray-700/30',
      progressBar: 'bg-gradient-to-r from-blue-400 to-blue-500'
    };
  };

  const styles = getWindowStyles();

  const getRandomChallenge = () => {
    const challenges = getChallenges(language);
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  const startChallenge = () => {
    const challenge = getRandomChallenge();
    setCurrentChallenge(challenge);
    setIsActive(true);
    setTimeLeft(60);
    setIsCompleted(false);
  };

  const resetChallenge = () => {
    setIsActive(false);
    setTimeLeft(60);
    setIsCompleted(false);
    setCurrentChallenge('');
  };

  const completeChallenge = () => {
    setIsActive(false);
    setIsCompleted(true);
    toast({
      title: t('Challenge completed!'),
      description: t('You\'re building great habits!') + ' 💪',
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeChallenge();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-yellow' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Challenges.exe</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('1-Minute Challenge')} ]</h1>
            
            <div className="w-full max-w-2xl space-y-6">
              {!currentChallenge && !isCompleted && (
                <div className="space-y-4">
                  <div className="text-6xl">⏱️</div>
                  <h3 className={`text-lg font-medium font-pixel ${styles.text}`}>
                    {t('Ready for your daily mini-challenge?')}
                  </h3>
                  <p className={`text-sm font-pixel ${styles.text}`}>
                    {t('Short tasks for more focus and variety in everyday life')}
                  </p>
                </div>
              )}

              {currentChallenge && !isCompleted && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className={`text-4xl font-bold ${styles.text} mb-2 font-pixel`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className={`w-full ${styles.progressBg} rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${styles.progressBar}`}
                        style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-2 ${styles.cardBg}`}>
                    <h3 className={`text-lg font-medium ${styles.text} mb-2 font-pixel`}>
                      {t('Your Challenge:')}
                    </h3>
                    <p className={`${styles.text} font-pixel`}>{currentChallenge}</p>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className={`text-lg font-medium ${styles.text} font-pixel`}>
                    {t('Challenge completed!')}
                  </h3>
                  <p className={`text-sm ${styles.text} font-pixel`}>
                    {t('You\'re building great habits!')} 💪
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                {!currentChallenge && !isCompleted && (
                  <button 
                    onClick={startChallenge}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${styles.button}`}
                  >
                    <Play className="w-4 h-4" />
                    {t('Start Challenge')}
                  </button>
                )}

                {currentChallenge && !isCompleted && (
                  <>
                    <button 
                      onClick={completeChallenge}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${styles.button}`}
                    >
                      {t('Done!')} ✅
                    </button>
                    <button 
                      onClick={resetChallenge}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 ${styles.cardBg} ${styles.text} hover:bg-yellow-400/10 transition-all duration-300 font-pixel`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('Reset')}
                    </button>
                  </>
                )}

                {isCompleted && (
                  <button 
                    onClick={startChallenge}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${styles.button}`}
                  >
                    <Play className="w-4 h-4" />
                    {t('New Challenge')}
                  </button>
                )}
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

export default Challenges;