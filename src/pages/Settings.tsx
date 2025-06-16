
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
      id: 'matrix-terminal' as const,
      name: t('Matrix Terminal'),
      preview: 'bg-gradient-to-br from-black via-green-900 to-black'
    },
    {
      id: 'retro-chrome' as const,
      name: t('Retro Chrome'),
      preview: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Settings Window Frame */}
      <div className={`p-3 border-4 w-full max-w-2xl shadow-2xl rounded-lg ${
        theme === 'dark-vhs' 
          ? 'bg-gradient-to-br from-gray-800/20 via-black/90 to-gray-900/20 border-white/50' 
          : theme === 'matrix-terminal'
          ? 'bg-gradient-to-br from-green-900/20 via-black/90 to-green-800/20 border-green-500/50'
          : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-black/40'
      }`}>
        {/* Title bar with theme-aware styling */}
        <div className={`p-3 rounded-t border-b-4 shadow-inner relative ${
          theme === 'dark-vhs'
            ? 'bg-gradient-to-r from-gray-700/80 via-black/90 to-gray-800/80 border-white/30'
            : theme === 'matrix-terminal'
            ? 'bg-gradient-to-r from-green-800/80 via-black/90 to-green-700/80 border-green-500/30'
            : 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 border-black/30'
        }`}>
          <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-t"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs' || theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-white/30'
                : 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs' || theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-white/30'
                : 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-transparent rounded-full"></div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-white/30'
                : theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-green-500/30'
                : 'bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-black/30'
            }`}>
              <div className="absolute inset-0.5 bg-gradient-to-br from-green-300 to-transparent rounded-full"></div>
            </div>
            <span className={`font-pixel text-lg ml-3 drop-shadow-lg ${
              theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-white'
            }`}>{t('Settings')}</span>
          </div>
        </div>
        
        {/* Window content with theme-aware background */}
        <div className={`p-8 border-4 shadow-inner rounded-b relative ${
          theme === 'dark-vhs'
            ? 'bg-gradient-to-br from-black/95 via-gray-900/10 to-gray-800/10 border-white/30'
            : theme === 'matrix-terminal'
            ? 'bg-gradient-to-br from-black/95 via-green-900/10 to-green-800/10 border-green-500/30'
            : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 border-white/30'
        }`}>
          <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-black/5 rounded"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Language Section */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-black/80 via-gray-900/20 to-gray-800/20 border-white/40'
                : theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-black/80 via-green-900/20 to-green-800/20 border-green-500/40'
                : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-black/20'
            }`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className={`text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 ${
                theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
              }`}>{t('Language')}</h2>
              <RadioGroup value={language} onValueChange={setLanguage} className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="english" 
                      id="english"
                      className={`w-6 h-6 border-3 shadow-lg ${
                        theme === 'dark-vhs'
                          ? 'border-white/40 bg-gradient-to-br from-black to-gray-900/30 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-white data-[state=checked]:to-gray-300'
                          : theme === 'matrix-terminal'
                          ? 'border-green-500/40 bg-gradient-to-br from-black to-green-900/30 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-400 data-[state=checked]:to-green-600'
                          : 'border-black/40 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600'
                      }`}
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="english" className={`text-xl font-pixel drop-shadow-sm cursor-pointer ${
                    theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
                  }`}>
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
                          : theme === 'matrix-terminal'
                          ? 'border-green-500/40 bg-gradient-to-br from-black to-green-900/30 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-400 data-[state=checked]:to-green-600'
                          : 'border-black/40 bg-gradient-to-br from-white to-gray-200 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600'
                      }`}
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="deutsch" className={`text-xl font-pixel drop-shadow-sm cursor-pointer ${
                    theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
                  }`}>
                    {t('German')}
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Theme Section */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-black/80 via-gray-900/20 to-gray-800/20 border-white/40'
                : theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-black/80 via-green-900/20 to-green-800/20 border-green-500/40'
                : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-black/20'
            }`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className={`text-2xl font-pixel mb-6 drop-shadow-sm relative z-10 ${
                theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
              }`}>{t('Appearance Theme')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu ${
                      theme === themeOption.id 
                        ? (theme === 'dark-vhs' 
                          ? 'border-white/60 shadow-2xl bg-gradient-to-br from-white/30 to-white/10' 
                          : theme === 'matrix-terminal'
                          ? 'border-green-500/60 shadow-2xl bg-gradient-to-br from-green-400/30 to-green-600/10'
                          : 'border-black/60 shadow-2xl bg-gradient-to-br from-white/30 to-white/10')
                        : (theme === 'dark-vhs'
                          ? 'border-white/30 shadow-lg bg-gradient-to-br from-black/60 to-gray-900/20 hover:border-white/40'
                          : theme === 'matrix-terminal'
                          ? 'border-green-500/30 shadow-lg bg-gradient-to-br from-black/60 to-green-900/20 hover:border-green-500/40'
                          : 'border-black/30 shadow-lg bg-gradient-to-br from-white/20 to-transparent hover:border-black/40')
                    }`}
                  >
                    <div className={`w-full h-12 rounded-md mb-3 border-2 shadow-inner ${
                      theme === 'dark-vhs' ? 'border-white/30' : theme === 'matrix-terminal' ? 'border-green-500/30' : 'border-black/30'
                    } ${themeOption.preview}`}>
                      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                    </div>
                    <span className={`text-lg font-pixel drop-shadow-sm ${
                      theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
                    }`}>
                      {themeOption.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className={`p-6 rounded-lg border-3 shadow-xl ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-black/90 via-gray-900/30 to-gray-800/30 border-white/50'
                : theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-black/90 via-green-900/30 to-green-800/30 border-green-500/50'
                : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border-black/30'
            }`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-black/10 rounded-lg"></div>
              <div className={`space-y-2 font-pixel relative z-10 ${
                theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-black'
              }`}>
                <div className="text-lg drop-shadow-sm">Henri OS v1.0</div>
                <div className="text-base drop-shadow-sm">Designed by Henri Brüning</div>
                <div className="text-base drop-shadow-sm">Built for: nostalgia, creativity, and curiosity</div>
                <div className="text-sm drop-shadow-sm mt-4 opacity-80">Support: [X] not found</div>
              </div>
            </div>

            <Link 
              to="/desktop" 
              className={`inline-block mt-8 text-2xl underline transition-colors font-pixel drop-shadow-sm hover:scale-105 transform-gpu duration-200 ${
                theme === 'dark-vhs'
                  ? 'text-white hover:text-gray-300'
                  : theme === 'matrix-terminal'
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-blue-800 hover:text-blue-900'
              }`}
            >
              &lt;- {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
