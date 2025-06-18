
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
    const { password, section } = await req.json()

    // Get the password for the requested section from environment variables
    let correctPassword: string | undefined
    
    switch (section) {
      case 'projects':
        correctPassword = Deno.env.get('PROJECTS_PASSWORD')
        break
      case 'videos':
        correctPassword = Deno.env.get('VIDEOS_PASSWORD')
        break
      case 'tv':
        correctPassword = Deno.env.get('TV_PASSWORD')
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid section' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    if (!correctPassword) {
      console.error(`Password not configured for section: ${section}`)
      return new Response(
        JSON.stringify({ error: 'Password not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const isValid = password === correctPassword

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in verify-password function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
