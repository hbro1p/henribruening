import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, MapPin, User, CheckCircle, XCircle, Users, Handshake } from 'lucide-react';

type Screen = 'start' | 'need-help' | 'helper-list' | 'want-help' | 'requests-list' | 'confirmation';

interface HelpRequest {
  id: string;
  name: string;
  age: string;
  category: string;
  time: string;
  status: 'offen' | 'bestätigt' | 'erledigt';
}

interface Helper {
  id: string;
  name: string;
  age: string;
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
    name: '',
    age: '',
    skills: [] as string[],
    availability: ''
  });

  const helpCategories = ['Einkauf', 'Spaziergang', 'Haushalt', 'Garten', 'IT-Hilfe', 'Transport'];
  const timeframes = ['Heute', 'Morgen', 'Diese Woche', 'Flexibel'];
  const skills = ['Einkauf', 'Garten', 'IT', 'Haushalt', 'Transport', 'Gesellschaft'];
  const availabilities = ['Vormittags', 'Nachmittags', 'Abends', 'Wochenende'];
  const ageRanges = ['40-67 Jahre', '67-80 Jahre', '80+ Jahre'];

  const mockHelpers: Helper[] = [
    { id: '1', name: 'Anna M.', age: '28', distance: '0.5 km', availability: 'Heute verfügbar', skills: ['Einkauf', 'IT'] },
    { id: '2', name: 'Klaus B.', age: '45', distance: '1.2 km', availability: 'Morgen verfügbar', skills: ['Garten', 'Transport'] },
    { id: '3', name: 'Lisa K.', age: '23', distance: '0.8 km', availability: 'Heute verfügbar', skills: ['Haushalt', 'Gesellschaft'] }
  ];

  const mockRequests: HelpRequest[] = [
    { id: '1', name: 'Herr Schmidt', age: '78', category: 'Einkauf', time: 'Heute 14:00', status: 'offen' },
    { id: '2', name: 'Frau Müller', age: '82', category: 'Spaziergang', time: 'Morgen 10:00', status: 'offen' },
    { id: '3', name: 'Herr Weber', age: '75', category: 'IT-Hilfe', time: 'Diese Woche', status: 'offen' }
  ];

  const renderStartScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto text-center space-y-12 pt-16">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg border-2 border-blue-200">
            <Handshake className="h-16 w-16 text-blue-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Care&Share</h1>
            <p className="text-2xl text-gray-600 font-medium">Helfe und werde geholfen</p>
          </div>
          <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            Verbinde dich mit deiner Nachbarschaft. Biete Hilfe an oder finde jemanden, der dir hilft.
          </p>
        </div>
        
        <div className="grid gap-6 max-w-md mx-auto">
          <Button 
            onClick={() => setCurrentScreen('need-help')} 
            className="h-16 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <User className="mr-3 h-6 w-6" />
            Ich brauche Hilfe
          </Button>
          <Button 
            onClick={() => setCurrentScreen('want-help')} 
            className="h-16 text-xl font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            variant="default"
          >
            <Users className="mr-3 h-6 w-6" />
            Ich möchte helfen
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNeedHelpForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-3xl font-bold text-gray-800">Ich brauche Hilfe</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium text-gray-700">Name</Label>
              <Input 
                id="name"
                placeholder="Ihr vollständiger Name"
                value={helpForm.name}
                onChange={(e) => setHelpForm({...helpForm, name: e.target.value})}
                className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-lg font-medium text-gray-700">Alter</Label>
              <select 
                id="age"
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                value={helpForm.age}
                onChange={(e) => setHelpForm({...helpForm, age: e.target.value})}
              >
                <option value="">Wählen Sie Ihre Altersgruppe...</option>
                {ageRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-medium text-gray-700">Hilfe-Kategorie</Label>
              <select 
                id="category"
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                value={helpForm.category}
                onChange={(e) => setHelpForm({...helpForm, category: e.target.value})}
              >
                <option value="">Wobei benötigen Sie Hilfe?</option>
                {helpCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="text-lg font-medium text-gray-700">Zeitraum</Label>
              <select 
                id="timeframe"
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                value={helpForm.timeframe}
                onChange={(e) => setHelpForm({...helpForm, timeframe: e.target.value})}
              >
                <option value="">Wann benötigen Sie Hilfe?</option>
                {timeframes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setCurrentScreen('helper-list')} 
              className="w-full h-14 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-8"
              disabled={!helpForm.name || !helpForm.age || !helpForm.category || !helpForm.timeframe}
            >
              Helfer finden
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelperList = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('need-help')} className="hover:bg-white/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold text-gray-800">Verfügbare Helfer</h2>
        </div>

        <div className="grid gap-6">
          {mockHelpers.map(helper => (
            <Card key={helper.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800">{helper.name}</h3>
                      <p className="text-lg text-gray-600">{helper.age} Jahre</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                      {helper.availability}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{helper.distance}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Kompetenzen:</p>
                    <div className="flex flex-wrap gap-2">
                      {helper.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={() => setCurrentScreen('confirmation')} 
                      className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg font-semibold"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Annehmen
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 text-lg font-semibold"
                    >
                      <XCircle className="mr-2 h-5 w-5" />
                      Ablehnen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWantHelpForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-3xl font-bold text-gray-800">Ich möchte helfen</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="helper-name" className="text-lg font-medium text-gray-700">Name</Label>
              <Input 
                id="helper-name"
                placeholder="Ihr vollständiger Name"
                value={helperForm.name}
                onChange={(e) => setHelperForm({...helperForm, name: e.target.value})}
                className="h-12 text-lg border-2 border-gray-200 focus:border-green-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helper-age" className="text-lg font-medium text-gray-700">Alter</Label>
              <select 
                id="helper-age"
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 focus:border-green-500 rounded-lg bg-white"
                value={helperForm.age}
                onChange={(e) => setHelperForm({...helperForm, age: e.target.value})}
              >
                <option value="">Wählen Sie Ihre Altersgruppe...</option>
                <option value="18-30">18-30 Jahre</option>
                <option value="30-50">30-50 Jahre</option>
                <option value="50+">50+ Jahre</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-medium text-gray-700">Kenntnisse (mehrere möglich)</Label>
              <div className="grid grid-cols-2 gap-3">
                {skills.map(skill => (
                  <label key={skill} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      checked={helperForm.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHelperForm({...helperForm, skills: [...helperForm.skills, skill]});
                        } else {
                          setHelperForm({...helperForm, skills: helperForm.skills.filter(s => s !== skill)});
                        }
                      }}
                    />
                    <span className="text-lg font-medium text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-lg font-medium text-gray-700">Verfügbare Zeiten</Label>
              <select 
                id="availability"
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 focus:border-green-500 rounded-lg bg-white"
                value={helperForm.availability}
                onChange={(e) => setHelperForm({...helperForm, availability: e.target.value})}
              >
                <option value="">Wann können Sie helfen?</option>
                {availabilities.map(avail => (
                  <option key={avail} value={avail}>{avail}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setCurrentScreen('requests-list')} 
              className="w-full h-14 text-xl font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 mt-8"
              disabled={!helperForm.name || !helperForm.age || helperForm.skills.length === 0 || !helperForm.availability}
            >
              Hilfegesuche anzeigen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestsList = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('want-help')} className="hover:bg-white/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold text-gray-800">Offene Hilfegesuche</h2>
        </div>

        <div className="grid gap-6">
          {mockRequests.map(request => (
            <Card key={request.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800">{request.name}</h3>
                      <p className="text-lg text-gray-600">{request.age} Jahre</p>
                    </div>
                    <Badge className={request.status === 'offen' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-blue-600">{request.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span className="text-lg font-medium">{request.time}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentScreen('confirmation')} 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold"
                  >
                    <Handshake className="mr-2 h-5 w-5" />
                    Hilfe anbieten
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-2xl mx-auto text-center pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Anfrage gesendet!</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Die andere Person wurde benachrichtigt und kann Ihre Anfrage annehmen oder ablehnen.
            </p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
            <p className="text-lg font-semibold text-gray-700">Status-Übersicht:</p>
            <div className="flex justify-center items-center space-x-3">
              <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-lg">Offen</Badge>
              <span className="text-2xl text-gray-400">→</span>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">Bestätigt</Badge>
              <span className="text-2xl text-gray-400">→</span>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">Erledigt</Badge>
            </div>
          </div>

          <Button 
            onClick={() => setCurrentScreen('start')} 
            className="w-full h-14 text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            Zurück zum Start
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
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