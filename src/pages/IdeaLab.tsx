import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Play, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/contexts/SettingsContext';
import ViralVideoPromptGenerator from '@/components/prototypes/ViralVideoPromptGenerator';
import CoesfelderQuest from '@/components/prototypes/CoesfelderQuest';
import CareAndShare from '@/components/prototypes/CareAndShare';

interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  prototypeComponent: string;
  ratings: number[];
}

interface UserRating {
  ideaId: string;
  rating: number;
  feedback: string;
}

const IdeaLab = () => {
  const { t, language, theme } = useSettings();
  const [currentView, setCurrentView] = useState<'welcome' | 'list' | 'detail' | 'prototype'>('welcome');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
        text: 'text-blue-900',
        link: 'text-blue-800 hover:text-blue-900',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        cardBg: 'bg-blue-50 border-blue-600',
        accent: 'text-blue-700'
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
      accent: 'text-blue-700'
    };
  };

  const styles = getWindowStyles();

  // Initialize ideas data
  useEffect(() => {
    const initialIdeas: Idea[] = [
      {
        id: '1',
        title: 'Viral Video Prompt Generator',
        shortDescription: 'KI-gestützte Prompts für TikTok, YouTube Shorts und Instagram Reels',
        fullDescription: `Ein intelligenter Generator, der basierend auf aktuellen Trends, Zielgruppe und gewünschtem Stil kreative Video-Prompts erstellt.

Features:
• Trendanalyse und aktuelle Hashtags
• Zielgruppenspezifische Anpassung  
• Genre-Filter (Comedy, Educational, Lifestyle, etc.)
• Template-Bibliothek für verschiedene Formate
• A/B-Testing Vorschläge für Thumbnails
• Optimierung für verschiedene Plattformen`,
        prototypeComponent: 'ViralVideoPromptGenerator',
        ratings: [5, 4, 5, 4, 5]
      },
      {
        id: '2',
        title: 'Coesfelder Quest',
        shortDescription: 'Interaktive Stadtrallye durch Coesfeld mit AR-Elementen',
        fullDescription: `Eine moderne Schnitzeljagd durch die Innenstadt von Coesfeld, die Geschichte, Kultur und lokale Geschäfte miteinander verbindet.

Features:
• GPS-basierte Stationen in der Innenstadt
• Augmented Reality für historische Gebäude
• QR-Code Rätsel an verschiedenen Standorten
• Kooperation mit lokalen Geschäften für Belohnungen
• Multiplayer-Modus für Teams
• Saisonale Events und Themen-Rallyes
• Digitale Badges und Erfolge sammeln`,
        prototypeComponent: 'CoesfelderQuest',
        ratings: [4, 5, 4, 3, 5]
      },
      {
        id: '3',
        title: 'Care&Share',
        shortDescription: 'Die Plattform, die Helfen einfach macht - Helfe & werde geholfen',
        fullDescription: `Eine Nachbarschaftshilfe-Plattform, die Senioren mit hilfsbereiten Menschen in der Umgebung verbindet. Einsamkeit runter, Freude hoch.

Hauptfunktionen:
• Einfache Hilfegesuche für Einkauf, Spaziergang, Haushalt
• Matching-System basierend auf Nähe und Verfügbarkeit
• Verifizierte Helfer mit Bewertungssystem
• Terminkoordination und Status-Tracking
• Integration für Sozialstunden-Leistende

Zusätzliche Ideen:
• Stadt-Gutscheine bei Meilensteinen
• Sozialstunden-Integration für Pflichtstunden
• Gamification mit Helferpunkten
• Community-Events und Nachbarschaftstreffen

Das Motto: Aus Fremden werden Nachbarn, aus Nachbarn werden Freunde.`,
        prototypeComponent: 'CareAndShare',
        ratings: [5, 4, 5, 5, 4]
      }
    ];
    setIdeas(initialIdeas);
  }, [language]);

  // Calculate average rating for an idea
  const getAverageRating = (idea: Idea): number | null => {
    if (idea.ratings.length === 0) return null;
    const sum = idea.ratings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / idea.ratings.length) * 10) / 10;
  };

  const welcomeText = language === 'deutsch' 
    ? 'Willkommen in meinem Ideen-Labor.\n\nHier findest du Konzepte, die ich noch nicht umgesetzt habe – manchmal roh, manchmal fast fertig, aber immer offen für Feedback.\n\nDu kannst jede Idee bewerten und mir mit einem Kommentar weiterhelfen.\n\nWelche Idee findest du gut? Was würdest du anders machen? Sag\'s mir. Deine Meinung zählt.'
    : 'Welcome to my Idea Laboratory.\n\nHere you\'ll find concepts I haven\'t implemented yet – sometimes raw, sometimes almost finished, but always open for feedback.\n\nYou can rate each idea and help me with a comment.\n\nWhich idea do you like? What would you do differently? Tell me. Your opinion matters.';

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1 justify-center sm:justify-start">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 transition-colors duration-200 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:fill-amber-300 hover:text-amber-300 hover:scale-110' : ''}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleSubmitRating = () => {
    if (!selectedIdea || userRating === 0) return;

    // Update the idea's ratings
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === selectedIdea.id) {
        return { ...idea, ratings: [...idea.ratings, userRating] };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    // Save user rating
    const newUserRating: UserRating = {
      ideaId: selectedIdea.id,
      rating: userRating,
      feedback
    };
    setUserRatings([...userRatings, newUserRating]);

    setUserRating(0);
    setFeedback('');
    setCurrentView('list');
  };

  const openPrototype = (idea: Idea) => {
    setSelectedIdea(idea);
    setCurrentView('prototype');
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('Idea Lab')}</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b overflow-y-auto max-h-[calc(90vh-100px)] ${styles.windowContent}`}>
          {/* Navigation */}
          {currentView !== 'welcome' && (
            <div className="mb-6">
              <button
                onClick={() => {
                  if (currentView === 'prototype') {
                    setCurrentView('detail');
                  } else if (currentView === 'detail') {
                    setCurrentView('list');
                    setSelectedIdea(null);
                  } else {
                    setCurrentView('welcome');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${styles.button}`}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('Back')}
              </button>
            </div>
          )}

          {currentView === 'welcome' && (
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Lightbulb className={`h-8 w-8 sm:h-10 sm:w-10 ${styles.accent}`} />
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-pixel drop-shadow-lg ${styles.text} text-center px-2`}>
                  {language === 'deutsch' ? 'Ideen-Labor' : 'Idea Laboratory'}
                </h1>
              </div>
              
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-4xl mx-auto px-4">
                {welcomeText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`${styles.text} leading-relaxed text-base sm:text-lg lg:text-xl font-pixel text-left`}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <button 
                onClick={() => setCurrentView('list')}
                className={`px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-lg font-pixel border-2 border-black/30 transition-all duration-200 transform hover:scale-105 ${styles.button}`}
              >
                {language === 'deutsch' ? 'Ideen entdecken' : 'Discover Ideas'}
              </button>
            </div>
          )}

          {currentView === 'list' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-3 px-4">
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-pixel font-bold ${styles.text}`}>
                  {language === 'deutsch' ? 'Meine Ideen' : 'My Ideas'}
                </h3>
                <p className={`${styles.text} font-pixel text-base sm:text-lg lg:text-xl`}>
                  {language === 'deutsch' 
                    ? 'Entdecke innovative Konzepte und teste funktionsfähige Prototypen'
                    : 'Discover innovative concepts and test functional prototypes'
                  }
                </p>
              </div>
              <div className="text-center space-y-6">
                {ideas.length === 0 ? (
                  <div className="space-y-4">
                    <div className="text-6xl">💭</div>
                    <h4 className={`text-2xl sm:text-3xl font-pixel ${styles.text}`}>
                      {language === 'deutsch' ? 'Noch keine Ideen' : 'No ideas yet'}
                    </h4>
                    <p className={`${styles.text} font-pixel text-lg`}>
                      {language === 'deutsch' 
                        ? 'Hier werden bald neue Ideen auftauchen...' 
                        : 'New ideas will appear here soon...'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4 lg:gap-6 px-2">
                    {ideas.map((idea) => {
                      const avgRating = getAverageRating(idea);
                      return (
                        <div key={idea.id} className={`p-4 sm:p-6 border-2 rounded-lg transition-all duration-200 hover:scale-[1.02] ${styles.cardBg}`}>
                          <div className="flex flex-col gap-4 sm:gap-5">
                            <div className="space-y-3 flex-1">
                              <h4 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl ${styles.text} font-pixel font-semibold leading-tight`}>{idea.title}</h4>
                              <p className={`text-base sm:text-lg lg:text-xl ${styles.text} font-pixel leading-relaxed`}>{idea.shortDescription}</p>
                            </div>
                            {avgRating !== null && (
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex justify-center sm:justify-start">
                                  {renderStars(avgRating)}
                                </div>
                                <p className={`text-sm sm:text-base ${styles.text} font-pixel text-center sm:text-right`}>
                                  {avgRating.toFixed(1)} ({idea.ratings.length} {language === 'deutsch' ? 'Bewertungen' : 'ratings'})
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5">
                            <button 
                              onClick={() => {
                                setSelectedIdea(idea);
                                setCurrentView('detail');
                              }}
                              className={`flex-1 px-4 sm:px-5 py-3 text-base sm:text-lg lg:text-xl font-pixel rounded-lg transition-all duration-200 border-2 ${styles.cardBg} ${styles.text} hover:bg-blue-400/10 border-black/30`}
                            >
                              {language === 'deutsch' ? 'Details ansehen' : 'View Details'}
                            </button>
                            <button 
                              onClick={() => openPrototype(idea)}
                              className={`px-4 sm:px-5 py-3 text-base sm:text-lg lg:text-xl font-pixel rounded-lg transition-all duration-200 transform hover:scale-105 border-2 border-black/30 flex items-center justify-center gap-2 sm:gap-3 ${styles.button}`}
                            >
                              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                              {language === 'deutsch' ? 'Testen' : 'Try'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'prototype' && selectedIdea && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-3">
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-pixel font-bold ${styles.text}`}>
                  {selectedIdea.title}
                </h3>
                <p className={`text-lg sm:text-xl ${styles.text} font-pixel`}>
                  {language === 'deutsch' ? 'Interaktiver Prototyp' : 'Interactive Prototype'}
                </p>
              </div>
              <div className="bg-white rounded-xl border-2 border-black/30 min-h-[400px] sm:min-h-[600px] overflow-auto shadow-lg">
                {selectedIdea.prototypeComponent === 'ViralVideoPromptGenerator' && 
                  <ViralVideoPromptGenerator language={language} />}
                {selectedIdea.prototypeComponent === 'CoesfelderQuest' && 
                  <CoesfelderQuest language={language} />}
                {selectedIdea.prototypeComponent === 'CareAndShare' && 
                  <CareAndShare />}
              </div>
            </div>
          )}

          {currentView === 'detail' && selectedIdea && (
            <div className="space-y-6">
              <div className="text-center space-y-5">
                <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-pixel font-bold ${styles.text}`}>{selectedIdea.title}</h3>
                <button 
                  onClick={() => setCurrentView('prototype')}
                  className={`px-8 py-4 rounded-lg font-pixel border-2 border-black/30 transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto text-lg sm:text-xl ${styles.button}`}
                >
                  <Play className="h-5 w-5" />
                  {language === 'deutsch' ? 'Prototyp testen' : 'Test Prototype'}
                </button>
              </div>
              
              <div className={`p-6 border-2 rounded-lg ${styles.cardBg}`}>
                <h4 className={`text-xl sm:text-2xl font-pixel font-semibold mb-3 ${styles.text}`}>
                  {language === 'deutsch' ? 'Beschreibung' : 'Description'}
                </h4>
                <p className={`${styles.text} font-pixel leading-relaxed text-base sm:text-lg`}>{selectedIdea.fullDescription}</p>
              </div>

              <div className={`p-6 border-2 rounded-lg ${styles.cardBg}`}>
                <h4 className={`text-xl sm:text-2xl font-pixel font-semibold mb-5 ${styles.text}`}>
                  {language === 'deutsch' ? 'Deine Bewertung' : 'Your Rating'}
                </h4>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className={`text-base sm:text-lg font-pixel ${styles.text}`}>
                      {language === 'deutsch' ? 'Bewertung (1-5 Sterne)' : 'Rating (1-5 stars)'}
                    </label>
                    <div className="flex justify-center">
                      {renderStars(userRating, true, setUserRating)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className={`text-base sm:text-lg font-pixel ${styles.text}`}>
                      {language === 'deutsch' ? 'Feedback (optional)' : 'Feedback (optional)'}
                    </label>
                    <Textarea
                      placeholder={language === 'deutsch' 
                        ? 'Teile deine Gedanken und Verbesserungsvorschläge mit...'
                        : 'Share your thoughts and suggestions for improvement...'
                      }
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className={`${styles.cardBg} border-black/30 ${styles.text} font-pixel rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  
                  <button 
                    onClick={handleSubmitRating}
                    disabled={userRating === 0}
                    className={`w-full py-4 rounded-lg font-pixel border-2 border-black/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-xl ${styles.button}`}
                  >
                    {language === 'deutsch' ? 'Bewertung abgeben' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Desktop link */}
          {currentView === 'welcome' && (
            <div className="text-center mt-8">
              <Link to="/desktop" className={`text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm justify-center ${styles.link}`}>
                <ArrowLeft className="w-5 h-5" />
                {t('Back to Desktop')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaLab;