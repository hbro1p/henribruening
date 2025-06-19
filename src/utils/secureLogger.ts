
// Secure logging utility that only logs in development
const isDevelopment = import.meta.env.DEV;

interface LogLevel {
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

class SecureLogger {
  private shouldLog(): boolean {
    return isDevelopment;
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth', 'session'];
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        }
      });
      
      return sanitized;
    }
    return data;
  }

  log(level: keyof LogLevel, message: string, data?: any) {
    if (!this.shouldLog()) return;
    
    const sanitizedData = data ? this.sanitizeData(data) : undefined;
    const timestamp = new Date().toISOString();
    
    switch (level) {
      case 'INFO':
        console.log(`[${timestamp}] INFO: ${message}`, sanitizedData || '');
        break;
      case 'WARN':
        console.warn(`[${timestamp}] WARN: ${message}`, sanitizedData || '');
        break;
      case 'ERROR':
        console.error(`[${timestamp}] ERROR: ${message}`, sanitizedData || '');
        break;
      case 'DEBUG':
        console.debug(`[${timestamp}] DEBUG: ${message}`, sanitizedData || '');
        break;
    }
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
  }
}

export const secureLogger = new SecureLogger();

// Legacy console.log replacement (for gradual migration)
export const secureLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};
