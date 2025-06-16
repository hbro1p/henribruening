
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'deutsch';
export type Theme = 'dreamos' | 'dark-vhs' | 'space-mood' | 'light-os';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations = {
  english: {
    'My Pictures': 'My Pictures',
    'My Videos': 'My Videos', 
    'My Projects': 'My Projects',
    'About Me': 'About Me',
    'Contact': 'Contact',
    'Settings': 'Settings',
    'Game.exe': 'Game.exe',
    'Language': 'Language:',
    'Appearance Theme': 'Appearance Theme:',
    'DreamOS': 'DreamOS',
    'Dark VHS': 'Dark VHS',
    'Space Mood': 'Space Mood',
    'Light OS 2001': 'Light OS 2001',
    'Back to Desktop': 'Back to Desktop',
    'Now Playing': 'Now Playing',
    'TRACK': 'TRACK',
    'VIBES': 'VIBES',
    'English': 'English',
    'German': 'German',
    'Enter Password': 'Enter Password',
    'Password': 'Password',
    'Submit': 'Submit',
    'Wrong Password': 'Wrong Password! Try again.',
    'This folder is protected': 'This folder is protected. Please enter the password to continue.',
  },
  deutsch: {
    'My Pictures': 'Meine Bilder',
    'My Videos': 'Meine Videos',
    'My Projects': 'Meine Projekte', 
    'About Me': 'Über Mich',
    'Contact': 'Kontakt',
    'Settings': 'Einstellungen',
    'Game.exe': 'Spiel.exe',
    'Language': 'Sprache:',
    'Appearance Theme': 'Erscheinungsbild:',
    'DreamOS': 'DreamOS',
    'Dark VHS': 'Dunkles VHS',
    'Space Mood': 'Weltraum-Stimmung',
    'Light OS 2001': 'Helles OS 2001',
    'Back to Desktop': 'Zurück zum Desktop',
    'Now Playing': 'Jetzt läuft',
    'TRACK': 'TITEL',
    'VIBES': 'STIMMUNG',
    'English': 'Englisch',
    'German': 'Deutsch',
    'Enter Password': 'Passwort eingeben',
    'Password': 'Passwort',
    'Submit': 'Bestätigen',
    'Wrong Password': 'Falsches Passwort! Versuchen Sie es erneut.',
    'This folder is protected': 'Dieser Ordner ist geschützt. Bitte geben Sie das Passwort ein, um fortzufahren.',
  }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('english');
  const [theme, setThemeState] = useState<Theme>('space-mood'); // Space Mood as default

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('henri-os-language') as Language;
    const savedTheme = localStorage.getItem('henri-os-theme') as Theme;
    
    if (savedLanguage && ['english', 'deutsch'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    
    if (savedTheme && ['dreamos', 'dark-vhs', 'space-mood', 'light-os'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('henri-os-language', newLanguage);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('henri-os-theme', newTheme);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
