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

export default function ViralVideoPromptGenerator() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const { toast } = useToast();

  const generatePrompt = () => {
    if (!topic.trim()) {
      toast({
        title: "Bitte gib ein Thema ein",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const prompts = {
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
      };

      const defaultPrompt = {
        hook: `"Das passiert, wenn du über ${topic} nachdenkst..."`,
        storyline: `Erzähle eine persönliche Geschichte über ${topic}. Beginne mit einem überraschenden Fakt, teile deine Erfahrung und ende mit einer Erkenntnis, die zum Nachdenken anregt.`,
        style: "Authentisch und direkt, mit emotionalem Bezug",
        duration: "30-75 Sekunden",
        hashtags: [`#${topic.toLowerCase()}`, "#storytime", "#lebensweisheit", "#viral", "#deepthoughts"]
      };

      setResult(prompts[topic as keyof typeof prompts] || defaultPrompt);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "In Zwischenablage kopiert!",
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
          <Sparkles className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-yellow-900">
            Viral Video Prompt Generator
          </h1>
        </div>
        <p className="text-lg text-yellow-700 max-w-2xl mx-auto">
          Gib ein Thema ein und erhalte einen kompletten Social-Media-Prompt mit Hook, 
          Dramaturgie und Stil-Empfehlungen für virale Videos.
        </p>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Thema eingeben</CardTitle>
          <CardDescription className="text-yellow-700">
            Z.B. Vertrauen, Sommerferien, Freundschaft, Erfolg, Liebe...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Dein Thema..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 bg-white border-yellow-300"
              onKeyPress={(e) => e.key === 'Enter' && generatePrompt()}
            />
            <Button 
              onClick={generatePrompt}
              disabled={isGenerating}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Generieren'
              )}
            </Button>
          </div>
          
          {result && (
            <Button 
              variant="outline" 
              onClick={reset}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              Neuen Prompt erstellen
            </Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-900">🎣 Hook (Aufmerksamkeits-Fänger)</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.hook)}
                  className="text-yellow-700 hover:bg-yellow-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-yellow-800 font-medium">{result.hook}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-900">🎬 Dramaturgie & Storytelling</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.storyline)}
                  className="text-yellow-700 hover:bg-yellow-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 leading-relaxed">{result.storyline}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-900">🎭 Erzählstil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800">{result.style}</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-900">⏱️ Empfohlene Länge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800 font-medium">{result.duration}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-900">#️⃣ Hashtag-Vorschläge</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.hashtags.join(' '))}
                  className="text-yellow-700 hover:bg-yellow-200"
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
                    className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-yellow-900 font-medium">
                  💡 Dein kompletter Social-Media-Prompt ist bereit!
                </p>
                <p className="text-yellow-700 text-sm">
                  Kopiere die einzelnen Elemente und erstelle dein virales Video.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}