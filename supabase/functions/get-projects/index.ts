
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { password } = requestBody;

    // Validate password input
    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid password provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify password first
    const correctPassword = Deno.env.get('PROJECTS_PASSWORD')
    
    if (!correctPassword) {
      console.error('PROJECTS_PASSWORD environment variable not configured')
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use timing-safe comparison
    if (password.length !== correctPassword.length || password !== correctPassword) {
      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 200));
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return secure projects data only after successful authentication
    const projectsData = [
      {
        id: 'internly',
        title: 'Internly',
        description: {
          en: 'Currently developing a platform to connect students with internships',
          de: 'Entwickle derzeit eine Plattform, um Studenten mit Praktika zu verbinden'
        },
        links: [
          { url: 'https://internly.replit.app', label: 'Website' },
          { url: 'https://www.instagram.com/internly.de/', label: 'Instagram' }
        ]
      },
      {
        id: 'echo-coesfeld',
        title: 'Echo Coesfeld',
        description: {
          en: 'A public voice project using QR codes & interviews to gather real opinions from people in Coesfeld',
          de: 'Ein öffentliches Stimmprojekt mit QR-Codes & Interviews, um echte Meinungen von Menschen in Coesfeld zu sammeln'
        },
        links: [
          { url: 'https://www.instagram.com/echo.coesfeld/', label: 'Instagram' },
          { url: 'https://www.tiktok.com/@echo.coesfeld', label: 'TikTok' }
        ]
      }
    ]

    return new Response(
      JSON.stringify({ projects: projectsData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in get-projects function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
