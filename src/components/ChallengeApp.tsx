import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ChallengeAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const challenges = [
  "Schreib 3 neue Ideen auf 💡",
  "Mach 10 Liegestütze 💪",
  "Sag einem Freund etwas Nettes 💝",
  "Trinke ein großes Glas Wasser 💧",
  "Atme 5 mal tief ein und aus 🫁",
  "Schau 1 Minute aus dem Fenster 🪟",
  "Strecke dich für 1 Minute 🤸‍♂️",
  "Schreibe eine positive Affirmation auf ✨",
  "Mach ein Foto von etwas Schönem 📸",
  "Höre deinen Lieblingssong 🎵",
  "Sortiere deinen Arbeitsplatz 📋",
  "Lächle bewusst für 30 Sekunden 😊",
  "Plane eine kleine Abenteuer-Aktivität 🗺️",
  "Denke an 3 Dinge, für die du dankbar bist 🙏",
  "Mach eine Minute lang Jumping Jacks 🏃‍♂️",
];

const ChallengeApp: React.FC<ChallengeAppProps> = ({ isOpen, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const getRandomChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  const startChallenge = () => {
    const challenge = getRandomChallenge();
    setCurrentChallenge(challenge);
    setIsActive(true);
    setTimeLeft(60);
    setIsCompleted(false);
    toast({
      title: "Challenge Started! 🚀",
      description: challenge,
    });
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
      title: "Challenge Complete! 🎉",
      description: "Great job! You're building amazing habits!",
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-800">1-Minute Challenge</h2>
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
                Bereit für deine tägliche Mini-Challenge?
              </h3>
              <p className="text-sm text-gray-500">
                Kurze Aufgaben für mehr Fokus und Abwechslung im Alltag
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
                  Deine Challenge:
                </h3>
                <p className="text-gray-600">{currentChallenge}</p>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-lg font-medium text-green-700">
                Challenge abgeschlossen!
              </h3>
              <p className="text-sm text-gray-600">
                Du baust großartige Gewohnheiten auf! 💪
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
                Challenge starten
              </Button>
            )}

            {currentChallenge && !isCompleted && (
              <>
                <Button 
                  onClick={completeChallenge}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  Erledigt! ✅
                </Button>
                <Button 
                  onClick={resetChallenge}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </>
            )}

            {isCompleted && (
              <Button 
                onClick={startChallenge}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                <Play className="w-4 h-4" />
                Neue Challenge
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChallengeApp;