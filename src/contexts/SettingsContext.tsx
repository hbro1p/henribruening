
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'deutsch' | 'español';
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
    'Shop': 'Shop',
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
    'Spanish': 'Spanish',
    'Enter Password': 'Enter Password',
    'Password': 'Password',
    'Submit': 'Submit',
    'Wrong Password': 'Wrong Password! Try again.',
    'This folder is protected': 'This folder is protected. Please enter the password to continue.',
    'language': 'english',
    
    // Care&Share translations
    'care_share_title': 'Care&Share',
    'care_share_subtitle': 'Help & be helped',
    'care_share_description': 'Connect with your neighborhood. Offer help or find someone to help you.',
    'care_share_need_help': 'I need help',
    'care_share_want_help': 'I want to help',
    'care_share_find_helpers': 'Find helpers',
    'care_share_show_requests': 'Show help requests',
    'care_share_accept': 'Accept',
    'care_share_decline': 'Decline',
    'care_share_offer_help': 'Offer help',
    'care_share_back_start': 'Back to start',
    'care_share_name': 'Name',
    'care_share_age': 'Age',
    'care_share_category': 'Category',
    'care_share_timeframe': 'Timeframe',
    'care_share_skills': 'Skills',
    'care_share_availability': 'Availability',
    'care_share_shopping': 'Shopping',
    'care_share_walk': 'Walk',
    'care_share_household': 'Household',
    'care_share_garden': 'Garden',
    'care_share_it_help': 'IT Help',
    'care_share_transport': 'Transport',
    'care_share_today': 'Today',
    'care_share_tomorrow': 'Tomorrow',
    'care_share_this_week': 'This week',
    'care_share_flexible': 'Flexible',
    'care_share_it': 'IT',
    'care_share_company': 'Company',
    'care_share_morning': 'Morning',
    'care_share_afternoon': 'Afternoon',
    'care_share_evening': 'Evening',
    'care_share_weekend': 'Weekend',
    
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
    // Shop page
    'La Vaca': 'La Vaca',
    'Click to flip': 'Click to flip',
    'Buy now': 'Buy now',
    'Inquire': 'Inquire',
    'la-vaca-story-1': 'A cow has lost her way. She stands on a log, somewhere out there.\nMaybe on a lake, maybe on the ocean. No one really knows.',
    'la-vaca-story-2': 'What we do know is this:\nShe once stood on a green meadow, surrounded by what she knew.\nNow she drifts in blue, far away from anything familiar.',
    'la-vaca-story-3': 'Sometimes our lives feel the same.\nWe lose direction, we are unsure where we belong,\nyet we always remember where we came from.',
    'la-vaca-story-4': 'The cow does not look sad.\nShe looks curious. Maybe even quietly content,\nas if she is ready for the adventure ahead.',
    'la-vaca-story-5': 'Maybe we can learn from her.\nSometimes it is enough to take one step into the unknown. 🌊',
    'Artist credit': 'An artwork by @Henribruening',
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
    'View on': 'View on',
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
    'Shop': 'Shop',
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
    'Spanish': 'Spanisch',
    'Enter Password': 'Passwort eingeben',
    'Password': 'Passwort',
    'Submit': 'Bestätigen',
    'Wrong Password': 'Falsches Passwort! Versuchen Sie es erneut.',
    'This folder is protected': 'Dieser Ordner ist geschützt. Bitte geben Sie das Passwort ein, um fortzufahren.',
    'language': 'deutsch',
    
    // Care&Share translations
    'care_share_title': 'Care&Share',
    'care_share_subtitle': 'Helfe und werde geholfen',
    'care_share_description': 'Verbinde dich mit deiner Nachbarschaft. Biete Hilfe an oder finde jemanden, der dir hilft.',
    'care_share_need_help': 'Ich brauche Hilfe',
    'care_share_want_help': 'Ich möchte helfen',
    'care_share_find_helpers': 'Helfer finden',
    'care_share_show_requests': 'Hilfegesuche anzeigen',
    'care_share_accept': 'Annehmen',
    'care_share_decline': 'Ablehnen',
    'care_share_offer_help': 'Hilfe anbieten',
    'care_share_back_start': 'Zurück zum Start',
    'care_share_name': 'Name',
    'care_share_age': 'Alter',
    'care_share_category': 'Kategorie',
    'care_share_timeframe': 'Zeitraum',
    'care_share_skills': 'Kenntnisse',
    'care_share_availability': 'Verfügbarkeit',
    'care_share_shopping': 'Einkauf',
    'care_share_walk': 'Spaziergang',
    'care_share_household': 'Haushalt',
    'care_share_garden': 'Garten',
    'care_share_it_help': 'IT-Hilfe',
    'care_share_transport': 'Transport',
    'care_share_today': 'Heute',
    'care_share_tomorrow': 'Morgen',
    'care_share_this_week': 'Diese Woche',
    'care_share_flexible': 'Flexibel',
    'care_share_it': 'IT',
    'care_share_company': 'Gesellschaft',
    'care_share_morning': 'Vormittags',
    'care_share_afternoon': 'Nachmittags',
    'care_share_evening': 'Abends',
    'care_share_weekend': 'Wochenende',
    
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
    // Shop page
    'La Vaca': 'La Vaca',
    'Click to flip': 'Klicke zum Umdrehen',
    'Buy now': 'Jetzt kaufen',
    'Inquire': 'Anfragen',
    'la-vaca-story-1': 'Eine Kuh hat sich verirrt. Sie steht auf einem Baumstamm, irgendwo draußen.\nVielleicht auf einem See, vielleicht auf dem Meer. Keiner weiß es genau.',
    'la-vaca-story-2': 'Sicher ist nur eins:\nFrüher stand sie auf einer grünen Wiese, vertraut und sicher.\nJetzt treibt sie im Blau, weit weg von allem Bekannten.',
    'la-vaca-story-3': 'So geht es manchmal auch uns.\nWir verlieren die Orientierung, wir wissen nicht, wohin wir gehören,\naber wir erinnern uns immer an unseren Ursprung.',
    'la-vaca-story-4': 'Die Kuh wirkt nicht traurig.\nSie wirkt neugierig. Vielleicht sogar still zufrieden,\nals würde sie das Abenteuer annehmen.',
    'la-vaca-story-5': 'Vielleicht können wir uns davon etwas mitnehmen.\nManchmal hilft es, den Schritt ins Unbekannte einfach zu wagen. 🌊',
    'Artist credit': 'Ein Kunstwerk von @Henribruening',
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
    'View on': 'Ansehen auf',
  },
  español: {
    'My Pictures': 'Mis Fotos',
    'My Videos': 'Mis Videos',
    'My Projects': 'Mis Proyectos', 
    'About Me': 'Sobre Mí',
    'About': 'Sobre Mí',
    'Contact': 'Contacto',
    'Settings': 'Configuración',
    'Radio': 'Radio',
    'Pictures': 'Fotos',
    'Challenges': 'Desafíos',
    'Shop': 'Tienda',
    'Idea Lab': 'Laboratorio de Ideas',
    'Game.exe': 'Juego.exe',
    'Language': 'Idioma:',
    'Appearance Theme': 'Tema de Apariencia:',
    'Space Mood': 'Vibra 2000',
    'Dark VHS': 'VHS Oscuro',
    'Adventure Canyon': 'Cañón Aventura',
    'Back to Desktop': 'Volver al Escritorio',
    'Now Playing': 'Reproduciendo',
    'TRACK': 'PISTA',
    'VIBES': 'VIBRAS',
    'English': 'Inglés',
    'German': 'Alemán',
    'Spanish': 'Español',
    'Enter Password': 'Introducir Contraseña',
    'Password': 'Contraseña',
    'Submit': 'Enviar',
    'Wrong Password': '¡Contraseña incorrecta! Inténtalo de nuevo.',
    'This folder is protected': 'Esta carpeta está protegida. Por favor introduce la contraseña para continuar.',
    'language': 'español',
    
    // Care&Share translations
    'care_share_title': 'Care&Share',
    'care_share_subtitle': 'Ayuda y recibe ayuda',
    'care_share_description': 'Conéctate con tu vecindario. Ofrece ayuda o encuentra a alguien que te ayude.',
    'care_share_need_help': 'Necesito ayuda',
    'care_share_want_help': 'Quiero ayudar',
    'care_share_find_helpers': 'Encontrar ayudantes',
    'care_share_show_requests': 'Mostrar solicitudes de ayuda',
    'care_share_accept': 'Aceptar',
    'care_share_decline': 'Rechazar',
    'care_share_offer_help': 'Ofrecer ayuda',
    'care_share_back_start': 'Volver al inicio',
    'care_share_name': 'Nombre',
    'care_share_age': 'Edad',
    'care_share_category': 'Categoría',
    'care_share_timeframe': 'Marco temporal',
    'care_share_skills': 'Habilidades',
    'care_share_availability': 'Disponibilidad',
    'care_share_shopping': 'Compras',
    'care_share_walk': 'Paseo',
    'care_share_household': 'Hogar',
    'care_share_garden': 'Jardín',
    'care_share_it_help': 'Ayuda IT',
    'care_share_transport': 'Transporte',
    'care_share_today': 'Hoy',
    'care_share_tomorrow': 'Mañana',
    'care_share_this_week': 'Esta semana',
    'care_share_flexible': 'Flexible',
    'care_share_it': 'IT',
    'care_share_company': 'Compañía',
    'care_share_morning': 'Mañana',
    'care_share_afternoon': 'Tarde',
    'care_share_evening': 'Noche',
    'care_share_weekend': 'Fin de semana',
    
    // Music Player
    'Loading...': 'Cargando...',
    'Unknown Track': 'Pista Desconocida',
    'No Music': 'Sin Música',
    'Chill Out': 'Relajarse',
    'Track': 'Pista',
    'of': 'de',
    'Restart Track': 'Reiniciar Pista',
    
    // More Videos text
    'More Videos Available on the TV App': 'Más Videos Disponibles en la App de TV',
    // Footer
    'Imprint': 'Aviso Legal',
    'Privacy': 'Privacidad',
    'Privacy Policy': 'Política de Privacidad',
    'This personal website does not collect or store personal data.': 'Este sitio web personal no recopila ni almacena datos personales.',
    'No tracking cookies, analytics services or third-party advertising are used.': 'No se utilizan cookies de seguimiento, servicios de análisis o publicidad de terceros.',
    'Uploaded media is static and privately hosted. No visitor data is analyzed or monetized.': 'Los medios subidos son estáticos y alojados de forma privada. No se analizan ni monetizan los datos de visitantes.',
    'Any form submissions or visitor interactions are purely voluntary and not recorded or evaluated.': 'Cualquier envío de formulario o interacción de visitantes es puramente voluntario y no se registra ni evalúa.',
    'Responsible for content:': 'Responsable del contenido:',
    // Videos page
    'Oops... looks like this section requires a password': 'Ups... parece que esta sección requiere contraseña',
    'Enter the password to continue.': 'Introduce la contraseña para continuar.',
    'Incorrect password. Try again.': 'Contraseña incorrecta. Inténtalo de nuevo.',
    'Unlock': 'Desbloquear',
    'Teen coaching videos created for Ute\'s TikTok and Instagram': 'Videos de coaching para adolescentes creados para TikTok e Instagram de Ute',
    'Website I built': 'Sitio web que construí',
    'A creative and content-focused internship at FALC Real Estate in Cala Millor': 'Una pasantía creativa y enfocada en contenido en FALC Real Estate en Cala Millor',
    'Entertaining TikToks with surprising twists, hooks, and storytelling': 'TikToks entretenidos con giros sorprendentes, ganchos y narrativa',
    'My storytelling identity for vlogs, creative clips, and travel adventures': 'Mi identidad narrativa para vlogs, clips creativos y aventuras de viaje',
    // About page
    'A Walk Through My Brain': 'Un Paseo por Mi Mente',
    'Hi, I\'m Henri – a 17-year-old creative from Germany who sees the world through a lens that\'s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.': 'Hola, soy Henri – un creativo de 17 años de Alemania que ve el mundo a través de una lente un poco nostálgica, un poco curiosa y siempre buscando significado. Comencé a tomar fotos no porque quisiera ser fotógrafo, sino porque quería aferrarme a los sentimientos. A los momentos. A las pequeñas cosas que usualmente pasan desapercibidas.',
    
    // Additional translations for Spanish
    'Back': 'Atrás',
    // Contact page
    'Get In Touch': 'Ponerse en Contacto',
    'Let\'s connect via Instagram or Email.': 'Conectemos a través de Instagram o correo electrónico.',
    // Shop page
    'La Vaca': 'La Vaca',
    'Click to flip': 'Haz clic para voltear',
    'Buy now': 'Comprar ahora',
    'Inquire': 'Consultar',
    'la-vaca-story-1': 'Una vaca se ha perdido. Está sobre un tronco, en algún lugar lejos de todo.\nQuizá en un lago, quizá en el mar. Nadie lo sabe con certeza.',
    'la-vaca-story-2': 'Lo único seguro es esto:\nAntes vivía en un prado verde, rodeada de lo que conocía.\nAhora flota en el azul, lejos de todo lo familiar.',
    'la-vaca-story-3': 'A veces nuestra vida se siente igual.\nPerdemos la dirección, no sabemos dónde pertenecemos,\npero siempre recordamos de dónde venimos.',
    'la-vaca-story-4': 'La vaca no parece triste.\nSe ve curiosa, incluso tranquila y contenta,\ncomo si aceptara la aventura que le espera.',
    'la-vaca-story-5': 'Tal vez podamos aprender de ella.\nA veces basta con dar un paso hacia lo desconocido. 🌊',
    'Artist credit': 'Una obra de arte de @Henribruening',
    
    
    // IdeaLab Complete Spanish translations
    'Idea Laboratory': 'Laboratorio de Ideas',
    'Welcome to my Idea Laboratory.': 'Bienvenido a mi Laboratorio de Ideas.',
    'Here you\'ll find concepts I haven\'t implemented yet – sometimes raw, sometimes almost finished, but always open for feedback.': 'Aquí encontrarás conceptos que aún no he implementado – a veces crudos, a veces casi terminados, pero siempre abiertos a comentarios.',
    'You can rate each idea and help me with a comment.': 'Puedes calificar cada idea y ayudarme con un comentario.',
    'Which idea do you like? What would you do differently? Tell me. Your opinion matters.': '¿Qué idea te gusta? ¿Qué harías diferente? Dímelo. Tu opinión importa.',
    'Discover innovative concepts and test functional prototypes': 'Descubre conceptos innovadores y prueba prototipos funcionales',
    'Discover Ideas': 'Descubrir Ideas',
    'My Ideas': 'Mis Ideas',
    'View Details': 'Ver Detalles',
    'Test': 'Probar',
    'Details ansehen': 'Ver Detalles',
    'Testen': 'Probar',
    'No ideas yet': 'Aún no hay ideas',
    'New ideas will appear here soon...': 'Nuevas ideas aparecerán aquí pronto...',
    'ratings': 'calificaciones',
    'Bewertungen': 'calificaciones',
    
    // Project titles in Spanish
    'Pulse-Pad – the bathroom mat that saves lives': 'Pulse-Pad – la alfombra de baño que salva vidas',
    'Care and Share': 'Cuidar y Compartir',
    
    // Rating System Spanish
    'You like what you see and want to make it come true?': '¿Te gusta lo que ves y quieres hacerlo realidad?',
    'Message Me': 'Escríbeme',
    'Your Rating': 'Tu Calificación',
    'Rating (1-5 stars)': 'Calificación (1-5 estrellas)',
    'Feedback (optional)': 'Comentarios (opcional)',
    'Share your thoughts and suggestions for improvement...': 'Comparte tus pensamientos y sugerencias de mejora...',
    'Submit Rating': 'Enviar Calificación',
    
    // Care&Share Prototype Spanish
    'Helfe und werde geholfen': 'Ayuda y recibe ayuda',
    'Ich brauche Hilfe': 'Necesito ayuda',
    'Ich möchte helfen': 'Quiero ayudar',
    'Name': 'Nombre',
    'Altersbereich': 'Rango de edad',
    'Hilfe-Kategorie': 'Categoría de ayuda',
    'Wann brauchen Sie Hilfe?': '¿Cuándo necesitas ayuda?',
    'Helfer finden': 'Encontrar ayudantes',
    'Telefonnummer': 'Número de teléfono',
    'Facebook Name (optional)': 'Nombre de Facebook (opcional)',
    'Wobei können Sie helfen?': '¿En qué puedes ayudar?',
    'Wann sind Sie verfügbar?': '¿Cuándo estás disponible?',
    'Hilfesuchende finden': 'Encontrar personas que buscan ayuda',
    'Interactive Prototype': 'Prototipo Interactivo',
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
    
    if (savedLanguage && ['english', 'deutsch', 'español'].includes(savedLanguage)) {
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
