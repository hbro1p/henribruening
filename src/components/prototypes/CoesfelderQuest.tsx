import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Gift, Star, Timer, Users, Trophy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer' | 'Easy' | 'Medium' | 'Hard';
  reward: string;
  completed: boolean;
  hint: string;
}

interface UserStats {
  completedQuests: number;
  totalPoints: number;
  rank: string;
}

interface Props {
  language?: string;
}

export default function CoesfelderQuest({ language = 'deutsch' }: Props) {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    completedQuests: 3,
    totalPoints: 150,
    rank: language === 'deutsch' ? 'Stadtentdecker' : 'City Explorer'
  });
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const quests: Quest[] = language === 'deutsch' ? [
    {
      id: '1',
      title: 'Das Geheimnis des Rathauses',
      description: 'Finde das historische Detail am Coesfelder Rathaus, das die meisten Besucher übersehen.',
      location: 'Markt 8, 48653 Coesfeld',
      difficulty: 'Einfach',
      reward: '20 Punkte + Rabatt im Café Central',
      completed: true,
      hint: 'Schau dir die Fassade genau an - es ist etwas Ungewöhnliches in der Architektur versteckt.'
    },
    {
      id: '2',
      title: 'Lamberti-Kirchen Mystery',
      description: 'Löse das Rätsel der Lamberti-Kirche und entdecke ihre verborgene Botschaft.',
      location: 'Lambertikirchplatz, 48653 Coesfeld',
      difficulty: 'Mittel',
      reward: '35 Punkte + Führung im Heimatmuseum',
      completed: true,
      hint: 'Die Antwort liegt in den Fenstern - zähle und kombiniere!'
    },
    {
      id: '3',
      title: 'Stadtpark Schatzsuche',
      description: 'Folge den Hinweisen durch den Stadtpark und finde den versteckten "Schatz".',
      location: 'Stadtpark Coesfeld',
      difficulty: 'Schwer',
      reward: '50 Punkte + Gutschein Buchhandlung Podszun',
      completed: false,
      hint: 'Beginne beim Haupteingang und folge dem Pfad der alten Bäume...'
    },
    {
      id: '4',
      title: 'Wasserburg Expedition',
      description: 'Erkunde die Geheimnisse rund um die Wasserburg und ihre Geschichte.',
      location: 'Wasserburg Haus Stapel',
      difficulty: 'Mittel',
      reward: '40 Punkte + Führung durch die Burg',
      completed: false,
      hint: 'Das Wasser erzählt eine Geschichte - höre genau hin!'
    }
  ] : [
    {
      id: '1',
      title: 'The Town Hall Secret',
      description: 'Find the historical detail at Coesfeld Town Hall that most visitors overlook.',
      location: 'Markt 8, 48653 Coesfeld',
      difficulty: 'Easy',
      reward: '20 Points + Discount at Café Central',
      completed: true,
      hint: 'Look closely at the facade - there\'s something unusual hidden in the architecture.'
    },
    {
      id: '2',
      title: 'Lamberti Church Mystery',
      description: 'Solve the riddle of Lamberti Church and discover its hidden message.',
      location: 'Lambertikirchplatz, 48653 Coesfeld',
      difficulty: 'Medium',
      reward: '35 Points + Tour at Local Museum',
      completed: true,
      hint: 'The answer lies in the windows - count and combine!'
    },
    {
      id: '3',
      title: 'City Park Treasure Hunt',
      description: 'Follow the clues through the city park and find the hidden "treasure".',
      location: 'Stadtpark Coesfeld',
      difficulty: 'Hard',
      reward: '50 Points + Podszun Bookstore Voucher',
      completed: false,
      hint: 'Start at the main entrance and follow the path of the old trees...'
    },
    {
      id: '4',
      title: 'Water Castle Expedition',
      description: 'Explore the secrets around the water castle and its history.',
      location: 'Wasserburg Haus Stapel',
      difficulty: 'Medium',
      reward: '40 Points + Castle Tour',
      completed: false,
      hint: 'The water tells a story - listen carefully!'
    }
  ];

  useEffect(() => {
    // Set first incomplete quest as current
    const nextQuest = quests.find(q => !q.completed);
    if (nextQuest) setCurrentQuest(nextQuest);
  }, []);

  const startQuest = (quest: Quest) => {
    setCurrentQuest(quest);
    setShowHint(false);
    toast({
      title: `${language === 'deutsch' ? 'Quest gestartet:' : 'Quest started:'} ${quest.title}`,
      description: language === 'deutsch' ? "Viel Erfolg bei deiner Mission!" : "Good luck on your mission!"
    });
  };

  const completeQuest = () => {
    if (!currentQuest) return;
    
    toast({
      title: language === 'deutsch' ? "Quest abgeschlossen! 🎉" : "Quest completed! 🎉",
      description: `${language === 'deutsch' ? 'Du hast' : 'You received'} ${currentQuest.reward} ${language === 'deutsch' ? 'erhalten!' : '!'}`
    });

    setUserStats(prev => ({
      ...prev,
      completedQuests: prev.completedQuests + 1,
      totalPoints: prev.totalPoints + parseInt(currentQuest.reward.match(/\d+/)?.[0] || '0')
    }));

    // Find next quest
    const currentIndex = quests.findIndex(q => q.id === currentQuest.id);
    const nextQuest = quests[currentIndex + 1];
    if (nextQuest && !nextQuest.completed) {
      setCurrentQuest(nextQuest);
    } else {
      setCurrentQuest(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Einfach' || difficulty === 'Easy') return 'bg-green-500';
    if (difficulty === 'Mittel' || difficulty === 'Medium') return 'bg-yellow-500';
    if (difficulty === 'Schwer' || difficulty === 'Hard') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Coesfeld Quest
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'deutsch' 
            ? 'Entdecke Coesfeld auf eine völlig neue Art! Löse Rätsel, finde versteckte Orte und sammle Belohnungen bei lokalen Partnern.'
            : 'Discover Coesfeld in a completely new way! Solve puzzles, find hidden places, and collect rewards from local partners.'
          }
        </p>
      </div>

      {/* User Stats */}
      <Card className="ideas-lab-card">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-amber-50 w-fit mx-auto">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {language === 'deutsch' ? 'Rang' : 'Rank'}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{userStats.rank}</p>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-blue-50 w-fit mx-auto">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {language === 'deutsch' ? 'Punkte' : 'Points'}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{userStats.totalPoints}</p>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-green-50 w-fit mx-auto">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Quests</p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{userStats.completedQuests}/{quests.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Quest */}
      {currentQuest && (
        <Card className="ideas-lab-card border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-gray-900 text-lg sm:text-xl">
                  {language === 'deutsch' ? 'Aktuelle Quest' : 'Current Quest'}
                </CardTitle>
              </div>
              <Badge className={`${getDifficultyColor(currentQuest.difficulty)} text-white w-fit`}>
                {currentQuest.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{currentQuest.title}</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{currentQuest.description}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600">{currentQuest.location}</span>
              </div>

              <div className="flex items-start gap-2">
                <Gift className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{currentQuest.reward}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowHint(!showHint)}
                className="ideas-secondary flex-1 text-sm sm:text-base font-medium"
              >
                {showHint ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {language === 'deutsch' ? 'Hinweis verstecken' : 'Hide Hint'}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'deutsch' ? 'Hinweis anzeigen' : 'Show Hint'}
                  </>
                )}
              </Button>
              <Button 
                onClick={completeQuest}
                className="ideas-primary flex-1 text-sm sm:text-base font-medium"
              >
                {language === 'deutsch' ? 'Quest abschließen' : 'Complete Quest'}
              </Button>
            </div>

            {showHint && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-yellow-800 text-xs sm:text-sm">
                    💡 <strong>{language === 'deutsch' ? 'Hinweis:' : 'Hint:'}</strong> {currentQuest.hint}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quest List */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
          {language === 'deutsch' ? 'Alle Quests' : 'All Quests'}
        </h2>
        <div className="grid gap-3 sm:gap-4">
          {quests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`ideas-lab-card transition-all duration-200 ${
                quest.completed ? 'bg-green-50 border-green-200' : ''
              } ${
                currentQuest?.id === quest.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <CardHeader className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {quest.completed && <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 fill-current mt-0.5 flex-shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <CardTitle className={`text-sm sm:text-lg font-semibold ${
                        quest.completed ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {quest.title}
                      </CardTitle>
                      <CardDescription className={`text-xs sm:text-sm mt-1 ${
                        quest.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {quest.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getDifficultyColor(quest.difficulty)} text-white text-xs`}>
                      {quest.difficulty}
                    </Badge>
                    {quest.completed && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {language === 'deutsch' ? 'Abgeschlossen' : 'Completed'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className={`flex items-start gap-2 ${
                      quest.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{quest.location}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${
                      quest.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      <Gift className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">{quest.reward}</span>
                    </div>
                  </div>
                  {!quest.completed && currentQuest?.id !== quest.id && (
                    <Button 
                      onClick={() => startQuest(quest)}
                      className="ideas-secondary text-xs sm:text-sm w-full sm:w-auto"
                    >
                      {language === 'deutsch' ? 'Starten' : 'Start'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {!currentQuest && userStats.completedQuests === quests.length && (
        <Card className="ideas-lab-card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-4">
              <div className="p-3 rounded-full bg-yellow-50 w-fit mx-auto">
                <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {language === 'deutsch' 
                  ? 'Glückwunsch! Du bist ein wahrer Coesfeld-Experte! 🎉'
                  : 'Congratulations! You are a true Coesfeld expert! 🎉'
                }
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {language === 'deutsch'
                  ? 'Du hast alle verfügbaren Quests abgeschlossen. Neue Abenteuer kommen bald!'
                  : 'You have completed all available quests. New adventures coming soon!'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}