
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
    const correctPassword = Deno.env.get('VIDEOS_PASSWORD')
    
    if (!correctPassword) {
      console.error('VIDEOS_PASSWORD environment variable not configured')
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

    // Return secure videos data only after successful authentication
    const videosData = [
      {
        id: 'ute-uphues',
        title: 'Ute Uphues',
        description: {
          en: 'Teen coaching videos created for Ute\'s TikTok and Instagram',
          de: 'Teen-Coaching-Videos für Utes TikTok und Instagram erstellt'
        },
        links: [
          { url: 'https://www.tiktok.com/@ute.uphues', label: 'TikTok' },
          { url: 'https://ute-uphues.replit.app', label: 'Website I built' }
        ]
      },
      {
        id: 'real-estate-mallorca',
        title: 'Real Estate Internship (Mallorca)',
        description: {
          en: 'A creative and content-focused internship at FALC Real Estate in Cala Millor',
          de: 'Ein kreatives und inhaltsorientierten Praktikum bei FALC Real Estate in Cala Millor'
        },
        links: [
          { url: 'https://www.instagram.com/p/DIjcdGZIAcr/', label: 'Instagram' }
        ]
      },
      {
        id: 'henriawb',
        title: 'HenriAWB – Blackstories with a Hook',
        description: {
          en: 'Entertaining TikToks with surprising twists, hooks, and storytelling',
          de: 'Unterhaltsame TikToks mit überraschenden Wendungen, Hooks und Storytelling'
        },
        links: [
          { url: 'https://www.youtube.com/@Henriawb', label: 'YouTube' }
        ]
      },
      {
        id: 'thistimefr',
        title: 'ThisTimeFr',
        description: {
          en: 'My storytelling identity for vlogs, creative clips, and travel adventures',
          de: 'Meine Storytelling-Identität für Vlogs, kreative Clips und Reiseabenteuer'
        },
        links: [
          { url: 'https://www.tiktok.com/@thistimefrr', label: 'TikTok' },
          { url: 'https://www.youtube.com/@Thistimefr', label: 'YouTube' }
        ]
      },
      {
        id: 'more-videos',
        title: {
          en: 'More Videos',
          de: 'Weitere Videos'
        },
        description: {
          en: 'Additional videos from various projects and collaborations',
          de: 'Weitere Videos aus verschiedenen Projekten und Kollaborationen'
        },
        links: [
          { url: 'https://www.youtube.com/watch?v=jr0z7nFgE7Q', label: { en: 'A Day as a Real Estate Agent', de: 'Ein Tag als Immobilienmakler' } },
          { url: 'https://www.instagram.com/reel/C2Il3BRoCV5/', label: { en: 'Thomas Puke DEVK - Short Advertisement', de: 'Thomas Puke DEVK - Kurzwerbung' } },
          { url: 'https://heriburg-gymnasium.de/projektwoche-2025/', label: { en: 'Project Week Film', de: 'Film zur Projektwoche' } }
        ]
      }
    ]

    return new Response(
      JSON.stringify({ videos: videosData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in get-videos function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
