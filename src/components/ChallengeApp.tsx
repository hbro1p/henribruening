import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';

interface ChallengeAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const getChallenges = (language: string) => {
  if (language === 'deutsch') {
    return [
      // Kreativität & Ideen
      "Schreib 3 neue Ideen auf 💡",
      "Zeichne 1 Minute lang etwas Abstraktes ✏️",
      "Erfinde eine Geschichte in 3 Sätzen 📖",
      "Mach ein Foto aus einer ungewöhnlichen Perspektive 📷",
      "Schreibe ein Haiku über deine Stimmung 🌸",
      "Komponiere eine 30-Sekunden-Melodie 🎼",
      "Gestalte ein Logo für ein erfundenes Unternehmen 🎨",
      
      // Körper & Gesundheit
      "Mach 10 Liegestütze 💪",
      "Trinke ein großes Glas Wasser 💧",
      "Atme 5 mal tief ein und aus 🫁",
      "Strecke dich für 1 Minute 🤸‍♂️",
      "Mach eine Minute lang Jumping Jacks 🏃‍♂️",
      "Geh 2 Minuten an der frischen Luft spazieren 🚶‍♂️",
      "Mach 15 Kniebeugen 🦵",
      "Massiere deine Schultern 30 Sekunden lang 👐",
      
      // Sozial & Beziehungen
      "Sag einem Freund etwas Nettes 💝",
      "Schreibe eine Dankesnachricht an jemanden 🙏",
      "Rufe ein Familienmitglied für 2 Minuten an 📞",
      "Komplimentiere einen Fremden 😊",
      "Teile einen motivierenden Spruch mit jemandem ✨",
      
      // Achtsamkeit & Reflexion
      "Schau 1 Minute aus dem Fenster 🪟",
      "Lächle bewusst für 30 Sekunden 😊",
      "Denke an 3 Dinge, für die du dankbar bist 🙏",
      "Schreibe eine positive Affirmation auf ✨",
      "Meditiere 1 Minute lang 🧘‍♀️",
      "Beobachte deine Gedanken ohne zu urteilen 🤔",
      
      // Produktivität & Organisation
      "Sortiere deinen Arbeitsplatz 📋",
      "Lösche 5 alte Dateien vom Desktop 🗑️",
      "Plane deine nächsten 3 Stunden 📅",
      "Schreibe 5 Dinge auf, die du heute erledigen willst ✅",
      "Organisiere einen Ordner auf deinem Computer 📁",
      
      // Abenteuer & Exploration
      "Plane eine kleine Abenteuer-Aktivität 🗺️",
      "Recherchiere einen Ort, den du besuchen möchtest 🌍",
      "Lerne 5 Wörter in einer neuen Sprache 🗣️",
      "Schaue dir ein 1-minütiges Tutorial an 🎓",
      "Entdecke einen neuen Musikstil 🎵",
      
      // Unterhaltung & Spaß
      "Höre deinen Lieblingssong 🎵",
      "Tanze 30 Sekunden zu deiner Lieblingsmusik 💃",
      "Mach ein lustiges Selfie 🤳",
      "Erfinde einen neuen Handschlag 🤝",
      "Sing 30 Sekunden unter der Dusche 🚿",
      
      // Herausforderungen & Skills
      "Jongliere mit 3 Gegenständen (oder versuche es) 🤹‍♂️",
      "Schreibe 1 Minute lang mit der schwächeren Hand ✍️",
      "Stehe 1 Minute auf einem Bein 🦶",
      "Zähle rückwärts von 100 in 7er-Schritten 🔢",
      "Mach 10 verschiedene Gesichtsausdrücke 😮",
      
      // Wissen & Lernen
      "Lerne einen interessanten Fakt und teile ihn 🧠",
      "Schaue ein 1-minütiges Erklärvideo 📺",
      "Lese einen kurzen Wikipedia-Artikel 📚",
      "Schreibe 5 Synonyme für das Wort 'schön' auf 📝"
    ];
  } else {
    return [
      // Creativity & Ideas
      "Write down 3 new ideas 💡",
      "Draw something abstract for 1 minute ✏️",
      "Invent a story in 3 sentences 📖",
      "Take a photo from an unusual perspective 📷",
      "Write a haiku about your mood 🌸",
      "Compose a 30-second melody 🎼",
      "Design a logo for an imaginary company 🎨",
      
      // Body & Health
      "Do 10 push-ups 💪",
      "Drink a large glass of water 💧",
      "Take 5 deep breaths 🫁",
      "Stretch for 1 minute 🤸‍♂️",
      "Do jumping jacks for one minute 🏃‍♂️",
      "Take a 2-minute walk outside 🚶‍♂️",
      "Do 15 squats 🦵",
      "Massage your shoulders for 30 seconds 👐",
      
      // Social & Relationships
      "Say something nice to a friend 💝",
      "Write a thank you message to someone 🙏",
      "Call a family member for 2 minutes 📞",
      "Compliment a stranger 😊",
      "Share a motivational quote with someone ✨",
      
      // Mindfulness & Reflection
      "Look out the window for 1 minute 🪟",
      "Smile consciously for 30 seconds 😊",
      "Think of 3 things you're grateful for 🙏",
      "Write down a positive affirmation ✨",
      "Meditate for 1 minute 🧘‍♀️",
      "Observe your thoughts without judging 🤔",
      
      // Productivity & Organization
      "Organize your workspace 📋",
      "Delete 5 old files from your desktop 🗑️",
      "Plan your next 3 hours 📅",
      "Write down 5 things you want to accomplish today ✅",
      "Organize a folder on your computer 📁",
      
      // Adventure & Exploration
      "Plan a small adventure activity 🗺️",
      "Research a place you'd like to visit 🌍",
      "Learn 5 words in a new language 🗣️",
      "Watch a 1-minute tutorial 🎓",
      "Discover a new music genre 🎵",
      
      // Entertainment & Fun
      "Listen to your favorite song 🎵",
      "Dance for 30 seconds to your favorite music 💃",
      "Take a funny selfie 🤳",
      "Invent a new handshake 🤝",
      "Sing for 30 seconds in the shower 🚿",
      
      // Challenges & Skills
      "Juggle with 3 objects (or try to) 🤹‍♂️",
      "Write for 1 minute with your weaker hand ✍️",
      "Stand on one leg for 1 minute 🦶",
      "Count backwards from 100 in steps of 7 🔢",
      "Make 10 different facial expressions 😮",
      
      // Knowledge & Learning
      "Learn an interesting fact and share it 🧠",
      "Watch a 1-minute educational video 📺",
      "Read a short Wikipedia article 📚",
      "Write down 5 synonyms for the word 'beautiful' 📝"
    ];
  }
};

const ChallengeApp: React.FC<ChallengeAppProps> = ({ isOpen, onClose }) => {
  const { t, language } = useSettings();
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-800">{t('1-Minute Challenge')}</h2>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {!currentChallenge && !isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-6xl">⏱️</div>
              <h3 className="text-lg font-medium text-gray-700">
                {t('Ready for your daily mini-challenge?')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('Short tasks for more focus and variety in everyday life')}
              </p>
            </div>
          )}

          {currentChallenge && !isCompleted && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="w-full bg-orange-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t('Your Challenge:')}
                </h3>
                <p className="text-gray-600">{currentChallenge}</p>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-lg font-medium text-green-700">
                {t('Challenge completed!')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('You\'re building great habits!')} 💪
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {!currentChallenge && !isCompleted && (
              <Button 
                onClick={startChallenge}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                <Play className="w-4 h-4" />
                {t('Start Challenge')}
              </Button>
            )}

            {currentChallenge && !isCompleted && (
              <>
                <Button 
                  onClick={completeChallenge}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  {t('Done!')} ✅
                </Button>
                <Button 
                  onClick={resetChallenge}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('Reset')}
                </Button>
              </>
            )}

            {isCompleted && (
              <Button 
                onClick={startChallenge}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                <Play className="w-4 h-4" />
                {t('New Challenge')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChallengeApp;