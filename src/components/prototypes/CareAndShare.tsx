import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Phone, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Screen = 'start' | 'needHelp' | 'helpersList' | 'wantToHelp' | 'helpRequests' | 'helperContact' | 'confirmation';

interface Helper {
  id: number;
  name: string;
  age: number;
  distance: string;
  skills: string[];
  availability: string;
  phone?: string;
}

const CareAndShare = () => {
  const { language } = useSettings();
  const [screen, setScreen] = useState<Screen>('start');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    category: '',
    timeframe: '',
    date: new Date() as Date | undefined,
    time: ''
  });

  const [helperData, setHelperData] = useState({
    name: '',
    phone: '',
    facebook: '',
    age: '',
    skills: '',
    availability: ''
  });

  const [helpers, setHelpers] = useState([
    { id: 1, name: 'Anna M.', age: 28, distance: '0.5km', skills: [language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf', language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'], availability: language === 'english' ? 'Mornings' : language === 'español' ? 'Mañanas' : 'Vormittags', phone: '+49 123 456 7890' },
    { id: 2, name: 'Tom K.', age: 35, distance: '1.2km', skills: [language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten', 'IT'], availability: language === 'english' ? 'Evenings' : language === 'español' ? 'Noches' : 'Abends', phone: '+49 123 456 7891' },
    { id: 3, name: 'Sarah L.', age: 42, distance: '0.8km', skills: [language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf', language === 'english' ? 'Walk' : language === 'español' ? 'Paseo' : 'Spaziergang'], availability: language === 'english' ? 'Afternoons' : language === 'español' ? 'Tardes' : 'Nachmittags', phone: '+49 123 456 7892' },
    { id: 4, name: 'Michael R.', age: 29, distance: '1.5km', skills: [language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf', language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'], availability: language === 'english' ? 'Weekends' : language === 'español' ? 'Fines de semana' : 'Wochenende', phone: '+49 123 456 7893' },
    { id: 5, name: 'Lisa B.', age: 33, distance: '2.1km', skills: [language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten', language === 'english' ? 'Walk' : language === 'español' ? 'Paseo' : 'Spaziergang'], availability: language === 'english' ? 'Mornings' : language === 'español' ? 'Mañanas' : 'Vormittags', phone: '+49 123 456 7894' },
    { id: 6, name: 'David W.', age: 45, distance: '0.7km', skills: ['IT', language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'], availability: language === 'english' ? 'Evenings' : language === 'español' ? 'Noches' : 'Abends', phone: '+49 123 456 7895' }
  ]);

  const [acceptedHelper, setAcceptedHelper] = useState<Helper | null>(null);

  const filteredHelpers = formData.category 
    ? helpers.filter(helper => helper.skills.includes(formData.category))
    : helpers;

  return (
    <div className="w-full h-screen bg-white">
      
        {screen === 'start' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center m-4">
            <div className="mb-8">
              <div className="text-4xl mb-4">🤝</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'english' ? 'Care&Share' : language === 'español' ? 'Cuidar y Compartir' : 'Care&Share'}
              </h1>
              <p className="text-gray-600">
                {language === 'english' ? 'Help and get help' : language === 'español' ? 'Ayuda y recibe ayuda' : 'Helfe und werde geholfen'}
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setScreen('needHelp')}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'english' ? 'I need help' : language === 'español' ? 'Necesito ayuda' : 'Ich brauche Hilfe'}
              </button>
              
              <button
                onClick={() => setScreen('wantToHelp')}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-colors"
              >
                {language === 'english' ? 'I want to help' : language === 'español' ? 'Quiero ayudar' : 'Ich möchte helfen'}
              </button>
            </div>
          </div>
        )}

        {screen === 'needHelp' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setScreen('start')}
                className="mr-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'english' ? 'I need help' : language === 'español' ? 'Necesito ayuda' : 'Ich brauche Hilfe'}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={language === 'english' ? 'Name' : language === 'español' ? 'Nombre' : 'Name'}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
                />
              </div>
              
              <div>
                <select
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none text-lg"
                >
                  <option value="">{language === 'english' ? 'Age range' : language === 'español' ? 'Rango de edad' : 'Altersbereich'}</option>
                  <option value="40-67">40-67</option>
                  <option value="67-80">67-80</option>
                  <option value="80+">80+</option>
                </select>
              </div>
              
              <div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none text-lg"
                >
                  <option value="">{language === 'english' ? 'Help category' : language === 'español' ? 'Categoría de ayuda' : 'Hilfe-Kategorie'}</option>
                  <option value={language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf'}>{language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf'}</option>
                  <option value={language === 'english' ? 'Walk' : language === 'español' ? 'Paseo' : 'Spaziergang'}>{language === 'english' ? 'Walk' : language === 'español' ? 'Paseo' : 'Spaziergang'}</option>
                  <option value={language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'}>{language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'}</option>
                  <option value={language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten'}>{language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten'}</option>
                </select>
              </div>
              
              <div>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none text-lg"
                >
                  <option value="">{language === 'english' ? 'When do you need help?' : language === 'español' ? '¿Cuándo necesitas ayuda?' : 'Wann brauchen Sie Hilfe?'}</option>
                  <option value={language === 'english' ? 'Today' : language === 'español' ? 'Hoy' : 'Heute'}>{language === 'english' ? 'Today' : language === 'español' ? 'Hoy' : 'Heute'}</option>
                  <option value={language === 'english' ? 'Today afternoon' : language === 'español' ? 'Hoy por la tarde' : 'Heute Nachmittag'}>{language === 'english' ? 'Today afternoon' : language === 'español' ? 'Hoy por la tarde' : 'Heute Nachmittag'}</option>
                  <option value={language === 'english' ? 'Today evening' : language === 'español' ? 'Hoy por la noche' : 'Heute Abend'}>{language === 'english' ? 'Today evening' : language === 'español' ? 'Hoy por la noche' : 'Heute Abend'}</option>
                  <option value={language === 'english' ? 'Tomorrow' : language === 'español' ? 'Mañana' : 'Morgen'}>{language === 'english' ? 'Tomorrow' : language === 'español' ? 'Mañana' : 'Morgen'}</option>
                </select>
              </div>
              
              <button
                onClick={() => setScreen('helpersList')}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors mb-8"
              >
                {language === 'english' ? 'Find helpers' : language === 'español' ? 'Encontrar ayudantes' : 'Helfer finden'}
              </button>
            </div>
          </div>
        )}

        {screen === 'helpersList' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setScreen('needHelp')}
                className="mr-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'english' ? 'Available helpers' : language === 'español' ? 'Ayudantes disponibles' : 'Verfügbare Helfer'}
              </h2>
            </div>
            
            <div className="space-y-4 pb-24">
              {filteredHelpers.slice(0, 2).map((helper) => (
                <div key={helper.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{helper.name}</h3>
                      <p className="text-gray-600">{language === 'english' ? 'Age' : language === 'español' ? 'Edad' : 'Alter'}: {helper.age}</p>
                      <p className="text-gray-600">{language === 'english' ? 'Distance' : language === 'español' ? 'Distancia' : 'Entfernung'}: {helper.distance}</p>
                      <p className="text-gray-600">{language === 'english' ? 'Skills' : language === 'español' ? 'Habilidades' : 'Kenntnisse'}: {helper.skills.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setAcceptedHelper(helper);
                        setScreen('helperContact');
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      {language === 'english' ? 'Accept' : language === 'español' ? 'Aceptar' : 'Annehmen'}
                    </button>
                    <button
                      onClick={() => {
                        setHelpers(helpers.filter(h => h.id !== helper.id));
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      {language === 'english' ? 'Decline' : language === 'español' ? 'Rechazar' : 'Ablehnen'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'wantToHelp' && (
          <div className="bg-white rounded-2xl shadow-xl p-4 m-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setScreen('start')}
                className="mr-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ←
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {language === 'english' ? 'I want to help' : language === 'español' ? 'Quiero ayudar' : 'Ich möchte helfen'}
              </h2>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder={language === 'english' ? 'Name' : language === 'español' ? 'Nombre' : 'Name'}
                value={helperData.name}
                onChange={(e) => setHelperData({...helperData, name: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
              />
              
              <input
                type="tel"
                placeholder={language === 'english' ? 'Phone number' : language === 'español' ? 'Número de teléfono' : 'Telefonnummer'}
                value={helperData.phone}
                onChange={(e) => setHelperData({...helperData, phone: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
              />
              
              <input
                type="text"
                placeholder={language === 'english' ? 'Facebook name (optional)' : language === 'español' ? 'Nombre de Facebook (opcional)' : 'Facebook Name (optional)'}
                value={helperData.facebook}
                onChange={(e) => setHelperData({...helperData, facebook: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
              />
              
              <select
                value={helperData.age}
                onChange={(e) => setHelperData({...helperData, age: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all appearance-none text-sm"
              >
                <option value="">{language === 'english' ? 'Age range' : language === 'español' ? 'Rango de edad' : 'Altersbereich'}</option>
                <option value="18-30">18-30</option>
                <option value="30-50">30-50</option>
                <option value="50+">50+</option>
              </select>
              
              <select
                value={helperData.skills}
                onChange={(e) => setHelperData({...helperData, skills: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all appearance-none text-sm"
              >
                <option value="">{language === 'english' ? 'What can you help with?' : language === 'español' ? '¿En qué puedes ayudar?' : 'Wobei können Sie helfen?'}</option>
                <option value={language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf'}>{language === 'english' ? 'Shopping' : language === 'español' ? 'Compras' : 'Einkauf'}</option>
                <option value={language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten'}>{language === 'english' ? 'Garden' : language === 'español' ? 'Jardín' : 'Garten'}</option>
                <option value="IT">IT</option>
                <option value={language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'}>{language === 'english' ? 'Household' : language === 'español' ? 'Hogar' : 'Haushalt'}</option>
              </select>
              
              <select
                value={helperData.availability}
                onChange={(e) => setHelperData({...helperData, availability: e.target.value})}
                className="w-full p-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all appearance-none text-sm"
              >
                <option value="">{language === 'english' ? 'When are you available?' : language === 'español' ? '¿Cuándo estás disponible?' : 'Wann sind Sie verfügbar?'}</option>
                <option value={language === 'english' ? 'Mornings' : language === 'español' ? 'Mañanas' : 'Vormittags'}>{language === 'english' ? 'Mornings' : language === 'español' ? 'Mañanas' : 'Vormittags'}</option>
                <option value={language === 'english' ? 'Afternoons' : language === 'español' ? 'Tardes' : 'Nachmittags'}>{language === 'english' ? 'Afternoons' : language === 'español' ? 'Tardes' : 'Nachmittags'}</option>
                <option value={language === 'english' ? 'Evenings' : language === 'español' ? 'Noches' : 'Abends'}>{language === 'english' ? 'Evenings' : language === 'español' ? 'Noches' : 'Abends'}</option>
                <option value={language === 'english' ? 'Weekends' : language === 'español' ? 'Fines de semana' : 'Wochenende'}>{language === 'english' ? 'Weekends' : language === 'español' ? 'Fines de semana' : 'Wochenende'}</option>
              </select>
              
              <button
                onClick={() => setScreen('helpRequests')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-green-700 transition-colors mt-4"
              >
                {language === 'english' ? 'Find people in need' : language === 'español' ? 'Encontrar personas que buscan ayuda' : 'Hilfesuchende finden'}
              </button>
            </div>
          </div>
        )}

        {screen === 'helpRequests' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setScreen('wantToHelp')}
                className="mr-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'english' ? 'Help requests' : 'Hilfegesuche'}
              </h2>
            </div>
            
            <div className="space-y-4 pb-8">
              {[
                { id: 1, name: 'Maria S.', age: 75, task: language === 'english' ? 'Shopping' : 'Einkauf', time: language === 'english' ? 'Today 14:00' : 'Heute 14:00' },
                { id: 2, name: 'Klaus M.', age: 82, task: language === 'english' ? 'Walk' : 'Spaziergang', time: language === 'english' ? 'Tomorrow 10:00' : 'Morgen 10:00' },
                { id: 3, name: 'Ingrid B.', age: 78, task: language === 'english' ? 'Garden' : 'Garten', time: language === 'english' ? 'This week' : 'Diese Woche' }
              ].slice(0, 2).map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <p className="text-gray-600">{language === 'english' ? 'Age' : 'Alter'}: {request.age}</p>
                    <p className="text-gray-600">{language === 'english' ? 'Task' : 'Aufgabe'}: {request.task}</p>
                    <p className="text-gray-600">{language === 'english' ? 'Time' : 'Zeit'}: {request.time}</p>
                  </div>
                  <button
                    onClick={() => setScreen('confirmation')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    {language === 'english' ? 'Offer help' : 'Hilfe anbieten'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'helperContact' && acceptedHelper && (
          <div className="bg-white rounded-2xl shadow-xl p-4 m-4">
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {language === 'english' ? 'Helper contacted!' : 'Helfer kontaktiert!'}
              </h2>
               <p className="text-gray-600 mb-4 text-sm">
                 {language === 'english' 
                   ? `You can now contact ${acceptedHelper.name} directly:`
                   : `Sie können ${acceptedHelper.name} jetzt direkt kontaktieren:`
                 }
              </p>
              
               <div className="bg-gray-50 rounded-xl p-3 mb-4">
                 <h3 className="font-semibold mb-3 text-base">{acceptedHelper.name}</h3>
                 
                 <div className="grid grid-cols-3 gap-2">
                   <a
                     href={`tel:${acceptedHelper.phone}`}
                     className="bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex flex-col items-center justify-center text-xs"
                   >
                     <Phone className="h-4 w-4 mb-1" />
                     Call
                   </a>
                   
                   <a
                     href={`https://wa.me/${acceptedHelper.phone?.replace(/[\s\+\-]/g, '')}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-green-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex flex-col items-center justify-center text-xs"
                   >
                     <MessageCircle className="h-4 w-4 mb-1" />
                     WhatsApp
                   </a>
                   
                   <a
                     href="https://m.me/user"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-blue-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex flex-col items-center justify-center text-xs"
                   >
                     <svg className="h-4 w-4 mb-1" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M12 0C5.4 0 0 4.9 0 11c0 3.5 1.6 6.6 4.2 8.8L3 24l4.3-1.2C8.8 23.6 10.4 24 12 24c6.6 0 12-4.9 12-11S18.6 0 12 0zm1.2 14.8l-3.1-3.3-6 3.3 6.6-7 3.1 3.3 6-3.3-6.6 7z"/>
                     </svg>
                     Facebook
                   </a>
                 </div>
               </div>
              
              <button
                onClick={() => {
                  setScreen('start');
                  setAcceptedHelper(null);
                  setFormData({ name: '', age: '', category: '', timeframe: '', date: new Date() as Date | undefined, time: '' });
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === 'english' ? 'Back to start' : 'Zurück zum Start'}
              </button>
            </div>
          </div>
        )}

        {screen === 'confirmation' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
               <h2 className="text-2xl font-bold text-gray-800 mb-4">
                 {language === 'english' ? 'Offer sent!' : 'Angebot gesendet!'}
               </h2>
               <p className="text-gray-600 mb-6">
                 {language === 'english' 
                   ? 'The other person has been contacted.'
                   : 'Die andere Person wurde kontaktiert.'
                 }
              </p>
              
               <button
                 onClick={() => {
                   setScreen('start');
                   setHelperData({ age: '', skills: '', availability: '', name: '', phone: '', facebook: '' });
                 }}
                 className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-8"
               >
                {language === 'english' ? 'Back to start' : 'Zurück zum Start'}
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CareAndShare;