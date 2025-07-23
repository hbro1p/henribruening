import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from '@/hooks/use-toast';
import { useAppTheme } from '@/components/shared/AppColorSystem';

interface ChallengeAppProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const ChallengeApp: React.FC<ChallengeAppProps> = ({ isOpen, onClose }) => {
  const { t, language } = useSettings();
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);

  // Use yellow color for Challenge app
  const styles = useAppTheme('yellow');

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${styles.background}`}>
      <Card className={`w-full max-w-md mx-4 max-h-[90vh] p-6 ${styles.container}`}>
        <div className="h-full overflow-y-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${styles.accent}`} />
            <h2 className={`text-xl font-bold ${styles.text}`}>{t('1-Minute Challenge')}</h2>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className={`${styles.subText} hover:bg-gray-100/10`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {!currentChallenge && !isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-6xl">⏱️</div>
              <h3 className={`text-lg font-medium ${styles.text}`}>
                {t('Ready for your daily mini-challenge?')}
              </h3>
              <p className={`text-sm ${styles.subText}`}>
                {t('Short tasks for more focus and variety in everyday life')}
              </p>
            </div>
          )}

          {currentChallenge && !isCompleted && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className={`text-4xl font-bold ${styles.accent} mb-2`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000 bg-gradient-to-r from-yellow-400 to-amber-500"
                    style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${styles.card}`}>
                <h3 className={`text-lg font-medium ${styles.text} mb-2`}>
                  {t('Your Challenge:')}
                </h3>
                <p className={styles.subText}>{currentChallenge}</p>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className={`text-lg font-medium ${styles.text}`}>
                {t('Challenge completed!')}
              </h3>
              <p className={`text-sm ${styles.subText}`}>
                {t('You\'re building great habits!')} 💪
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {!currentChallenge && !isCompleted && (
              <Button 
                onClick={startChallenge}
                className={`flex items-center gap-2 ${styles.button} transition-all duration-300 hover:scale-105`}
              >
                <Play className="w-4 h-4" />
                {t('Start Challenge')}
              </Button>
            )}

            {currentChallenge && !isCompleted && (
              <>
                <Button 
                  onClick={completeChallenge}
                  className={`flex items-center gap-2 ${styles.button} transition-all duration-300 hover:scale-105`}
                >
                  {t('Done!')} ✅
                </Button>
                <Button 
                  onClick={resetChallenge}
                  variant="outline"
                  className={`flex items-center gap-2 border-2 ${styles.border} ${styles.text} hover:bg-yellow-400/10 transition-all duration-300`}
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('Reset')}
                </Button>
              </>
            )}

            {isCompleted && (
              <Button 
                onClick={startChallenge}
                className={`flex items-center gap-2 ${styles.button} transition-all duration-300 hover:scale-105`}
              >
                <Play className="w-4 h-4" />
                {t('New Challenge')}
              </Button>
            )}
          </div>
        </div>
        </div> {/* End scrollable content */}
      </Card>
    </div>
  );
};

export default ChallengeApp;