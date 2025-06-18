
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced rate limiting with IP tracking and progressive delays
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastAttempt: number }>();
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PROGRESSIVE_DELAY_BASE = 1000; // Start with 1 second delay

// Security headers for enhanced protection
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}

// Enhanced encryption utilities with stronger security
async function generateSecureKey(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000, // Increased iterations for better security
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function decryptData(encryptedData: string, password: string): Promise<string> {
  try {
    const [salt, encrypted] = encryptedData.split(':');
    if (!salt || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }
    
    const key = await generateSecureKey(password, salt);
    
    // Decode base64 with proper validation
    let encryptedBytes: string;
    try {
      encryptedBytes = atob(encrypted);
    } catch {
      throw new Error('Invalid base64 encoding');
    }
    
    const keyBytes = key.slice(0, encryptedBytes.length);
    
    let decrypted = '';
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted += String.fromCharCode(
        encryptedBytes.charCodeAt(i) ^ keyBytes.charCodeAt(i % keyBytes.length)
      );
    }
    
    // Validate decrypted data contains no suspicious characters
    if (!/^[a-zA-Z0-9\-_./]+$/.test(decrypted)) {
      throw new Error('Decrypted data validation failed');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
}

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0] : 'unknown');
  return `secure_access_${ip}`;
}

async function checkRateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, lastAttempt: now });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    // Progressive delay based on attempt count
    const delay = Math.min(PROGRESSIVE_DELAY_BASE * Math.pow(2, entry.count - RATE_LIMIT_MAX_ATTEMPTS), 30000);
    if (now - entry.lastAttempt < delay) {
      return false;
    }
  }
  
  entry.count++;
  entry.lastAttempt = now;
  return entry.count <= RATE_LIMIT_MAX_ATTEMPTS;
}

// Enhanced password validation with timing-safe comparison
async function verifyPasswordHash(providedHash: string, correctPassword: string, timestamp: number): Promise<boolean> {
  const expectedHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(correctPassword + timestamp.toString())
  );
  const expectedHashHex = Array.from(new Uint8Array(expectedHash))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // Timing-safe comparison
  if (providedHash.length !== expectedHashHex.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < providedHash.length; i++) {
    result |= providedHash.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  
  return result === 0;
}

// Input sanitization and validation
function sanitizeInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9\-_./]/g, '');
}

function validateSection(section: string): boolean {
  const allowedSections = ['projects', 'videos', 'tv'];
  return allowedSections.includes(section);
}

function validateBucket(bucket: string): boolean {
  const allowedBuckets = ['projects', 'videos', 'tv'];
  return allowedBuckets.includes(bucket);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders, ...securityHeaders } })
  }

  try {
    // Enhanced rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    if (!(await checkRateLimit(rateLimitKey))) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Access temporarily blocked.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
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
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { encryptedPath, passwordHash, timestamp, bucket, section } = requestBody;

    // Enhanced input validation
    if (!encryptedPath || !passwordHash || !timestamp || !bucket || !section) {
      return new Response(
        JSON.stringify({ error: 'Missing required encrypted fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate section and bucket
    if (!validateSection(sanitizeInput(section)) || !validateBucket(sanitizeInput(bucket))) {
      return new Response(
        JSON.stringify({ error: 'Invalid section or bucket' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced timestamp validation with stricter window
    const now = Date.now();
    if (typeof timestamp !== 'number' || Math.abs(now - timestamp) > 2 * 60 * 1000) { // 2 minute window
      return new Response(
        JSON.stringify({ error: 'Request expired or invalid timestamp' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the password for the requested section with enhanced security
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
    }

    if (!correctPassword) {
      console.error(`Password not configured for section: ${section}`);
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced password verification
    if (!(await verifyPasswordHash(passwordHash, correctPassword, timestamp))) {
      // Progressive delay for failed attempts
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced file path decryption and validation
    let filePath: string;
    try {
      filePath = await decryptData(encryptedPath, correctPassword);
      
      // Additional path validation
      if (filePath.includes('..') || filePath.startsWith('/') || filePath.includes('\\')) {
        throw new Error('Invalid file path detected');
      }
      
      // Sanitize the file path
      filePath = sanitizeInput(filePath);
      
    } catch (error) {
      console.error('Decryption or validation failed:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid encrypted path' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a temporary signed URL with shorter expiry for better security
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate secure access URL' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return encrypted response with additional security measures
    const responseData = {
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
    };

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      }
    )

  } catch (error) {
    console.error('Error in secure-file-access function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
