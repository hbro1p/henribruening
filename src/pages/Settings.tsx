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
      preview: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-black'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200">
      {/* Settings Window Frame - Always neutral styling */}
      <div className="p-3 border-4 w-full max-w-2xl shadow-2xl rounded-lg bg-gradient-to-br from-white/95 via-gray-50/95 to-slate-100/95 border-gray-400">
        {/* Title bar with neutral styling */}
        <div className="p-3 rounded-t border-b-4 shadow-inner relative bg-gradient-to-r from-gray-200/80 via-slate-300/90 to-gray-200/80 border-gray-300/30">
          <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-t"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-4 h-4 rounded-full border-2 shadow-lg bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-black/30">
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 shadow-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-black/30">
              <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-transparent rounded-full"></div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 shadow-lg bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-black/30">
              <div className="absolute inset-0.5 bg-gradient-to-br from-green-300 to-transparent rounded-full"></div>
            </div>
            <span className="font-pixel text-lg ml-3 drop-shadow-lg text-gray-800">{t('Settings')}</span>
          </div>
        </div>
        
        {/* Window content with neutral background */}
        <div className="p-8 border-4 shadow-inner rounded-b relative bg-gradient-to-br from-white/95 via-gray-50/10 to-slate-100/10 border-gray-300/30">
          <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-black/5 rounded"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Language Section */}
            <div className="p-6 rounded-lg border-3 shadow-xl bg-gradient-to-br from-white/80 via-gray-50/20 to-slate-100/20 border-gray-300/40">
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className="text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 text-gray-800">{t('Language')}</h2>
              <RadioGroup value={language} onValueChange={setLanguage} className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="english" 
                      id="english"
                      className="w-6 h-6 border-3 shadow-lg border-gray-400 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600"
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="english" className="text-xl font-pixel drop-shadow-sm cursor-pointer text-gray-800">
                    {t('English')}
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="deutsch" 
                      id="deutsch"
                      className="w-6 h-6 border-3 shadow-lg border-gray-400 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600"
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="deutsch" className="text-xl font-pixel drop-shadow-sm cursor-pointer text-gray-800">
                    {t('German')}
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Theme Section */}
            <div className="p-6 rounded-lg border-3 shadow-xl bg-gradient-to-br from-white/80 via-gray-50/20 to-slate-100/20 border-gray-300/40">
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className="text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 text-gray-800">{t('Appearance Theme')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu ${
                      theme === themeOption.id 
                        ? 'border-blue-400/60 shadow-2xl bg-gradient-to-br from-blue-400/30 to-blue-400/10' 
                        : 'border-gray-400/30 shadow-lg bg-gradient-to-br from-white/60 to-transparent hover:border-gray-400/40'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-md mb-3 border-2 shadow-inner border-gray-400/30 ${themeOption.preview}`}>
                      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                    </div>
                    <span className="text-lg font-pixel drop-shadow-sm text-gray-800">
                      {themeOption.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="p-6 rounded-lg border-3 shadow-xl bg-gradient-to-br from-white/80 via-gray-50/20 to-slate-100/20 border-gray-300/40">
              <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-black/10 rounded-lg"></div>
              <div className="space-y-2 font-pixel relative z-10 text-gray-800">
                <div className="text-lg drop-shadow-sm">Henri OS v1.0</div>
                <div className="text-base drop-shadow-sm">Designed by Henri Brüning</div>
                <div className="text-base drop-shadow-sm">Built for: nostalgia, creativity, and curiosity</div>
                <div className="text-sm drop-shadow-sm mt-4 opacity-80">Support: [X] not found</div>
              </div>
            </div>

            {/* Styled Back to Desktop link */}
            <div className="flex justify-center">
              <Link 
                to="/desktop" 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu font-pixel text-xl shadow-lg border-blue-400/60 bg-gradient-to-br from-blue-400/30 to-blue-400/10 text-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
                {t('Back to Desktop')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;