import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAppTheme } from '@/components/shared/AppColorSystem';

const Settings = () => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  
  // Use neutral purple for settings
  const styles = useAppTheme('purple');

  const themes = [
    { id: 'space-mood', name: t('Space Mood'), preview: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-black' },
    { id: 'adventure-canyon', name: t('Adventure Canyon'), preview: 'bg-gradient-to-br from-amber-100 via-orange-200 to-red-300' }
  ];

  return (
    <div className={`min-h-screen p-4 ${styles.background}`}>
      <div className={`max-w-2xl mx-auto ${styles.container} rounded-2xl p-8 shadow-2xl`}>
        <div className="h-full max-h-[90vh] overflow-y-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${styles.text}`}>
            {t('Settings')}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className={`${styles.card} rounded-lg p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${styles.text}`}>{t('Language')}</h2>
            <RadioGroup value={language} onValueChange={setLanguage} className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english" className={styles.subText}>English</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="deutsch" id="deutsch" />
                <Label htmlFor="deutsch" className={styles.subText}>Deutsch</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Theme Settings */}
          <div className={`${styles.card} rounded-lg p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${styles.text}`}>{t('Theme')}</h2>
            <div className="space-y-3">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]
                    ${theme === themeOption.id 
                      ? `${styles.border} ring-2 ring-purple-400/50` 
                      : 'border-gray-300 hover:border-purple-400'
                    }
                    ${styles.card}
                  `}
                  onClick={() => setTheme(themeOption.id as any)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg border-2 border-black/20 ${themeOption.preview} shadow-md`}></div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${styles.text}`}>{themeOption.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${theme === themeOption.id ? 'bg-purple-600' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm ${styles.subText}`}>
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
          <div className={`${styles.card} rounded-lg p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${styles.text}`}>{t('System Info')}</h2>
            <div className="space-y-2">
              <p className={`text-sm ${styles.subText}`}>Version: 2.5.1</p>
              <p className={`text-sm ${styles.subText}`}>Build: 2025.01.23</p>
              <p className={`text-sm ${styles.subText}`}>Platform: Lovable OS</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link 
            to="/desktop" 
            className={`${styles.button} inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Back to Desktop')}
          </Link>
        </div>
        </div> {/* End scrollable content */}
      </div>
    </div>
  );
};

export default Settings;