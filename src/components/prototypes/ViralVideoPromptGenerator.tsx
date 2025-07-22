import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptResult {
  hook: string;
  storyline: string;
  style: string;
  duration: string;
  hashtags: string[];
}

interface Props {
  language?: string;
}

export default function ViralVideoPromptGenerator({ language = 'deutsch' }: Props) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const { toast } = useToast();

  const generatePrompt = () => {
    if (!topic.trim()) {
      toast({
        title: language === 'deutsch' ? "Bitte gib ein Thema ein" : "Please enter a topic",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const prompts = language === 'deutsch' ? {
        'Vertrauen': {
          hook: "Was wäre, wenn du jemandem blind vertrauen müsstest?",
          storyline: "Zeige eine Situation, in der Vertrauen auf die Probe gestellt wird. Beginne mit einem Dilemma, baue Spannung auf und zeige die emotionale Auflösung.",
          style: "Persönlich und authentisch, mit direkter Ansprache",
          duration: "30-60 Sekunden",
          hashtags: ["#vertrauen", "#beziehungen", "#lebensweisheit", "#viral", "#storytelling"]
        },
        'Freundschaft': {
          hook: "Echte Freunde erkennst du in diesen 3 Momenten...",
          storyline: "Stelle drei konkrete Situationen vor, die wahre Freundschaft zeigen. Nutze persönliche Anekdoten oder universelle Erfahrungen.",
          style: "Warm und einladend, mit Nostalgie-Faktor",
          duration: "45-90 Sekunden",
          hashtags: ["#freundschaft", "#friends", "#lebenstipps", "#wholesome", "#relatable"]
        }
      } : {
        'Trust': {
          hook: "What if you had to trust someone blindly?",
          storyline: "Show a situation where trust is put to the test. Start with a dilemma, build tension, and show the emotional resolution.",
          style: "Personal and authentic, with direct address",
          duration: "30-60 seconds",
          hashtags: ["#trust", "#relationships", "#wisdom", "#viral", "#storytelling"]
        },
        'Friendship': {
          hook: "You recognize true friends in these 3 moments...",
          storyline: "Present three concrete situations that show true friendship. Use personal anecdotes or universal experiences.",
          style: "Warm and inviting, with nostalgia factor",
          duration: "45-90 seconds",
          hashtags: ["#friendship", "#friends", "#lifetips", "#wholesome", "#relatable"]
        }
      };

      const defaultPrompt = language === 'deutsch' ? {
        hook: `"Das passiert, wenn du über ${topic} nachdenkst..."`,
        storyline: `Erzähle eine persönliche Geschichte über ${topic}. Beginne mit einem überraschenden Fakt, teile deine Erfahrung und ende mit einer Erkenntnis, die zum Nachdenken anregt.`,
        style: "Authentisch und direkt, mit emotionalem Bezug",
        duration: "30-75 Sekunden",
        hashtags: [`#${topic.toLowerCase()}`, "#storytime", "#lebensweisheit", "#viral", "#deepthoughts"]
      } : {
        hook: `"This happens when you think about ${topic}..."`,
        storyline: `Tell a personal story about ${topic}. Start with a surprising fact, share your experience, and end with an insight that makes people think.`,
        style: "Authentic and direct, with emotional connection",
        duration: "30-75 seconds",
        hashtags: [`#${topic.toLowerCase()}`, "#storytime", "#wisdom", "#viral", "#deepthoughts"]
      };

      setResult(prompts[topic as keyof typeof prompts] || defaultPrompt);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: language === 'deutsch' ? "In Zwischenablage kopiert!" : "Copied to clipboard!",
    });
  };

  const reset = () => {
    setTopic('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === 'deutsch' ? 'Viral Video Prompt Generator' : 'Viral Video Prompt Generator'}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'deutsch' 
            ? 'Gib ein Thema ein und erhalte einen kompletten Social-Media-Prompt mit Hook, Dramaturgie und Stil-Empfehlungen für virale Videos.'
            : 'Enter a topic and get a complete social media prompt with hook, dramaturgy, and style recommendations for viral videos.'
          }
        </p>
      </div>

      <Card className="ideas-lab-card">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {language === 'deutsch' ? 'Thema eingeben' : 'Enter Topic'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {language === 'deutsch' 
              ? 'Z.B. Vertrauen, Sommerferien, Freundschaft, Erfolg, Liebe...'
              : 'E.g. Trust, Summer vacation, Friendship, Success, Love...'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={language === 'deutsch' ? 'Dein Thema...' : 'Your topic...'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && generatePrompt()}
            />
            <Button 
              onClick={generatePrompt}
              disabled={isGenerating}
              className="ideas-primary px-6 rounded-lg"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                language === 'deutsch' ? 'Generieren' : 'Generate'
              )}
            </Button>
          </div>
          
          {result && (
            <Button 
              onClick={reset}
              className="ideas-secondary w-full rounded-lg"
            >
              {language === 'deutsch' ? 'Neuen Prompt erstellen' : 'Create New Prompt'}
            </Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-4 sm:gap-6">
          <Card className="ideas-lab-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">
                  🎣 {language === 'deutsch' ? 'Hook (Aufmerksamkeits-Fänger)' : 'Hook (Attention Grabber)'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.hook)}
                  className="text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">{result.hook}</p>
            </CardContent>
          </Card>

          <Card className="ideas-lab-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">
                  🎬 {language === 'deutsch' ? 'Dramaturgie & Storytelling' : 'Dramaturgy & Storytelling'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.storyline)}
                  className="text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{result.storyline}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="ideas-lab-card">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  🎭 {language === 'deutsch' ? 'Erzählstil' : 'Narrative Style'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 text-sm sm:text-base">{result.style}</p>
              </CardContent>
            </Card>

            <Card className="ideas-lab-card">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  ⏱️ {language === 'deutsch' ? 'Empfohlene Länge' : 'Recommended Length'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 font-medium text-sm sm:text-base">{result.duration}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="ideas-lab-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">
                  #️⃣ {language === 'deutsch' ? 'Hashtag-Vorschläge' : 'Hashtag Suggestions'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.hashtags.join(' '))}
                  className="text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="ideas-lab-card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-2">
                <p className="text-gray-900 font-medium text-sm sm:text-base">
                  💡 {language === 'deutsch' 
                    ? 'Dein kompletter Social-Media-Prompt ist bereit!'
                    : 'Your complete social media prompt is ready!'
                  }
                </p>
                <p className="text-gray-700 text-xs sm:text-sm">
                  {language === 'deutsch'
                    ? 'Kopiere die einzelnen Elemente und erstelle dein virales Video.'
                    : 'Copy the individual elements and create your viral video.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}