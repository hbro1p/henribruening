import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();

  const themes = [
    { id: 'space-mood', name: t('Space Mood'), preview: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-black' },
    { id: 'adventure-canyon', name: t('Adventure Canyon'), preview: 'bg-gradient-to-br from-amber-100 via-orange-200 to-red-300' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600">
        <div className="p-2 rounded-t border-b-2 border-black/20 shadow-inner bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Settings.exe</span>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-8 font-pixel drop-shadow-lg text-black">[ {t('Settings')} ]</h1>
            
            <div className="w-full max-w-2xl space-y-8">
              {/* Language Settings */}
              <div className="bg-white border-2 border-black/30 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-pixel mb-4 text-black">{t('Language')}</h2>
                <RadioGroup value={language} onValueChange={setLanguage}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english" className="font-pixel text-black">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deutsch" id="deutsch" />
                    <Label htmlFor="deutsch" className="font-pixel text-black">Deutsch</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Theme Settings */}
              <div className="bg-white border-2 border-black/30 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-pixel mb-4 text-black">{t('Theme')}</h2>
                <div className="grid gap-4">
                  {themes.map((themeOption) => (
                    <div
                      key={themeOption.id}
                      className={`
                        border-2 rounded-lg p-4 cursor-pointer transition-all
                        ${theme === themeOption.id 
                          ? 'border-blue-600 ring-2 ring-blue-400' 
                          : 'border-gray-400 hover:border-gray-600'
                        }
                      `}
                      onClick={() => setTheme(themeOption.id as any)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-lg border-2 border-black/20 ${themeOption.preview}`}></div>
                        <div>
                          <h3 className="font-pixel text-lg text-black">{themeOption.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-3 h-3 rounded-full ${theme === themeOption.id ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                            <span className="font-pixel text-sm text-black">
                              {theme === themeOption.id ? t('Active') : t('Select')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="bg-white border-2 border-black/30 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-pixel mb-4 text-black">{t('System Info')}</h2>
                <div className="space-y-2 text-left">
                  <p className="font-pixel text-sm text-black">Version: 2.5.1</p>
                  <p className="font-pixel text-sm text-black">Build: 2025.01.23</p>
                  <p className="font-pixel text-sm text-black">Platform: Lovable OS</p>
                </div>
              </div>
            </div>

            <Link 
              to="/desktop" 
              className="mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm text-black hover:text-gray-700"
            >
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