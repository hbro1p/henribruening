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
        id: '3',
        title: 'Care&Share',
        shortDescription: language === 'english' 
          ? 'The platform that makes helping easy - Help & get help'
          : 'Die Plattform, die Helfen einfach macht - Helfe & werde geholfen',
        fullDescription: language === 'english'
          ? `A neighborhood help platform that connects seniors with helpful people in the area. Reduce loneliness, increase joy.

Main functions:
• Simple help requests for shopping, walks, household tasks
• Matching system based on proximity and availability
• Verified helpers with rating system
• Appointment coordination and status tracking
• Integration for community service providers

Additional ideas:
• City vouchers for milestones
• Community service integration for mandatory hours
• Gamification with helper points
• Community events and neighborhood meetings

The motto: From strangers to neighbors, from neighbors to friends.`
          : `Eine Nachbarschaftshilfe-Plattform, die Senioren mit hilfsbereiten Menschen in der Umgebung verbindet. Einsamkeit runter, Freude hoch.

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
        ratings: []
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
            className={`h-5 w-5 transition-all duration-200 star-enhanced ${
              star <= rating
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                : 'text-blue-600 stroke-2 opacity-70 hover:opacity-100'
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
      <div className={`relative p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg backdrop-blur-md bg-white/10 ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner backdrop-blur-sm bg-black/20 ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm drop-shadow-lg">{t('Idea Lab')}</span>
          </div>
        </div>
        
        <div className={`relative p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b backdrop-blur-sm bg-white/20 ${currentView === 'prototype' ? 'overflow-hidden h-[calc(90vh-100px)]' : 'overflow-y-auto max-h-[calc(90vh-100px)]'} ${styles.windowContent}`}>
          {/* Fade-out gradient only for actual scrollable content */}
          {currentView !== 'prototype' && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-blue-400/30 via-blue-400/15 to-transparent pointer-events-none z-20 opacity-60" />
          )}
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
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black/30 transition-all duration-300 button-enhanced font-pixel transform active:scale-95 hover-glow ${styles.button}`}
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 icon-interactive" />
                {t('Back')}
              </button>
            </div>
          )}

          {currentView === 'welcome' && (
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Lightbulb className={`h-8 w-8 sm:h-10 sm:w-10 ${styles.accent} transition-all duration-300 hover:scale-110 hover:rotate-12 hover:drop-shadow-xl`} />
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-pixel drop-shadow-lg ${styles.text} text-center px-2 transition-all duration-300 hover:scale-105`}>
                  {language === 'deutsch' ? 'Ideen-Labor' : 'Idea Laboratory'}
                </h1>
              </div>
              
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-4xl mx-auto px-4 relative">
                {welcomeText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`${styles.text} leading-relaxed text-base sm:text-lg lg:text-xl font-pixel text-left transition-all duration-300 hover:scale-[1.02] hover:drop-shadow-sm`}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <button 
                onClick={() => setCurrentView('list')}
                className={`px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-lg font-pixel border-2 border-black/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1 active:scale-95 backdrop-blur-sm bg-white/10 ${styles.button}`}
              >
                {language === 'deutsch' ? 'Ideen entdecken' : 'Discover Ideas'}
              </button>
            </div>
          )}

          {currentView === 'list' && (
            <div className="space-y-4 sm:space-y-6 relative">
              <div className="text-center space-y-3 px-4 transform transition-all duration-500 animate-fade-in">
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-pixel font-bold ${styles.text} transition-all duration-300 hover:scale-105`}>
                  {language === 'deutsch' ? 'Meine Ideen' : 'My Ideas'}
                </h3>
                <p className={`${styles.text} font-pixel text-base sm:text-lg lg:text-xl opacity-90 transition-all duration-300 hover:opacity-100`}>
                  {language === 'deutsch' 
                    ? 'Entdecke innovative Konzepte und teste funktionsfähige Prototypen'
                    : 'Discover innovative concepts and test functional prototypes'
                  }
                </p>
              </div>
              <div className="text-center space-y-6 relative">
                {/* Bottom fade-out gradient for ideas list */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400/30 to-transparent pointer-events-none z-10" />
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
                        <div key={idea.id} className={`group p-4 sm:p-6 border-2 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/10 border-white/30 ${styles.cardBg}`}>
                          <div className="flex flex-col gap-4 sm:gap-5">
                            <div className="space-y-3 flex-1 text-center">
                              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                                🤝
                              </div>
                              <h4 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl ${styles.text} font-pixel font-semibold leading-tight transition-all duration-300 group-hover:scale-105`}>{idea.title}</h4>
                              <p className={`text-base sm:text-lg lg:text-xl ${styles.text} font-pixel leading-relaxed transition-all duration-300 group-hover:text-blue-800`}>{idea.shortDescription}</p>
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
                              className={`flex-1 px-4 sm:px-5 py-3 text-base sm:text-lg lg:text-xl font-pixel rounded-lg transition-all duration-300 border-2 backdrop-blur-sm bg-white/20 ${styles.text} hover:bg-blue-400/20 button-enhanced border-white/30 transform active:scale-95 hover-glow`}
                            >
                              {language === 'deutsch' ? 'Details ansehen' : 'View Details'}
                            </button>
                            <button 
                              onClick={() => openPrototype(idea)}
                              className={`group px-4 sm:px-5 py-3 text-base sm:text-lg lg:text-xl font-pixel rounded-lg transition-all duration-300 transform button-enhanced border-2 border-black/30 flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-sm bg-white/10 active:scale-95 hover-glow ${styles.button}`}
                            >
                              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 icon-interactive" />
                              {language === 'deutsch' ? 'Testen' : 'Test'}
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
            <div className="h-full flex flex-col animate-scale-in">
              <div className="text-center space-y-3 mb-4 transform transition-all duration-500 hover:scale-105">
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-pixel font-bold ${styles.text} drop-shadow-lg`}>
                  {selectedIdea.title}
                </h3>
                <p className={`text-lg sm:text-xl ${styles.text} font-pixel opacity-80`}>
                  {language === 'deutsch' ? 'Interaktiver Prototyp' : 'Interactive Prototype'}
                </p>
              </div>
              <div className="flex-1 overflow-hidden rounded-xl transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
                {selectedIdea.prototypeComponent === 'CareAndShare' && 
                  <CareAndShare />}
              </div>
              {/* Bottom fade-out gradient for prototype */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-400/40 to-transparent pointer-events-none z-10" />
            </div>
          )}

          {currentView === 'detail' && selectedIdea && (
            <div className="space-y-6 relative animate-fade-in">
              {/* Top fade-in effect */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-400/20 to-transparent pointer-events-none z-10" />
              
              <div className="text-center space-y-5 transform transition-all duration-500 hover:scale-[1.02]">
                <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-pixel font-bold ${styles.text} transition-all duration-300 hover:scale-105 drop-shadow-lg`}>{selectedIdea.title}</h3>
                <button 
                  onClick={() => setCurrentView('prototype')}
                  className={`group px-8 py-4 rounded-lg font-pixel border-2 border-black/30 transition-all duration-300 transform button-enhanced flex items-center gap-3 mx-auto text-lg sm:text-xl backdrop-blur-sm bg-white/10 active:scale-95 hover-glow ${styles.button}`}
                >
                  <Lightbulb className="h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 icon-interactive" />
                  {language === 'deutsch' ? 'Prototyp testen' : 'Test Prototype'}
                </button>
              </div>
              
              {/* Bottom fade-out gradient for detail view */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-400/30 to-transparent pointer-events-none z-10" />
              
              <div className={`p-6 border-2 rounded-lg backdrop-blur-sm bg-white/10 border-white/30 transition-all duration-300 hover:shadow-lg ${styles.cardBg}`}>
                <h4 className={`text-xl sm:text-2xl font-pixel font-semibold mb-3 ${styles.text} transition-all duration-300 hover:scale-105`}>
                  {language === 'deutsch' ? 'Beschreibung' : 'Description'}
                </h4>
                <div className={`${styles.text} font-pixel leading-relaxed text-base sm:text-lg transition-all duration-300 hover:text-blue-800`}>
                  {selectedIdea.fullDescription.split('\n').map((line, index) => (
                    <div key={index} className="mb-2">
                      {line.includes('• ') ? (
                        <div className="ml-4 relative">
                          <span className="absolute -left-4 text-blue-600 font-bold">•</span>
                          <span className="text-blue-700">{line.replace('• ', '')}</span>
                        </div>
                      ) : line.trim() === '' ? (
                        <div className="h-2" />
                      ) : line.includes(':') && !line.includes('•') ? (
                        <div className="font-semibold text-blue-800 mt-3 mb-1">{line}</div>
                      ) : (
                        <div className="text-blue-700">{line}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 border-2 rounded-lg backdrop-blur-sm bg-white/10 border-white/30 transition-all duration-300 hover:shadow-lg ${styles.cardBg}`}>
                <h4 className={`text-xl sm:text-2xl font-pixel font-semibold mb-5 ${styles.text} transition-all duration-300 hover:scale-105`}>
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
                    className={`w-full py-4 rounded-lg font-pixel border-2 border-black/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 backdrop-blur-sm bg-white/10 active:scale-95 text-lg sm:text-xl ${styles.button}`}
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