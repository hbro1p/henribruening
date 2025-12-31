import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Clock, Calendar as CalendarIcon, TrendingUp, MapPin, Timer, Flame, Heart, Zap, Mountain, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AnimatedCounter from '@/components/AnimatedCounter';
import stravaLogo from '@/assets/strava-logo-new.png';

// Helper: Parse ISO date string (YYYY-MM-DD) to local midnight Date
// This avoids timezone issues from new Date('YYYY-MM-DD') which parses as UTC
const parseISODateToLocal = (isoString: string): Date => {
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

// Challenge start date - fixed constant
const CHALLENGE_START_ISO = '2025-12-14';

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
    suffer_score?: number;
    pr_count?: number;
    achievement_count?: number;
    kudos_count?: number;
  } | null;
  tiktok: {
    title: string;
    url: string;
    thumbnail: string | null;
  } | null;
}

const Strava2026 = () => {
  const { language, theme } = useSettings();
  const [view, setView] = useState<'home' | 'day'>('home');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [summary, setSummary] = useState<ChallengeSummary | null>(null);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [dayDetails, setDayDetails] = useState<DayDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = current month relative to challenge start

  const stravaOAuthUrl = 'https://uwwxkkkzkwiftbekezvl.supabase.co/functions/v1/strava-oauth-callback';

  // Original warm orange design
  const styles = {
    windowFrame: 'bg-gradient-to-br from-orange-300 via-orange-400 to-red-500',
    titleBar: 'bg-gradient-to-r from-orange-600 via-red-600 to-red-700',
    windowContent: 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300',
    text: 'text-orange-900',
    textMuted: 'text-orange-700',
    textAccent: 'text-red-600',
    link: 'text-orange-800 hover:text-orange-900',
    button: 'bg-gradient-to-br from-orange-500 via-red-500 to-red-700 hover:from-orange-400 hover:via-red-400 hover:to-red-600 text-white shadow-lg',
    buttonSecondary: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 hover:from-orange-100 hover:via-orange-200 hover:to-orange-300 text-orange-900 border-2 border-orange-500/30',
    cardBg: 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400/50 shadow-lg',
    cardBgAlt: 'bg-gradient-to-br from-red-50 to-orange-100 border-2 border-red-400/50 shadow-lg',
    progressBg: 'bg-orange-900/20',
    progressBar: 'bg-gradient-to-r from-orange-500 to-red-500',
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  // Set current month based on today's date relative to challenge start
  useEffect(() => {
    if (calendar?.todayDayNumber) {
      const todayDate = new Date();
      const startDate = parseISODateToLocal(CHALLENGE_START_ISO);
      const monthsDiff = (todayDate.getFullYear() - startDate.getFullYear()) * 12 + (todayDate.getMonth() - startDate.getMonth());
      setCurrentMonth(Math.max(0, monthsDiff));
    }
  }, [calendar]);

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
        en: `This year I want to do something fun — but also something that gives me routine and motivation.\n\nI started the goal of running/walking 5 km every day for 365 days.`,
        deutsch: `Dieses Jahr möchte ich etwas Lustiges machen — aber auch etwas, das mir Routine und Motivation gibt.\n\nIch habe mir das Ziel gesetzt, jeden Tag 5 km zu laufen, 365 Tage lang.`,
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
      stravaProfile: { en: 'Strava', deutsch: 'Strava' },
      tiktokProfile: { en: 'TikTok', deutsch: 'TikTok' },
      backToChallenge: { en: 'Back', deutsch: 'Zurück' },
      backToDesktop: { en: 'Back to Desktop', deutsch: 'Zurück zum Desktop' },
      videoProof: { en: 'Video Proof', deutsch: 'Video-Beweis' },
      stravaAnalytics: { en: 'Strava Analytics', deutsch: 'Strava Statistiken' },
      pace: { en: 'Pace', deutsch: 'Tempo' },
      elevation: { en: 'Elevation', deutsch: 'Höhenmeter' },
      openTikTok: { en: 'Open TikTok', deutsch: 'TikTok öffnen' },
      calendar: { en: 'Calendar', deutsch: 'Kalender' },
      loading: { en: 'Loading...', deutsch: 'Laden...' },
      noActivity: { en: 'No activity yet', deutsch: 'Noch keine Aktivität' },
      noVideo: { en: 'No video yet', deutsch: 'Noch kein Video' },
      challengeNotStarted: { en: 'Challenge starts December 14, 2025!', deutsch: 'Challenge startet am 14. Dezember 2025!' },
      splits: { en: 'Kilometer Splits', deutsch: 'Kilometer-Zwischenzeiten' },
      avgHr: { en: 'Avg HR', deutsch: 'Ø HF' },
      maxHr: { en: 'Max HR', deutsch: 'Max HF' },
      calories: { en: 'Calories', deutsch: 'Kalorien' },
      sufferScore: { en: 'Effort', deutsch: 'Anstrengung' },
      achievements: { en: 'Achievements', deutsch: 'Erfolge' },
      prs: { en: 'PRs', deutsch: 'Bestzeiten' },
      kudos: { en: 'Kudos', deutsch: 'Kudos' },
    };
    return texts[key]?.[language === 'deutsch' ? 'deutsch' : 'en'] || key;
  };

  // Get month data for calendar
  const getMonthData = (monthOffset: number) => {
    const startDate = parseISODateToLocal(CHALLENGE_START_ISO);
    const targetDate = new Date(startDate);
    targetDate.setMonth(startDate.getMonth() + monthOffset);
    
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    const monthNames = language === 'deutsch' 
      ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const weekDays = language === 'deutsch'
      ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return { year, month, daysInMonth, firstDayOfWeek, monthName: monthNames[month], weekDays };
  };

  // Convert calendar date to challenge day number (using local dates consistently)
  const getChallengeDayForDate = (year: number, month: number, day: number): number | null => {
    // Create date at local midnight
    const date = new Date(year, month, day, 0, 0, 0, 0);
    const startDate = parseISODateToLocal(CHALLENGE_START_ISO);
    
    // Calculate difference in days (both are local midnight, so division is clean)
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays < 1 || diffDays > 365) return null;
    return diffDays;
  };

  // Single month calendar with big day tiles
  const renderMonthCalendar = () => {
    if (!calendar) return null;

    const monthData = getMonthData(currentMonth);
    const { year, month, daysInMonth, firstDayOfWeek, monthName, weekDays } = monthData;
    
    // Adjust first day (Monday = 0)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const canGoPrev = currentMonth > 0;
    const canGoNext = currentMonth < 12;

    return (
      <div className={`p-4 sm:p-6 rounded-xl ${styles.cardBg}`}>
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => canGoPrev && setCurrentMonth(currentMonth - 1)}
            disabled={!canGoPrev}
            className={`p-2 rounded-lg transition-all ${canGoPrev ? 'hover:bg-orange-200 text-orange-800' : 'opacity-30 cursor-not-allowed text-orange-400'}`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <h3 className={`text-lg sm:text-2xl font-pixel font-bold ${styles.text}`}>
            {monthName} {year}
          </h3>
          
          <button 
            onClick={() => canGoNext && setCurrentMonth(currentMonth + 1)}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-all ${canGoNext ? 'hover:bg-orange-200 text-orange-800' : 'opacity-30 cursor-not-allowed text-orange-400'}`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className={`text-center font-pixel text-xs sm:text-sm ${styles.textMuted}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: adjustedFirstDay }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayOfMonth = i + 1;
            const challengeDay = getChallengeDayForDate(year, month, dayOfMonth);
            const isDone = challengeDay ? calendar.doneMap[challengeDay - 1] : false;
            const isToday = challengeDay === calendar.todayDayNumber;
            const isFuture = challengeDay ? challengeDay > calendar.todayDayNumber : true;
            const isInChallenge = challengeDay !== null;
            const isPastNotDone = isInChallenge && !isDone && !isFuture && !isToday;

            let bgClass = 'bg-gray-200/50 text-gray-400';
            if (isInChallenge) {
              if (isDone) {
                bgClass = 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md';
              } else if (isToday) {
                // Today not done yet - yellow/pending
                bgClass = 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md';
              } else if (isFuture) {
                bgClass = 'bg-orange-100 text-orange-300';
              } else if (isPastNotDone) {
                // Past day not done - red/missed
                bgClass = 'bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md';
              }
            }

            return (
              <button
                key={dayOfMonth}
                onClick={() => isInChallenge && !isFuture && fetchDayDetails(challengeDay!)}
                disabled={!isInChallenge || isFuture || dayLoading}
                className={`
                  aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center
                  font-pixel transition-all duration-200 text-xs sm:text-base
                  ${bgClass}
                  ${isToday ? 'ring-2 sm:ring-4 ring-yellow-600 ring-offset-1 sm:ring-offset-2' : ''}
                  ${isInChallenge && !isFuture ? 'hover:scale-105 cursor-pointer hover:shadow-lg' : ''}
                  ${!isInChallenge ? 'cursor-default' : ''}
                `}
              >
                {/* Show day of month prominently, challenge day number below */}
                <span className="text-sm sm:text-lg font-bold">{dayOfMonth}</span>
                {isInChallenge && (
                  <span className="text-[8px] sm:text-[10px] opacity-70">Tag {challengeDay}</span>
                )}
                {isDone && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 absolute bottom-0.5 right-0.5 sm:static sm:mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Goal Description Section
  const renderGoalDescription = () => (
    <div className={`p-4 sm:p-6 rounded-xl ${styles.cardBg}`}>
      <h2 className={`text-lg sm:text-xl font-pixel font-bold mb-3 ${styles.text}`}>
        {getText('myStravaGoal')}
      </h2>
      <p className={`font-pixel text-sm sm:text-base whitespace-pre-line ${styles.textMuted}`}>
        {getText('goalDescription')}
      </p>
    </div>
  );

  // Hero Header with Logo and animated counter
  const renderHeroHeader = () => (
    <div className={`relative overflow-hidden rounded-xl ${styles.cardBgAlt} p-4 sm:p-6`}>
      {/* Mobile: Stack vertically, Desktop: side by side */}
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img 
            src={stravaLogo} 
            alt="Strava Logo" 
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-lg"
          />
          <div className="text-center sm:text-left">
            <h1 className={`text-xl sm:text-2xl font-pixel font-bold ${styles.text}`}>
              365 Day Challenge
            </h1>
            <p className={`font-pixel text-sm ${styles.textMuted}`}>5 km • {language === 'deutsch' ? 'Jeden Tag' : 'Every Day'}</p>
          </div>
        </div>

        {/* Counter Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className={`text-4xl sm:text-6xl font-pixel font-black ${styles.textAccent} tabular-nums`}>
              <AnimatedCounter value={summary?.daysDone || 0} duration={2000} />
            </div>
            <p className={`font-pixel text-xs sm:text-sm ${styles.textMuted}`}>{getText('daysCompleted')}</p>
          </div>
          
          <div className={`h-12 sm:h-16 w-px bg-orange-400/30`} />
          
          <div className="text-center">
            <div className={`text-2xl sm:text-4xl font-pixel font-bold ${styles.text} tabular-nums`}>
              {summary?.daysRemaining || 365}
            </div>
            <p className={`font-pixel text-xs sm:text-sm ${styles.textMuted}`}>{getText('daysLeft')}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 sm:mt-6">
        <div className={`flex justify-between text-xs sm:text-sm font-pixel ${styles.textMuted} mb-2`}>
          <span>{getText('progress')}</span>
          <span>{Math.round((summary?.daysDone || 0) / 365 * 100)}%</span>
        </div>
        <div className={`h-3 sm:h-4 rounded-full ${styles.progressBg} overflow-hidden`}>
          <div 
            className={`h-full rounded-full ${styles.progressBar} transition-all duration-1000`}
            style={{ width: `${((summary?.daysDone || 0) / 365) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  // External Links Section
  const renderExternalLinks = () => (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
      <a
        href="https://www.strava.com/athletes/185666796"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-pixel text-sm sm:text-base transition-all hover:scale-105 ${styles.button}`}
      >
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
        {getText('stravaProfile')}
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
      </a>
      <a
        href="https://www.tiktok.com/@henri.running"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-pixel text-sm sm:text-base transition-all hover:scale-105 ${styles.buttonSecondary}`}
      >
        🎵 {getText('tiktokProfile')}
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
      </a>
    </div>
  );

  // Home View
  const renderHomeView = () => (
    <div className="space-y-4 sm:space-y-6">
      {renderHeroHeader()}
      {renderGoalDescription()}
      {renderMonthCalendar()}
      {renderExternalLinks()}
    </div>
  );

  // Day View
  const renderDayView = () => {
    if (!dayDetails) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className={`flex items-center gap-2 font-pixel ${styles.link}`}
          >
            <ArrowLeft className="w-5 h-5" />
            {getText('backToChallenge')}
          </button>
          {dayDetails.done ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white font-pixel rounded-full">
              <Check className="w-4 h-4" />
              {getText('done')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 text-white font-pixel rounded-full">
              <Clock className="w-4 h-4" />
              {getText('pending')}
            </span>
          )}
        </div>

        {/* Day Title */}
        <div className="text-center py-4">
          <div className={`inline-block px-6 py-3 rounded-xl ${styles.cardBgAlt}`}>
            <span className={`text-4xl font-pixel font-black ${styles.text}`}>{getText('day')} {dayDetails.dayNumber}</span>
          </div>
          <p className={`font-pixel mt-2 ${styles.textMuted}`}>{formatDate(dayDetails.dateISO)}</p>
        </div>

        {/* Main Stats */}
        {dayDetails.strava && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <MapPin className={`w-5 h-5 mx-auto mb-1 ${styles.textAccent}`} />
              <div className={`text-2xl font-pixel font-bold ${styles.text}`}>{dayDetails.strava.distanceKm}</div>
              <div className={`text-xs font-pixel ${styles.textMuted}`}>km</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Timer className={`w-5 h-5 mx-auto mb-1 ${styles.textAccent}`} />
              <div className={`text-2xl font-pixel font-bold ${styles.text}`}>{formatTime(dayDetails.strava.movingTimeSec)}</div>
              <div className={`text-xs font-pixel ${styles.textMuted}`}>{getText('time')}</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Zap className={`w-5 h-5 mx-auto mb-1 ${styles.textAccent}`} />
              <div className={`text-2xl font-pixel font-bold ${styles.text}`}>{formatPace(dayDetails.strava.paceSecPerKm)}</div>
              <div className={`text-xs font-pixel ${styles.textMuted}`}>/km</div>
            </div>
            <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
              <Mountain className={`w-5 h-5 mx-auto mb-1 ${styles.textAccent}`} />
              <div className={`text-2xl font-pixel font-bold ${styles.text}`}>{dayDetails.strava.elevationM}</div>
              <div className={`text-xs font-pixel ${styles.textMuted}`}>m</div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        {dayDetails.strava && (dayDetails.strava.avgHeartRate || dayDetails.strava.calories || dayDetails.strava.suffer_score) && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {dayDetails.strava.avgHeartRate && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className={`text-lg font-pixel font-bold ${styles.text}`}>{dayDetails.strava.avgHeartRate}</div>
                <div className={`text-[10px] font-pixel ${styles.textMuted}`}>{getText('avgHr')}</div>
              </div>
            )}
            {dayDetails.strava.maxHeartRate && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Heart className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <div className={`text-lg font-pixel font-bold ${styles.text}`}>{dayDetails.strava.maxHeartRate}</div>
                <div className={`text-[10px] font-pixel ${styles.textMuted}`}>{getText('maxHr')}</div>
              </div>
            )}
            {dayDetails.strava.calories && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className={`text-lg font-pixel font-bold ${styles.text}`}>{dayDetails.strava.calories}</div>
                <div className={`text-[10px] font-pixel ${styles.textMuted}`}>{getText('calories')}</div>
              </div>
            )}
            {dayDetails.strava.suffer_score && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <Zap className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                <div className={`text-lg font-pixel font-bold ${styles.text}`}>{dayDetails.strava.suffer_score}</div>
                <div className={`text-[10px] font-pixel ${styles.textMuted}`}>{getText('sufferScore')}</div>
              </div>
            )}
            {dayDetails.strava.kudos_count !== undefined && (
              <div className={`p-3 rounded-lg ${styles.cardBgAlt} text-center`}>
                <span className="text-lg">👏</span>
                <div className={`text-lg font-pixel font-bold ${styles.text}`}>{dayDetails.strava.kudos_count}</div>
                <div className={`text-[10px] font-pixel ${styles.textMuted}`}>{getText('kudos')}</div>
              </div>
            )}
          </div>
        )}

        {/* Activity Name */}
        {dayDetails.strava && (
          <div className={`p-4 rounded-xl ${styles.cardBg} text-center`}>
            <p className={`font-pixel ${styles.text}`}>"{dayDetails.strava.activityName}"</p>
          </div>
        )}

        {/* Splits Table */}
        {dayDetails.strava?.splits && dayDetails.strava.splits.length > 0 && (
          <div className={`p-4 rounded-xl ${styles.cardBg}`}>
            <h3 className={`text-lg font-pixel font-bold mb-4 flex items-center gap-2 ${styles.text}`}>
              <Timer className="w-5 h-5" />
              {getText('splits')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-pixel">
                <thead>
                  <tr className={`${styles.textMuted} border-b border-orange-300`}>
                    <th className="text-left py-2 px-2">KM</th>
                    <th className="text-center py-2 px-2">{getText('time')}</th>
                    <th className="text-center py-2 px-2">{getText('pace')}</th>
                    <th className="text-center py-2 px-2">↕</th>
                  </tr>
                </thead>
                <tbody>
                  {dayDetails.strava.splits.map((split, idx) => {
                    const paceSeconds = split.moving_time / (split.distance / 1000);
                    return (
                      <tr key={idx} className="border-b border-orange-200/50">
                        <td className={`py-2 px-2 font-bold ${styles.text}`}>{split.split}</td>
                        <td className={`py-2 px-2 text-center ${styles.text}`}>{formatTime(split.moving_time)}</td>
                        <td className={`py-2 px-2 text-center ${styles.text}`}>{formatPace(paceSeconds)}</td>
                        <td className={`py-2 px-2 text-center ${split.elevation_difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {split.elevation_difference >= 0 ? '+' : ''}{Math.round(split.elevation_difference)}m
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Video */}
        {dayDetails.tiktok && (
          <div className={`p-4 rounded-xl ${styles.cardBg}`}>
            <h3 className={`text-lg font-pixel font-bold mb-3 ${styles.text}`}>🎬 {getText('videoProof')}</h3>
            <p className={`font-pixel mb-3 ${styles.textMuted}`}>{dayDetails.tiktok.title}</p>
            <a
              href={dayDetails.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-pixel transition-all hover:scale-105 ${styles.button}`}
            >
              {getText('openTikTok')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* No activity message */}
        {!dayDetails.strava && (
          <div className={`p-8 rounded-xl ${styles.cardBg} text-center`}>
            <div className="text-4xl mb-2">📊</div>
            <p className={`font-pixel ${styles.textMuted}`}>{getText('noActivity')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-5xl mx-auto shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title Bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center gap-2">
            <img src={stravaLogo} alt="Strava" className="w-6 h-6" />
            <span className="text-white font-pixel text-sm">Strava 2026</span>
          </div>
        </div>
        
        {/* Window Content */}
        <div className={`p-4 sm:p-6 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className={`font-pixel ${styles.text}`}>{getText('loading')}</div>
            </div>
          ) : needsAuth ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className={`font-pixel text-xl mb-2 ${styles.text}`}>
                {language === 'deutsch' ? 'Strava-Verbindung erforderlich' : 'Strava Connection Required'}
              </h2>
              <a
                href={stravaOAuthUrl}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-pixel transition-all hover:scale-105 ${styles.button}`}
              >
                <TrendingUp className="w-5 h-5" />
                {language === 'deutsch' ? 'Mit Strava verbinden' : 'Connect to Strava'}
              </a>
            </div>
          ) : summary?.todayDayNumber === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img src={stravaLogo} alt="Strava" className="w-20 h-20 mb-4" />
              <h2 className={`font-pixel text-xl mb-2 ${styles.text}`}>{getText('challengeNotStarted')}</h2>
              <p className={`font-pixel ${styles.textMuted}`}>365 days • 5 km daily</p>
            </div>
          ) : view === 'home' ? (
            renderHomeView()
          ) : (
            renderDayView()
          )}

          {/* Footer */}
          <Link 
            to="/desktop" 
            className={`mt-8 flex items-center justify-center gap-2 font-pixel underline ${styles.link}`}
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
