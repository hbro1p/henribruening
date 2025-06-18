
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
  'Expires': '0',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none';"
}

// Military-grade rate limiting with exponential backoff and IP fingerprinting
const rateLimitMap = new Map<string, { 
  count: number; 
  resetTime: number; 
  lastAttempt: number; 
  consecutiveFailures: number;
  fingerprint: string;
}>();

const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PROGRESSIVE_DELAY_BASE = 2000; // Start with 2 second delay
const MAX_DELAY = 300000; // 5 minutes max

function generateFingerprint(req: Request): string {
  const headers = [
    req.headers.get('user-agent') || '',
    req.headers.get('accept-language') || '',
    req.headers.get('accept-encoding') || '',
    req.headers.get('accept') || ''
  ];
  return btoa(headers.join('|')).slice(0, 16);
}

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0] : 'unknown');
  const fingerprint = generateFingerprint(req);
  return `verify_${ip}_${fingerprint}`;
}

async function checkRateLimit(key: string, fingerprint: string): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW_MS, 
      lastAttempt: now,
      consecutiveFailures: 0,
      fingerprint
    });
    return true;
  }
  
  // Additional security: check fingerprint consistency
  if (entry.fingerprint !== fingerprint) {
    entry.consecutiveFailures += 2; // Penalty for fingerprint mismatch
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    // Exponential backoff with jitter
    const baseDelay = PROGRESSIVE_DELAY_BASE * Math.pow(2, entry.consecutiveFailures);
    const jitter = Math.random() * 1000;
    const delay = Math.min(baseDelay + jitter, MAX_DELAY);
    
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
      // Reset on success
      rateLimitMap.delete(key);
    } else {
      entry.consecutiveFailures++;
      // Extend reset time on repeated failures
      entry.resetTime = Math.max(entry.resetTime, Date.now() + (entry.consecutiveFailures * 60000));
    }
  }
}

// Military-grade timing-safe comparison with random delay injection
async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  const maxLength = Math.max(a.length, b.length, 64); // Minimum 64 chars for consistent timing
  let result = 0;
  
  // Constant-time comparison
  for (let i = 0; i < maxLength; i++) {
    const aChar = i < a.length ? a.charCodeAt(i) : 0;
    const bChar = i < b.length ? b.charCodeAt(i) : 0;
    result |= aChar ^ bChar;
  }
  
  // Random delay injection (50-150ms) to prevent timing analysis
  const randomDelay = Math.random() * 100 + 50;
  await new Promise(resolve => setTimeout(resolve, randomDelay));
  
  // Additional computational work to mask timing
  let dummy = 0;
  for (let i = 0; i < 1000; i++) {
    dummy = (dummy + Math.random()) % 1000000;
  }
  
  return result === 0;
}

// Enhanced input sanitization with deep validation
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  // Remove control characters, non-printable chars, and potential injection vectors
  return input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Control characters
    .replace(/[<>'"&]/g, '') // Basic XSS prevention
    .replace(/[\r\n\t]/g, '') // Line breaks and tabs
    .trim()
    .slice(0, 256); // Length limit
}

function validateSection(section: string): boolean {
  const allowedSections = ['projects', 'videos', 'tv', 'master'];
  return allowedSections.includes(section);
}

// Enhanced password validation with entropy checking
function validatePassword(password: string): boolean {
  if (typeof password !== 'string') return false;
  if (password.length === 0 || password.length > 512) return false;
  
  // Check for suspicious patterns
  if (/(.)\1{4,}/.test(password)) return false; // Repeated characters
  if (/^[0-9]+$/.test(password)) return false; // Only numbers
  if (/^[a-zA-Z]+$/.test(password)) return false; // Only letters
  
  // Check for null bytes and control characters
  return !password.includes('\x00') && !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(password);
}

// Honeypot detection
function detectHoneypot(req: Request): boolean {
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-cluster-client-ip',
    'x-real-ip-override'
  ];
  
  return suspiciousHeaders.some(header => req.headers.has(header));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders, ...securityHeaders } })
  }

  const rateLimitKey = getRateLimitKey(req);
  const fingerprint = generateFingerprint(req);
  
  try {
    // Honeypot detection
    if (detectHoneypot(req)) {
      return new Response(
        JSON.stringify({ error: 'Request rejected' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Military-grade rate limiting
    if (!(await checkRateLimit(rateLimitKey, fingerprint))) {
      return new Response(
        JSON.stringify({ error: 'Access temporarily restricted. Security protocols active.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Method validation
    if (req.method !== 'POST') {
      updateFailureCount(rateLimitKey, false);
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
      if (rawBody.length > 2048) { // Stricter size limit
        throw new Error('Request too large');
      }
      requestBody = JSON.parse(rawBody);
    } catch {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
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
        JSON.stringify({ error: 'Incomplete request data' }),
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
        JSON.stringify({ error: 'Invalid authentication format' }),
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
        JSON.stringify({ error: 'Invalid access section' }),
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
      case 'master':
        correctPassword = Deno.env.get('MASTER_PASSWORD')
        break
    }

    if (!correctPassword) {
      console.error(`Authentication not configured for section: ${sanitizedSection}`)
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Authentication service unavailable' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Military-grade timing-safe comparison
    const isValid = await timingSafeCompare(password, correctPassword);
    
    // Update failure count based on result
    updateFailureCount(rateLimitKey, isValid);

    // Additional delay for failed attempts with random jitter
    if (!isValid) {
      const delay = Math.random() * 1000 + 500;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Critical security error in verify-password function:', error)
    updateFailureCount(rateLimitKey, false);
    return new Response(
      JSON.stringify({ error: 'Authentication service error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
