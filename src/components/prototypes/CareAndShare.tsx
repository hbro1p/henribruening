import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, Clock, MapPin, User } from 'lucide-react';

type Screen = 'start' | 'need-help' | 'helper-list' | 'want-help' | 'requests-list' | 'confirmation';

interface HelpRequest {
  id: string;
  name: string;
  age: number;
  category: string;
  time: string;
  status: 'offen' | 'bestätigt' | 'erledigt';
}

interface Helper {
  id: string;
  name: string;
  age: number;
  distance: string;
  availability: string;
  skills: string[];
}

const CareAndShare: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [helpForm, setHelpForm] = useState({
    name: '',
    age: '',
    category: '',
    timeframe: ''
  });
  const [helperForm, setHelperForm] = useState({
    age: '',
    skills: [] as string[],
    availability: ''
  });

  const helpCategories = ['Einkauf', 'Spaziergang', 'Haushalt', 'Garten', 'IT-Hilfe', 'Transport'];
  const timeframes = ['Heute', 'Morgen', 'Diese Woche', 'Flexibel'];
  const skills = ['Einkauf', 'Garten', 'IT', 'Haushalt', 'Transport', 'Gesellschaft'];
  const availabilities = ['Vormittags', 'Nachmittags', 'Abends', 'Wochenende'];

  const mockHelpers: Helper[] = [
    { id: '1', name: 'Anna M.', age: 28, distance: '0.5 km', availability: 'Heute verfügbar', skills: ['Einkauf', 'IT'] },
    { id: '2', name: 'Klaus B.', age: 45, distance: '1.2 km', availability: 'Morgen verfügbar', skills: ['Garten', 'Transport'] },
    { id: '3', name: 'Lisa K.', age: 23, distance: '0.8 km', availability: 'Heute verfügbar', skills: ['Haushalt', 'Gesellschaft'] }
  ];

  const mockRequests: HelpRequest[] = [
    { id: '1', name: 'Herr Schmidt', age: 78, category: 'Einkauf', time: 'Heute 14:00', status: 'offen' },
    { id: '2', name: 'Frau Müller', age: 82, category: 'Spaziergang', time: 'Morgen 10:00', status: 'offen' },
    { id: '3', name: 'Herr Weber', age: 75, category: 'IT-Hilfe', time: 'Diese Woche', status: 'offen' }
  ];

  const renderStartScreen = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-primary">
          <Heart className="h-10 w-10 text-red-500" />
          <span>Care&Share</span>
        </div>
        <p className="text-xl text-muted-foreground">Helfe und werde geholfen</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-gray-500" />
            <span>👵</span>
          </div>
          <Heart className="h-6 w-6 text-red-500" />
          <div className="flex items-center space-x-2">
            <span>👨‍💼</span>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <Button 
          onClick={() => setCurrentScreen('need-help')} 
          className="w-full h-16 text-lg"
          variant="default"
        >
          Ich brauche Hilfe
        </Button>
        <Button 
          onClick={() => setCurrentScreen('want-help')} 
          className="w-full h-16 text-lg"
          variant="outline"
        >
          Ich möchte helfen
        </Button>
      </div>
    </div>
  );

  const renderNeedHelpForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Ich brauche Hilfe</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helpForm.name}
            onChange={(e) => setHelpForm({...helpForm, name: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            <option value="Herr Schmidt">Herr Schmidt</option>
            <option value="Frau Müller">Frau Müller</option>
            <option value="Herr Weber">Herr Weber</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alter</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helpForm.age}
            onChange={(e) => setHelpForm({...helpForm, age: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            <option value="65-70">65-70 Jahre</option>
            <option value="70-80">70-80 Jahre</option>
            <option value="80+">80+ Jahre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hilfe-Kategorie</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helpForm.category}
            onChange={(e) => setHelpForm({...helpForm, category: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            {helpCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Zeitraum</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helpForm.timeframe}
            onChange={(e) => setHelpForm({...helpForm, timeframe: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            {timeframes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <Button 
          onClick={() => setCurrentScreen('helper-list')} 
          className="w-full"
          disabled={!helpForm.name || !helpForm.age || !helpForm.category || !helpForm.timeframe}
        >
          Weiter
        </Button>
      </div>
    </div>
  );

  const renderHelperList = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('need-help')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Verfügbare Helfer</h2>
      </div>

      <div className="space-y-4">
        {mockHelpers.map(helper => (
          <Card key={helper.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{helper.name}</h3>
                  <p className="text-sm text-muted-foreground">{helper.age} Jahre</p>
                </div>
                <Badge variant="outline">{helper.availability}</Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{helper.distance}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {helper.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => setCurrentScreen('confirmation')} 
                  className="flex-1"
                  size="sm"
                >
                  Annehmen
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Ablehnen
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWantHelpForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Ich möchte helfen</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Alter</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helperForm.age}
            onChange={(e) => setHelperForm({...helperForm, age: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            <option value="18-30">18-30 Jahre</option>
            <option value="30-50">30-50 Jahre</option>
            <option value="50+">50+ Jahre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kenntnisse (mehrere möglich)</label>
          <div className="grid grid-cols-2 gap-2">
            {skills.map(skill => (
              <label key={skill} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={helperForm.skills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setHelperForm({...helperForm, skills: [...helperForm.skills, skill]});
                    } else {
                      setHelperForm({...helperForm, skills: helperForm.skills.filter(s => s !== skill)});
                    }
                  }}
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Verfügbare Zeiten</label>
          <select 
            className="w-full p-3 border rounded-md"
            value={helperForm.availability}
            onChange={(e) => setHelperForm({...helperForm, availability: e.target.value})}
          >
            <option value="">Wählen Sie...</option>
            {availabilities.map(avail => (
              <option key={avail} value={avail}>{avail}</option>
            ))}
          </select>
        </div>

        <Button 
          onClick={() => setCurrentScreen('requests-list')} 
          className="w-full"
          disabled={!helperForm.age || helperForm.skills.length === 0 || !helperForm.availability}
        >
          Hilfegesuche anzeigen
        </Button>
      </div>
    </div>
  );

  const renderRequestsList = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('want-help')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Offene Hilfegesuche</h2>
      </div>

      <div className="space-y-4">
        {mockRequests.map(request => (
          <Card key={request.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.name}</h3>
                  <p className="text-sm text-muted-foreground">{request.age} Jahre</p>
                </div>
                <Badge variant={request.status === 'offen' ? 'destructive' : 'default'}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">{request.category}</p>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{request.time}</span>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentScreen('confirmation')} 
                className="w-full"
                size="sm"
              >
                Hilfe anbieten
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="text-6xl">✅</div>
        <h2 className="text-2xl font-semibold">Anfrage gesendet!</h2>
        <p className="text-muted-foreground">
          Die andere Person wurde benachrichtigt und kann Ihre Anfrage annehmen oder ablehnen.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Status-Übersicht:</p>
        <div className="flex justify-center space-x-2">
          <Badge variant="destructive">Offen</Badge>
          <span>→</span>
          <Badge variant="default">Bestätigt</Badge>
          <span>→</span>
          <Badge variant="secondary">Erledigt</Badge>
        </div>
      </div>

      <Button onClick={() => setCurrentScreen('start')} className="w-full">
        Zurück zum Start
      </Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {currentScreen === 'start' && renderStartScreen()}
      {currentScreen === 'need-help' && renderNeedHelpForm()}
      {currentScreen === 'helper-list' && renderHelperList()}
      {currentScreen === 'want-help' && renderWantHelpForm()}
      {currentScreen === 'requests-list' && renderRequestsList()}
      {currentScreen === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default CareAndShare;