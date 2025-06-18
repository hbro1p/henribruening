
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Encryption utilities (server-side implementation)
function generateKey(password: string, salt: string): string {
  // Simple PBKDF2-like key derivation (for Deno environment)
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
}

function decryptData(encryptedData: string, password: string): string {
  try {
    // Simple XOR decryption for demonstration - in production use proper crypto
    const [salt, encrypted] = encryptedData.split(':');
    const key = generateKey(password, salt);
    
    // Decode base64
    const encryptedBytes = atob(encrypted);
    const keyBytes = key.slice(0, encryptedBytes.length);
    
    let decrypted = '';
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted += String.fromCharCode(
        encryptedBytes.charCodeAt(i) ^ keyBytes.charCodeAt(i % keyBytes.length)
      );
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
}

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `file_access_${ip}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

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

    const { encryptedPath, passwordHash, timestamp, bucket, section } = requestBody;

    // Validate required fields
    if (!encryptedPath || !passwordHash || !timestamp || !bucket || !section) {
      return new Response(
        JSON.stringify({ error: 'Missing required encrypted fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate timestamp to prevent replay attacks (allow 5 minute window)
    const now = Date.now();
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
      return new Response(
        JSON.stringify({ error: 'Request expired' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the password for the requested section
    let correctPassword: string | undefined;
    
    switch (section) {
      case 'projects':
        correctPassword = Deno.env.get('PROJECTS_PASSWORD');
        break;
      case 'videos':
        correctPassword = Deno.env.get('VIDEOS_PASSWORD');
        break;
      case 'tv':
        correctPassword = Deno.env.get('TV_PASSWORD');
        break;
      case 'pictures':
        correctPassword = Deno.env.get('PICTURES_PASSWORD');
        break;
    }

    if (!correctPassword) {
      console.error(`Password not configured for section: ${section}`);
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify password hash
    const expectedHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(correctPassword + timestamp.toString())
    );
    const expectedHashHex = Array.from(new Uint8Array(expectedHash))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    if (passwordHash !== expectedHashHex) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Decrypt the file path
    let filePath: string;
    try {
      filePath = decryptData(encryptedPath, correctPassword);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid encrypted path' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a temporary signed URL that expires in 30 minutes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 1800) // 30 minutes expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate secure access URL' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return encrypted response
    const responseData = {
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + 1800 * 1000).toISOString()
    };

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in secure-file-access function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
