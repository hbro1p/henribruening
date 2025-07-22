import React, { useState, useEffect } from 'react';
import { X, Star, ArrowLeft, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useSettings } from '@/contexts/SettingsContext';
import ViralVideoPromptGenerator from './prototypes/ViralVideoPromptGenerator';
import CoesfelderQuest from './prototypes/CoesfelderQuest';

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

interface RatingAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingApp({ isOpen, onClose }: RatingAppProps) {
  const { t, language } = useSettings();
  const [currentView, setCurrentView] = useState<'welcome' | 'list' | 'detail' | 'prototype'>('welcome');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showPrototype, setShowPrototype] = useState(false);
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Initialize ideas data
  useEffect(() => {
    const initialIdeas: Idea[] = [
      {
        id: '1',
        title: 'Viral Video Prompt Generator',
        shortDescription: language === 'deutsch' 
          ? 'Ein Tool für vollständige Social-Media-Prompts basierend auf Themen'
          : 'A tool for complete social media prompts based on topics',
        fullDescription: language === 'deutsch'
          ? 'Diese Idee beschreibt ein Tool, bei dem man ein Thema eingibt (z. B. Vertrauen, Sommerferien, Freundschaft), und daraufhin einen komplett vorbereiteten Social-Media-Prompt bekommt. Der Prompt enthält eine Hook, eine passende Dramaturgie und Vorschläge für Erzählstil und Videolänge.'
          : 'This idea describes a tool where you input a topic (e.g., trust, summer vacation, friendship) and receive a complete social media prompt. The prompt includes a hook, appropriate dramaturgy, and suggestions for narrative style and video length.',
        prototypeComponent: 'ViralVideoPromptGenerator',
        ratings: []
      },
      {
        id: '2',
        title: 'Coesfeld Quest',
        shortDescription: language === 'deutsch'
          ? 'Eine digitale Schnitzeljagd durch die Stadt Coesfeld'
          : 'A digital scavenger hunt through the city of Coesfeld',
        fullDescription: language === 'deutsch'
          ? 'Diese Idee beschreibt eine digitale Schnitzeljagd durch die Stadt Coesfeld. Nutzerinnen und Nutzer müssen Orte finden, Hinweise lösen und erhalten Belohnungen in teilnehmenden Geschäften, Museen oder Cafés.'
          : 'This idea describes a digital scavenger hunt through the city of Coesfeld. Users find locations, solve clues, and receive rewards at participating businesses, museums, or cafes.',
        prototypeComponent: 'CoesfelderQuest',
        ratings: []
      }
    ];
    setIdeas(initialIdeas);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setCurrentView('welcome');
      setSelectedIdea(null);
      setUserRating(0);
      setFeedback('');
      setShowPrototype(false);
    }
  }, [isOpen]);

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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-yellow-300'
            } ${interactive ? 'cursor-pointer hover:fill-yellow-400 hover:text-yellow-400' : ''}`}
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="rating-app-yellow border rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-yellow-300">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-900">
              {language === 'deutsch' ? 'Ideen-Labor' : 'Idea Laboratory'}
            </h2>
          </div>
          {(currentView !== 'welcome') && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (currentView === 'prototype') {
                  setCurrentView('detail');
                } else if (currentView === 'detail') {
                  setCurrentView('list');
                  setSelectedIdea(null);
                  setShowPrototype(false);
                } else {
                  setCurrentView('welcome');
                }
              }}
              className="text-yellow-800 hover:bg-yellow-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-yellow-800 hover:bg-yellow-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          {currentView === 'welcome' && (
            <div className="text-center space-y-4 sm:space-y-6 max-w-2xl mx-auto">
              <div className="space-y-3 sm:space-y-4">
                {welcomeText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-yellow-800 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentView('list')}
                className="mt-8 bg-yellow-600 hover:bg-yellow-700 text-white border-none"
              >
                {language === 'deutsch' ? 'Ideen entdecken' : 'Discover Ideas'}
              </Button>
            </div>
          )}

          {currentView === 'list' && (
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-yellow-900">
                {language === 'deutsch' ? 'Meine Ideen' : 'My Ideas'}
              </h3>
              <div className="grid gap-3 sm:gap-4">
                {ideas.map((idea) => {
                  const avgRating = getAverageRating(idea);
                  return (
                    <Card key={idea.id} className="bg-yellow-50 border-yellow-200 hover:bg-yellow-100 transition-colors">
                      <CardHeader className="p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="space-y-1 sm:space-y-2 flex-1">
                            <CardTitle className="text-base sm:text-lg text-yellow-900">{idea.title}</CardTitle>
                            <CardDescription className="text-sm sm:text-base text-yellow-700">{idea.shortDescription}</CardDescription>
                          </div>
                          {avgRating !== null && (
                            <div className="text-left sm:text-right space-y-1 sm:ml-4">
                              {renderStars(avgRating)}
                              <p className="text-xs sm:text-sm text-yellow-700">
                                {avgRating.toFixed(1)} ({idea.ratings.length} {language === 'deutsch' ? 'Bewertungen' : 'ratings'})
                              </p>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={() => {
                              setSelectedIdea(idea);
                              setCurrentView('detail');
                            }}
                            variant="outline"
                            className="flex-1 border-yellow-300 text-yellow-800 hover:bg-yellow-200 text-sm sm:text-base"
                          >
                            {language === 'deutsch' ? 'Details ansehen' : 'View Details'}
                          </Button>
                          <Button 
                            onClick={() => openPrototype(idea)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white border-none text-sm sm:text-base"
                          >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Try
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'prototype' && selectedIdea && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-900">
                  {selectedIdea.title} - {language === 'deutsch' ? 'Prototyp' : 'Prototype'}
                </h3>
              </div>
              <div className="bg-white rounded-lg border border-yellow-200 min-h-[400px] sm:min-h-[600px] overflow-auto">
                {selectedIdea.prototypeComponent === 'ViralVideoPromptGenerator' && <ViralVideoPromptGenerator />}
                {selectedIdea.prototypeComponent === 'CoesfelderQuest' && <CoesfelderQuest />}
              </div>
            </div>
          )}

          {currentView === 'detail' && selectedIdea && (
            <div className="space-y-6">
              {showPrototype ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-yellow-900">
                      Prototype - {selectedIdea.title}
                    </h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPrototype(false)}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                    >
                      {language === 'deutsch' ? 'Zurück zur Beschreibung' : 'Back to Description'}
                    </Button>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                    {selectedIdea.prototypeComponent === 'ViralVideoPromptGenerator' && <ViralVideoPromptGenerator />}
                    {selectedIdea.prototypeComponent === 'CoesfelderQuest' && <CoesfelderQuest />}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-yellow-900 flex-1">{selectedIdea.title}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentView('prototype')}
                        className="border-yellow-300 text-yellow-800 hover:bg-yellow-200 text-sm sm:text-base"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {language === 'deutsch' ? 'Prototyp testen' : 'Test Prototype'}
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-900">
                        {language === 'deutsch' ? 'Beschreibung' : 'Description'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-800 leading-relaxed">{selectedIdea.fullDescription}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-900">
                        {language === 'deutsch' ? 'Deine Bewertung' : 'Your Rating'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-yellow-800">
                          {language === 'deutsch' ? 'Bewertung (1-5 Sterne)' : 'Rating (1-5 stars)'}
                        </label>
                        {renderStars(userRating, true, setUserRating)}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-yellow-800">
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
                          className="bg-white border-yellow-300 text-yellow-900 placeholder:text-yellow-600"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmitRating}
                        disabled={userRating === 0}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-none disabled:bg-yellow-300"
                      >
                        {language === 'deutsch' ? 'Bewertung abgeben' : 'Submit Rating'}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}