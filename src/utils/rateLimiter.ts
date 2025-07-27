// Client-side rate limiting utility
import { securityMonitor } from './securityMonitor';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class ClientRateLimiter {
  private attempts = new Map<string, RateLimitEntry>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  private getKey(identifier: string): string {
    // Create a simple hash for the identifier
    return `rate_limit_${identifier}`;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanupExpired();
    
    const key = this.getKey(identifier);
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry) {
      // First attempt
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
        blocked: false
      });
      
      return {
        allowed: true,
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs
      };
    }

    // Check if currently blocked
    if (entry.blocked && now < entry.resetTime) {
      securityMonitor.logSecurityEvent({
        type: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        details: { 
          reason: 'Rate limit exceeded',
          identifier: identifier.substring(0, 10) + '...'
        }
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Reset if window expired
    if (now > entry.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
        blocked: false
      });
      
      return {
        allowed: true,
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs
      };
    }

    // Increment count
    entry.count++;

    if (entry.count > this.maxAttempts) {
      // Block the identifier
      entry.blocked = true;
      entry.resetTime = now + this.blockDurationMs;
      
      securityMonitor.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        severity: 'HIGH',
        details: { 
          reason: 'Rate limit exceeded, blocking identifier',
          identifier: identifier.substring(0, 10) + '...',
          attempts: entry.count
        }
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    return {
      allowed: true,
      remaining: this.maxAttempts - entry.count,
      resetTime: entry.resetTime
    };
  }

  recordAttempt(identifier: string, success: boolean): void {
    securityMonitor.logSecurityEvent({
      type: 'AUTHENTICATION_ATTEMPT',
      severity: success ? 'LOW' : 'MEDIUM',
      details: { 
        success,
        identifier: identifier.substring(0, 10) + '...'
      }
    });

    if (!success) {
      // Increment failure count
      this.checkLimit(identifier);
    }
  }
}

export const clientRateLimiter = new ClientRateLimiter();