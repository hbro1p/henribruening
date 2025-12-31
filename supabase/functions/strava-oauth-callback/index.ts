import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRAVA_CLIENT_ID = '192656'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    
    // Get the authorization code from query params
    const code = url.searchParams.get('code')
    
    if (!code) {
      // No code - redirect to Strava OAuth
      const redirectUri = `${url.origin}/functions/v1/strava-oauth-callback`
      const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=activity:read_all`
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': stravaAuthUrl,
        },
      })
    }

    // Exchange code for tokens
    const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')
    if (!clientSecret) {
      throw new Error('STRAVA_CLIENT_SECRET not configured')
    }

    console.log('Exchanging Strava authorization code for tokens...')

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Strava token exchange failed:', errorText)
      throw new Error(`Failed to exchange code: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Token exchange successful!')
    console.log('Athlete:', tokenData.athlete?.firstname, tokenData.athlete?.lastname)
    console.log('Scopes:', tokenData.scope)

    // Return a nice HTML page with the refresh token
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Strava Connected!</title>
  <style>
    body {
      font-family: monospace;
      background: linear-gradient(135deg, #fc4c02, #ff6b35);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .container {
      background: rgba(0,0,0,0.3);
      padding: 40px;
      border-radius: 16px;
      max-width: 600px;
      text-align: center;
    }
    h1 { margin-bottom: 20px; }
    .token-box {
      background: rgba(0,0,0,0.5);
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      margin: 20px 0;
      text-align: left;
    }
    .success { color: #4ade80; font-size: 48px; }
    .instructions {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: left;
    }
    .instructions ol { margin: 10px 0; padding-left: 20px; }
    .instructions li { margin: 8px 0; }
    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h1>Strava Connected Successfully!</h1>
    <p>Welcome, <strong>${tokenData.athlete?.firstname || 'Athlete'}</strong>!</p>
    <p>Scopes granted: <code>${tokenData.scope || 'unknown'}</code></p>
    
    <div class="instructions">
      <h3>⚠️ Important: Update Your Secret</h3>
      <p>Copy the refresh token below and update the <code>STRAVA_REFRESH_TOKEN</code> secret in Supabase:</p>
      <div class="token-box">
        <strong>Refresh Token:</strong><br>
        ${tokenData.refresh_token}
      </div>
      <ol>
        <li>Go to Supabase Dashboard → Edge Functions → Secrets</li>
        <li>Find <code>STRAVA_REFRESH_TOKEN</code></li>
        <li>Update it with the token above</li>
        <li>Return to the Strava 2026 page and refresh</li>
      </ol>
    </div>
  </div>
</body>
</html>
`

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Strava OAuth error:', error)
    
    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Strava OAuth Error</title>
  <style>
    body {
      font-family: monospace;
      background: #1a1a2e;
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }
    .container {
      background: rgba(255,0,0,0.2);
      padding: 40px;
      border-radius: 16px;
      max-width: 500px;
      text-align: center;
    }
    .error { color: #ef4444; font-size: 48px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="error">✕</div>
    <h1>OAuth Error</h1>
    <p>${message}</p>
    <p><a href="/strava2026" style="color: #60a5fa;">← Back to Challenge</a></p>
  </div>
</body>
</html>
`
    
    return new Response(errorHtml, {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    })
  }
})
