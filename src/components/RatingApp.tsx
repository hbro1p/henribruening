import React, { useState, useEffect } from 'react';
import { X, Star, Eye, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useSettings } from '@/contexts/SettingsContext';

interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mockupImage?: string;
  averageRating: number;
  totalRatings: number;
}

interface RatingAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingApp({ isOpen, onClose }: RatingAppProps) {
  const { t, language } = useSettings();
  const [currentView, setCurrentView] = useState<'welcome' | 'list' | 'detail'>('welcome');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showMockup, setShowMockup] = useState(false);

  const ideas: Idea[] = [
    {
      id: '1',
      title: 'Viral Video Prompt Generator',
      shortDescription: language === 'deutsch' 
        ? 'Ein Tool für vollständige Social-Media-Prompts basierend auf Themen'
        : 'A tool for complete social media prompts based on topics',
      fullDescription: language === 'deutsch'
        ? 'Diese Idee beschreibt ein Tool, bei dem man ein Thema eingibt (z. B. Vertrauen, Sommerferien, Freundschaft), und daraufhin einen komplett vorbereiteten Social-Media-Prompt bekommt. Der Prompt enthält eine Hook, eine passende Dramaturgie und Vorschläge für Erzählstil und Videolänge.'
        : 'This idea describes a tool where you input a topic (e.g., trust, summer vacation, friendship) and receive a complete social media prompt. The prompt includes a hook, appropriate dramaturgy, and suggestions for narrative style and video length.',
      averageRating: 4.2,
      totalRatings: 15
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
      averageRating: 3.8,
      totalRatings: 12
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentView('welcome');
      setSelectedIdea(null);
      setUserRating(0);
      setFeedback('');
      setShowMockup(false);
    }
  }, [isOpen]);

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
                ? 'fill-primary text-primary'
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-primary' : ''}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleSubmitRating = () => {
    // Here you would typically save to a database
    console.log('Rating submitted:', { ideaId: selectedIdea?.id, rating: userRating, feedback });
    setUserRating(0);
    setFeedback('');
    setCurrentView('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              {language === 'deutsch' ? 'Ideen-Labor' : 'Idea Laboratory'}
            </h2>
          </div>
          {currentView !== 'welcome' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (currentView === 'detail') {
                  setCurrentView('list');
                  setSelectedIdea(null);
                  setShowMockup(false);
                } else {
                  setCurrentView('welcome');
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {currentView === 'welcome' && (
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                {welcomeText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentView('list')}
                className="mt-8"
              >
                {language === 'deutsch' ? 'Ideen entdecken' : 'Discover Ideas'}
              </Button>
            </div>
          )}

          {currentView === 'list' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">
                {language === 'deutsch' ? 'Meine Ideen' : 'My Ideas'}
              </h3>
              <div className="grid gap-4">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{idea.title}</CardTitle>
                          <CardDescription>{idea.shortDescription}</CardDescription>
                        </div>
                        <div className="text-right space-y-1">
                          {renderStars(idea.averageRating)}
                          <p className="text-sm text-muted-foreground">
                            {idea.averageRating.toFixed(1)} ({idea.totalRatings} {language === 'deutsch' ? 'Bewertungen' : 'ratings'})
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => {
                          setSelectedIdea(idea);
                          setCurrentView('detail');
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        {language === 'deutsch' ? 'Details ansehen' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentView === 'detail' && selectedIdea && (
            <div className="space-y-6">
              {showMockup ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      Mockup - {selectedIdea.title}
                    </h3>
                    <Button variant="outline" onClick={() => setShowMockup(false)}>
                      {language === 'deutsch' ? 'Zurück zur Beschreibung' : 'Back to Description'}
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      {language === 'deutsch' 
                        ? 'Mockup-Bild würde hier angezeigt werden'
                        : 'Mockup image would be displayed here'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{selectedIdea.title}</h3>
                    <Button variant="outline" onClick={() => setShowMockup(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {language === 'deutsch' ? 'Mockup ansehen' : 'View Mockup'}
                    </Button>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>{language === 'deutsch' ? 'Beschreibung' : 'Description'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{selectedIdea.fullDescription}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{language === 'deutsch' ? 'Deine Bewertung' : 'Your Rating'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'deutsch' ? 'Bewertung (1-5 Sterne)' : 'Rating (1-5 stars)'}
                        </label>
                        {renderStars(userRating, true, setUserRating)}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
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
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmitRating}
                        disabled={userRating === 0}
                        className="w-full"
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