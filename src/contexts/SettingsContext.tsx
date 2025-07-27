
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'deutsch';
export type Theme = 'space-mood';

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
    'About': 'About',
    'Contact': 'Contact',
    'Settings': 'Settings',
    'Radio': 'Radio',
    'Pictures': 'Pictures',
    'Challenges': 'Challenges',
    'Idea Lab': 'Idea Lab',
    'Game.exe': 'Game.exe',
    'Language': 'Language:',
    'Appearance Theme': 'Appearance Theme:',
    'Space Mood': '2000 Vibe',
    'Dark VHS': 'Dark VHS',
    'Adventure Canyon': 'Adventure Canyon',
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
    'language': 'english',
    // Music Player
    'Loading...': 'Loading...',
    'Unknown Track': 'Unknown Track',
    'No Music': 'No Music',
    'Chill Out': 'Chill Out',
    'Track': 'Track',
    'of': 'of',
    'Restart Track': 'Restart Track',
    // Footer
    'Imprint': 'Imprint',
    'Privacy': 'Privacy',
    'Privacy Policy': 'Privacy Policy',
    'This personal website does not collect or store personal data.': 'This personal website does not collect or store personal data.',
    'No tracking cookies, analytics services or third-party advertising are used.': 'No tracking cookies, analytics services or third-party advertising are used.',
    'Uploaded media is static and privately hosted. No visitor data is analyzed or monetized.': 'Uploaded media is static and privately hosted. No visitor data is analyzed or monetized.',
    'Any form submissions or visitor interactions are purely voluntary and not recorded or evaluated.': 'Any form submissions or visitor interactions are purely voluntary and not recorded or evaluated.',
    'Responsible for content:': 'Responsible for content:',
    // Videos page
    'Oops... looks like this section requires a password': 'Oops... looks like this section requires a password',
    'Enter the password to continue.': 'Enter the password to continue.',
    'Incorrect password. Try again.': 'Incorrect password. Try again.',
    'Unlock': 'Unlock',
    'Teen coaching videos created for Ute\'s TikTok and Instagram': 'Teen coaching videos created for Ute\'s TikTok and Instagram',
    'Website I built': 'Website I built',
    'A creative and content-focused internship at FALC Real Estate in Cala Millor': 'A creative and content-focused internship at FALC Real Estate in Cala Millor',
    'Entertaining TikToks with surprising twists, hooks, and storytelling': 'Entertaining TikToks with surprising twists, hooks, and storytelling',
    'My storytelling identity for vlogs, creative clips, and travel adventures': 'My storytelling identity for vlogs, creative clips, and travel adventures',
    // About page
    'A Walk Through My Brain': 'A Walk Through My Brain',
    'Hi, I\'m Henri – a 17-year-old creative from Germany who sees the world through a lens that\'s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.': 'Hi, I\'m Henri – a 17-year-old creative from Germany who sees the world through a lens that\'s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.',
    'I\'m someone who loves to explore – new places, new people, new ways of expressing myself. Whether it\'s through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that\'s the energy I try to bring into everything I do.': 'I\'m someone who loves to explore – new places, new people, new ways of expressing myself. Whether it\'s through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that\'s the energy I try to bring into everything I do.',
    'I\'ve always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I\'ve been, and what I\'m still figuring out.': 'I\'ve always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I\'ve been, and what I\'m still figuring out.',
    'If you want to connect, collaborate, or just share thoughts – feel free to reach out. I\'m always open to new ideas, new perspectives, and new stories.': 'If you want to connect, collaborate, or just share thoughts – feel free to reach out. I\'m always open to new ideas, new perspectives, and new stories.',
    // Contact page
    'Get In Touch': 'Get In Touch',
    'Let\'s connect via Instagram or Email.': 'Let\'s connect via Instagram or Email.',
    // Desktop apps
    'TV': 'TV',
    'Challenge': 'Challenge',
    // Challenge app
    '1-Minute Challenge': '1-Minute Challenge',
    'Ready for your daily mini-challenge?': 'Ready for your daily mini-challenge?',
    'Short tasks for more focus and variety in everyday life': 'Short tasks for more focus and variety in everyday life',
    'Your Challenge:': 'Your Challenge:',
    'Challenge Started!': 'Challenge Started!',
    'Challenge Complete!': 'Challenge Complete!',
    'Great job! You\'re building amazing habits!': 'Great job! You\'re building amazing habits!',
    'Challenge completed!': 'Challenge completed!',
    'You\'re building great habits!': 'You\'re building great habits!',
    'Start Challenge': 'Start Challenge',
    'Done!': 'Done!',
    'Reset': 'Reset',
    'New Challenge': 'New Challenge',
  },
  deutsch: {
    'My Pictures': 'Meine Bilder',
    'My Videos': 'Meine Videos',
    'My Projects': 'Meine Projekte', 
    'About Me': 'Über Mich',
    'About': 'Über Mich',
    'Contact': 'Kontakt',
    'Settings': 'Einstellungen',
    'Radio': 'Radio',
    'Pictures': 'Bilder',
    'Challenges': 'Challenges',
    'Idea Lab': 'Ideenlabor',
    'Game.exe': 'Spiel.exe',
    'Language': 'Sprache:',
    'Appearance Theme': 'Erscheinungsbild:',
    'Space Mood': '2000 Vibe',
    'Dark VHS': 'Dunkles VHS',
    'Adventure Canyon': 'Abenteuer Canyon',
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
    'language': 'deutsch',
    // Music Player
    'Loading...': 'Lädt...',
    'Unknown Track': 'Unbekannter Titel',
    'No Music': 'Keine Musik',
    'Chill Out': 'Entspannen',
    'Track': 'Titel',
    'of': 'von',
    'Restart Track': 'Titel Neustarten',
    // Footer
    'Imprint': 'Impressum',
    'Privacy': 'Datenschutz',
    'Privacy Policy': 'Datenschutzerklärung',
    'This personal website does not collect or store personal data.': 'Diese persönliche Website sammelt oder speichert keine persönlichen Daten.',
    'No tracking cookies, analytics services or third-party advertising are used.': 'Es werden keine Tracking-Cookies, Analysedienste oder Werbung von Drittanbietern verwendet.',
    'Uploaded media is static and privately hosted. No visitor data is analyzed or monetized.': 'Hochgeladene Medien sind statisch und privat gehostet. Besucherdaten werden nicht analysiert oder monetarisiert.',
    'Any form submissions or visitor interactions are purely voluntary and not recorded or evaluated.': 'Alle Formularübermittlungen oder Besucherinteraktionen sind rein freiwillig und werden nicht aufgezeichnet oder ausgewertet.',
    'Responsible for content:': 'Verantwortlich für den Inhalt:',
    // Videos page
    'Oops... looks like this section requires a password': 'Ups... dieser Bereich benötigt ein Passwort',
    'Enter the password to continue.': 'Geben Sie das Passwort ein, um fortzufahren.',
    'Incorrect password. Try again.': 'Falsches Passwort. Versuchen Sie es erneut.',
    'Unlock': 'Entsperren',
    'Teen coaching videos created for Ute\'s TikTok and Instagram': 'Jugend-Coaching-Videos für Utes TikTok und Instagram erstellt',
    'Website I built': 'Website die ich erstellt habe',
    'A creative and content-focused internship at FALC Real Estate in Cala Millor': 'Ein kreatives und inhaltsorientiertes Praktikum bei FALC Real Estate in Cala Millor',
    'Entertaining TikToks with surprising twists, hooks, and storytelling': 'Unterhaltsame TikToks mit überraschenden Wendungen, Hooks und Geschichten',
    'My storytelling identity for vlogs, creative clips, and travel adventures': 'Meine Storytelling-Identität für Vlogs, kreative Clips und Reiseabenteuer',
    // About page
    'A Walk Through My Brain': 'Ein Spaziergang durch mein Gehirn',
    'Hi, I\'m Henri – a 17-year-old creative from Germany who sees the world through a lens that\'s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.': 'Hi, ich bin Henri – ein 17-jähriger Kreativer aus Deutschland, der die Welt durch eine Linse betrachtet, die etwas nostalgisch, etwas neugierig ist und immer nach Bedeutung sucht. Ich fing an zu fotografieren, nicht weil ich Fotograf werden wollte, sondern weil ich Gefühle festhalten wollte. Momente. Die kleinen Dinge, die normalerweise unbemerkt vorbeiziehen.',
    'I\'m someone who loves to explore – new places, new people, new ways of expressing myself. Whether it\'s through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that\'s the energy I try to bring into everything I do.': 'Ich bin jemand, der es liebt zu erkunden – neue Orte, neue Menschen, neue Wege mich auszudrücken. Ob durch Fotografie, Video, Design oder einfach nächtliche Ideen in meiner Notizen-App, ich genieße es, Dinge zu schaffen, die andere etwas fühlen lassen. Ich glaube, Kreativität sollte ein Spielplatz sein, kein Druck – und das ist die Energie, die ich in alles einzubringen versuche.',
    'I\'ve always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I\'ve been, and what I\'m still figuring out.': 'Ich war schon immer fasziniert von der Mischung aus Alt und Neu. Ich liebe analoge Kameras genauso sehr wie glitchy Websites. Ich genieße es, digitale Räume zu schaffen, die menschlich wirken, die unperfeekt, ehrlich und etwas verspielt sind. Diese Seite ist ein Stück davon – nicht nur ein Portfolio, sondern eine kleine Reflexion dessen, wer ich bin, wo ich war und was ich noch herausfinde.',
    'If you want to connect, collaborate, or just share thoughts – feel free to reach out. I\'m always open to new ideas, new perspectives, and new stories.': 'Wenn Sie sich vernetzen, zusammenarbeiten oder einfach Gedanken teilen möchten – zögern Sie nicht, sich zu melden. Ich bin immer offen für neue Ideen, neue Perspektiven und neue Geschichten.',
    // Contact page
    'Get In Touch': 'Kontakt Aufnehmen',
    'Let\'s connect via Instagram or Email.': 'Lass uns über Instagram oder E-Mail in Kontakt treten.',
    // Desktop apps
    'TV': 'TV',
    'Challenge': 'Challenge',
    // Challenge app
    '1-Minute Challenge': '1-Minuten Challenge',
    'Ready for your daily mini-challenge?': 'Bereit für deine tägliche Mini-Challenge?',
    'Short tasks for more focus and variety in everyday life': 'Kurze Aufgaben für mehr Fokus und Abwechslung im Alltag',
    'Your Challenge:': 'Deine Challenge:',
    'Challenge Started!': 'Challenge gestartet!',
    'Challenge Complete!': 'Challenge abgeschlossen!',
    'Great job! You\'re building amazing habits!': 'Großartig! Du baust tolle Gewohnheiten auf!',
    'Challenge completed!': 'Challenge abgeschlossen!',
    'You\'re building great habits!': 'Du baust großartige Gewohnheiten auf!',
    'Start Challenge': 'Challenge starten',
    'Done!': 'Erledigt!',
    'Reset': 'Zurücksetzen',
    'New Challenge': 'Neue Challenge',
  }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('english');
  const [theme, setThemeState] = useState<Theme>('space-mood');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('henri-os-language') as Language;
    const savedTheme = localStorage.getItem('henri-os-theme');
    
    if (savedLanguage && ['english', 'deutsch'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    
    // Only set space-mood or default to space-mood, clearing any old theme values
    if (savedTheme === 'space-mood') {
      setThemeState('space-mood');
    } else {
      // Clear any invalid theme from localStorage
      localStorage.setItem('henri-os-theme', 'space-mood');
      setThemeState('space-mood');
    }
    
    setIsInitialized(true);
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

  // Don't render children until context is initialized
  if (!isInitialized) {
    return null;
  }

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
