import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Sparkles, Check, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

type Lang = 'english' | 'deutsch' | 'español';
type Trio = { en: string; de: string; es: string };

interface Question {
  q: Trio;
  options: [Trio, Trio, Trio];
  correct: 0 | 1 | 2;
  explanation?: Trio;
}

const QUESTIONS: Question[] = [
  {
    q: { en: 'In which city does Henri live?', de: 'In welcher Stadt wohnt Henri?', es: '¿En qué ciudad vive Henri?' },
    options: [
      { en: 'Münster', de: 'Münster', es: 'Münster' },
      { en: 'Coesfeld', de: 'Coesfeld', es: 'Coesfeld' },
      { en: 'Berlin', de: 'Berlin', es: 'Berlín' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Who did Henri organize the free flea market with?', de: 'Mit wem hat Henri den kostenlosen Flohmarkt organisiert?', es: '¿Con quién organizó Henri el mercadillo gratuito?' },
    options: [
      { en: 'Arne', de: 'Arne', es: 'Arne' },
      { en: 'Florian', de: 'Florian', es: 'Florian' },
      { en: 'Kelwin', de: 'Kelwin', es: 'Kelwin' },
    ],
    correct: 0,
  },
  {
    q: { en: 'What was the topic of Henri\'s English research paper?', de: 'Worum ging es in Henris Englisch-Facharbeit?', es: '¿De qué trató el trabajo de investigación en inglés de Henri?' },
    options: [
      { en: 'AI in education', de: 'KI im Schulalltag', es: 'IA en la educación' },
      { en: 'The Fading American Dream in Brooklyn', de: 'Der schwindende American Dream in Brooklyn', es: 'El American Dream desvaneciéndose en Brooklyn' },
      { en: 'Brexit and youth', de: 'Brexit und Jugend', es: 'Brexit y la juventud' },
    ],
    correct: 1,
  },
  {
    q: { en: 'How did Henri find people for his Brooklyn interviews?', de: 'Wie hat Henri Leute für seine Brooklyn-Interviews gefunden?', es: '¿Cómo encontró Henri gente para sus entrevistas en Brooklyn?' },
    options: [
      { en: 'Cold emails to brokers', de: 'Kalt-E-Mails an Makler', es: 'Correos en frío a agentes' },
      { en: 'A viral Reddit post', de: 'Einen viralen Reddit-Post', es: 'Una publicación viral en Reddit' },
      { en: 'A travel agency', de: 'Ein Reisebüro', es: 'Una agencia de viajes' },
    ],
    correct: 1,
    explanation: { en: 'The Reddit post got over 17,000 views.', de: 'Der Reddit-Post hatte über 17.000 Aufrufe.', es: 'La publicación tuvo más de 17.000 visualizaciones.' },
  },
  {
    q: { en: 'Which real estate agent does Henri create social media for?', de: 'Für welchen Immobilienmakler macht Henri Social Media?', es: '¿Para qué agente inmobiliario crea Henri redes sociales?' },
    options: [
      { en: 'Florian Klostermann', de: 'Florian Klostermann', es: 'Florian Klostermann' },
      { en: 'Kelwin Lamparter', de: 'Kelwin Lamparter', es: 'Kelwin Lamparter' },
      { en: 'Ute Uphues', de: 'Ute Uphues', es: 'Ute Uphues' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Roughly how many followers did Kelwin\'s account gain in ~2 months?', de: 'Wie viele Follower bekam Kelwins Account in ca. 2 Monaten?', es: '¿Cuántos seguidores ganó la cuenta de Kelwin en unos 2 meses?' },
    options: [
      { en: '~200', de: '~200', es: '~200' },
      { en: '~1,400', de: '~1.400', es: '~1.400' },
      { en: '~10,000', de: '~10.000', es: '~10.000' },
    ],
    correct: 1,
  },
  {
    q: { en: 'What is Internly?', de: 'Was ist Internly?', es: '¿Qué es Internly?' },
    options: [
      { en: 'A music streaming service', de: 'Ein Musik-Streaming-Dienst', es: 'Un servicio de streaming de música' },
      { en: 'A platform connecting students with internships', de: 'Eine Plattform, die Studenten mit Praktika verbindet', es: 'Una plataforma que conecta estudiantes con prácticas' },
      { en: 'A photography agency', de: 'Eine Fotoagentur', es: 'Una agencia de fotografía' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Is Internly still active?', de: 'Ist Internly noch aktiv?', es: '¿Sigue activo Internly?' },
    options: [
      { en: 'Yes, growing fast', de: 'Ja, wächst schnell', es: 'Sí, creciendo rápido' },
      { en: 'No, Henri stopped it', de: 'Nein, Henri hat aufgehört', es: 'No, Henri lo paró' },
      { en: 'It became a podcast', de: 'Es wurde ein Podcast', es: 'Se convirtió en un podcast' },
    ],
    correct: 1,
  },
  {
    q: { en: 'When did Henri\'s 365-day Strava challenge start?', de: 'Wann startete Henris 365-Tage-Strava-Challenge?', es: '¿Cuándo empezó el reto de 365 días en Strava?' },
    options: [
      { en: 'January 1, 2026', de: '1. Januar 2026', es: '1 de enero de 2026' },
      { en: 'December 14, 2025', de: '14. Dezember 2025', es: '14 de diciembre de 2025' },
      { en: 'June 1, 2025', de: '1. Juni 2025', es: '1 de junio de 2025' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Henri switched from Strava to which tracker?', de: 'Henri ist von Strava zu welchem Tracker gewechselt?', es: '¿A qué tracker cambió Henri desde Strava?' },
    options: [
      { en: 'Garmin', de: 'Garmin', es: 'Garmin' },
      { en: 'Fitbit', de: 'Fitbit', es: 'Fitbit' },
      { en: 'Apple Watch', de: 'Apple Watch', es: 'Apple Watch' },
    ],
    correct: 1,
  },
  {
    q: { en: 'How many Brooklyn video interviews did Henri record?', de: 'Wie viele Brooklyn-Videointerviews hat Henri aufgenommen?', es: '¿Cuántas entrevistas en video grabó Henri en Brooklyn?' },
    options: [{ en: '2', de: '2', es: '2' }, { en: '5', de: '5', es: '5' }, { en: '12', de: '12', es: '12' }],
    correct: 1,
  },
  {
    q: { en: 'Which local food brand did Henri make viral content for?', de: 'Für welche lokale Food-Marke hat Henri virale Inhalte gemacht?', es: '¿Para qué marca local hizo Henri contenido viral?' },
    options: [
      { en: 'Kebab Bros Coesfeld', de: 'Kebab Bros Coesfeld', es: 'Kebab Bros Coesfeld' },
      { en: 'Burger Town', de: 'Burger Town', es: 'Burger Town' },
      { en: 'Pizza Palace', de: 'Pizza Palace', es: 'Pizza Palace' },
    ],
    correct: 0,
  },
  {
    q: { en: 'How many views did Henri\'s Döner-action videos get in total?', de: 'Wie viele Aufrufe hatten Henris Döner-Aktion-Videos insgesamt?', es: '¿Cuántas vistas tuvieron los videos de la acción Döner en total?' },
    options: [
      { en: '~9,000', de: '~9.000', es: '~9.000' },
      { en: '~90,000', de: '~90.000', es: '~90.000' },
      { en: '~900,000', de: '~900.000', es: '~900.000' },
    ],
    correct: 1,
  },
  {
    q: { en: 'For which politician did Henri produce campaign videos?', de: 'Für welchen Politiker hat Henri Wahlkampfvideos produziert?', es: '¿Para qué político produjo Henri videos de campaña?' },
    options: [
      { en: 'Florian Klostermann', de: 'Florian Klostermann', es: 'Florian Klostermann' },
      { en: 'Friedrich Merz', de: 'Friedrich Merz', es: 'Friedrich Merz' },
      { en: 'Markus Söder', de: 'Markus Söder', es: 'Markus Söder' },
    ],
    correct: 0,
  },
  {
    q: { en: 'What is the name of the cow artwork in Henri\'s shop?', de: 'Wie heißt das Kuh-Kunstwerk in Henris Shop?', es: '¿Cómo se llama la obra de la vaca en la tienda de Henri?' },
    options: [
      { en: 'The Silly Cow / La Vaca', de: 'The Silly Cow / La Vaca', es: 'The Silly Cow / La Vaca' },
      { en: 'Moo Moo', de: 'Moo Moo', es: 'Moo Moo' },
      { en: 'Bessie', de: 'Bessie', es: 'Bessie' },
    ],
    correct: 0,
  },
  {
    q: { en: 'How much does The Silly Cow cost?', de: 'Was kostet The Silly Cow?', es: '¿Cuánto cuesta The Silly Cow?' },
    options: [{ en: '€199', de: '199 €', es: '199 €' }, { en: '€499', de: '499 €', es: '499 €' }, { en: '€1,299', de: '1.299 €', es: '1.299 €' }],
    correct: 1,
  },
  {
    q: { en: 'Where do Henri\'s shop buy buttons send you?', de: 'Wohin führen die Kaufen-Buttons im Shop?', es: '¿A dónde llevan los botones de comprar en la tienda?' },
    options: [
      { en: 'Stripe checkout', de: 'Stripe-Checkout', es: 'Pago por Stripe' },
      { en: 'Etsy listing', de: 'Etsy-Anzeige', es: 'Listado de Etsy' },
      { en: 'PayPal.me link', de: 'PayPal.me-Link', es: 'Enlace de PayPal.me' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Henri\'s Instagram handle is…', de: 'Henris Instagram-Handle ist…', es: 'El @ de Instagram de Henri es…' },
    options: [
      { en: '@henri.bruening', de: '@henri.bruening', es: '@henri.bruening' },
      { en: '@henribruening', de: '@henribruening', es: '@henribruening' },
      { en: '@henri_b', de: '@henri_b', es: '@henri_b' },
    ],
    correct: 1,
  },
  {
    q: { en: 'How many languages does this portfolio support?', de: 'Wie viele Sprachen unterstützt dieses Portfolio?', es: '¿Cuántos idiomas soporta este portfolio?' },
    options: [{ en: '2', de: '2', es: '2' }, { en: '3', de: '3', es: '3' }, { en: '5', de: '5', es: '5' }],
    correct: 1,
    explanation: { en: 'English, German, Spanish.', de: 'Englisch, Deutsch, Spanisch.', es: 'Inglés, alemán, español.' },
  },
  {
    q: { en: 'Which gallery categories exist on the Pictures page?', de: 'Welche Galerie-Kategorien gibt es auf Pictures?', es: '¿Qué categorías de galería existen?' },
    options: [
      { en: 'Family, Friends, Work', de: 'Familie, Freunde, Arbeit', es: 'Familia, Amigos, Trabajo' },
      { en: 'Kindheit, Natur, Travel', de: 'Kindheit, Natur, Travel', es: 'Kindheit, Natur, Travel' },
      { en: 'Food, Cars, Cities', de: 'Essen, Autos, Städte', es: 'Comida, Coches, Ciudades' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Which local website did Henri NOT design?', de: 'Welche lokale Website hat Henri NICHT gebaut?', es: '¿Qué web local NO diseñó Henri?' },
    options: [
      { en: 'immobilienbewertung-lamparter.de', de: 'immobilienbewertung-lamparter.de', es: 'immobilienbewertung-lamparter.de' },
      { en: 'uteuphues.de', de: 'uteuphues.de', es: 'uteuphues.de' },
      { en: 'spiegel.de', de: 'spiegel.de', es: 'spiegel.de' },
    ],
    correct: 2,
  },
  {
    q: { en: 'What was Henri\'s research conclusion about the American Dream in Brooklyn?', de: 'Was war Henris Fazit zum American Dream in Brooklyn?', es: '¿Cuál fue la conclusión de Henri sobre el sueño americano en Brooklyn?' },
    options: [
      { en: 'Stronger than ever', de: 'Stärker als je zuvor', es: 'Más fuerte que nunca' },
      { en: 'Owning a home is barely reachable; the dream shifted to belonging & freedom', de: 'Eigenheim kaum erreichbar; Traum wandelt sich zu Zugehörigkeit & Freiheit', es: 'Casa propia apenas alcanzable; el sueño se desplaza a pertenencia y libertad' },
      { en: 'Completely dead', de: 'Komplett tot', es: 'Completamente muerto' },
    ],
    correct: 1,
  },
  {
    q: { en: 'What kind of activities does the Strava 2026 challenge count?', de: 'Welche Aktivitäten zählen im Strava-2026-Challenge?', es: '¿Qué actividades cuentan en el reto Strava 2026?' },
    options: [
      { en: 'Only running', de: 'Nur Laufen', es: 'Solo correr' },
      { en: 'Runs and walks (toggleable)', de: 'Laufen & Gehen (umschaltbar)', es: 'Correr y caminar (alternables)' },
      { en: 'Cycling only', de: 'Nur Radfahren', es: 'Solo ciclismo' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Where did Henri study his Brooklyn topic from?', de: 'Worüber lief Henris Brooklyn-Recherche hauptsächlich?', es: '¿Sobre qué giró la investigación de Brooklyn?' },
    options: [
      { en: 'Gentrification & housing affordability', de: 'Gentrifizierung & Wohnkosten', es: 'Gentrificación y precio de la vivienda' },
      { en: 'Crime statistics', de: 'Kriminalitätsstatistik', es: 'Estadísticas de crimen' },
      { en: 'Public transport', de: 'Öffentlicher Nahverkehr', es: 'Transporte público' },
    ],
    correct: 0,
  },
  {
    q: { en: 'Which of these is a real Henri project?', de: 'Welches davon ist ein echtes Henri-Projekt?', es: '¿Cuál de estos es un proyecto real de Henri?' },
    options: [
      { en: 'Coesfelder Flohmarkt', de: 'Coesfelder Flohmarkt', es: 'Coesfelder Flohmarkt' },
      { en: 'Coesfelder Casino', de: 'Coesfelder Casino', es: 'Coesfelder Casino' },
      { en: 'Coesfelder Bank', de: 'Coesfelder Bank', es: 'Coesfelder Bank' },
    ],
    correct: 0,
  },
  {
    q: { en: 'The Coesfelder Flohmarkt is…', de: 'Der Coesfelder Flohmarkt ist…', es: 'El Coesfelder Flohmarkt es…' },
    options: [
      { en: 'A paid VIP event', de: 'Ein bezahltes VIP-Event', es: 'Un evento VIP de pago' },
      { en: 'A free neighborhood flea market', de: 'Ein kostenloser Nachbarschaftsflohmarkt', es: 'Un mercadillo de barrio gratuito' },
      { en: 'A weekly farmer\'s market', de: 'Ein wöchentlicher Bauernmarkt', es: 'Un mercado semanal de granjeros' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Henri\'s portfolio aesthetic is best described as…', de: 'Henris Portfolio-Ästhetik beschreibt man am besten als…', es: 'La estética del portfolio de Henri se describe mejor como…' },
    options: [
      { en: 'Minimal corporate', de: 'Minimal-Corporate', es: 'Corporativo minimalista' },
      { en: 'Retro desktop OS', de: 'Retro-Desktop-Betriebssystem', es: 'Sistema operativo retro' },
      { en: 'Brutalist black-and-white', de: 'Brutalistisch schwarz-weiß', es: 'Brutalista blanco y negro' },
    ],
    correct: 1,
  },
  {
    q: { en: 'What\'s the philosophy behind The Silly Cow artwork?', de: 'Was steckt hinter dem Kunstwerk The Silly Cow?', es: '¿Qué hay detrás de la obra The Silly Cow?' },
    options: [
      { en: 'A philosophical narrative about life and absurdity', de: 'Eine philosophische Erzählung über Leben und Absurdität', es: 'Una narrativa filosófica sobre la vida y la absurdidad' },
      { en: 'Just a funny cow', de: 'Einfach eine lustige Kuh', es: 'Solo una vaca divertida' },
      { en: 'A children\'s book illustration', de: 'Eine Kinderbuch-Illustration', es: 'Una ilustración de libro infantil' },
    ],
    correct: 0,
  },
  {
    q: { en: 'Which of these did Henri NOT do for his Facharbeit?', de: 'Was hat Henri für seine Facharbeit NICHT getan?', es: '¿Qué NO hizo Henri para su trabajo de investigación?' },
    options: [
      { en: 'Conduct video interviews', de: 'Videointerviews führen', es: 'Hacer entrevistas en video' },
      { en: 'Post on Reddit', de: 'Auf Reddit posten', es: 'Publicar en Reddit' },
      { en: 'Fly to Brooklyn personally', de: 'Persönlich nach Brooklyn fliegen', es: 'Volar a Brooklyn en persona' },
    ],
    correct: 2,
  },
  {
    q: { en: 'What does Henri value in his projects?', de: 'Was ist Henri bei seinen Projekten wichtig?', es: '¿Qué valora Henri en sus proyectos?' },
    options: [
      { en: 'Planning, researching and actually executing himself', de: 'Selbst planen, recherchieren und umsetzen', es: 'Planear, investigar y ejecutar él mismo' },
      { en: 'Outsourcing everything', de: 'Alles outsourcen', es: 'Externalizar todo' },
      { en: 'Following trends only', de: 'Nur Trends folgen', es: 'Solo seguir tendencias' },
    ],
    correct: 0,
  },
];

const T: Record<Lang, Record<string, string>> = {
  english: {
    title: 'Have you stalked me enough?',
    sub: "Let's test. 3 random questions about me — pick the right answer.",
    start: 'Start the quiz',
    next: 'Next question',
    finish: 'See result',
    again: 'Play again',
    back: 'Back to Desktop',
    score: 'You scored',
    of: 'of',
    perfect: 'Certified Henri-stalker. Impressive.',
    great: 'Pretty solid. You\'ve been paying attention.',
    okay: 'Not bad — but keep scrolling, there\'s more.',
    bad: 'Awkward. Maybe actually read the projects?',
    correct: 'Correct',
    wrong: 'Wrong',
    qOf: 'Question',
  },
  deutsch: {
    title: 'Hast du genug über mich gestalkt?',
    sub: 'Mal sehen. 3 zufällige Fragen über mich — wähl die richtige Antwort.',
    start: 'Quiz starten',
    next: 'Nächste Frage',
    finish: 'Ergebnis ansehen',
    again: 'Nochmal spielen',
    back: 'Zurück zum Desktop',
    score: 'Du hast',
    of: 'von',
    perfect: 'Zertifizierter Henri-Stalker. Beeindruckend.',
    great: 'Ziemlich gut. Du hast aufgepasst.',
    okay: 'Nicht schlecht — aber scroll ruhig weiter.',
    bad: 'Peinlich. Lies vielleicht erstmal die Projekte?',
    correct: 'Richtig',
    wrong: 'Falsch',
    qOf: 'Frage',
  },
  español: {
    title: '¿Ya me has stalkeado suficiente?',
    sub: 'A ver. 3 preguntas aleatorias sobre mí — elige la correcta.',
    start: 'Empezar el quiz',
    next: 'Siguiente pregunta',
    finish: 'Ver resultado',
    again: 'Jugar otra vez',
    back: 'Volver al escritorio',
    score: 'Has acertado',
    of: 'de',
    perfect: 'Stalker certificado de Henri. Impresionante.',
    great: 'Bastante bien. Has estado atento.',
    okay: 'No está mal — pero sigue explorando.',
    bad: 'Qué vergüenza. ¿Quizá lee los proyectos?',
    correct: 'Correcto',
    wrong: 'Incorrecto',
    qOf: 'Pregunta',
  },
};

const pick = (l: Lang, t: Trio) => t[l === 'deutsch' ? 'de' : l === 'español' ? 'es' : 'en'];

const QUESTIONS_PER_ROUND = 3;

const Challenges = () => {
  const { language, theme } = useSettings();
  const lang = (language as Lang) || 'english';
  const tr = T[lang] || T.english;

  const [round, setRound] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');

  const startRound = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);
    setRound(shuffled);
    setStep(0);
    setPicked(null);
    setScore(0);
    setPhase('playing');
  };

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === round[step].correct) setScore(s => s + 1);
  };

  const onNext = () => {
    if (step + 1 >= round.length) {
      setPhase('done');
    } else {
      setStep(s => s + 1);
      setPicked(null);
    }
  };

  const resultMsg = useMemo(() => {
    const pct = score / Math.max(1, round.length);
    if (pct === 1) return tr.perfect;
    if (pct >= 0.67) return tr.great;
    if (pct >= 0.34) return tr.okay;
    return tr.bad;
  }, [score, round.length, tr]);

  const isOrange = theme === 'space-mood';
  const frame = isOrange
    ? 'bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-600'
    : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600';
  const titleBar = isOrange
    ? 'bg-gradient-to-r from-yellow-600 via-orange-700 to-orange-700'
    : 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700';
  const content = isOrange
    ? 'bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400'
    : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400';
  const text = isOrange ? 'text-orange-900' : 'text-black';
  const link = isOrange ? 'text-orange-800 hover:text-orange-900' : 'text-blue-800 hover:text-blue-900';
  const cta = isOrange
    ? 'bg-gradient-to-br from-yellow-500 via-orange-600 to-orange-800 hover:from-yellow-400 hover:via-orange-500 hover:to-orange-700 text-white'
    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white';
  const cardBase = isOrange ? 'bg-yellow-50/80 border-orange-700/40' : 'bg-white/70 border-black/30';

  const current = round[step];

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${isOrange ? 'folder-orange' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-3xl shadow-2xl rounded-lg ${frame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${titleBar}`}>
          <span className="text-white font-pixel text-sm">Quiz</span>
        </div>

        <div className={`p-6 sm:p-10 border-2 border-white/20 shadow-inner rounded-b ${content}`}>
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-3xl sm:text-4xl mb-3 font-pixel drop-shadow-lg ${text}`}>
              [ {tr.title} ]
            </h1>

            {phase === 'idle' && (
              <>
                <p className={`mb-8 font-pixel text-sm sm:text-base max-w-xl ${text}`}>{tr.sub}</p>
                <div className="text-6xl mb-6 animate-pulse">🕵️</div>
                <button
                  onClick={startRound}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${cta}`}
                >
                  <Sparkles className="w-4 h-4" />
                  {tr.start}
                </button>
              </>
            )}

            {phase === 'playing' && current && (
              <div className="w-full max-w-xl space-y-5">
                <div className={`text-xs font-pixel ${text} opacity-70`}>
                  {tr.qOf} {step + 1} / {round.length}
                </div>
                <div className={`p-5 rounded-xl border-2 backdrop-blur-sm ${cardBase}`}>
                  <p className={`text-lg font-pixel ${text}`}>{pick(lang, current.q)}</p>
                </div>

                <div className="grid gap-3">
                  {current.options.map((opt, i) => {
                    const isCorrect = i === current.correct;
                    const isPicked = picked === i;
                    let cls = `${cardBase} hover:scale-[1.02]`;
                    if (picked !== null) {
                      if (isCorrect) cls = 'bg-green-100/80 border-green-700/60';
                      else if (isPicked) cls = 'bg-red-100/80 border-red-700/60';
                      else cls = `${cardBase} opacity-60`;
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => onPick(i)}
                        disabled={picked !== null}
                        className={`w-full text-left p-4 rounded-lg border-2 font-pixel transition-all duration-300 ${text} ${cls} flex items-center justify-between gap-3`}
                      >
                        <span>{pick(lang, opt)}</span>
                        {picked !== null && isCorrect && <Check className="w-5 h-5 text-green-700 shrink-0" />}
                        {picked !== null && isPicked && !isCorrect && <X className="w-5 h-5 text-red-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {picked !== null && current.explanation && (
                  <p className={`text-sm font-pixel italic ${text} opacity-80`}>
                    {pick(lang, current.explanation)}
                  </p>
                )}

                {picked !== null && (
                  <button
                    onClick={onNext}
                    className={`mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 font-pixel hover:scale-105 transition-all duration-300 ${cta}`}
                  >
                    {step + 1 >= round.length ? tr.finish : tr.next}
                  </button>
                )}
              </div>
            )}

            {phase === 'done' && (
              <div className="space-y-5 max-w-xl">
                <div className="text-6xl">{score === round.length ? '🏆' : score >= 2 ? '🎯' : '🤔'}</div>
                <p className={`text-2xl font-pixel ${text}`}>
                  {tr.score} {score} {tr.of} {round.length}
                </p>
                <p className={`text-base font-pixel ${text}`}>{resultMsg}</p>
                <button
                  onClick={startRound}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 font-pixel hover:scale-105 transition-all duration-300 ${cta}`}
                >
                  <RotateCcw className="w-4 h-4" />
                  {tr.again}
                </button>
              </div>
            )}

            <Link to="/desktop" className={`mt-10 text-lg underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${link}`}>
              <ArrowLeft className="w-5 h-5" />
              {tr.back}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
