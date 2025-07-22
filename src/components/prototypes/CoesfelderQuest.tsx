import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Gift, Star, Timer, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  reward: string;
  completed: boolean;
  hint: string;
}

interface UserStats {
  completedQuests: number;
  totalPoints: number;
  rank: string;
}

export default function CoesfelderQuest() {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    completedQuests: 3,
    totalPoints: 150,
    rank: 'Stadtentdecker'
  });
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const quests: Quest[] = [
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
      title: `Quest gestartet: ${quest.title}`,
      description: "Viel Erfolg bei deiner Mission!"
    });
  };

  const completeQuest = () => {
    if (!currentQuest) return;
    
    toast({
      title: "Quest abgeschlossen! 🎉",
      description: `Du hast ${currentQuest.reward} erhalten!`
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
    switch (difficulty) {
      case 'Einfach': return 'bg-green-500';
      case 'Mittel': return 'bg-yellow-500';
      case 'Schwer': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-yellow-900">
            Coesfeld Quest
          </h1>
        </div>
        <p className="text-lg text-yellow-700 max-w-2xl mx-auto">
          Entdecke Coesfeld auf eine völlig neue Art! Löse Rätsel, finde versteckte Orte 
          und sammle Belohnungen bei lokalen Partnern.
        </p>
      </div>

      {/* User Stats */}
      <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Trophy className="h-6 w-6 text-yellow-700 mx-auto" />
              <p className="text-sm text-yellow-700">Rang</p>
              <p className="font-semibold text-yellow-900">{userStats.rank}</p>
            </div>
            <div className="space-y-2">
              <Star className="h-6 w-6 text-yellow-700 mx-auto" />
              <p className="text-sm text-yellow-700">Punkte</p>
              <p className="font-semibold text-yellow-900">{userStats.totalPoints}</p>
            </div>
            <div className="space-y-2">
              <Users className="h-6 w-6 text-yellow-700 mx-auto" />
              <p className="text-sm text-yellow-700">Quests</p>
              <p className="font-semibold text-yellow-900">{userStats.completedQuests}/{quests.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Quest */}
      {currentQuest && (
        <Card className="bg-yellow-50 border-yellow-200 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Aktuelle Quest
              </CardTitle>
              <Badge className={`${getDifficultyColor(currentQuest.difficulty)} text-white`}>
                {currentQuest.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-yellow-900 text-lg">{currentQuest.title}</h3>
              <p className="text-yellow-700 mt-2">{currentQuest.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-yellow-700">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{currentQuest.location}</span>
            </div>

            <div className="flex items-center gap-2 text-yellow-700">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">{currentQuest.reward}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="flex-1 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
              >
                {showHint ? 'Hinweis verstecken' : 'Hinweis anzeigen'}
              </Button>
              <Button 
                onClick={completeQuest}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Quest abschließen
              </Button>
            </div>

            {showHint && (
              <Card className="bg-yellow-100 border-yellow-300">
                <CardContent className="pt-4">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Hinweis:</strong> {currentQuest.hint}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quest List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-900">Alle Quests</h2>
        <div className="grid gap-4">
          {quests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`${quest.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} 
                         ${currentQuest?.id === quest.id ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${quest.completed ? 'text-green-900' : 'text-yellow-900'} flex items-center gap-2`}>
                    {quest.completed && <Star className="h-5 w-5 text-green-600 fill-current" />}
                    {quest.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={`${getDifficultyColor(quest.difficulty)} text-white`}>
                      {quest.difficulty}
                    </Badge>
                    {quest.completed && (
                      <Badge className="bg-green-500 text-white">
                        Abgeschlossen
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className={quest.completed ? 'text-green-700' : 'text-yellow-700'}>
                  {quest.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 ${quest.completed ? 'text-green-700' : 'text-yellow-700'}`}>
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{quest.location}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${quest.completed ? 'text-green-700' : 'text-yellow-700'}`}>
                      <Gift className="h-4 w-4" />
                      <span className="text-sm">{quest.reward}</span>
                    </div>
                  </div>
                  {!quest.completed && currentQuest?.id !== quest.id && (
                    <Button 
                      onClick={() => startQuest(quest)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                    >
                      Starten
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!currentQuest && userStats.completedQuests === quests.length && (
        <Card className="bg-gradient-to-r from-green-100 to-yellow-100 border-green-300">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto" />
              <h3 className="text-xl font-bold text-yellow-900">
                Glückwunsch! Du bist ein wahrer Coesfeld-Experte! 🎉
              </h3>
              <p className="text-yellow-700">
                Du hast alle verfügbaren Quests abgeschlossen. Neue Abenteuer kommen bald!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}