
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
    },
    {
      id: 'dark-vhs' as const,
      name: t('Dark VHS'),
      preview: 'bg-gradient-to-br from-black via-gray-800 to-gray-900'
    },
    {
      id: 'adventure-canyon' as const,
      name: t('Adventure Canyon'),
      preview: 'bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-300'
    }
  ];

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          background: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black',
          windowFrame: 'bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-black/90 border-green-400',
          titleBar: 'bg-gradient-to-r from-gray-700/80 via-black/90 to-gray-800/80 border-green-400/30',
          content: 'bg-gradient-to-br from-black/95 via-gray-900/10 to-gray-800/10 border-green-400/30',
          text: 'text-green-400',
          subText: 'text-green-300',
          accent: 'text-green-400',
          card: 'bg-gradient-to-br from-black/80 via-gray-900/20 to-gray-800/20 border-green-400/40',
          buttonSelected: 'border-green-400/60 shadow-2xl bg-gradient-to-br from-green-400/30 to-green-400/10',
          buttonUnselected: 'border-green-400/30 shadow-lg bg-gradient-to-br from-black/60 to-gray-900/20 hover:border-green-400/40'
        };
      case 'adventure-canyon':
        return {
          background: 'bg-gradient-to-br from-amber-100 via-orange-200 to-red-300',
          windowFrame: 'bg-gradient-to-br from-amber-50/90 via-orange-100/95 to-yellow-200/90 border-orange-600',
          titleBar: 'bg-gradient-to-r from-orange-500/80 via-amber-600/90 to-yellow-500/80 border-orange-400/30',
          content: 'bg-gradient-to-br from-amber-50/95 via-orange-100/10 to-yellow-100/10 border-orange-400/30',
          text: 'text-orange-900',
          subText: 'text-orange-700',
          accent: 'text-orange-600',
          card: 'bg-gradient-to-br from-amber-100/80 via-orange-100/20 to-yellow-100/20 border-orange-400/40',
          buttonSelected: 'border-orange-400/60 shadow-2xl bg-gradient-to-br from-orange-300/30 to-orange-300/10',
          buttonUnselected: 'border-orange-400/30 shadow-lg bg-gradient-to-br from-orange-100/60 to-transparent hover:border-orange-400/40'
        };
      default: // space-mood
        return {
          background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          windowFrame: 'bg-gradient-to-br from-indigo-800/90 via-purple-800/95 to-blue-800/90 border-cyan-400',
          titleBar: 'bg-gradient-to-r from-indigo-700/80 via-purple-800/90 to-blue-700/80 border-cyan-400/30',
          content: 'bg-gradient-to-br from-indigo-900/95 via-purple-900/10 to-blue-900/10 border-cyan-400/30',
          text: 'text-cyan-400',
          subText: 'text-cyan-300',
          accent: 'text-cyan-400',
          card: 'bg-gradient-to-br from-indigo-900/80 via-purple-900/20 to-blue-900/20 border-cyan-400/40',
          buttonSelected: 'border-cyan-400/60 shadow-2xl bg-gradient-to-br from-cyan-400/30 to-cyan-400/10',
          buttonUnselected: 'border-cyan-400/30 shadow-lg bg-gradient-to-br from-indigo-800/60 to-transparent hover:border-cyan-400/40'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${styles.background}`}>
      {/* Settings Window Frame */}
      <div className={`p-3 border-4 w-full max-w-2xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar with theme-aware styling */}
        <div className={`p-3 rounded-t border-b-4 shadow-inner relative ${styles.titleBar}`}>
          <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-t"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-white/30'
                : 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-white/30'
                : 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-transparent rounded-full"></div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-white/30'
                : 'bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-green-300 to-transparent rounded-full"></div>
            </div>
            <span className="font-pixel text-lg ml-3 drop-shadow-lg text-white">{t('Settings')}</span>
          </div>
        </div>
        
        {/* Window content with theme-aware background */}
        <div className={`p-8 border-4 shadow-inner rounded-b relative ${styles.content}`}>
          <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-black/5 rounded"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Language Section */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${styles.card}`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className={`text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 ${styles.text}`}>{t('Language')}</h2>
              <RadioGroup value={language} onValueChange={setLanguage} className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="english" 
                      id="english"
                      className={`w-6 h-6 border-3 shadow-lg ${
                        theme === 'dark-vhs'
                          ? 'border-white/40 bg-gradient-to-br from-black to-gray-900/30 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-white data-[state=checked]:to-gray-300'
                          : 'border-black/40 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600'
                      }`}
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="english" className={`text-xl font-pixel drop-shadow-sm cursor-pointer ${styles.text}`}>
                    {t('English')}
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="deutsch" 
                      id="deutsch"
                      className={`w-6 h-6 border-3 shadow-lg ${
                        theme === 'dark-vhs'
                          ? 'border-white/40 bg-gradient-to-br from-black to-gray-900/30 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-white data-[state=checked]:to-gray-300'
                          : 'border-black/40 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600'
                      }`}
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="deutsch" className={`text-xl font-pixel drop-shadow-sm cursor-pointer ${styles.text}`}>
                    {t('German')}
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Theme Section */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${styles.card}`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className={`text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 ${styles.text}`}>{t('Appearance Theme')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu ${
                      theme === themeOption.id ? styles.buttonSelected : styles.buttonUnselected
                    }`}
                  >
                    <div className={`w-full h-12 rounded-md mb-3 border-2 shadow-inner border-gray-400/30 ${themeOption.preview}`}>
                      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                    </div>
                    <span className={`text-lg font-pixel drop-shadow-sm ${styles.text}`}>
                      {themeOption.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${styles.card}`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-black/10 rounded-lg"></div>
              <div className={`space-y-2 font-pixel relative z-10 ${styles.text}`}>
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
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu font-pixel text-xl shadow-lg ${styles.buttonSelected} text-white`}
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
