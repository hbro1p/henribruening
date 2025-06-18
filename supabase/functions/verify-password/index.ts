
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Enhanced rate limiting with progressive delays
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastAttempt: number; consecutiveFailures: number }>();
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PROGRESSIVE_DELAY_BASE = 2000; // Start with 2 second delay

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0] : 'unknown');
  return `verify_${ip}`;
}

async function checkRateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW_MS, 
      lastAttempt: now,
      consecutiveFailures: 0
    });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    // Progressive delay based on consecutive failures
    const delay = Math.min(PROGRESSIVE_DELAY_BASE * Math.pow(2, entry.consecutiveFailures), 60000);
    if (now - entry.lastAttempt < delay) {
      return false;
    }
  }
  
  entry.count++;
  entry.lastAttempt = now;
  return entry.count <= RATE_LIMIT_MAX_ATTEMPTS;
}

function updateFailureCount(key: string, success: boolean): void {
  const entry = rateLimitMap.get(key);
  if (entry) {
    if (success) {
      entry.consecutiveFailures = 0;
    } else {
      entry.consecutiveFailures++;
    }
  }
}

// Enhanced timing-safe comparison
async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    // Still perform comparison to maintain constant time
    let dummy = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      dummy |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length);
    }
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  // Add small random delay to prevent timing attacks
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  
  return result === 0;
}

// Input sanitization
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\x20-\x7E]/g, '').trim(); // Only allow printable ASCII
}

function validateSection(section: string): boolean {
  const allowedSections = ['projects', 'videos', 'tv', 'global'];
  return allowedSections.includes(section);
}

// Enhanced password validation
function validatePassword(password: string): boolean {
  if (typeof password !== 'string') return false;
  if (password.length === 0 || password.length > 256) return false; // Reasonable length limits
  // Check for null bytes and other suspicious characters
  return !password.includes('\x00') && !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(password);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders, ...securityHeaders } })
  }

  const rateLimitKey = getRateLimitKey(req);
  
  try {
    // Enhanced rate limiting check
    if (!(await checkRateLimit(rateLimitKey))) {
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Access temporarily blocked.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced input validation
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
      const rawBody = await req.text();
      if (rawBody.length > 1024) { // Limit request size
        throw new Error('Request too large');
      }
      requestBody = JSON.parse(rawBody);
    } catch {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { password, section } = requestBody;

    // Enhanced field validation
    if (!password || !section) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Missing required fields: password and section' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced password validation
    if (!validatePassword(password)) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid password format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced section validation
    const sanitizedSection = sanitizeInput(section);
    if (!validateSection(sanitizedSection)) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid section. Must be one of: projects, videos, tv, global' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the password for the requested section from environment variables
    let correctPassword: string | undefined
    
    switch (sanitizedSection) {
      case 'projects':
        correctPassword = Deno.env.get('PROJECTS_PASSWORD')
        break
      case 'videos':
        correctPassword = Deno.env.get('VIDEOS_PASSWORD')
        break
      case 'tv':
        correctPassword = Deno.env.get('TV_PASSWORD')
        break
      case 'global':
        correctPassword = Deno.env.get('MASTER_PASSWORD')
        break
    }

    if (!correctPassword) {
      console.error(`Password not configured for section: ${sanitizedSection}`)
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced timing-safe comparison to prevent timing attacks
    const isValid = await timingSafeCompare(password, correctPassword);
    
    // Update failure count based on result
    updateFailureCount(rateLimitKey, isValid);

    // Add additional delay for failed attempts
    if (!isValid) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    }

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in verify-password function:', error)
    updateFailureCount(rateLimitKey, false);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
