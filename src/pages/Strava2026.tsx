import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Clock, Calendar as CalendarIcon, TrendingUp, MapPin, Timer, Flame, Heart, Zap, Mountain } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AnimatedCounter from '@/components/AnimatedCounter';
import stravaLogo from '@/assets/strava-logo.png';

interface ChallengeSummary {
  startDateISO: string;
  totalDays: number;
  daysDone: number;
  daysRemaining: number;
  pct: number;
  todayDayNumber: number;
  todayDone: boolean;
  todayStats: {
    distanceKm: number;
    movingTimeSec: number;
    activityName: string;
  } | null;
}

interface CalendarData {
  startDateISO: string;
  doneMap: boolean[];
  todayDayNumber: number;
}

interface DayDetails {
  dayNumber: number;
  dateISO: string;
  done: boolean;
  strava: {
    distanceKm: number;
    movingTimeSec: number;
    paceSecPerKm: number;
    elevationM: number;
    activityName: string;
    calories?: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    avgCadence?: number;
    splits?: Array<{
      distance: number;
      elapsed_time: number;
      elevation_difference: number;
      moving_time: number;
      split: number;
      average_speed: number;
      average_heartrate?: number;
      pace_zone?: number;
    }>;
    map?: {
      polyline: string;
      summary_polyline: string;
    };
    suffer_score?: number;
    pr_count?: number;
    achievement_count?: number;
    kudos_count?: number;
    start_latlng?: [number, number];
    end_latlng?: [number, number];
  } | null;
  tiktok: {
    title: string;
    url: string;
    thumbnail: string | null;
  } | null;
}

const Strava2026 = () => {
  const { t, language, theme } = useSettings();
  const [view, setView] = useState<'home' | 'day'>('home');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [summary, setSummary] = useState<ChallengeSummary | null>(null);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [dayDetails, setDayDetails] = useState<DayDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  const stravaOAuthUrl = 'https://uwwxkkkzkwiftbekezvl.supabase.co/functions/v1/strava-oauth-callback';

  const getWindowStyles = () => {
    const baseStyles = {
      windowFrame: 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-red-500 to-red-600',
      windowContent: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      text: 'text-white',
      textMuted: 'text-orange-200/80',
      textAccent: 'text-orange-400',
      link: 'text-orange-300 hover:text-orange-200',
      button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/30',
      buttonSecondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      cardBg: 'bg-white/5 border border-white/10 backdrop-blur-sm',
      cardBgAlt: 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30',
      progressBg: 'bg-white/10',
      progressBar: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600',
      dayDone: 'bg-green-500 text-white',
      dayPending: 'bg-orange-500/80 text-white',
      dayFuture: 'bg-white/10 text-white/30',
      dayToday: 'ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900',
    };
    return baseStyles;
  };

  const styles = getWindowStyles();

  useEffect(() => {
    fetchChallengeData();
  }, []);

  const extractEdgeFunctionError = async (err: any): Promise<string | null> => {
    const res: Response | undefined = err?.context;
    if (!res || typeof res.headers?.get !== 'function') return null;
    try {
      const contentType = (res.headers.get('Content-Type') ?? '').split(';')[0].trim();
      if (contentType === 'application/json') {
        const json = await res.json().catch(() => null);
        if (json?.error && typeof json.error === 'string') return json.error;
        if (json) return JSON.stringify(json);
      }
      const text = await res.text().catch(() => '');
      return text || null;
    } catch {
      return null;
    }
  };

  const fetchChallengeData = async () => {
    setLoading(true);
    try {
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke('strava-challenge', {
        body: { action: 'summary' },
      });
      if (summaryError) throw summaryError;
      setSummary(summaryData as ChallengeSummary);

      const { data: calendarData, error: calendarError } = await supabase.functions.invoke('strava-challenge', {
        body: { action: 'calendar' },
      });
      if (calendarError) throw calendarError;
      setCalendar(calendarData as CalendarData);

      const today = (summaryData as ChallengeSummary | null)?.todayDayNumber ?? 0;
      if (today > 0) setSelectedDay(today);
    } catch (error: any) {
      console.error('Error fetching challenge data:', error);
      const edgeError = await extractEdgeFunctionError(error);
      const description = edgeError ?? (typeof error?.message === 'string' ? error.message : 'Failed to load challenge data.');
      if (description.includes('401') || description.includes('activity:read') || description.includes('Authorization')) {
        setNeedsAuth(true);
      }
      toast({ title: 'Error', description, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDayDetails = async (day: number) => {
    setDayLoading(true);
    setSelectedDay(day);
    try {
      const { data, error } = await supabase.functions.invoke('strava-challenge', {
        body: { action: 'day', day },
      });
      if (error) throw error;
      setDayDetails(data as DayDetails);
      setView('day');
    } catch (error: any) {
      console.error('Error fetching day details:', error);
      const edgeError = await extractEdgeFunctionError(error);
      toast({ title: 'Error', description: edgeError ?? 'Failed to load day details', variant: 'destructive' });
    } finally {
      setDayLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secPerKm: number): string => {
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.floor(secPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateISO: string): string => {
    const date = new Date(dateISO);
    return date.toLocaleDateString(language === 'deutsch' ? 'de-DE' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getText = (key: string): string => {
    const texts: Record<string, Record<string, string>> = {
      myStravaGoal: { en: 'My Strava Goal', deutsch: 'Mein Strava Ziel' },
      goalDescription: {
        en: `This year I want to do something fun — but also something that gives me routine and motivation.\n\nI started the goal of running/walking 5 km every day for 365 days. I also post one video every day to motivate others.`,
        deutsch: `Dieses Jahr möchte ich etwas Lustiges machen — aber auch etwas, das mir Routine und Motivation gibt.\n\nIch habe mir das Ziel gesetzt, jeden Tag 5 km zu laufen, 365 Tage lang. Ich poste auch jeden Tag ein Video zur Motivation.`,
      },
      today: { en: 'Today', deutsch: 'Heute' },
      day: { en: 'Day', deutsch: 'Tag' },
      done: { en: 'DONE', deutsch: 'ERLEDIGT' },
      pending: { en: 'PENDING', deutsch: 'AUSSTEHEND' },
      distance: { en: 'Distance', deutsch: 'Distanz' },
      time: { en: 'Time', deutsch: 'Zeit' },
      viewDay: { en: 'View Day', deutsch: 'Tag ansehen' },
      progress: { en: 'Progress', deutsch: 'Fortschritt' },
      daysLeft: { en: 'days left', deutsch: 'Tage übrig' },
      daysCompleted: { en: 'Days Completed', deutsch: 'Tage geschafft' },
      stravaProfile: { en: 'Strava Profile', deutsch: 'Strava Profil' },
      tiktokProfile: { en: 'TikTok Profile', deutsch: 'TikTok Profil' },
      backToChallenge: { en: 'Back to Challenge', deutsch: 'Zurück zur Challenge' },
      backToDesktop: { en: 'Back to Desktop', deutsch: 'Zurück zum Desktop' },
      videoProof: { en: 'Video Proof', deutsch: 'Video-Beweis' },
      stravaAnalytics: { en: 'Strava Analytics', deutsch: 'Strava Statistiken' },
      pace: { en: 'Pace', deutsch: 'Tempo' },
      elevation: { en: 'Elevation', deutsch: 'Höhenmeter' },
      openTikTok: { en: 'Open TikTok', deutsch: 'TikTok öffnen' },
      calendar: { en: '365-Day Calendar', deutsch: '365-Tage Kalender' },
      loading: { en: 'Loading...', deutsch: 'Laden...' },
      noActivity: { en: 'No activity yet', deutsch: 'Noch keine Aktivität' },
      noVideo: { en: 'No video yet', deutsch: 'Noch kein Video' },
      challengeNotStarted: { en: 'Challenge started December 14, 2025!', deutsch: 'Challenge startete am 14. Dezember 2025!' },
      splits: { en: 'Kilometer Splits', deutsch: 'Kilometer-Zwischenzeiten' },
      heartRate: { en: 'Heart Rate', deutsch: 'Herzfrequenz' },
      avgHr: { en: 'Avg HR', deutsch: 'Ø HF' },
      maxHr: { en: 'Max HR', deutsch: 'Max HF' },
      calories: { en: 'Calories', deutsch: 'Kalorien' },
      cadence: { en: 'Cadence', deutsch: 'Kadenz' },
      sufferScore: { en: 'Relative Effort', deutsch: 'Relative Anstrengung' },
      achievements: { en: 'Achievements', deutsch: 'Erfolge' },
      prs: { en: 'PRs', deutsch: 'Bestzeiten' },
      kudos: { en: 'Kudos', deutsch: 'Kudos' },
      km: { en: 'km', deutsch: 'km' },
      perKm: { en: '/km', deutsch: '/km' },
      bpm: { en: 'bpm', deutsch: 'bpm' },
      spm: { en: 'spm', deutsch: 'spm' },
    };
    return texts[key]?.[language === 'deutsch' ? 'deutsch' : 'en'] || key;
  };

  // Get the actual date for a day number
  const getDateForDay = (dayNumber: number): Date => {
    const startDate = new Date('2025-12-14');
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayNumber - 1);
    return date;
  };

  // Render the new calendar with visible day numbers
  const renderCalendar = () => {
    if (!calendar) return null;

    const months = [
      { name: language === 'deutsch' ? 'Dez' : 'Dec', shortName: 'Dec', year: 2025, daysInMonth: 31, startDay: 14 },
      { name: language === 'deutsch' ? 'Jan' : 'Jan', shortName: 'Jan', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Feb' : 'Feb', shortName: 'Feb', year: 2026, daysInMonth: 28, startDay: 1 },
      { name: language === 'deutsch' ? 'Mär' : 'Mar', shortName: 'Mar', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Apr' : 'Apr', shortName: 'Apr', year: 2026, daysInMonth: 30, startDay: 1 },
      { name: language === 'deutsch' ? 'Mai' : 'May', shortName: 'May', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Jun' : 'Jun', shortName: 'Jun', year: 2026, daysInMonth: 30, startDay: 1 },
      { name: language === 'deutsch' ? 'Jul' : 'Jul', shortName: 'Jul', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Aug' : 'Aug', shortName: 'Aug', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Sep' : 'Sep', shortName: 'Sep', year: 2026, daysInMonth: 30, startDay: 1 },
      { name: language === 'deutsch' ? 'Okt' : 'Oct', shortName: 'Oct', year: 2026, daysInMonth: 31, startDay: 1 },
      { name: language === 'deutsch' ? 'Nov' : 'Nov', shortName: 'Nov', year: 2026, daysInMonth: 30, startDay: 1 },
      { name: language === 'deutsch' ? 'Dez' : 'Dec', shortName: 'Dec', year: 2026, daysInMonth: 13, startDay: 1 },
    ];

    let currentChallengeDay = 1;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {months.map((month, monthIndex) => {
          const daysToShow = month.year === 2025 
            ? month.daysInMonth - month.startDay + 1 
            : month.daysInMonth;

          const monthDays: JSX.Element[] = [];
          
          for (let d = 0; d < daysToShow && currentChallengeDay <= 365; d++) {
            const dayNum = currentChallengeDay;
            const calendarDay = month.year === 2025 ? month.startDay + d : d + 1;
            const isDone = calendar.doneMap[dayNum - 1];
            const isToday = dayNum === calendar.todayDayNumber;
            const isFuture = dayNum > calendar.todayDayNumber;

            let dayClass = 'bg-orange-500/60 hover:bg-orange-400/80 text-white';
            if (isDone) dayClass = 'bg-green-500 hover:bg-green-400 text-white';
            if (isFuture) dayClass = 'bg-white/5 text-white/30 cursor-not-allowed';

            monthDays.push(
              <button
                key={dayNum}
                onClick={() => !isFuture && fetchDayDetails(dayNum)}
                disabled={isFuture || dayLoading}
                className={`
                  relative w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center 
                  transition-all duration-200 ${dayClass} ${isToday ? 'ring-2 ring-orange-400 ring-offset-1 ring-offset-slate-800' : ''}
                  ${!isFuture ? 'hover:scale-110 cursor-pointer' : ''}
                `}
                title={`Day ${dayNum} - ${calendarDay}. ${month.name}`}
              >
                {calendarDay}
                {isDone && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-green-900" />
                  </span>
                )}
              </button>
            );
            currentChallengeDay++;
          }

          return (
            <div key={`${month.name}-${month.year}`} className={`p-3 rounded-xl ${styles.cardBg}`}>
              <h4 className="text-sm font-bold text-orange-400 mb-2 text-center">
                {month.name} {month.year}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {monthDays}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Hero Header with Logo and animated counter
  const renderHeroHeader = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-8 mb-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,white,transparent_70%)]" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img 
            src={stravaLogo} 
            alt="Strava Logo" 
            className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              365 Day Challenge
            </h1>
            <p className="text-orange-100 text-lg">5 km • {language === 'deutsch' ? 'Jeden Tag' : 'Every Day'} • 2026</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {/* Days Counter - Animated */}
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-black text-white drop-shadow-lg tabular-nums">
              <AnimatedCounter value={summary?.daysDone || 0} duration={2000} />
            </div>
            <p className="text-orange-100 font-medium text-sm md:text-base">{getText('daysCompleted')}</p>
          </div>

          {/* Divider */}
          <div className="h-20 w-px bg-white/30" />

          {/* Days Remaining */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white/80 tabular-nums">
              {summary?.daysRemaining || 365}
            </div>
            <p className="text-orange-100/80 text-sm">{getText('daysLeft')}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>{getText('progress')}</span>
          <span>{Math.round((summary?.daysDone || 0) / 365 * 100)}%</span>
        </div>
        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((summary?.daysDone || 0) / 365) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  // Today's Status Card
  const renderTodayCard = () => (
    <div className={`p-6 rounded-xl ${styles.cardBgAlt}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-orange-400 font-medium">{getText('today')}</span>
        {summary?.todayDone ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white font-medium rounded-full text-sm">
            <Check className="w-4 h-4" />
            {getText('done')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white font-medium rounded-full text-sm animate-pulse">
            <Clock className="w-4 h-4" />
            {getText('pending')}
          </span>
        )}
      </div>

      <div className="text-center py-4">
        <span className="text-7xl md:text-8xl font-black text-white tabular-nums">
          <AnimatedCounter value={summary?.todayDayNumber || 0} duration={1500} />
        </span>
        <p className="text-orange-300 text-lg mt-2">{getText('day')}</p>
      </div>

      {summary?.todayStats && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className={`p-3 rounded-lg ${styles.cardBg} text-center`}>
            <MapPin className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{summary.todayStats.distanceKm}</div>
            <div className="text-xs text-orange-200/60">{getText('km')}</div>
          </div>
          <div className={`p-3 rounded-lg ${styles.cardBg} text-center`}>
            <Timer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{formatTime(summary.todayStats.movingTimeSec)}</div>
            <div className="text-xs text-orange-200/60">{getText('time')}</div>
          </div>
        </div>
      )}

      <button
        onClick={() => summary?.todayDayNumber && fetchDayDetails(summary.todayDayNumber)}
        disabled={!summary?.todayDayNumber || dayLoading}
        className={`w-full mt-4 py-3 rounded-lg font-medium transition-all hover:scale-[1.02] ${styles.button}`}
      >
        {dayLoading ? '...' : getText('viewDay')}
      </button>
    </div>
  );

  // Home View
  const renderHomeView = () => (
    <div className="space-y-6">
      {renderHeroHeader()}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Story */}
        <div className={`md:col-span-2 p-6 rounded-xl ${styles.cardBg}`}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            {getText('myStravaGoal')}
          </h2>
          <p className="text-orange-100/80 whitespace-pre-line leading-relaxed">
            {getText('goalDescription')}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="https://www.strava.com/athletes/185666796"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${styles.button}`}
            >
              <TrendingUp className="w-4 h-4" />
              {getText('stravaProfile')}
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.tiktok.com/@henri.running"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${styles.buttonSecondary}`}
            >
              🎵 {getText('tiktokProfile')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Today Status */}
        {renderTodayCard()}
      </div>

      {/* Calendar */}
      <div className={`p-6 rounded-xl ${styles.cardBg}`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-orange-400" />
          {getText('calendar')}
        </h3>
        {renderCalendar()}
      </div>
    </div>
  );

  // Enhanced Day View with more Strava data
  const renderDayView = () => {
    if (!dayDetails) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-orange-300 hover:text-orange-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {getText('backToChallenge')}
          </button>
          {dayDetails.done ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white font-medium rounded-full">
              <Check className="w-4 h-4" />
              {getText('done')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 text-white font-medium rounded-full">
              <Clock className="w-4 h-4" />
              {getText('pending')}
            </span>
          )}
        </div>

        {/* Day Title */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
            <span className="text-4xl md:text-5xl font-black text-white">{getText('day')} {dayDetails.dayNumber}</span>
          </div>
          <p className="text-orange-200/80">{formatDate(dayDetails.dateISO)}</p>
        </div>

        {/* Main Stats Grid */}
        {dayDetails.strava && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <MapPin className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{dayDetails.strava.distanceKm}</div>
              <div className="text-sm text-orange-200/60">{getText('km')}</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Timer className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatTime(dayDetails.strava.movingTimeSec)}</div>
              <div className="text-sm text-orange-200/60">{getText('time')}</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Zap className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatPace(dayDetails.strava.paceSecPerKm)}</div>
              <div className="text-sm text-orange-200/60">{getText('perKm')}</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Mountain className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{dayDetails.strava.elevationM}</div>
              <div className="text-sm text-orange-200/60">m</div>
            </div>
          </div>
        )}

        {/* Additional Stats Row */}
        {dayDetails.strava && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {dayDetails.strava.avgHeartRate && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{dayDetails.strava.avgHeartRate}</div>
                <div className="text-xs text-orange-200/60">{getText('avgHr')}</div>
              </div>
            )}
            {dayDetails.strava.maxHeartRate && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{dayDetails.strava.maxHeartRate}</div>
                <div className="text-xs text-orange-200/60">{getText('maxHr')}</div>
              </div>
            )}
            {dayDetails.strava.calories && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{dayDetails.strava.calories}</div>
                <div className="text-xs text-orange-200/60">{getText('calories')}</div>
              </div>
            )}
            {dayDetails.strava.avgCadence && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{Math.round(dayDetails.strava.avgCadence * 2)}</div>
                <div className="text-xs text-orange-200/60">{getText('spm')}</div>
              </div>
            )}
            {dayDetails.strava.suffer_score && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{dayDetails.strava.suffer_score}</div>
                <div className="text-xs text-orange-200/60">{getText('sufferScore')}</div>
              </div>
            )}
          </div>
        )}

        {/* Activity Name */}
        {dayDetails.strava && (
          <div className={`p-4 rounded-xl ${styles.cardBg}`}>
            <p className="text-lg text-white text-center font-medium">
              "{dayDetails.strava.activityName}"
            </p>
          </div>
        )}

        {/* Splits Table */}
        {dayDetails.strava?.splits && dayDetails.strava.splits.length > 0 && (
          <div className={`p-6 rounded-xl ${styles.cardBg}`}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-400" />
              {getText('splits')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-orange-300/80 border-b border-white/10">
                    <th className="text-left py-2 px-3">KM</th>
                    <th className="text-center py-2 px-3">{getText('time')}</th>
                    <th className="text-center py-2 px-3">{getText('pace')}</th>
                    <th className="text-center py-2 px-3">{getText('elevation')}</th>
                    {dayDetails.strava.splits[0]?.average_heartrate && (
                      <th className="text-center py-2 px-3">HR</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dayDetails.strava.splits.map((split, idx) => {
                    const paceSeconds = split.moving_time / (split.distance / 1000);
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3 text-white font-medium">{split.split}</td>
                        <td className="py-2 px-3 text-center text-orange-100">{formatTime(split.moving_time)}</td>
                        <td className="py-2 px-3 text-center text-orange-100">{formatPace(paceSeconds)}</td>
                        <td className="py-2 px-3 text-center text-orange-100">
                          <span className={split.elevation_difference >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {split.elevation_difference >= 0 ? '+' : ''}{Math.round(split.elevation_difference)}m
                          </span>
                        </td>
                        {split.average_heartrate && (
                          <td className="py-2 px-3 text-center text-red-400">{Math.round(split.average_heartrate)}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Grid - Video & No Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Proof */}
          <div className={`p-6 rounded-xl ${styles.cardBg}`}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🎬 {getText('videoProof')}
            </h3>
            {dayDetails.tiktok ? (
              <div className="space-y-4">
                <div className="aspect-[9/16] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-white/10">
                  <div className="text-center p-4">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-white text-sm">{dayDetails.tiktok.title}</p>
                  </div>
                </div>
                <a
                  href={dayDetails.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all hover:scale-[1.02] ${styles.button}`}
                >
                  {getText('openTikTok')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="aspect-[9/16] bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2 opacity-50">📹</div>
                  <p className="text-orange-200/50 text-sm">{getText('noVideo')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Achievements / Kudos */}
          {dayDetails.strava && (
            <div className={`p-6 rounded-xl ${styles.cardBgAlt}`}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                {getText('achievements')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {dayDetails.strava.pr_count !== undefined && (
                  <div className={`p-4 rounded-lg ${styles.cardBg} text-center`}>
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-yellow-400">{dayDetails.strava.pr_count}</div>
                    <div className="text-xs text-orange-200/60">{getText('prs')}</div>
                  </div>
                )}
                {dayDetails.strava.achievement_count !== undefined && (
                  <div className={`p-4 rounded-lg ${styles.cardBg} text-center`}>
                    <div className="text-3xl mb-2">🎖️</div>
                    <div className="text-2xl font-bold text-orange-400">{dayDetails.strava.achievement_count}</div>
                    <div className="text-xs text-orange-200/60">{getText('achievements')}</div>
                  </div>
                )}
                {dayDetails.strava.kudos_count !== undefined && (
                  <div className={`p-4 rounded-lg ${styles.cardBg} text-center`}>
                    <div className="text-3xl mb-2">👏</div>
                    <div className="text-2xl font-bold text-green-400">{dayDetails.strava.kudos_count}</div>
                    <div className="text-xs text-orange-200/60">{getText('kudos')}</div>
                  </div>
                )}
              </div>

              {/* If no activity */}
              {!dayDetails.strava && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2 opacity-50">📊</div>
                  <p className="text-orange-200/50">{getText('noActivity')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calendar at bottom */}
        <div className={`p-6 rounded-xl ${styles.cardBg}`}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-400" />
            {getText('calendar')}
          </h3>
          {renderCalendar()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className={`p-1 sm:p-2 border-2 border-orange-500/50 w-full max-w-7xl mx-auto shadow-2xl shadow-orange-500/20 rounded-xl ${styles.windowFrame}`}>
        {/* Title Bar */}
        <div className={`p-3 rounded-t-lg flex items-center gap-3 ${styles.titleBar}`}>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-white font-medium">🏃 Strava 2026 Challenge</span>
        </div>
        
        {/* Window Content */}
        <div className={`p-4 sm:p-8 rounded-b-lg ${styles.windowContent}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-white text-lg">{getText('loading')}</div>
            </div>
          ) : needsAuth ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-white text-2xl font-bold mb-2">
                {language === 'deutsch' ? 'Strava-Verbindung erforderlich' : 'Strava Connection Required'}
              </h2>
              <p className="text-orange-200/80 mb-6">
                {language === 'deutsch' 
                  ? 'Klicke unten, um Strava zu verbinden.' 
                  : 'Click below to connect Strava.'}
              </p>
              <a
                href={stravaOAuthUrl}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 ${styles.button}`}
              >
                <TrendingUp className="w-5 h-5" />
                {language === 'deutsch' ? 'Mit Strava verbinden' : 'Connect to Strava'}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : summary?.todayDayNumber === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img src={stravaLogo} alt="Strava" className="w-24 h-24 mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">{getText('challengeNotStarted')}</h2>
              <p className="text-orange-200/80">365 days • 5 km daily • Starting Dec 14, 2025</p>
            </div>
          ) : view === 'home' ? (
            renderHomeView()
          ) : (
            renderDayView()
          )}

          {/* Footer */}
          <Link 
            to="/desktop" 
            className="mt-8 flex items-center justify-center gap-2 text-orange-300 hover:text-orange-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {getText('backToDesktop')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Strava2026;
