import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Challenge configuration
const CHALLENGE_START_DATE = '2025-12-14'
const TOTAL_DAYS = 365
const MIN_DISTANCE_KM = 5

interface StravaTokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
}

interface StravaActivity {
  id: number
  name: string
  distance: number // in meters
  moving_time: number // in seconds
  elapsed_time: number
  total_elevation_gain: number
  start_date: string
  start_date_local: string
  type: string
}

// Get fresh access token using refresh token
async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('STRAVA_CLIENT_ID')
  const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')
  const refreshToken = Deno.env.get('STRAVA_REFRESH_TOKEN')

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava API credentials')
  }

  console.log('Refreshing Strava access token...')
  
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Strava token refresh failed:', errorText)
    throw new Error(`Failed to refresh Strava token: ${response.status}`)
  }

  const data: StravaTokenResponse = await response.json()
  console.log('Strava token refreshed successfully')
  return data.access_token
}

// Fetch activities from Strava
async function fetchStravaActivities(accessToken: string, after: number, before: number): Promise<StravaActivity[]> {
  console.log(`Fetching Strava activities from ${new Date(after * 1000).toISOString()} to ${new Date(before * 1000).toISOString()}`)
  
  const allActivities: StravaActivity[] = []
  let page = 1
  const perPage = 200

  while (true) {
    const url = new URL('https://www.strava.com/api/v3/athlete/activities')
    url.searchParams.set('after', after.toString())
    url.searchParams.set('before', before.toString())
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', perPage.toString())

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Strava activities fetch failed:', errorText)
      throw new Error(`Failed to fetch Strava activities: ${response.status}`)
    }

    const activities: StravaActivity[] = await response.json()
    console.log(`Page ${page}: fetched ${activities.length} activities`)
    
    if (activities.length === 0) break
    
    allActivities.push(...activities)
    if (activities.length < perPage) break
    page++
  }

  console.log(`Total activities fetched: ${allActivities.length}`)
  return allActivities
}

// Calculate day number from date
function getDayNumber(date: Date): number {
  const startDate = new Date(CHALLENGE_START_DATE)
  startDate.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)
  
  const diffTime = targetDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Day 1 is the start date
}

// Get date from day number
function getDateFromDayNumber(dayNumber: number): Date {
  const startDate = new Date(CHALLENGE_START_DATE)
  startDate.setHours(0, 0, 0, 0)
  const targetDate = new Date(startDate)
  targetDate.setDate(startDate.getDate() + dayNumber - 1)
  return targetDate
}

// Get today's day number (relative to challenge)
function getTodayDayNumber(): number {
  const today = new Date()
  const dayNum = getDayNumber(today)
  // Clamp to valid range
  if (dayNum < 1) return 0 // Before challenge starts
  if (dayNum > TOTAL_DAYS) return TOTAL_DAYS
  return dayNum
}

// Check if an activity qualifies (>= 5km run or walk)
function isQualifyingActivity(activity: StravaActivity): boolean {
  const distanceKm = activity.distance / 1000
  const validTypes = ['Run', 'Walk', 'Hike', 'VirtualRun']
  return distanceKm >= MIN_DISTANCE_KM && validTypes.includes(activity.type)
}

// Find the best qualifying activity for a specific day
function findActivityForDay(activities: StravaActivity[], dayNumber: number): StravaActivity | null {
  const targetDate = getDateFromDayNumber(dayNumber)
  const targetDateStr = targetDate.toISOString().split('T')[0]
  
  const dayActivities = activities.filter(a => {
    const activityDate = a.start_date_local.split('T')[0]
    return activityDate === targetDateStr && isQualifyingActivity(a)
  })

  if (dayActivities.length === 0) return null
  
  // Return the one with longest distance
  return dayActivities.reduce((best, current) => 
    current.distance > best.distance ? current : best
  )
}

// Build done map for all days
function buildDoneMap(activities: StravaActivity[], todayDayNumber: number): boolean[] {
  const doneMap: boolean[] = []
  
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    if (day > todayDayNumber) {
      // Future day - not done yet
      doneMap.push(false)
    } else {
      const activity = findActivityForDay(activities, day)
      doneMap.push(activity !== null)
    }
  }
  
  return doneMap
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'summary'
    const dayParam = url.searchParams.get('day')

    console.log(`Strava Challenge API: action=${action}, day=${dayParam}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Strava access token
    const accessToken = await getAccessToken()

    // Calculate date range for fetching activities
    const startDate = new Date(CHALLENGE_START_DATE)
    const now = new Date()
    const afterTimestamp = Math.floor(startDate.getTime() / 1000)
    const beforeTimestamp = Math.floor(now.getTime() / 1000)

    // Fetch all activities for the challenge period
    const activities = await fetchStravaActivities(accessToken, afterTimestamp, beforeTimestamp)

    const todayDayNumber = getTodayDayNumber()

    if (action === 'summary') {
      // GET /api/challenge/summary
      const doneMap = buildDoneMap(activities, todayDayNumber)
      const daysDone = doneMap.filter(Boolean).length
      const daysRemaining = Math.max(0, todayDayNumber - daysDone) + (TOTAL_DAYS - todayDayNumber)
      const pct = todayDayNumber > 0 ? Math.round((daysDone / todayDayNumber) * 100) : 0

      // Get today's activity
      const todayActivity = todayDayNumber > 0 ? findActivityForDay(activities, todayDayNumber) : null
      
      const response = {
        startDateISO: CHALLENGE_START_DATE,
        totalDays: TOTAL_DAYS,
        daysDone,
        daysRemaining: TOTAL_DAYS - daysDone,
        pct,
        todayDayNumber,
        todayDone: todayActivity !== null,
        todayStats: todayActivity ? {
          distanceKm: Math.round(todayActivity.distance / 10) / 100,
          movingTimeSec: todayActivity.moving_time,
          activityName: todayActivity.name,
        } : null,
      }

      console.log('Summary response:', response)
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'calendar') {
      // GET /api/challenge/calendar
      const doneMap = buildDoneMap(activities, todayDayNumber)

      const response = {
        startDateISO: CHALLENGE_START_DATE,
        doneMap,
        todayDayNumber,
      }

      console.log('Calendar response: doneMap length =', doneMap.length)
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'day') {
      // GET /api/challenge/day?day=42
      const dayNumber = parseInt(dayParam || '1', 10)
      
      if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
        return new Response(JSON.stringify({ error: 'Invalid day number' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const targetDate = getDateFromDayNumber(dayNumber)
      const activity = findActivityForDay(activities, dayNumber)

      // Fetch TikTok video for this day from database
      const { data: videoData } = await supabase
        .from('strava_challenge_videos')
        .select('*')
        .eq('day_number', dayNumber)
        .maybeSingle()

      const response = {
        dayNumber,
        dateISO: targetDate.toISOString().split('T')[0],
        done: activity !== null,
        strava: activity ? {
          distanceKm: Math.round(activity.distance / 10) / 100,
          movingTimeSec: activity.moving_time,
          paceSecPerKm: Math.round(activity.moving_time / (activity.distance / 1000)),
          elevationM: Math.round(activity.total_elevation_gain),
          activityName: activity.name,
        } : null,
        tiktok: videoData ? {
          title: videoData.tiktok_title || `Day ${dayNumber} – 5K done`,
          url: videoData.tiktok_url,
          thumbnail: videoData.tiktok_thumbnail,
        } : null,
      }

      console.log('Day response:', response)
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Strava Challenge API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
