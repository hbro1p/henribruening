const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const redirectUri = `${url.origin}/functions/v1/strava-oauth-callback`
    const callbackDomain = url.hostname
    
    // Get client ID from env (fallback to hardcoded for backwards compat)
    const clientId = Deno.env.get('STRAVA_CLIENT_ID') || '192656'
    
    // Get the authorization code from query params
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    
    // Handle Strava OAuth errors
    if (error) {
      const errorDescription = url.searchParams.get('error_description') || 'Unknown error'
      console.error('Strava OAuth error:', error, errorDescription)
      
      const errorHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Strava OAuth Fehler</title>
  <style>
    body {
      font-family: monospace;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
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
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.5);
      padding: 40px;
      border-radius: 16px;
      max-width: 600px;
      text-align: center;
    }
    h1 { color: #ef4444; }
    .error-box {
      background: rgba(0,0,0,0.3);
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    code { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; }
    a { color: #60a5fa; }
  </style>
</head>
<body>
  <div class="container">
    <h1>❌ OAuth Fehler</h1>
    <p><strong>Fehler:</strong> ${error}</p>
    <p>${errorDescription}</p>
    
    <div class="error-box">
      <strong>Debug Info:</strong><br>
      Redirect URI: <code>${redirectUri}</code><br>
      Callback Domain: <code>${callbackDomain}</code><br>
      Client ID: <code>${clientId}</code>
    </div>
    
    <p><a href="/strava2026">← Zurück zur Challenge</a></p>
  </div>
</body>
</html>
`
      return new Response(errorHtml, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      })
    }
    
    if (!code) {
      // No code - redirect to Strava OAuth
      const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=activity:read_all`
      
      console.log('Redirecting to Strava OAuth...')
      console.log('Redirect URI:', redirectUri)
      console.log('Callback Domain (set this in Strava):', callbackDomain)
      
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
    console.log('Using redirect_uri:', redirectUri)

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Strava token exchange failed:', errorText)
      throw new Error(`Token-Austausch fehlgeschlagen: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Token exchange successful!')
    console.log('Athlete:', tokenData.athlete?.firstname, tokenData.athlete?.lastname)
    console.log('Scopes:', tokenData.scope)

    // Check if we got the required scopes
    const hasActivityRead = tokenData.scope?.includes('activity:read')
    const scopeWarning = !hasActivityRead 
      ? '<div style="background: rgba(239, 68, 68, 0.3); border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>⚠️ Warnung:</strong> Der Scope <code>activity:read</code> fehlt! Du musst die App erneut autorisieren und dabei die Aktivitäten-Berechtigung erteilen.</div>'
      : '<div style="background: rgba(34, 197, 94, 0.3); border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>✓ Perfekt!</strong> Scope <code>activity:read_all</code> wurde erteilt.</div>'

    // Return a nice HTML page with the refresh token
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Strava Verbunden!</title>
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
      max-width: 700px;
    }
    h1 { margin-bottom: 20px; text-align: center; }
    .token-box {
      background: rgba(0,0,0,0.5);
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      margin: 20px 0;
      text-align: left;
      user-select: all;
      cursor: pointer;
    }
    .token-box:hover { background: rgba(0,0,0,0.7); }
    .success { color: #4ade80; font-size: 48px; text-align: center; }
    .instructions {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .instructions ol { margin: 10px 0; padding-left: 20px; }
    .instructions li { margin: 8px 0; }
    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .debug-info {
      background: rgba(0,0,0,0.2);
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 11px;
      opacity: 0.8;
    }
    a { color: #60a5fa; }
    .center { text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h1>Strava Verbunden!</h1>
    <p class="center">Willkommen, <strong>${tokenData.athlete?.firstname || 'Athlet'}</strong>!</p>
    
    ${scopeWarning}
    
    <div class="instructions">
      <h3>📋 Nächste Schritte</h3>
      <p>Kopiere den Refresh Token unten und aktualisiere das <code>STRAVA_REFRESH_TOKEN</code> Secret in Supabase:</p>
      
      <div class="token-box" title="Klicken zum Markieren">
        <strong>Refresh Token:</strong><br>
        ${tokenData.refresh_token}
      </div>
      
      <ol>
        <li>Gehe zu <a href="https://supabase.com/dashboard/project/uwwxkkkzkwiftbekezvl/settings/functions" target="_blank">Supabase Dashboard → Edge Functions → Secrets</a></li>
        <li>Finde <code>STRAVA_REFRESH_TOKEN</code> und klicke "Edit"</li>
        <li>Ersetze den Wert mit dem Token oben</li>
        <li>Speichern und <a href="/strava2026">zurück zur Challenge</a></li>
      </ol>
    </div>
    
    <div class="debug-info">
      <strong>Debug Info:</strong><br>
      Scopes erteilt: <code>${tokenData.scope || 'unbekannt'}</code><br>
      Redirect URI verwendet: <code>${redirectUri}</code><br>
      Callback Domain: <code>${callbackDomain}</code><br>
      Client ID: <code>${clientId}</code><br>
      Athlete ID: <code>${tokenData.athlete?.id || 'N/A'}</code>
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
    
    const url = new URL(req.url)
    const redirectUri = `${url.origin}/functions/v1/strava-oauth-callback`
    const callbackDomain = url.hostname
    
    const errorHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Strava OAuth Fehler</title>
  <style>
    body {
      font-family: monospace;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
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
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.5);
      padding: 40px;
      border-radius: 16px;
      max-width: 700px;
    }
    .error { color: #ef4444; font-size: 48px; text-align: center; }
    h1 { text-align: center; }
    .error-box {
      background: rgba(0,0,0,0.3);
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      word-break: break-word;
    }
    .debug-info {
      background: rgba(0,0,0,0.2);
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 11px;
    }
    code { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; }
    a { color: #60a5fa; }
    .help {
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.5);
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error">✕</div>
    <h1>OAuth Fehler</h1>
    
    <div class="error-box">
      <strong>Fehler:</strong> ${message}
    </div>
    
    <div class="help">
      <strong>💡 Häufige Ursachen:</strong>
      <ul>
        <li><strong>invalid redirect_uri:</strong> Die Callback Domain in deinen <a href="https://www.strava.com/settings/api" target="_blank">Strava API Settings</a> muss exakt <code>${callbackDomain}</code> sein (ohne https://, ohne Pfad)</li>
        <li><strong>Missing permissions:</strong> Widerrufe die App-Berechtigung in Strava und autorisiere erneut</li>
        <li><strong>Token expired:</strong> Starte den OAuth-Flow neu</li>
      </ul>
    </div>
    
    <div class="debug-info">
      <strong>Debug Info:</strong><br>
      Redirect URI: <code>${redirectUri}</code><br>
      Callback Domain (in Strava setzen): <code>${callbackDomain}</code>
    </div>
    
    <p style="text-align: center; margin-top: 20px;">
      <a href="/strava2026">← Zurück zur Challenge</a>
    </p>
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
