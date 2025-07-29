import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, MapPin, User, CheckCircle, XCircle, Users, Handshake } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

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
  const { t } = useSettings();
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [rejectedHelpers, setRejectedHelpers] = useState<string[]>([]);
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

  // Translations for the app
  const translations = {
    // App title and main content
    title: t('care_share_title') || 'Care&Share',
    subtitle: t('care_share_subtitle') || 'Helfe und werde geholfen',
    description: t('care_share_description') || 'Verbinde dich mit deiner Nachbarschaft. Biete Hilfe an oder finde jemanden, der dir hilft.',
    
    // Buttons
    needHelp: t('care_share_need_help') || 'Ich brauche Hilfe',
    wantToHelp: t('care_share_want_help') || 'Ich möchte helfen',
    findHelpers: t('care_share_find_helpers') || 'Helfer finden',
    showRequests: t('care_share_show_requests') || 'Hilfegesuche anzeigen',
    accept: t('care_share_accept') || 'Annehmen',
    decline: t('care_share_decline') || 'Ablehnen',
    offerHelp: t('care_share_offer_help') || 'Hilfe anbieten',
    backToStart: t('care_share_back_start') || 'Zurück zum Start',
    
    // Form labels
    name: t('care_share_name') || 'Name',
    age: t('care_share_age') || 'Alter',
    category: t('care_share_category') || 'Kategorie',
    timeframe: t('care_share_timeframe') || 'Zeitraum',
    skills: t('care_share_skills') || 'Kenntnisse',
    availability: t('care_share_availability') || 'Verfügbarkeit',
    
    // Categories and options
    helpCategories: [
      t('care_share_shopping') || 'Einkauf',
      t('care_share_walk') || 'Spaziergang', 
      t('care_share_household') || 'Haushalt',
      t('care_share_garden') || 'Garten',
      t('care_share_it_help') || 'IT-Hilfe',
      t('care_share_transport') || 'Transport'
    ],
    timeframes: [
      t('care_share_today') || 'Heute',
      t('care_share_tomorrow') || 'Morgen',
      t('care_share_this_week') || 'Diese Woche',
      t('care_share_flexible') || 'Flexibel'
    ],
    skillsList: [
      t('care_share_shopping') || 'Einkauf',
      t('care_share_garden') || 'Garten',
      t('care_share_it') || 'IT',
      t('care_share_household') || 'Haushalt',
      t('care_share_transport') || 'Transport',
      t('care_share_company') || 'Gesellschaft'
    ],
    availabilities: [
      t('care_share_morning') || 'Vormittags',
      t('care_share_afternoon') || 'Nachmittags',
      t('care_share_evening') || 'Abends',
      t('care_share_weekend') || 'Wochenende'
    ],
    ageRanges: ['40-67', '67-80', '80+']
  };

  const mockHelpers: Helper[] = [
    { id: '1', name: 'Anna M.', age: '28', distance: '0.5 km', availability: translations.timeframes[0], skills: [translations.helpCategories[0], translations.skillsList[2]] },
    { id: '2', name: 'Klaus B.', age: '45', distance: '1.2 km', availability: translations.timeframes[1], skills: [translations.helpCategories[3], translations.helpCategories[5]] },
    { id: '3', name: 'Lisa K.', age: '23', distance: '0.8 km', availability: translations.timeframes[0], skills: [translations.helpCategories[2], translations.skillsList[5]] }
  ];

  const mockRequests: HelpRequest[] = [
    { id: '1', name: 'Herr Schmidt', age: '78', category: translations.helpCategories[0], time: `${translations.timeframes[0]} 14:00`, status: 'offen' },
    { id: '2', name: 'Frau Müller', age: '82', category: translations.helpCategories[1], time: `${translations.timeframes[1]} 10:00`, status: 'offen' },
    { id: '3', name: 'Herr Weber', age: '75', category: translations.helpCategories[4], time: translations.timeframes[2], status: 'offen' }
  ];

  // Filter helpers based on selected category
  const getFilteredHelpers = () => {
    if (!helpForm.category) return mockHelpers;
    return mockHelpers.filter(helper => 
      helper.skills.includes(helpForm.category) && 
      !rejectedHelpers.includes(helper.id)
    );
  };

  const handleRejectHelper = (helperId: string) => {
    setRejectedHelpers(prev => [...prev, helperId]);
  };

  const renderStartScreen = () => (
    <div className="care-share-app min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-xl mx-auto text-center space-y-8 sm:space-y-12 pt-8 sm:pt-16">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white rounded-full shadow-lg border-2 border-emerald-200">
            <Handshake className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 tracking-tight">{translations.title}</h1>
            <p className="text-lg sm:text-2xl text-gray-600 font-medium">{translations.subtitle}</p>
          </div>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto leading-relaxed px-4">
            {translations.description}
          </p>
        </div>
        
        <div className="grid gap-4 sm:gap-6 max-w-sm mx-auto px-4">
          <Button 
            onClick={() => setCurrentScreen('need-help')} 
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            <User className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {translations.needHelp}
          </Button>
          <Button 
            onClick={() => setCurrentScreen('want-help')} 
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {translations.wantToHelp}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNeedHelpForm = () => (
    <div className="care-share-app min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')} className="hover:bg-gray-100 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{translations.needHelp}</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base sm:text-lg font-medium text-gray-700">{translations.name}</Label>
              <Input 
                id="name"
                placeholder={translations.name}
                value={helpForm.name}
                onChange={(e) => setHelpForm({...helpForm, name: e.target.value})}
                className="h-12 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-base sm:text-lg font-medium text-gray-700">{translations.age}</Label>
              <select 
                id="age"
                className="w-full h-12 px-4 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                value={helpForm.age}
                onChange={(e) => setHelpForm({...helpForm, age: e.target.value})}
              >
                <option value="">{translations.age}</option>
                {translations.ageRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base sm:text-lg font-medium text-gray-700">{translations.category}</Label>
              <select 
                id="category"
                className="w-full h-12 px-4 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                value={helpForm.category}
                onChange={(e) => setHelpForm({...helpForm, category: e.target.value})}
              >
                <option value="">{translations.category}</option>
                {translations.helpCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="text-base sm:text-lg font-medium text-gray-700">{translations.timeframe}</Label>
              <select 
                id="timeframe"
                className="w-full h-12 px-4 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                value={helpForm.timeframe}
                onChange={(e) => setHelpForm({...helpForm, timeframe: e.target.value})}
              >
                <option value="">{translations.timeframe}</option>
                {translations.timeframes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setCurrentScreen('helper-list')} 
              className="w-full h-12 sm:h-14 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-6 sm:mt-8 rounded-xl"
              disabled={!helpForm.name || !helpForm.age || !helpForm.category || !helpForm.timeframe}
            >
              {translations.findHelpers}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelperList = () => {
    const filteredHelpers = getFilteredHelpers();
    
    return (
      <div className="care-share-app min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('need-help')} className="hover:bg-white/50 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Verfügbare Helfer</h2>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {filteredHelpers.length === 0 ? (
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-gray-600">Keine passenden Helfer gefunden. Versuchen Sie es mit einer anderen Kategorie.</p>
                </CardContent>
              </Card>
            ) : (
              filteredHelpers.map(helper => (
                <Card key={helper.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500 rounded-xl">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{helper.name}</h3>
                          <p className="text-base sm:text-lg text-gray-600">{helper.age} Jahre</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-medium self-start">
                          {helper.availability}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">{helper.distance}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Kompetenzen:</p>
                        <div className="flex flex-wrap gap-2">
                          {helper.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                        <Button 
                          onClick={() => setCurrentScreen('confirmation')} 
                          className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-base sm:text-lg font-semibold rounded-xl"
                        >
                          <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          {translations.accept}
                        </Button>
                        <Button 
                          onClick={() => handleRejectHelper(helper.id)}
                          variant="outline" 
                          className="flex-1 h-10 sm:h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 text-base sm:text-lg font-semibold rounded-xl"
                        >
                          <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          {translations.decline}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWantHelpForm = () => (
    <div className="care-share-app min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('start')} className="hover:bg-gray-100 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{translations.wantToHelp}</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="helper-name" className="text-base sm:text-lg font-medium text-gray-700">{translations.name}</Label>
              <Input 
                id="helper-name"
                placeholder={translations.name}
                value={helperForm.name}
                onChange={(e) => setHelperForm({...helperForm, name: e.target.value})}
                className="h-12 text-base sm:text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helper-age" className="text-base sm:text-lg font-medium text-gray-700">{translations.age}</Label>
              <select 
                id="helper-age"
                className="w-full h-12 px-4 text-base sm:text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                value={helperForm.age}
                onChange={(e) => setHelperForm({...helperForm, age: e.target.value})}
              >
                <option value="">{translations.age}</option>
                <option value="18-30">18-30</option>
                <option value="30-50">30-50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-base sm:text-lg font-medium text-gray-700">{translations.skills}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {translations.skillsList.map(skill => (
                  <label key={skill} className="flex items-center space-x-2 sm:space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={helperForm.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHelperForm({...helperForm, skills: [...helperForm.skills, skill]});
                        } else {
                          setHelperForm({...helperForm, skills: helperForm.skills.filter(s => s !== skill)});
                        }
                      }}
                    />
                    <span className="text-sm sm:text-lg font-medium text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-base sm:text-lg font-medium text-gray-700">{translations.availability}</Label>
              <select 
                id="availability"
                className="w-full h-12 px-4 text-base sm:text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                value={helperForm.availability}
                onChange={(e) => setHelperForm({...helperForm, availability: e.target.value})}
              >
                <option value="">{translations.availability}</option>
                {translations.availabilities.map(avail => (
                  <option key={avail} value={avail}>{avail}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setCurrentScreen('requests-list')} 
              className="w-full h-12 sm:h-14 text-lg sm:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 mt-6 sm:mt-8 rounded-xl"
              disabled={!helperForm.name || !helperForm.age || helperForm.skills.length === 0 || !helperForm.availability}
            >
              {translations.showRequests}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestsList = () => (
    <div className="care-share-app min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('want-help')} className="hover:bg-white/50 flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Offene Hilfegesuche</h2>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {mockRequests.map(request => (
            <Card key={request.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{request.name}</h3>
                      <p className="text-base sm:text-lg text-gray-600">{request.age} Jahre</p>
                    </div>
                    <Badge className={request.status === 'offen' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-base sm:text-lg font-semibold text-blue-600">{request.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg font-medium">{request.time}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentScreen('confirmation')} 
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-base sm:text-lg font-semibold rounded-xl"
                  >
                    <Handshake className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {translations.offerHelp}
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
    <div className="care-share-app min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto text-center pt-8 sm:pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-emerald-100 rounded-full">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Anfrage gesendet!</h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
              Die andere Person wurde benachrichtigt und kann Ihre Anfrage annehmen oder ablehnen.
            </p>
          </div>

          <div className="space-y-4 p-4 sm:p-6 bg-gray-50 rounded-xl">
            <p className="text-base sm:text-lg font-semibold text-gray-700">Status-Übersicht:</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Badge className="bg-orange-100 text-orange-800 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg">Offen</Badge>
              <span className="text-xl sm:text-2xl text-gray-400 hidden sm:inline">→</span>
              <Badge className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg">Bestätigt</Badge>
              <span className="text-xl sm:text-2xl text-gray-400 hidden sm:inline">→</span>
              <Badge className="bg-emerald-100 text-emerald-800 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg">Erledigt</Badge>
            </div>
          </div>

          <Button 
            onClick={() => {
              setCurrentScreen('start');
              setRejectedHelpers([]);
            }} 
            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl"
          >
            {translations.backToStart}
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