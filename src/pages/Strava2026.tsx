import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Clock, Calendar as CalendarIcon, TrendingUp, MapPin, Timer } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-orange-300 via-orange-400 to-red-500',
        titleBar: 'bg-gradient-to-r from-orange-600 via-red-600 to-red-700',
        windowContent: 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300',
        text: 'text-orange-900',
        textMuted: 'text-orange-700',
        link: 'text-orange-800 hover:text-orange-900',
        button: 'bg-gradient-to-br from-orange-500 via-red-500 to-red-700 hover:from-orange-400 hover:via-red-400 hover:to-red-600 text-white',
        buttonSecondary: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 hover:from-orange-100 hover:via-orange-200 hover:to-orange-300 text-orange-900',
        cardBg: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400',
        cardBgAlt: 'bg-gradient-to-br from-red-50 to-orange-100 border-red-400',
        progressBg: 'bg-orange-900/20',
        progressBar: 'bg-gradient-to-r from-orange-500 to-red-500',
        dayDone: 'bg-green-500 hover:bg-green-400',
        dayPending: 'bg-orange-300 hover:bg-orange-200',
        dayFuture: 'bg-gray-300 hover:bg-gray-200',
        dayToday: 'ring-4 ring-red-500 ring-offset-2',
      };
    }
    
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-red-600 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      link: 'text-blue-800 hover:text-blue-900',
      button: 'bg-gradient-to-br from-orange-500 via-red-500 to-red-700 hover:from-orange-400 hover:via-red-400 hover:to-red-600 text-white',
      buttonSecondary: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 hover:from-gray-100 hover:via-gray-200 hover:to-gray-300 text-gray-900',
      cardBg: 'bg-white/80 border-gray-400',
      cardBgAlt: 'bg-orange-50/80 border-orange-400',
      progressBg: 'bg-gray-700/30',
      progressBar: 'bg-gradient-to-r from-orange-500 to-red-500',
      dayDone: 'bg-green-500 hover:bg-green-400',
      dayPending: 'bg-orange-300 hover:bg-orange-200',
      dayFuture: 'bg-gray-300 hover:bg-gray-200',
      dayToday: 'ring-4 ring-red-500 ring-offset-2',
    };
  };

  const styles = getWindowStyles();

  // Fetch challenge data
  useEffect(() => {
    fetchChallengeData();
  }, []);

  const fetchChallengeData = async () => {
    setLoading(true);
    try {
      // Fetch summary
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke('strava-challenge', {
        body: {},
      });
      
      if (summaryError) throw summaryError;
      
      // Parse the response - it comes as the direct response
      const summaryUrl = new URL('https://uwwxkkkzkwiftbekezvl.supabase.co/functions/v1/strava-challenge?action=summary');
      const summaryRes = await fetch(summaryUrl.toString());
      const summaryJson = await summaryRes.json();
      setSummary(summaryJson);

      // Fetch calendar
      const calendarUrl = new URL('https://uwwxkkkzkwiftbekezvl.supabase.co/functions/v1/strava-challenge?action=calendar');
      const calendarRes = await fetch(calendarUrl.toString());
      const calendarJson = await calendarRes.json();
      setCalendar(calendarJson);

      if (summaryJson.todayDayNumber > 0) {
        setSelectedDay(summaryJson.todayDayNumber);
      }
    } catch (error: any) {
      console.error('Error fetching challenge data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load challenge data. The challenge starts January 1, 2026.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDayDetails = async (day: number) => {
    setDayLoading(true);
    try {
      const url = new URL(`https://uwwxkkkzkwiftbekezvl.supabase.co/functions/v1/strava-challenge?action=day&day=${day}`);
      const res = await fetch(url.toString());
      const json = await res.json();
      setDayDetails(json);
      setView('day');
    } catch (error: any) {
      console.error('Error fetching day details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load day details',
        variant: 'destructive',
      });
    } finally {
      setDayLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secPerKm: number): string => {
    const mins = Math.floor(secPerKm / 60);
    const secs = secPerKm % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} /km`;
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
      myStravaGoal: {
        en: 'My Strava Goal',
        deutsch: 'Mein Strava Ziel',
      },
      goalDescription: {
        en: `This year I want to do something fun — but also something that gives me routine and motivation.
So I started the goal of running/walking 5 km every day for 365 days.

I also post one video every day to motivate other people and to make them feel inspired. It's my proof log.`,
        deutsch: `Dieses Jahr möchte ich etwas Lustiges machen — aber auch etwas, das mir Routine und Motivation gibt.
Also habe ich mir das Ziel gesetzt, jeden Tag 5 km zu laufen/gehen, 365 Tage lang.

Ich poste auch jeden Tag ein Video, um andere Menschen zu motivieren und zu inspirieren. Es ist mein Beweis-Log.`,
      },
      howAchieve: {
        en: 'How do I achieve this goal?',
        deutsch: 'Wie erreiche ich dieses Ziel?',
      },
      howDescription: {
        en: `Simple: Time pressure and money.

Explanation: I gave my mum 1000€ for the year. If I complete the challenge (5 km every day for 365 days), I get the money back. If I fail, I lose it.

Time pressure is brutal: I have to show up every day — no excuses.`,
        deutsch: `Einfach: Zeitdruck und Geld.

Erklärung: Ich habe meiner Mama 1000€ für das Jahr gegeben. Wenn ich die Challenge schaffe (5 km jeden Tag für 365 Tage), bekomme ich das Geld zurück. Wenn ich scheitere, verliere ich es.

Zeitdruck ist brutal: Ich muss jeden Tag ran — keine Ausreden.`,
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
      stravaProfile: { en: 'Strava Profile', deutsch: 'Strava Profil' },
      tiktokProfile: { en: 'TikTok Profile', deutsch: 'TikTok Profil' },
      backToChallenge: { en: 'Back to Challenge', deutsch: 'Zurück zur Challenge' },
      backToDesktop: { en: 'Back to Desktop', deutsch: 'Zurück zum Desktop' },
      videoProof: { en: 'Video Proof', deutsch: 'Video-Beweis' },
      stravaAnalytics: { en: 'Strava Analytics', deutsch: 'Strava Statistiken' },
      pace: { en: 'Pace', deutsch: 'Tempo' },
      elevation: { en: 'Elevation', deutsch: 'Höhenmeter' },
      openTikTok: { en: 'Open TikTok', deutsch: 'TikTok öffnen' },
      dataNote: { en: 'Data synced from my Strava. Viewer cannot edit anything.', deutsch: 'Daten von meinem Strava synchronisiert. Besucher können nichts bearbeiten.' },
      calendar: { en: '365-Day Calendar', deutsch: '365-Tage Kalender' },
      loading: { en: 'Loading challenge data...', deutsch: 'Lade Challenge-Daten...' },
      noActivity: { en: 'No activity recorded yet', deutsch: 'Noch keine Aktivität aufgezeichnet' },
      noVideo: { en: 'No video linked yet', deutsch: 'Noch kein Video verknüpft' },
      challengeNotStarted: { en: 'Challenge starts January 1, 2026!', deutsch: 'Challenge startet am 1. Januar 2026!' },
    };
    return texts[key]?.[language === 'deutsch' ? 'deutsch' : 'en'] || key;
  };

  // Render Calendar Grid
  const renderCalendar = () => {
    if (!calendar) return null;

    const months = [
      { name: language === 'deutsch' ? 'Januar' : 'January', days: 31, start: 0 },
      { name: language === 'deutsch' ? 'Februar' : 'February', days: 28, start: 31 },
      { name: language === 'deutsch' ? 'März' : 'March', days: 31, start: 59 },
      { name: language === 'deutsch' ? 'April' : 'April', days: 30, start: 90 },
      { name: language === 'deutsch' ? 'Mai' : 'May', days: 31, start: 120 },
      { name: language === 'deutsch' ? 'Juni' : 'June', days: 30, start: 151 },
      { name: language === 'deutsch' ? 'Juli' : 'July', days: 31, start: 181 },
      { name: language === 'deutsch' ? 'August' : 'August', days: 31, start: 212 },
      { name: language === 'deutsch' ? 'September' : 'September', days: 30, start: 243 },
      { name: language === 'deutsch' ? 'Oktober' : 'October', days: 31, start: 273 },
      { name: language === 'deutsch' ? 'November' : 'November', days: 30, start: 304 },
      { name: language === 'deutsch' ? 'Dezember' : 'December', days: 31, start: 334 },
    ];

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {months.map((month, monthIndex) => (
          <div key={month.name} className={`p-2 rounded-lg border-2 ${styles.cardBg}`}>
            <h4 className={`text-xs font-pixel mb-2 text-center ${styles.text}`}>{month.name}</h4>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: month.days }, (_, i) => {
                const dayNumber = month.start + i + 1;
                const isDone = calendar.doneMap[dayNumber - 1];
                const isToday = dayNumber === calendar.todayDayNumber;
                const isFuture = dayNumber > calendar.todayDayNumber;

                let dayClass = styles.dayPending;
                if (isDone) dayClass = styles.dayDone;
                if (isFuture) dayClass = styles.dayFuture;

                return (
                  <button
                    key={dayNumber}
                    onClick={() => fetchDayDetails(dayNumber)}
                    disabled={dayLoading}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm text-[8px] font-pixel flex items-center justify-center transition-all ${dayClass} ${isToday ? styles.dayToday : ''} ${isFuture ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={`Day ${dayNumber}`}
                  >
                    {isDone ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Home View
  const renderHomeView = () => (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Story */}
        <div className={`p-6 rounded-lg border-2 ${styles.cardBg}`}>
          <h2 className={`text-2xl font-pixel mb-4 ${styles.text}`}>[ {getText('myStravaGoal')} ]</h2>
          <p className={`font-pixel text-sm whitespace-pre-line mb-6 ${styles.text}`}>
            {getText('goalDescription')}
          </p>
          
          <h3 className={`text-lg font-pixel mb-3 ${styles.text}`}>{getText('howAchieve')}</h3>
          <p className={`font-pixel text-sm whitespace-pre-line mb-6 ${styles.text}`}>
            {getText('howDescription')}
          </p>

          {/* Profile Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.strava.com/athletes/185666796"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black/20 font-pixel text-sm transition-all hover:scale-105 ${styles.button}`}
            >
              <TrendingUp className="w-4 h-4" />
              {getText('stravaProfile')}
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.tiktok.com/@henri.running"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black/20 font-pixel text-sm transition-all hover:scale-105 ${styles.buttonSecondary}`}
            >
              🎵 {getText('tiktokProfile')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Side - Today Status */}
        <div className={`p-6 rounded-lg border-2 ${styles.cardBgAlt}`}>
          <div className="text-center">
            <span className={`font-pixel text-lg ${styles.textMuted}`}>{getText('today')}</span>
            
            {/* Big Day Number */}
            <div className={`text-8xl sm:text-9xl font-pixel font-bold my-4 ${styles.text}`}>
              {summary?.todayDayNumber || 0}
            </div>
            <span className={`font-pixel text-xl ${styles.textMuted}`}>{getText('day')}</span>

            {/* Status Badge */}
            <div className="my-4">
              {summary?.todayDone ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-pixel rounded-full text-lg">
                  <Check className="w-5 h-5" />
                  {getText('done')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-pixel rounded-full text-lg">
                  <Clock className="w-5 h-5" />
                  {getText('pending')}
                </span>
              )}
            </div>

            {/* Mini Stats */}
            {summary?.todayStats && (
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className={`p-3 rounded-lg ${styles.cardBg}`}>
                  <div className={`font-pixel text-xs ${styles.textMuted}`}>{getText('distance')}</div>
                  <div className={`font-pixel text-xl ${styles.text}`}>{summary.todayStats.distanceKm} km</div>
                </div>
                <div className={`p-3 rounded-lg ${styles.cardBg}`}>
                  <div className={`font-pixel text-xs ${styles.textMuted}`}>{getText('time')}</div>
                  <div className={`font-pixel text-xl ${styles.text}`}>{formatTime(summary.todayStats.movingTimeSec)}</div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="my-6">
              <div className="flex justify-between mb-2">
                <span className={`font-pixel text-sm ${styles.text}`}>{getText('progress')}</span>
                <span className={`font-pixel text-sm ${styles.text}`}>{summary?.daysDone || 0} / 365</span>
              </div>
              <div className={`w-full h-4 rounded-full ${styles.progressBg}`}>
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${styles.progressBar}`}
                  style={{ width: `${((summary?.daysDone || 0) / 365) * 100}%` }}
                />
              </div>
              <div className={`font-pixel text-sm mt-2 ${styles.textMuted}`}>
                {summary?.daysRemaining || 365} {getText('daysLeft')}
              </div>
            </div>

            {/* View Day Button */}
            <button
              onClick={() => summary?.todayDayNumber && fetchDayDetails(summary.todayDayNumber)}
              disabled={!summary?.todayDayNumber || dayLoading}
              className={`w-full py-3 rounded-lg border-2 border-black/20 font-pixel transition-all hover:scale-105 ${styles.button}`}
            >
              {dayLoading ? '...' : getText('viewDay')}
            </button>
          </div>
        </div>
      </div>

      {/* 365-Day Calendar */}
      <div className={`p-6 rounded-lg border-2 ${styles.cardBg}`}>
        <h3 className={`text-xl font-pixel mb-4 flex items-center gap-2 ${styles.text}`}>
          <CalendarIcon className="w-5 h-5" />
          {getText('calendar')}
        </h3>
        {renderCalendar()}
      </div>
    </div>
  );

  // Day Detail View
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
            <ArrowLeft className="w-4 h-4" />
            {getText('backToChallenge')}
          </button>
          <div className="flex items-center gap-2">
            {dayDetails.done ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white font-pixel rounded-full text-sm">
                <Check className="w-4 h-4" />
                {getText('done')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white font-pixel rounded-full text-sm">
                <Clock className="w-4 h-4" />
                {getText('pending')}
              </span>
            )}
          </div>
        </div>

        {/* Day Title */}
        <div className="text-center">
          <h2 className={`text-4xl font-pixel ${styles.text}`}>
            {getText('day')} {dayDetails.dayNumber}
          </h2>
          <p className={`font-pixel ${styles.textMuted}`}>{formatDate(dayDetails.dateISO)}</p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Proof */}
          <div className={`p-6 rounded-lg border-2 ${styles.cardBg}`}>
            <h3 className={`text-lg font-pixel mb-4 flex items-center gap-2 ${styles.text}`}>
              🎬 {getText('videoProof')}
            </h3>
            
            {dayDetails.tiktok ? (
              <div className="space-y-4">
                <div className={`aspect-[9/16] bg-black/20 rounded-lg flex items-center justify-center ${styles.text}`}>
                  <div className="text-center p-4">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="font-pixel text-sm">{dayDetails.tiktok.title}</p>
                  </div>
                </div>
                <a
                  href={dayDetails.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-black/20 font-pixel transition-all hover:scale-105 ${styles.button}`}
                >
                  {getText('openTikTok')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className={`aspect-[9/16] bg-black/10 rounded-lg flex items-center justify-center ${styles.textMuted}`}>
                <div className="text-center p-4 font-pixel">
                  <div className="text-4xl mb-2">📹</div>
                  {getText('noVideo')}
                </div>
              </div>
            )}
          </div>

          {/* Strava Analytics */}
          <div className={`p-6 rounded-lg border-2 ${styles.cardBgAlt}`}>
            <h3 className={`text-lg font-pixel mb-4 flex items-center gap-2 ${styles.text}`}>
              <TrendingUp className="w-5 h-5" />
              {getText('stravaAnalytics')}
            </h3>

            {dayDetails.strava ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${styles.cardBg}`}>
                    <div className={`font-pixel text-xs flex items-center gap-1 ${styles.textMuted}`}>
                      <MapPin className="w-3 h-3" />
                      {getText('distance')}
                    </div>
                    <div className={`font-pixel text-2xl ${styles.text}`}>{dayDetails.strava.distanceKm} km</div>
                  </div>
                  <div className={`p-4 rounded-lg ${styles.cardBg}`}>
                    <div className={`font-pixel text-xs flex items-center gap-1 ${styles.textMuted}`}>
                      <Timer className="w-3 h-3" />
                      {getText('time')}
                    </div>
                    <div className={`font-pixel text-2xl ${styles.text}`}>{formatTime(dayDetails.strava.movingTimeSec)}</div>
                  </div>
                  <div className={`p-4 rounded-lg ${styles.cardBg}`}>
                    <div className={`font-pixel text-xs flex items-center gap-1 ${styles.textMuted}`}>
                      <TrendingUp className="w-3 h-3" />
                      {getText('pace')}
                    </div>
                    <div className={`font-pixel text-xl ${styles.text}`}>{formatPace(dayDetails.strava.paceSecPerKm)}</div>
                  </div>
                  <div className={`p-4 rounded-lg ${styles.cardBg}`}>
                    <div className={`font-pixel text-xs flex items-center gap-1 ${styles.textMuted}`}>
                      ⛰️ {getText('elevation')}
                    </div>
                    <div className={`font-pixel text-2xl ${styles.text}`}>{dayDetails.strava.elevationM} m</div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${styles.cardBg}`}>
                  <div className={`font-pixel text-sm ${styles.text}`}>
                    "{dayDetails.strava.activityName}"
                  </div>
                </div>

                <p className={`font-pixel text-xs ${styles.textMuted}`}>
                  {getText('dataNote')}
                </p>
              </div>
            ) : (
              <div className={`text-center p-8 ${styles.textMuted}`}>
                <div className="text-4xl mb-2">📊</div>
                <p className="font-pixel">{getText('noActivity')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar at bottom */}
        <div className={`p-6 rounded-lg border-2 ${styles.cardBg}`}>
          <h3 className={`text-xl font-pixel mb-4 flex items-center gap-2 ${styles.text}`}>
            <CalendarIcon className="w-5 h-5" />
            {getText('calendar')}
          </h3>
          {renderCalendar()}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-start justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-6xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title Bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">🏃 Strava 2026</span>
          </div>
        </div>
        
        {/* Window Content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className={`font-pixel text-xl ${styles.text}`}>{getText('loading')}</div>
            </div>
          ) : summary?.todayDayNumber === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🏃</div>
              <h2 className={`font-pixel text-2xl mb-2 ${styles.text}`}>{getText('challengeNotStarted')}</h2>
              <p className={`font-pixel ${styles.textMuted}`}>365 days • 5 km daily • Starting 2026</p>
            </div>
          ) : view === 'home' ? (
            renderHomeView()
          ) : (
            renderDayView()
          )}

          {/* Footer */}
          <Link to="/desktop" className={`mt-8 text-xl underline transition-colors flex items-center justify-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
            <ArrowLeft className="w-5 h-5" />
            {getText('backToDesktop')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Strava2026;
