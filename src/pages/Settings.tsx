import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
  const { language, theme, setLanguage, setTheme, t } = useSettings();

  const themes = [
    {
      id: 'space-mood' as const,
      name: t('Space Mood'),
      preview: (
        <div className="w-full h-12 rounded-md border-2 shadow-inner border-gray-500 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 grid grid-cols-3 gap-1 p-1">
          <div className="bg-blue-500 rounded-sm"></div>
          <div className="bg-green-500 rounded-sm"></div>
          <div className="bg-purple-500 rounded-sm"></div>
          <div className="bg-yellow-500 rounded-sm"></div>
          <div className="bg-red-500 rounded-sm"></div>
          <div className="bg-orange-500 rounded-sm"></div>
          <div className="bg-pink-500 rounded-sm"></div>
          <div className="bg-indigo-500 rounded-sm"></div>
          <div className="bg-teal-500 rounded-sm"></div>
        </div>
      )
    }
  ];

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      <div className="p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600">
        <div className="p-2 rounded-t border-b-2 border-black/20 shadow-inner bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800">
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('Settings')}</span>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl mb-8 font-pixel drop-shadow-lg text-gray-900">[ {t('Settings')} ]</h1>
            
            <div className="w-full max-w-2xl space-y-8">
              {/* Language Section */}
              <div className="p-6 rounded-lg border-2 bg-gray-50 border-gray-600 shadow-lg">
                <h2 className="text-2xl font-pixel mb-6 text-gray-900">{t('Language')}</h2>
                <RadioGroup value={language} onValueChange={setLanguage} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value="english" 
                      id="english"
                      className="w-6 h-6 border-2 border-gray-600 bg-gray-100 data-[state=checked]:bg-gray-700"
                    />
                    <label htmlFor="english" className="text-xl font-pixel text-gray-900 cursor-pointer">
                      {t('English')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value="deutsch" 
                      id="deutsch"
                      className="w-6 h-6 border-2 border-gray-600 bg-gray-100 data-[state=checked]:bg-gray-700"
                    />
                    <label htmlFor="deutsch" className="text-xl font-pixel text-gray-900 cursor-pointer">
                      {t('German')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value="español" 
                      id="español"
                      className="w-6 h-6 border-2 border-gray-600 bg-gray-100 data-[state=checked]:bg-gray-700"
                    />
                    <label htmlFor="español" className="text-xl font-pixel text-gray-900 cursor-pointer">
                      {t('Spanish')}
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Theme Section */}
              <div className="p-6 rounded-lg border-2 bg-gray-50 border-gray-600 shadow-lg">
                <h2 className="text-2xl font-pixel mb-6 text-gray-900">{t('Appearance Theme')}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 transform-gpu ${
                        theme === themeOption.id 
                          ? 'border-gray-800 shadow-2xl bg-gray-200' 
                          : 'border-gray-500 shadow-lg bg-gray-100 hover:border-gray-600'
                      }`}
                    >
                      <div className="mb-3">
                        {themeOption.preview}
                      </div>
                      <span className="text-lg font-pixel text-gray-900">
                        {themeOption.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="p-6 rounded-lg border-2 bg-gray-50 border-gray-600 shadow-lg">
                <div className="space-y-2 font-pixel text-gray-900">
                  <div className="text-base">Designed by Henri Brüning</div>
                  <div className="text-base">Built for: nostalgia, creativity, and curiosity</div>
                </div>
              </div>
            </div>

            <Link to="/desktop" className="mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm text-gray-800 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;