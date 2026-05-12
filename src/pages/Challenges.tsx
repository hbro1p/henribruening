import React, { useState, useMemo, useEffect } from 'react';
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

// ~100 deeper, general questions about Henri — mindset, values, habits, philosophy.
// Avoid trivia about specific links/names where possible.
const QUESTIONS: Question[] = [
  { q:{en:'What best describes how Henri approaches new ideas?',de:'Wie geht Henri an neue Ideen heran?',es:'¿Cómo aborda Henri las nuevas ideas?'},
    options:[{en:'Plan endlessly, never start',de:'Endlos planen, nie starten',es:'Planear sin parar, nunca empezar'},{en:'Just start and learn by doing',de:'Einfach loslegen und im Tun lernen',es:'Empezar y aprender haciendo'},{en:'Wait until someone else proves it',de:'Warten bis jemand anders es beweist',es:'Esperar a que otro lo demuestre'}],correct:1},
  { q:{en:'When the normal path doesn\'t work, Henri tends to…',de:'Wenn der normale Weg nicht klappt, neigt Henri dazu…',es:'Cuando el camino normal no funciona, Henri suele…'},
    options:[{en:'Give up early',de:'Früh aufgeben',es:'Rendirse pronto'},{en:'Find an unconventional workaround',de:'Einen unkonventionellen Umweg finden',es:'Buscar un atajo poco convencional'},{en:'Blame the system',de:'Das System beschuldigen',es:'Culpar al sistema'}],correct:1},
  { q:{en:'Which value matters most to Henri in his work?',de:'Welcher Wert ist Henri bei seiner Arbeit am wichtigsten?',es:'¿Qué valor es más importante para Henri?'},
    options:[{en:'Authenticity & doing it himself',de:'Authentizität & selbst machen',es:'Autenticidad y hacerlo él mismo'},{en:'Maximum profit',de:'Maximaler Profit',es:'Máximo beneficio'},{en:'Following hype',de:'Hypes folgen',es:'Seguir el hype'}],correct:0},
  { q:{en:'Henri prefers projects that…',de:'Henri bevorzugt Projekte, die…',es:'Henri prefiere proyectos que…'},
    options:[{en:'Look impressive on paper only',de:'Nur auf dem Papier beeindrucken',es:'Solo impresionan en papel'},{en:'Have real, visible impact',de:'Echten, sichtbaren Impact haben',es:'Tienen impacto real y visible'},{en:'Are easy and risk-free',de:'Einfach und risikofrei sind',es:'Son fáciles y sin riesgo'}],correct:1},
  { q:{en:'How does Henri view failure?',de:'Wie sieht Henri Scheitern?',es:'¿Cómo ve Henri el fracaso?'},
    options:[{en:'Something to hide',de:'Etwas zum Verstecken',es:'Algo que esconder'},{en:'Part of the learning process',de:'Teil des Lernprozesses',es:'Parte del aprendizaje'},{en:'Proof you shouldn\'t try',de:'Beweis, es nicht zu versuchen',es:'Prueba de que no debes intentarlo'}],correct:1},
  { q:{en:'What kind of content does Henri like to create?',de:'Welche Art von Inhalten erstellt Henri gerne?',es:'¿Qué tipo de contenido le gusta crear a Henri?'},
    options:[{en:'Generic, copy-paste templates',de:'Generische Copy-Paste-Vorlagen',es:'Plantillas genéricas'},{en:'Short, engaging, locally relevant',de:'Kurz, ansprechend, lokal relevant',es:'Cortos, atractivos y locales'},{en:'Long corporate reports',de:'Lange Firmenberichte',es:'Largos informes corporativos'}],correct:1},
  { q:{en:'Henri\'s attitude toward learning is best described as…',de:'Henris Einstellung zum Lernen ist am besten…',es:'La actitud de Henri ante el aprendizaje es…'},
    options:[{en:'School is enough',de:'Schule reicht',es:'La escuela basta'},{en:'Self-driven and continuous',de:'Selbstgetrieben und kontinuierlich',es:'Autodidacta y continua'},{en:'Only when forced',de:'Nur unter Zwang',es:'Solo obligado'}],correct:1},
  { q:{en:'Which sport / activity is closest to Henri\'s daily routine?',de:'Welche Sportart liegt Henris Alltag am nächsten?',es:'¿Qué actividad está más cerca de su rutina diaria?'},
    options:[{en:'Daily running / walking',de:'Tägliches Laufen / Gehen',es:'Correr / caminar a diario'},{en:'Powerlifting',de:'Powerlifting',es:'Powerlifting'},{en:'Esports only',de:'Nur Esports',es:'Solo esports'}],correct:0},
  { q:{en:'Henri\'s long streak of daily activity says mostly that he is…',de:'Henris lange Streak täglicher Aktivität zeigt vor allem…',es:'Su racha diaria muestra sobre todo que es…'},
    options:[{en:'Lucky',de:'Glücklich',es:'Afortunado'},{en:'Disciplined and consistent',de:'Diszipliniert und konsequent',es:'Disciplinado y constante'},{en:'Bored',de:'Gelangweilt',es:'Aburrido'}],correct:1},
  { q:{en:'How does Henri usually start a project?',de:'Wie startet Henri meistens ein Projekt?',es:'¿Cómo suele iniciar un proyecto?'},
    options:[{en:'With a perfect business plan',de:'Mit einem perfekten Businessplan',es:'Con un plan perfecto'},{en:'With a rough idea and quick action',de:'Mit grober Idee und schnellem Handeln',es:'Con una idea aproximada y acción rápida'},{en:'By hiring an agency',de:'Indem er eine Agentur beauftragt',es:'Contratando una agencia'}],correct:1},
  { q:{en:'How does Henri feel about quitting a project that no longer fits?',de:'Wie steht Henri dazu, ein Projekt zu beenden, das nicht mehr passt?',es:'¿Qué piensa de abandonar un proyecto que ya no encaja?'},
    options:[{en:'Never quit, ever',de:'Niemals aufhören',es:'Nunca rendirse'},{en:'Stopping is okay if you keep the lesson',de:'Aufhören ist okay, wenn die Lektion bleibt',es:'Está bien parar si te llevas el aprendizaje'},{en:'Quit at the first hard week',de:'Bei erster harter Woche aufhören',es:'Rendirse en la primera semana dura'}],correct:1},
  { q:{en:'Which of these describes Henri\'s view on social media?',de:'Was beschreibt Henris Sicht auf Social Media?',es:'¿Qué describe su visión sobre redes sociales?'},
    options:[{en:'Tool to build trust and a local brand',de:'Werkzeug für Vertrauen und lokale Marke',es:'Herramienta para construir confianza y marca local'},{en:'Just a numbers game',de:'Nur ein Zahlenspiel',es:'Solo un juego de números'},{en:'Should be avoided',de:'Sollte vermieden werden',es:'Debe evitarse'}],correct:0},
  { q:{en:'Henri\'s storytelling style is usually…',de:'Henris Storytelling-Stil ist meistens…',es:'Su estilo de storytelling es…'},
    options:[{en:'Personal, direct, honest',de:'Persönlich, direkt, ehrlich',es:'Personal, directo, honesto'},{en:'Polished but empty',de:'Poliert, aber leer',es:'Pulido pero vacío'},{en:'Anonymous and corporate',de:'Anonym und Corporate',es:'Anónimo y corporativo'}],correct:0},
  { q:{en:'What language combination is Henri most comfortable with?',de:'Welche Sprachen beherrscht Henri am sichersten?',es:'¿Qué idiomas maneja con más soltura?'},
    options:[{en:'German + English',de:'Deutsch + Englisch',es:'Alemán + Inglés'},{en:'Only German',de:'Nur Deutsch',es:'Solo alemán'},{en:'French + Italian',de:'Französisch + Italienisch',es:'Francés + Italiano'}],correct:0},
  { q:{en:'How important is local impact (Coesfeld) to Henri?',de:'Wie wichtig ist Henri lokaler Impact (Coesfeld)?',es:'¿Qué tan importante es el impacto local para Henri?'},
    options:[{en:'Very — he likes building where he lives',de:'Sehr — er baut gerne dort, wo er lebt',es:'Mucho — le gusta construir donde vive'},{en:'Irrelevant',de:'Egal',es:'Irrelevante'},{en:'Only big cities matter',de:'Nur Großstädte zählen',es:'Solo importan grandes ciudades'}],correct:0},
  { q:{en:'Henri\'s portfolio is built to feel like…',de:'Henris Portfolio fühlt sich an wie…',es:'Su portfolio se siente como…'},
    options:[{en:'A boring CV PDF',de:'Ein langweiliges Lebenslauf-PDF',es:'Un CV aburrido en PDF'},{en:'A retro desktop you can play with',de:'Ein Retro-Desktop zum Erkunden',es:'Un escritorio retro para explorar'},{en:'A LinkedIn clone',de:'Ein LinkedIn-Klon',es:'Un clon de LinkedIn'}],correct:1},
  { q:{en:'When Henri talks about projects, he focuses on…',de:'Wenn Henri über Projekte spricht, fokussiert er…',es:'Cuando habla de proyectos se enfoca en…'},
    options:[{en:'Process, learnings and execution',de:'Prozess, Learnings und Umsetzung',es:'Proceso, aprendizajes y ejecución'},{en:'Bragging only',de:'Nur Angeberei',es:'Solo presumir'},{en:'Buzzwords with no substance',de:'Buzzwords ohne Substanz',es:'Buzzwords sin sustancia'}],correct:0},
  { q:{en:'Which best describes Henri\'s aesthetic taste?',de:'Was beschreibt Henris ästhetischen Geschmack?',es:'¿Qué describe mejor su gusto estético?'},
    options:[{en:'Nostalgic, retro, expressive',de:'Nostalgisch, retro, ausdrucksstark',es:'Nostálgico, retro, expresivo'},{en:'Cold corporate minimal',de:'Kalt-corporate-minimal',es:'Frío y corporativo'},{en:'Random and chaotic',de:'Wahllos chaotisch',es:'Aleatorio y caótico'}],correct:0},
  { q:{en:'How does Henri prefer to work with clients?',de:'Wie arbeitet Henri am liebsten mit Kunden?',es:'¿Cómo prefiere trabajar con clientes?'},
    options:[{en:'Hands-on, close, end-to-end',de:'Hands-on, eng, end-to-end',es:'Cercano, hands-on, end-to-end'},{en:'Strict ticket system only',de:'Nur striktes Ticket-System',es:'Solo sistema de tickets estricto'},{en:'Through 5 layers of management',de:'Durch 5 Management-Ebenen',es:'A través de muchas capas de gestión'}],correct:0},
  { q:{en:'When measuring success, Henri cares more about…',de:'Beim Messen von Erfolg achtet Henri mehr auf…',es:'Para medir éxito Henri mira más…'},
    options:[{en:'Real outcomes (followers, reach, sales)',de:'Echte Ergebnisse (Follower, Reichweite, Verkäufe)',es:'Resultados reales'},{en:'Vanity numbers only',de:'Nur Vanity-Metriken',es:'Solo métricas de vanidad'},{en:'Internal politics',de:'Interne Politik',es:'Política interna'}],correct:0},
  { q:{en:'Henri\'s preferred tone of communication is…',de:'Henris bevorzugter Kommunikationston ist…',es:'Su tono preferido de comunicación es…'},
    options:[{en:'Direct, friendly, no fluff',de:'Direkt, freundlich, ohne Bla-bla',es:'Directo, amable, sin paja'},{en:'Stiff and overly formal',de:'Steif und überförmlich',es:'Rígido y demasiado formal'},{en:'Aggressive and pushy',de:'Aggressiv und drängend',es:'Agresivo'}],correct:0},
  { q:{en:'Henri\'s view on AI tools:',de:'Henris Sicht auf KI-Tools:',es:'Su visión sobre las IA:'},
    options:[{en:'Use them to move faster, but stay original',de:'Nutzen, um schneller zu sein, aber eigen bleiben',es:'Usar para ir rápido, pero ser original'},{en:'Avoid completely',de:'Komplett meiden',es:'Evitar por completo'},{en:'Outsource all thinking to them',de:'Komplettes Denken auslagern',es:'Delegar todo el pensar'}],correct:0},
  { q:{en:'How does Henri usually overcome creative blocks?',de:'Wie überwindet Henri kreative Blockaden?',es:'¿Cómo supera bloqueos creativos?'},
    options:[{en:'Walk / move, then try again',de:'Gehen / bewegen, dann neu versuchen',es:'Caminar y volver a intentarlo'},{en:'Wait for inspiration forever',de:'Ewig auf Inspiration warten',es:'Esperar inspiración eternamente'},{en:'Quit the project',de:'Projekt aufgeben',es:'Abandonar el proyecto'}],correct:0},
  { q:{en:'Henri tends to make decisions based on…',de:'Henri trifft Entscheidungen meist aufgrund von…',es:'Toma decisiones basándose en…'},
    options:[{en:'Gut feeling + quick test',de:'Bauchgefühl + schneller Test',es:'Intuición + prueba rápida'},{en:'10-page Excel models',de:'10-seitige Excel-Modelle',es:'Modelos de Excel enormes'},{en:'Asking 50 people first',de:'Zuerst 50 Leute fragen',es:'Preguntar a 50 personas'}],correct:0},
  { q:{en:'Henri\'s relationship with comfort zones is…',de:'Henris Verhältnis zur Komfortzone ist…',es:'Su relación con la zona de confort es…'},
    options:[{en:'Loves to leave them',de:'Verlässt sie gerne',es:'Le encanta salir de ella'},{en:'Stays in them at all cost',de:'Bleibt um jeden Preis drin',es:'Se queda a toda costa'},{en:'Doesn\'t care',de:'Egal',es:'Le da igual'}],correct:0},
  { q:{en:'Which mindset does Henri lean toward?',de:'Zu welchem Mindset tendiert Henri?',es:'¿Hacia qué mindset se inclina?'},
    options:[{en:'Fixed mindset',de:'Fixed Mindset',es:'Mentalidad fija'},{en:'Growth mindset',de:'Growth Mindset',es:'Mentalidad de crecimiento'},{en:'No mindset',de:'Kein Mindset',es:'Ninguna'}],correct:1},
  { q:{en:'In a team, Henri is most often the…',de:'Im Team ist Henri am häufigsten der…',es:'En equipo, Henri suele ser…'},
    options:[{en:'Initiator who gets things rolling',de:'Initiator, der Dinge ins Rollen bringt',es:'El que arranca las cosas'},{en:'Silent observer',de:'Stille Beobachter',es:'Observador silencioso'},{en:'Person who only complains',de:'Der nur meckert',es:'El que solo se queja'}],correct:0},
  { q:{en:'Henri prefers feedback that is…',de:'Henri bevorzugt Feedback, das…',es:'Prefiere feedback que sea…'},
    options:[{en:'Honest and specific',de:'Ehrlich und konkret',es:'Honesto y concreto'},{en:'Only positive',de:'Nur positiv',es:'Solo positivo'},{en:'Never given',de:'Nie gegeben',es:'Que nunca llegue'}],correct:0},
  { q:{en:'Henri\'s typical reaction to a setback:',de:'Henris typische Reaktion auf einen Rückschlag:',es:'Su reacción típica ante un revés:'},
    options:[{en:'Reflect briefly, then keep moving',de:'Kurz reflektieren, dann weiter',es:'Reflexionar y seguir'},{en:'Spiral for weeks',de:'Wochenlang grübeln',es:'Darle vueltas por semanas'},{en:'Pretend it didn\'t happen',de:'So tun, als wäre nichts',es:'Hacer como si nada'}],correct:0},
  { q:{en:'How does Henri see money?',de:'Wie sieht Henri Geld?',es:'¿Cómo ve Henri el dinero?'},
    options:[{en:'A tool to build freedom and projects',de:'Werkzeug für Freiheit und Projekte',es:'Una herramienta para libertad y proyectos'},{en:'The only goal in life',de:'Einziges Lebensziel',es:'Único objetivo'},{en:'Something to fear',de:'Etwas zu fürchten',es:'Algo que temer'}],correct:0},
  { q:{en:'Henri values which type of friendships?',de:'Welche Art von Freundschaften schätzt Henri?',es:'¿Qué tipo de amistades valora?'},
    options:[{en:'Few, deep, honest',de:'Wenige, tiefe, ehrliche',es:'Pocas, profundas, honestas'},{en:'As many as possible, shallow',de:'So viele wie möglich, oberflächlich',es:'Cuantas más mejor, superficiales'},{en:'Only useful contacts',de:'Nur nützliche Kontakte',es:'Solo contactos útiles'}],correct:0},
  { q:{en:'Which environment energizes Henri most?',de:'Welche Umgebung gibt Henri am meisten Energie?',es:'¿Qué entorno le da más energía?'},
    options:[{en:'Hands-on, creative, building',de:'Hands-on, kreativ, bauend',es:'Práctico, creativo, construyendo'},{en:'Endless meetings',de:'Endlose Meetings',es:'Reuniones interminables'},{en:'Pure routine',de:'Reine Routine',es:'Pura rutina'}],correct:0},
  { q:{en:'Henri usually defines a "good day" as…',de:'Einen "guten Tag" definiert Henri meist als…',es:'Un "buen día" para Henri es…'},
    options:[{en:'One where he created or shipped something',de:'Einen, an dem er etwas geschaffen hat',es:'Uno en el que creó o entregó algo'},{en:'One spent only scrolling',de:'Den ganzen Tag nur scrollen',es:'Solo scrollear todo el día'},{en:'One without effort',de:'Einer ohne Anstrengung',es:'Sin esfuerzo'}],correct:0},
  { q:{en:'Henri considers consistency more important than…',de:'Henri hält Konstanz für wichtiger als…',es:'Considera la constancia más importante que…'},
    options:[{en:'Short bursts of motivation',de:'Kurze Motivationsschübe',es:'Ráfagas cortas de motivación'},{en:'Real action',de:'Echtes Handeln',es:'Acción real'},{en:'Discipline',de:'Disziplin',es:'Disciplina'}],correct:0},
  { q:{en:'Henri\'s attitude toward risk:',de:'Henris Einstellung zum Risiko:',es:'Su actitud ante el riesgo:'},
    options:[{en:'Calculated, willing to try',de:'Kalkuliert, bereit zu probieren',es:'Calculado, dispuesto a probar'},{en:'Reckless gambler',de:'Rücksichtsloser Zocker',es:'Apostador imprudente'},{en:'Avoids all risk',de:'Vermeidet jedes Risiko',es:'Evita todo riesgo'}],correct:0},
  { q:{en:'Henri thinks reading / researching is…',de:'Henri findet Lesen / Recherche…',es:'Henri considera leer / investigar…'},
    options:[{en:'Crucial — but should lead to action',de:'Wichtig — sollte aber zu Handeln führen',es:'Crucial, pero debe llevar a la acción'},{en:'A waste of time',de:'Zeitverschwendung',es:'Pérdida de tiempo'},{en:'Only for school',de:'Nur für die Schule',es:'Solo para la escuela'}],correct:0},
  { q:{en:'Henri usually presents projects in:',de:'Henri präsentiert Projekte meistens in:',es:'Henri presenta proyectos en:'},
    options:[{en:'Multiple languages (DE/EN/ES)',de:'Mehreren Sprachen (DE/EN/ES)',es:'Varios idiomas (DE/EN/ES)'},{en:'Only German',de:'Nur Deutsch',es:'Solo alemán'},{en:'Only emojis',de:'Nur Emojis',es:'Solo emojis'}],correct:0},
  { q:{en:'Henri\'s opinion on building in public:',de:'Henris Meinung zum Bauen in der Öffentlichkeit:',es:'Su opinión sobre construir en público:'},
    options:[{en:'Powerful — accountability + reach',de:'Stark — Verbindlichkeit + Reichweite',es:'Potente — compromiso + alcance'},{en:'Embarrassing',de:'Peinlich',es:'Vergonzoso'},{en:'Pointless',de:'Sinnlos',es:'Sin sentido'}],correct:0},
  { q:{en:'Which best matches Henri\'s view on school grades?',de:'Was beschreibt Henris Sicht auf Schulnoten?',es:'¿Cómo ve Henri las notas escolares?'},
    options:[{en:'Important, but execution matters more',de:'Wichtig, aber Umsetzung wichtiger',es:'Importan, pero la ejecución importa más'},{en:'The only thing that counts',de:'Das Einzige, was zählt',es:'Lo único que cuenta'},{en:'Completely useless',de:'Völlig nutzlos',es:'Completamente inútiles'}],correct:0},
  { q:{en:'When stuck on a problem, Henri usually…',de:'Wenn er feststeckt, macht Henri meist…',es:'Cuando se atasca, Henri suele…'},
    options:[{en:'Tries a different angle quickly',de:'Probiert schnell einen neuen Ansatz',es:'Prueba un ángulo distinto rápido'},{en:'Stays stuck for weeks',de:'Wochenlang feststecken',es:'Quedarse atascado semanas'},{en:'Asks ChatGPT and copies blindly',de:'Fragt ChatGPT und kopiert blind',es:'Copia ciegamente'}],correct:0},
  { q:{en:'How does Henri view "perfect first try"?',de:'Wie sieht Henri "perfekt beim ersten Versuch"?',es:'¿Qué piensa de "perfecto al primer intento"?'},
    options:[{en:'A myth — iterate fast',de:'Mythos — schnell iterieren',es:'Un mito — iterar rápido'},{en:'The only acceptable standard',de:'Einzig akzeptabler Standard',es:'Único estándar aceptable'},{en:'Impossible, so don\'t try',de:'Unmöglich, also gar nicht versuchen',es:'Imposible, mejor no intentar'}],correct:0},
  { q:{en:'Henri\'s relationship with routine:',de:'Henris Verhältnis zu Routine:',es:'Su relación con la rutina:'},
    options:[{en:'Loves structure that enables creativity',de:'Liebt Struktur, die Kreativität ermöglicht',es:'Ama estructura que permite creatividad'},{en:'Hates all structure',de:'Hasst jede Struktur',es:'Odia toda estructura'},{en:'Lives without any plan',de:'Lebt komplett planlos',es:'Vive sin plan alguno'}],correct:0},
  { q:{en:'Henri prefers tools that are…',de:'Henri bevorzugt Tools, die…',es:'Prefiere herramientas que sean…'},
    options:[{en:'Fast, simple, get out of the way',de:'Schnell, simpel, nicht im Weg',es:'Rápidas, simples, sin estorbar'},{en:'Bloated and complex',de:'Überladen und komplex',es:'Hinchadas y complejas'},{en:'Outdated and slow',de:'Veraltet und langsam',es:'Obsoletas y lentas'}],correct:0},
  { q:{en:'Henri\'s thinking on personal branding:',de:'Henris Sicht auf Personal Branding:',es:'Su visión del personal branding:'},
    options:[{en:'It should reflect who you really are',de:'Es soll widerspiegeln, wer du wirklich bist',es:'Debe reflejar quién eres de verdad'},{en:'Pure performance / fake',de:'Reines Theater / fake',es:'Pura actuación falsa'},{en:'Useless',de:'Nutzlos',es:'Inútil'}],correct:0},
  { q:{en:'Henri tends to celebrate wins by…',de:'Henri feiert Erfolge meistens, indem er…',es:'Henri celebra los logros…'},
    options:[{en:'Quick celebration, then next goal',de:'Kurz feiern, dann nächstes Ziel',es:'Celebración corta, siguiente meta'},{en:'Stops working for months',de:'Monatelang Pause',es:'Para de trabajar meses'},{en:'Doesn\'t notice them',de:'Bemerkt sie nicht',es:'Ni se entera'}],correct:0},
  { q:{en:'Henri\'s general view on cities like NYC:',de:'Henris Sicht auf Städte wie NYC:',es:'Su visión sobre ciudades como NYC:'},
    options:[{en:'Inspiring, but tough on affordability',de:'Inspirierend, aber teuer/hart',es:'Inspiradoras, pero duras en costes'},{en:'Boring',de:'Langweilig',es:'Aburridas'},{en:'Perfect utopia',de:'Perfekte Utopie',es:'Utopía perfecta'}],correct:0},
  { q:{en:'On the topic of the American Dream, Henri concluded that…',de:'Zum American Dream kam Henri zu dem Schluss…',es:'Sobre el sueño americano, Henri concluyó…'},
    options:[{en:'Its meaning has shifted toward freedom & belonging',de:'Seine Bedeutung verschiebt sich zu Freiheit & Zugehörigkeit',es:'Su significado se desplaza a libertad y pertenencia'},{en:'It is exactly like the 1950s',de:'Wie in den 1950ern',es:'Igual que en los años 50'},{en:'It never existed',de:'Hat nie existiert',es:'Nunca existió'}],correct:0},
  { q:{en:'Henri\'s typical day involves…',de:'Henris typischer Tag enthält…',es:'Un día típico de Henri incluye…'},
    options:[{en:'Movement + creating + learning',de:'Bewegung + Erschaffen + Lernen',es:'Movimiento + crear + aprender'},{en:'Only screens, no movement',de:'Nur Bildschirm, keine Bewegung',es:'Solo pantallas, sin movimiento'},{en:'Sleeping all day',de:'Den ganzen Tag schlafen',es:'Dormir todo el día'}],correct:0},
  { q:{en:'How does Henri handle criticism online?',de:'Wie geht Henri mit Online-Kritik um?',es:'¿Cómo maneja la crítica online?'},
    options:[{en:'Listens, filters, keeps building',de:'Hört zu, filtert, baut weiter',es:'Escucha, filtra, sigue construyendo'},{en:'Rage-quits the internet',de:'Verlässt das Internet wütend',es:'Abandona Internet enfadado'},{en:'Argues with everyone',de:'Streitet mit allen',es:'Discute con todos'}],correct:0},
  { q:{en:'Henri prefers product launches that are…',de:'Henri bevorzugt Launches, die…',es:'Prefiere lanzamientos que sean…'},
    options:[{en:'Small, quick, iterative',de:'Klein, schnell, iterativ',es:'Pequeños, rápidos, iterativos'},{en:'Huge "big bang" only',de:'Nur große Big-Bang-Events',es:'Solo grandes Big Bang'},{en:'Secret forever',de:'Ewig geheim',es:'Secretos para siempre'}],correct:0},
  { q:{en:'Henri thinks design should…',de:'Henri findet, Design soll…',es:'Henri cree que el diseño debe…'},
    options:[{en:'Have personality, not just look "clean"',de:'Persönlichkeit haben, nicht nur "clean"',es:'Tener personalidad, no solo verse "limpio"'},{en:'Be invisible always',de:'Immer unsichtbar',es:'Siempre invisible'},{en:'Be loud and confusing',de:'Laut und verwirrend',es:'Ruidoso y confuso'}],correct:0},
  { q:{en:'Henri\'s favorite kind of feedback loop:',de:'Henris Lieblings-Feedbackloop:',es:'Su loop de feedback favorito:'},
    options:[{en:'Real users + fast iteration',de:'Echte Nutzer + schnelle Iteration',es:'Usuarios reales + iteración rápida'},{en:'Internal opinions only',de:'Nur interne Meinungen',es:'Solo opiniones internas'},{en:'No feedback at all',de:'Gar kein Feedback',es:'Ningún feedback'}],correct:0},
  { q:{en:'Henri sees collaboration as…',de:'Henri sieht Zusammenarbeit als…',es:'Ve la colaboración como…'},
    options:[{en:'Multiplier — others bring missing skills',de:'Multiplikator — andere bringen fehlende Skills',es:'Multiplicador — los demás aportan'},{en:'Slowing him down',de:'Bremst ihn nur',es:'Solo lo frena'},{en:'Unnecessary',de:'Unnötig',es:'Innecesaria'}],correct:0},
  { q:{en:'Henri likes to combine creative work with…',de:'Henri kombiniert Kreativarbeit gerne mit…',es:'Henri combina lo creativo con…'},
    options:[{en:'Strategy and analytics',de:'Strategie und Analytics',es:'Estrategia y analítica'},{en:'Pure chaos',de:'Reinem Chaos',es:'Puro caos'},{en:'Nothing else',de:'Nichts anderem',es:'Nada más'}],correct:0},
  { q:{en:'How does Henri view "going viral"?',de:'Wie sieht Henri "viral gehen"?',es:'¿Cómo ve "hacerse viral"?'},
    options:[{en:'Nice, but trust > views',de:'Schön, aber Vertrauen > Views',es:'Bien, pero confianza > vistas'},{en:'The only goal',de:'Einziges Ziel',es:'Único objetivo'},{en:'Embarrassing',de:'Peinlich',es:'Vergonzoso'}],correct:0},
  { q:{en:'Henri\'s preferred way to learn a new skill:',de:'Henris bevorzugter Weg, neue Skills zu lernen:',es:'Su forma preferida de aprender:'},
    options:[{en:'Build a real project with it',de:'Ein echtes Projekt damit bauen',es:'Construir un proyecto real con eso'},{en:'Only watch tutorials forever',de:'Nur ewig Tutorials gucken',es:'Solo ver tutoriales eternamente'},{en:'Never start',de:'Nie anfangen',es:'Nunca empezar'}],correct:0},
  { q:{en:'Henri thinks young entrepreneurs should…',de:'Henri findet, junge Gründer sollten…',es:'Henri cree que jóvenes emprendedores deben…'},
    options:[{en:'Start small, ship often, learn fast',de:'Klein anfangen, oft launchen, schnell lernen',es:'Empezar pequeños, lanzar y aprender'},{en:'Wait until 40',de:'Bis 40 warten',es:'Esperar a los 40'},{en:'Need a big investor first',de:'Erst großen Investor brauchen',es:'Necesitan un gran inversor primero'}],correct:0},
  { q:{en:'How does Henri feel about copying others?',de:'Wie steht Henri zum Kopieren?',es:'¿Qué opina de copiar?'},
    options:[{en:'Inspiration ok, identity must stay yours',de:'Inspiration ok, Identität bleibt deine',es:'Inspirarse vale, la identidad es tuya'},{en:'Copy 1:1 always',de:'Immer 1:1 kopieren',es:'Copiar 1:1 siempre'},{en:'Never look at others',de:'Nie auf andere schauen',es:'Nunca mirar a otros'}],correct:0},
  { q:{en:'Henri values "showing your work" because…',de:'Henri schätzt "Show your work" weil…',es:'Valora "mostrar el trabajo" porque…'},
    options:[{en:'It builds trust over time',de:'Es schafft langfristig Vertrauen',es:'Construye confianza a largo plazo'},{en:'It looks cool only',de:'Sieht nur cool aus',es:'Solo se ve cool'},{en:'It\'s required by law',de:'Gesetzlich vorgeschrieben',es:'Lo exige la ley'}],correct:0},
  { q:{en:'Henri\'s general energy when speaking about work:',de:'Henris Energie, wenn er über seine Arbeit spricht:',es:'Su energía al hablar de su trabajo:'},
    options:[{en:'Curious, motivated, calm',de:'Neugierig, motiviert, ruhig',es:'Curioso, motivado, tranquilo'},{en:'Bored',de:'Gelangweilt',es:'Aburrido'},{en:'Defensive',de:'Defensiv',es:'Defensivo'}],correct:0},
  { q:{en:'Henri\'s favorite kind of challenge is…',de:'Henris Lieblings-Challenge ist…',es:'Su tipo de reto favorito es…'},
    options:[{en:'One that mixes physical + mental',de:'Eine, die körperlich + mental fordert',es:'Físico + mental combinados'},{en:'Pure luck-based',de:'Reines Glücksspiel',es:'Pura suerte'},{en:'Easy and short',de:'Leicht und kurz',es:'Fácil y corto'}],correct:0},
  { q:{en:'Henri\'s opinion on yearly goals:',de:'Henris Meinung zu Jahreszielen:',es:'Su opinión sobre las metas anuales:'},
    options:[{en:'Useful if reviewed and adjusted',de:'Nützlich, wenn überprüft & angepasst',es:'Útiles si se revisan'},{en:'Pointless',de:'Sinnlos',es:'Inútiles'},{en:'Set once, ignore forever',de:'Einmal setzen, ewig ignorieren',es:'Fijar y olvidar'}],correct:0},
  { q:{en:'Henri tends to surround himself with people who…',de:'Henri umgibt sich mit Menschen, die…',es:'Henri se rodea de gente que…'},
    options:[{en:'Build, learn, push him',de:'Bauen, lernen, ihn pushen',es:'Construyen, aprenden y lo empujan'},{en:'Only complain',de:'Nur jammern',es:'Solo se quejan'},{en:'Want him to stay small',de:'Wollen, dass er klein bleibt',es:'Quieren que se quede pequeño'}],correct:0},
  { q:{en:'Henri thinks travel is mostly about…',de:'Henri findet, Reisen ist vor allem…',es:'Para Henri, viajar es sobre todo…'},
    options:[{en:'Perspective and people, not just sights',de:'Perspektive und Menschen, nicht nur Sights',es:'Perspectiva y gente, no solo lugares'},{en:'Photos for Instagram only',de:'Nur Insta-Fotos',es:'Solo fotos para Insta'},{en:'A waste',de:'Verschwendung',es:'Pérdida'}],correct:0},
  { q:{en:'How does Henri view "small towns"?',de:'Wie sieht Henri "kleine Städte"?',es:'¿Cómo ve los pueblos pequeños?'},
    options:[{en:'Underrated — full of potential',de:'Unterschätzt — voller Potenzial',es:'Subestimados, llenos de potencial'},{en:'Boring & dead',de:'Langweilig & tot',es:'Aburridos y muertos'},{en:'Should be left',de:'Sollte man verlassen',es:'Mejor irse'}],correct:0},
  { q:{en:'On video content, Henri thinks the hook should…',de:'Bei Videos findet Henri, der Hook sollte…',es:'En videos, el hook debe…'},
    options:[{en:'Grab attention in the first 1–2 seconds',de:'In den ersten 1–2 Sekunden fesseln',es:'Captar atención en 1–2 segundos'},{en:'Be 30 seconds long',de:'30 Sekunden lang sein',es:'Durar 30 segundos'},{en:'Doesn\'t matter',de:'Egal',es:'Da igual'}],correct:0},
  { q:{en:'Henri prefers content that is…',de:'Henri bevorzugt Inhalte, die…',es:'Prefiere contenido que…'},
    options:[{en:'Native to the platform',de:'Plattform-nativ',es:'Nativo de la plataforma'},{en:'Reposted everywhere identically',de:'Überall identisch gepostet',es:'Reposteado igual en todos lados'},{en:'Only text',de:'Nur Text',es:'Solo texto'}],correct:0},
  { q:{en:'Henri\'s view on saying "no":',de:'Henris Sicht auf "Nein sagen":',es:'Su visión sobre decir "no":'},
    options:[{en:'Necessary to protect focus',de:'Nötig, um Fokus zu schützen',es:'Necesario para proteger el foco'},{en:'Always rude',de:'Immer unhöflich',es:'Siempre grosero'},{en:'Never do it',de:'Nie tun',es:'Nunca hacerlo'}],correct:0},
  { q:{en:'Henri thinks confidence comes mostly from…',de:'Henri findet, Selbstvertrauen kommt vor allem von…',es:'La confianza viene sobre todo de…'},
    options:[{en:'Doing hard things repeatedly',de:'Schwere Dinge wiederholt tun',es:'Hacer cosas difíciles repetidamente'},{en:'Compliments only',de:'Nur Komplimenten',es:'Solo cumplidos'},{en:'Faking it forever',de:'Ewig Faken',es:'Fingirlo siempre'}],correct:0},
  { q:{en:'Henri respects creators who…',de:'Henri respektiert Creator, die…',es:'Respeta a creadores que…'},
    options:[{en:'Are consistent over years',de:'Über Jahre konstant sind',es:'Son constantes por años'},{en:'Just chase trends',de:'Nur Trends jagen',es:'Solo cazan tendencias'},{en:'Buy fake followers',de:'Fake-Follower kaufen',es:'Compran seguidores falsos'}],correct:0},
  { q:{en:'Henri\'s general philosophy in one phrase:',de:'Henris Philosophie in einem Satz:',es:'Su filosofía en una frase:'},
    options:[{en:'Just start, then improve',de:'Einfach anfangen, dann verbessern',es:'Empieza y mejora después'},{en:'Wait until ready',de:'Warten bis bereit',es:'Esperar a estar listo'},{en:'Avoid all effort',de:'Jede Mühe vermeiden',es:'Evitar todo esfuerzo'}],correct:0},
  { q:{en:'How does Henri usually treat people who help him?',de:'Wie behandelt Henri Menschen, die ihm helfen?',es:'¿Cómo trata a quienes lo ayudan?'},
    options:[{en:'With genuine gratitude and credit',de:'Mit echter Dankbarkeit und Credit',es:'Con gratitud real y crédito'},{en:'Forgets them',de:'Vergisst sie',es:'Los olvida'},{en:'Takes credit himself',de:'Nimmt selbst den Credit',es:'Se lleva el crédito'}],correct:0},
  { q:{en:'Henri\'s approach to mistakes is…',de:'Henris Umgang mit Fehlern ist…',es:'Su enfoque ante los errores:'},
    options:[{en:'Own them, fix them, move on',de:'Eingestehen, beheben, weiter',es:'Asumir, arreglar, seguir'},{en:'Blame others',de:'Andere beschuldigen',es:'Culpar a otros'},{en:'Hide them',de:'Verstecken',es:'Esconderlos'}],correct:0},
  { q:{en:'Henri prefers communities that are…',de:'Henri bevorzugt Communitys, die…',es:'Prefiere comunidades que sean…'},
    options:[{en:'Local + supportive + active',de:'Lokal + unterstützend + aktiv',es:'Locales + activas + de apoyo'},{en:'Toxic and gatekeeping',de:'Toxisch und gatekeeping',es:'Tóxicas y excluyentes'},{en:'Dead and silent',de:'Tot und still',es:'Muertas y silenciosas'}],correct:0},
  { q:{en:'Henri sees aging / time as…',de:'Henri sieht Alter / Zeit als…',es:'Henri ve el tiempo como…'},
    options:[{en:'Most valuable resource',de:'Wertvollste Ressource',es:'El recurso más valioso'},{en:'Endless and free',de:'Endlos und kostenlos',es:'Infinito y gratis'},{en:'Irrelevant',de:'Egal',es:'Irrelevante'}],correct:0},
  { q:{en:'Henri values the process of writing because…',de:'Henri schätzt Schreiben, weil…',es:'Valora escribir porque…'},
    options:[{en:'It clarifies thinking',de:'Es ordnet das Denken',es:'Aclara el pensamiento'},{en:'It\'s easy',de:'Es leicht ist',es:'Es fácil'},{en:'He\'s forced to',de:'Er muss',es:'Está obligado'}],correct:0},
  { q:{en:'Henri\'s view on titles / status symbols:',de:'Henris Sicht auf Titel / Statussymbole:',es:'Su visión sobre títulos y estatus:'},
    options:[{en:'Output > titles',de:'Ergebnisse > Titel',es:'Resultados > títulos'},{en:'Title is everything',de:'Titel ist alles',es:'El título lo es todo'},{en:'Need 5 titles',de:'Braucht 5 Titel',es:'Necesita 5 títulos'}],correct:0},
  { q:{en:'Henri\'s favorite kind of music while working:',de:'Henris Lieblingsmusik beim Arbeiten:',es:'Música favorita al trabajar:'},
    options:[{en:'Something focused / instrumental / vibey',de:'Etwas Fokussiertes / Instrumental / Vibey',es:'Algo enfocado / instrumental'},{en:'Loud rage music only',de:'Nur laute Wutmusik',es:'Solo música furiosa'},{en:'Total silence always',de:'Immer komplette Stille',es:'Silencio total siempre'}],correct:0},
  { q:{en:'Henri\'s rule of thumb when in doubt:',de:'Henris Faustregel im Zweifel:',es:'Regla básica en la duda:'},
    options:[{en:'Pick the harder, more honest path',de:'Den härteren, ehrlicheren Weg wählen',es:'Elige el camino más duro y honesto'},{en:'Pick the easiest shortcut',de:'Die leichteste Abkürzung',es:'El atajo más fácil'},{en:'Don\'t decide at all',de:'Gar nicht entscheiden',es:'No decidir'}],correct:0},
  { q:{en:'Henri thinks the best ideas come from…',de:'Henri findet, die besten Ideen kommen von…',es:'Las mejores ideas vienen de…'},
    options:[{en:'Doing real things in the real world',de:'Echte Dinge in der echten Welt tun',es:'Hacer cosas reales en el mundo real'},{en:'Sitting and waiting',de:'Sitzen und warten',es:'Estar sentado esperando'},{en:'Random tweets only',de:'Nur zufällige Tweets',es:'Tweets aleatorios'}],correct:0},
  { q:{en:'Henri thinks branding should feel…',de:'Henri findet, Branding soll sich anfühlen wie…',es:'El branding debe sentirse…'},
    options:[{en:'Human, recognizable, consistent',de:'Menschlich, erkennbar, konsistent',es:'Humano, reconocible, consistente'},{en:'Cold and corporate',de:'Kalt und Corporate',es:'Frío y corporativo'},{en:'Different every week',de:'Jede Woche anders',es:'Diferente cada semana'}],correct:0},
  { q:{en:'Henri\'s view on multitasking:',de:'Henris Sicht auf Multitasking:',es:'Su visión del multitasking:'},
    options:[{en:'Deep focus beats multitasking',de:'Tiefer Fokus schlägt Multitasking',es:'El foco profundo gana'},{en:'10 things at once is best',de:'10 Dinge gleichzeitig ist top',es:'10 cosas a la vez es lo mejor'},{en:'Doesn\'t matter',de:'Egal',es:'Da igual'}],correct:0},
  { q:{en:'Henri sees content creation as…',de:'Henri sieht Content Creation als…',es:'Ve la creación de contenido como…'},
    options:[{en:'A craft you build over years',de:'Handwerk, das man über Jahre aufbaut',es:'Un oficio que se construye en años'},{en:'A get-rich-quick scheme',de:'Schnell-reich-Schema',es:'Esquema para hacerse rico'},{en:'Only luck',de:'Nur Glück',es:'Solo suerte'}],correct:0},
  { q:{en:'Henri\'s reaction when a project takes off:',de:'Henris Reaktion, wenn ein Projekt abhebt:',es:'Su reacción cuando un proyecto despega:'},
    options:[{en:'Stay grounded, double down on quality',de:'Geerdet bleiben, Qualität verdoppeln',es:'Mantener los pies en tierra'},{en:'Get arrogant',de:'Arrogant werden',es:'Volverse arrogante'},{en:'Disappear',de:'Verschwinden',es:'Desaparecer'}],correct:0},
  { q:{en:'Henri thinks a portfolio should be…',de:'Henri findet, ein Portfolio soll…',es:'Un portfolio debe ser…'},
    options:[{en:'A reflection of personality, not just skills',de:'Spiegel der Persönlichkeit, nicht nur Skills',es:'Reflejo de personalidad, no solo skills'},{en:'A boring list of jobs',de:'Eine langweilige Job-Liste',es:'Una lista aburrida'},{en:'A single PDF page',de:'Eine PDF-Seite',es:'Una página PDF'}],correct:0},
  { q:{en:'Henri\'s preferred working hours:',de:'Henris bevorzugte Arbeitszeit:',es:'Su horario preferido:'},
    options:[{en:'Whenever the energy is high',de:'Wann immer die Energie hoch ist',es:'Cuando hay energía alta'},{en:'Strict 9–5 forever',de:'Strikt 9–17 Uhr',es:'Estricto 9–17'},{en:'Never working',de:'Nie arbeiten',es:'Nunca trabajar'}],correct:0},
  { q:{en:'Henri thinks "ideas" without execution are…',de:'Henri findet, Ideen ohne Umsetzung sind…',es:'Las ideas sin ejecución son…'},
    options:[{en:'Worth almost nothing',de:'Fast nichts wert',es:'Casi nada valen'},{en:'The whole job',de:'Die ganze Arbeit',es:'Todo el trabajo'},{en:'More important than action',de:'Wichtiger als Handeln',es:'Más importantes que actuar'}],correct:0},
  { q:{en:'Henri appreciates teachers / mentors who…',de:'Henri schätzt Lehrer / Mentoren, die…',es:'Aprecia mentores que…'},
    options:[{en:'Push him to think for himself',de:'Ihn zum Selberdenken pushen',es:'Lo empujan a pensar por sí mismo'},{en:'Tell him exactly what to do',de:'Ihm alles vorgeben',es:'Le dicen todo qué hacer'},{en:'Ignore him',de:'Ihn ignorieren',es:'Lo ignoran'}],correct:0},
  { q:{en:'Henri usually values experience over…',de:'Henri schätzt Erfahrung höher als…',es:'Valora la experiencia más que…'},
    options:[{en:'Theory alone',de:'Reine Theorie',es:'Solo teoría'},{en:'Doing anything at all',de:'Überhaupt etwas tun',es:'Hacer algo en absoluto'},{en:'Reality',de:'Realität',es:'Realidad'}],correct:0},
  { q:{en:'On the question "what motivates you?", Henri would likely say:',de:'Auf "was motiviert dich?" würde Henri sagen:',es:'A "¿qué te motiva?", Henri diría:'},
    options:[{en:'Building things people actually use',de:'Dinge bauen, die Menschen wirklich nutzen',es:'Construir cosas que se usen de verdad'},{en:'Pure money',de:'Nur Geld',es:'Solo dinero'},{en:'Approval from strangers',de:'Bestätigung von Fremden',es:'Aprobación de extraños'}],correct:0},
  { q:{en:'Henri\'s view on "overnight success":',de:'Henris Sicht auf "Über-Nacht-Erfolg":',es:'Su visión del "éxito de la noche a la mañana":'},
    options:[{en:'Usually 5+ years of unseen work',de:'Meist 5+ Jahre unsichtbare Arbeit',es:'Suelen ser 5+ años de trabajo invisible'},{en:'Real and instant',de:'Echt und sofort',es:'Real y al instante'},{en:'Pure luck always',de:'Nur Glück',es:'Pura suerte siempre'}],correct:0},
  { q:{en:'Henri thinks empathy in business is…',de:'Henri findet, Empathie im Business ist…',es:'La empatía en negocios es…'},
    options:[{en:'A real competitive advantage',de:'Echter Wettbewerbsvorteil',es:'Una ventaja competitiva real'},{en:'A weakness',de:'Eine Schwäche',es:'Una debilidad'},{en:'Irrelevant',de:'Irrelevant',es:'Irrelevante'}],correct:0},
  { q:{en:'Henri prefers to spend time with people who…',de:'Henri verbringt Zeit am liebsten mit Menschen, die…',es:'Prefiere pasar tiempo con personas que…'},
    options:[{en:'Build their own thing',de:'Ihr eigenes Ding bauen',es:'Construyen lo suyo'},{en:'Only consume',de:'Nur konsumieren',es:'Solo consumen'},{en:'Tear others down',de:'Andere runterziehen',es:'Tiran a otros abajo'}],correct:0},
  { q:{en:'Henri\'s view on "side projects":',de:'Henris Sicht auf Side-Projects:',es:'Su visión de los side projects:'},
    options:[{en:'Often turn into the main thing',de:'Werden oft zur Hauptsache',es:'Suelen volverse lo principal'},{en:'Always a waste',de:'Immer Verschwendung',es:'Siempre desperdicio'},{en:'Not allowed',de:'Verboten',es:'No permitidos'}],correct:0},
  { q:{en:'When Henri picks colors / design, he leans toward…',de:'Bei Farben / Design tendiert Henri zu…',es:'En colores/diseño se inclina por…'},
    options:[{en:'Warm, bold, characterful',de:'Warm, mutig, charakterstark',es:'Cálido, atrevido, con carácter'},{en:'Pure grayscale forever',de:'Nur Graustufen',es:'Solo escala de grises'},{en:'Random clashing colors',de:'Zufällig kollidierende Farben',es:'Colores aleatorios chocando'}],correct:0},
  { q:{en:'Henri thinks the best way to be remembered is…',de:'Henri findet, am besten in Erinnerung bleibt man durch…',es:'La mejor forma de ser recordado es…'},
    options:[{en:'How you made people feel + what you built',de:'Wie du Leute fühlen ließest + was du gebaut hast',es:'Cómo hiciste sentir a la gente + lo que creaste'},{en:'Followers count',de:'Follower-Zahl',es:'Número de seguidores'},{en:'Money in the bank',de:'Geld auf der Bank',es:'Dinero en el banco'}],correct:0},
  { q:{en:'Henri\'s general energy can be summed up as…',de:'Henris Energie lässt sich beschreiben als…',es:'Su energía se resume como…'},
    options:[{en:'Calm hustle — steady, intentional',de:'Ruhiger Hustle — konstant, bewusst',es:'Hustle tranquilo — constante e intencional'},{en:'Burnout sprint',de:'Burnout-Sprint',es:'Sprint de burnout'},{en:'No energy at all',de:'Keine Energie',es:'Sin energía'}],correct:0},
  { q:{en:'Henri thinks the most underrated skill today is…',de:'Henri findet, der unterschätzteste Skill heute ist…',es:'La habilidad más subestimada hoy es…'},
    options:[{en:'Consistency',de:'Konstanz',es:'Constancia'},{en:'Yelling loudest',de:'Am lautesten schreien',es:'Gritar más fuerte'},{en:'Hype-skills',de:'Hype-Skills',es:'Habilidades de hype'}],correct:0},
  { q:{en:'How does Henri view the future of his projects?',de:'Wie sieht Henri die Zukunft seiner Projekte?',es:'¿Cómo ve el futuro de sus proyectos?'},
    options:[{en:'Open — keep building, keep learning',de:'Offen — weiterbauen, weiterlernen',es:'Abierto — seguir construyendo y aprendiendo'},{en:'Already done',de:'Schon vorbei',es:'Ya terminado'},{en:'No plans ever',de:'Niemals Pläne',es:'Sin planes nunca'}],correct:0},
];

const T: Record<Lang, Record<string, string>> = {
  english: {
    title: 'Have you stalked me enough?',
    sub: "Let's test. ~100 questions about how I think, work and live. Pick wisely — your progress is saved.",
    start: 'Start the quiz',
    resume: 'Continue where you left off',
    next: 'Next question',
    finish: 'See result',
    again: 'Restart from scratch',
    back: 'Back to Desktop',
    score: 'You scored',
    of: 'of',
    perfect: 'Certified Henri-stalker. Impressive.',
    great: 'Pretty solid. You\'ve been paying attention.',
    okay: 'Not bad — but keep going.',
    bad: 'Awkward. Maybe actually read the projects?',
    correct: 'Correct',
    wrong: 'Wrong',
    qOf: 'Question',
    saved: 'Progress saved automatically.',
  },
  deutsch: {
    title: 'Hast du genug über mich gestalkt?',
    sub: 'Mal sehen. ~100 Fragen darüber, wie ich denke, arbeite und lebe. Dein Fortschritt wird automatisch gespeichert.',
    start: 'Quiz starten',
    resume: 'Dort weitermachen, wo du aufgehört hast',
    next: 'Nächste Frage',
    finish: 'Ergebnis ansehen',
    again: 'Neu starten',
    back: 'Zurück zum Desktop',
    score: 'Du hast',
    of: 'von',
    perfect: 'Zertifizierter Henri-Stalker. Beeindruckend.',
    great: 'Ziemlich gut. Du hast aufgepasst.',
    okay: 'Nicht schlecht — aber weiter geht\'s.',
    bad: 'Peinlich. Lies vielleicht erstmal die Projekte?',
    correct: 'Richtig',
    wrong: 'Falsch',
    qOf: 'Frage',
    saved: 'Fortschritt wird automatisch gespeichert.',
  },
  español: {
    title: '¿Ya me has stalkeado suficiente?',
    sub: 'A ver. ~100 preguntas sobre cómo pienso, trabajo y vivo. Tu progreso se guarda automáticamente.',
    start: 'Empezar el quiz',
    resume: 'Continuar donde lo dejaste',
    next: 'Siguiente pregunta',
    finish: 'Ver resultado',
    again: 'Empezar de cero',
    back: 'Volver al escritorio',
    score: 'Has acertado',
    of: 'de',
    perfect: 'Stalker certificado de Henri. Impresionante.',
    great: 'Bastante bien. Has estado atento.',
    okay: 'No está mal — sigue.',
    bad: 'Qué vergüenza. ¿Quizá lee los proyectos?',
    correct: 'Correcto',
    wrong: 'Incorrecto',
    qOf: 'Pregunta',
    saved: 'Progreso guardado automáticamente.',
  },
};

const pick = (l: Lang, t: Trio) => t[l === 'deutsch' ? 'de' : l === 'español' ? 'es' : 'en'];

const STORAGE_KEY = 'henri.quiz.progress.v2';

interface SavedProgress {
  order: number[]; // shuffled indices into QUESTIONS
  step: number;   // current question index in order
  score: number;
  picked: number | null;
}

const loadProgress = (): SavedProgress | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (!Array.isArray(parsed.order) || parsed.order.length === 0) return null;
    return parsed;
  } catch { return null; }
};

const saveProgress = (p: SavedProgress) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
};

const clearProgress = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};

const Challenges = () => {
  const { language, theme } = useSettings();
  const lang = (language as Lang) || 'english';
  const tr = T[lang] || T.english;

  const [order, setOrder] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [hasSaved, setHasSaved] = useState(false);

  // On mount: detect saved progress
  useEffect(() => {
    const p = loadProgress();
    if (p && p.step < p.order.length) {
      setHasSaved(true);
    }
  }, []);

  // Persist while playing
  useEffect(() => {
    if (phase === 'playing' && order.length > 0) {
      saveProgress({ order, step, score, picked });
    }
  }, [order, step, score, picked, phase]);

  const startFresh = () => {
    const indices = QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
    setOrder(indices);
    setStep(0);
    setPicked(null);
    setScore(0);
    setPhase('playing');
    setHasSaved(false);
  };

  const resume = () => {
    const p = loadProgress();
    if (!p) { startFresh(); return; }
    setOrder(p.order);
    setStep(p.step);
    setScore(p.score);
    setPicked(p.picked);
    setPhase('playing');
    setHasSaved(false);
  };

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === order.length && false) return; // noop guard
    const q = QUESTIONS[order[step]];
    if (i === q.correct) setScore(s => s + 1);
  };

  const onNext = () => {
    if (step + 1 >= order.length) {
      setPhase('done');
      clearProgress();
    } else {
      setStep(s => s + 1);
      setPicked(null);
    }
  };

  const restartFromDone = () => {
    clearProgress();
    startFresh();
  };

  const resultMsg = useMemo(() => {
    const pct = score / Math.max(1, order.length);
    if (pct === 1) return tr.perfect;
    if (pct >= 0.67) return tr.great;
    if (pct >= 0.34) return tr.okay;
    return tr.bad;
  }, [score, order.length, tr]);

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
  const ctaSecondary = isOrange
    ? 'bg-yellow-50/80 hover:bg-yellow-100/90 text-orange-900 border-orange-700/40'
    : 'bg-white/80 hover:bg-white text-black border-black/30';
  const cardBase = isOrange ? 'bg-yellow-50/80 border-orange-700/40' : 'bg-white/70 border-black/30';

  const current = order.length > 0 ? QUESTIONS[order[step]] : null;
  const progressPct = order.length > 0 ? Math.round(((step) / order.length) * 100) : 0;

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
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  {hasSaved && (
                    <button
                      onClick={resume}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black/30 transition-all duration-300 hover:scale-105 font-pixel ${cta}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {tr.resume}
                    </button>
                  )}
                  <button
                    onClick={startFresh}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 font-pixel ${hasSaved ? ctaSecondary : cta}`}
                  >
                    {hasSaved ? <RotateCcw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {hasSaved ? tr.again : tr.start}
                  </button>
                </div>
                <p className={`mt-6 text-xs font-pixel opacity-70 ${text}`}>{tr.saved}</p>
              </>
            )}

            {phase === 'playing' && current && (
              <div className="w-full max-w-xl space-y-5">
                <div className={`text-xs font-pixel ${text} opacity-70`}>
                  {tr.qOf} {step + 1} / {order.length}
                </div>
                <div className="w-full h-2 bg-black/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isOrange ? 'bg-orange-700' : 'bg-blue-700'}`}
                    style={{ width: `${progressPct}%` }}
                  />
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
                    {step + 1 >= order.length ? tr.finish : tr.next}
                  </button>
                )}

                <p className={`text-xs font-pixel opacity-60 ${text}`}>{tr.saved}</p>
              </div>
            )}

            {phase === 'done' && (
              <div className="space-y-5 max-w-xl">
                <div className="text-6xl">{score === order.length ? '🏆' : score >= order.length * 0.67 ? '🎯' : '🤔'}</div>
                <p className={`text-2xl font-pixel ${text}`}>
                  {tr.score} {score} {tr.of} {order.length}
                </p>
                <p className={`text-base font-pixel ${text}`}>{resultMsg}</p>
                <button
                  onClick={restartFromDone}
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
