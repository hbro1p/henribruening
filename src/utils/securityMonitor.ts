// Security monitoring utility
import { secureLogger } from './secureLogger';

interface SecurityEvent {
  type: 'AUTHENTICATION_ATTEMPT' | 'SESSION_VIOLATION' | 'SUSPICIOUS_ACTIVITY' | 'ACCESS_DENIED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, any>;
  timestamp: number;
  userAgent?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 100; // Keep last 100 events in memory
  
  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized = { ...details };
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'session'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      details: this.sanitizeDetails(event.details),
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    // Add to memory (for immediate analysis)
    this.events.push(securityEvent);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift();
    }

    // Log based on severity
    switch (event.severity) {
      case 'CRITICAL':
        secureLogger.error(`SECURITY: ${event.type}`, securityEvent);
        break;
      case 'HIGH':
        secureLogger.warn(`SECURITY: ${event.type}`, securityEvent);
        break;
      case 'MEDIUM':
        secureLogger.info(`SECURITY: ${event.type}`, securityEvent);
        break;
      case 'LOW':
        secureLogger.debug(`SECURITY: ${event.type}`, securityEvent);
        break;
    }
  }

  getRecentEvents(count: number = 10): SecurityEvent[] {
    return this.events.slice(-count);
  }

  checkForSuspiciousPatterns(): boolean {
    const recentEvents = this.getRecentEvents(20);
    const failedAttempts = recentEvents.filter(
      event => event.type === 'AUTHENTICATION_ATTEMPT' && 
               event.details.success === false
    );

    // Alert if more than 5 failed attempts in recent events
    if (failedAttempts.length > 5) {
      this.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        severity: 'HIGH',
        details: { 
          reason: 'Multiple failed authentication attempts',
          count: failedAttempts.length 
        }
      });
      return true;
    }

    return false;
  }
}

export const securityMonitor = new SecurityMonitor();

// Input validation utilities
export const validateInput = {
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    }
    if (password.length > 500) {
      errors.push('Password too long');
    }
    if (password.includes('<') || password.includes('>')) {
      errors.push('Invalid characters in password');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  filename: (filename: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!filename) {
      errors.push('Filename is required');
    }
    if (filename.length > 255) {
      errors.push('Filename too long');
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      errors.push('Invalid characters in filename');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  sanitizeText: (text: string): string => {
    return text
      .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }
};