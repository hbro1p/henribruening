
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced security headers to prevent code inspection
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; base-uri 'none';",
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
}

// Enhanced rate limiting with progressive delays and IP tracking
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastAttempt: number; consecutiveFailures: number; blocked: boolean }>();
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PROGRESSIVE_DELAY_BASE = 5000; // Start with 5 second delay
const MAX_BLOCK_TIME = 60 * 60 * 1000; // 1 hour max block

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0] : 'unknown');
  
  // Create a hash of the IP to prevent IP exposure in logs
  const hasher = createHash("sha256");
  hasher.update(ip + "salt_string_for_privacy");
  return `verify_${hasher.toString()}`;
}

async function checkRateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW_MS, 
      lastAttempt: now,
      consecutiveFailures: 0,
      blocked: false
    });
    return true;
  }
  
  // Check if IP is temporarily blocked
  if (entry.blocked && now - entry.lastAttempt < MAX_BLOCK_TIME) {
    return false;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    const delay = Math.min(PROGRESSIVE_DELAY_BASE * Math.pow(2, entry.consecutiveFailures), MAX_BLOCK_TIME);
    if (now - entry.lastAttempt < delay) {
      entry.blocked = true;
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
      entry.blocked = false;
    } else {
      entry.consecutiveFailures++;
      if (entry.consecutiveFailures >= 5) {
        entry.blocked = true;
      }
    }
  }
}

// Enhanced timing-safe comparison with additional obfuscation
async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  // Add random padding to make timing analysis harder
  const padding = Math.floor(Math.random() * 1000) + 500;
  await new Promise(resolve => setTimeout(resolve, padding));
  
  if (a.length !== b.length) {
    let dummy = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      dummy |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length);
    }
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  // Add additional random delay to prevent timing attacks
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  
  return result === 0;
}

// Enhanced input sanitization and validation
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\x20-\x7E]/g, '').trim().slice(0, 1024); // Limit length
}

function validateSection(section: string): boolean {
  const allowedSections = ['projects', 'videos', 'tv', 'global'];
  return allowedSections.includes(section);
}

function validateTimestamp(timestamp: number): boolean {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return timestamp > (now - fiveMinutes) && timestamp < (now + fiveMinutes);
}

// Enhanced password validation with more strict rules
function validatePassword(hashedPassword: string): boolean {
  if (typeof hashedPassword !== 'string') return false;
  if (hashedPassword.length !== 64) return false; // SHA256 hex length
  return /^[a-f0-9]{64}$/i.test(hashedPassword);
}

// Create multiple layers of password hashing for enhanced security
function createSecureHash(password: string, timestamp: number): string {
  const hasher1 = createHash("sha256");
  hasher1.update(password + timestamp.toString());
  
  const hasher2 = createHash("sha256");
  hasher2.update(hasher1.toString() + "additional_salt_layer");
  
  return hasher2.toString();
}

serve(async (req) => {
  // Add anti-debugging headers
  const response_headers = { 
    ...corsHeaders, 
    ...securityHeaders,
    'X-Powered-By': 'Secure-Server', // Obfuscate technology stack
    'Server': 'nginx' // Fake server header
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: response_headers })
  }

  const rateLimitKey = getRateLimitKey(req);
  
  try {
    // Enhanced rate limiting check with IP blocking
    if (!(await checkRateLimit(rateLimitKey))) {
      // Log suspicious activity (in production, this could trigger alerts)
      console.warn(`Rate limit exceeded for key: ${rateLimitKey.slice(0, 8)}...`);
      
      return new Response(
        JSON.stringify({ error: 'Access temporarily restricted. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method !== 'POST') {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    let requestBody;
    try {
      const rawBody = await req.text();
      if (rawBody.length > 2048) { // Stricter request size limit
        throw new Error('Request too large');
      }
      requestBody = JSON.parse(rawBody);
    } catch {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { 
          status: 400, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { hashedPassword, timestamp, section } = requestBody;

    // Enhanced field validation
    if (!hashedPassword || !timestamp || !section) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Missing required authentication data' }),
        { 
          status: 400, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate timestamp to prevent replay attacks
    if (!validateTimestamp(timestamp)) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Request expired. Please try again.' }),
        { 
          status: 400, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced password validation
    if (!validatePassword(hashedPassword)) {
      updateFailureCount(rateLimitKey, false);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication format' }),
        { 
          status: 400, 
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
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
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
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
          headers: { ...response_headers, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create expected hash using the same method as frontend
    const expectedHash = createSecureHash(correctPassword, timestamp);

    // Enhanced timing-safe comparison to prevent timing attacks
    const isValid = await timingSafeCompare(hashedPassword, expectedHash);
    
    // Update failure count based on result
    updateFailureCount(rateLimitKey, isValid);

    // Add additional delay for failed attempts to slow down brute force
    if (!isValid) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    }

    // Clean up old rate limit entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      const now = Date.now();
      for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime + MAX_BLOCK_TIME) {
          rateLimitMap.delete(key);
        }
      }
    }

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        headers: { ...response_headers, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in verify-password function:', error)
    updateFailureCount(rateLimitKey, false);
    return new Response(
      JSON.stringify({ error: 'Authentication service error' }),
      { 
        status: 500, 
        headers: { ...response_headers, 'Content-Type': 'application/json' } 
      }
    )
  }
})
