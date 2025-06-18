
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
    const { password } = await req.json()

    // Verify password first
    const correctPassword = Deno.env.get('PROJECTS_PASSWORD')
    
    if (!correctPassword || password !== correctPassword) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return secure projects data
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
