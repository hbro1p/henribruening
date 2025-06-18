
import CryptoJS from 'crypto-js';

// Simple XOR-based encryption for compatibility with the edge function
const generateSecureKey = (password: string, salt: string): string => {
  const encoder = new TextEncoder();
  const keyMaterial = password + salt;
  
  // Use a simpler approach that matches the edge function
  let hash = '';
  for (let i = 0; i < keyMaterial.length; i++) {
    hash += keyMaterial.charCodeAt(i).toString(16).padStart(2, '0');
  }
  
  // Pad or truncate to ensure consistent length
  return hash.padEnd(64, '0').substring(0, 64);
};

// Simple encryption that matches the edge function's decryption
export const encryptData = (data: string, password: string): string => {
  // Input validation
  if (!data || !password) {
    throw new Error('Data and password are required');
  }
  
  // Generate a simple salt
  const salt = Math.random().toString(36).substring(2, 15);
  const key = generateSecureKey(password, salt);
  
  // Simple XOR encryption
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const dataChar = data.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(dataChar ^ keyChar);
  }
  
  // Convert to base64 and return with salt
  const encryptedBase64 = btoa(encrypted);
  return salt + ':' + encryptedBase64;
};

// Simple decryption
export const decryptData = (encryptedData: string, password: string): string => {
  // Input validation
  if (!encryptedData || !password) {
    throw new Error('Encrypted data and password are required');
  }
  
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const [salt, encrypted] = parts;
  
  try {
    const key = generateSecureKey(password, salt);
    const encryptedBytes = atob(encrypted);
    
    let decrypted = '';
    for (let i = 0; i < encryptedBytes.length; i++) {
      const encryptedChar = encryptedBytes.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(encryptedChar ^ keyChar);
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

// Enhanced file path encryption with additional validation
export const encryptFilePath = (filePath: string, password: string): string => {
  // Validate file path
  if (!filePath || filePath.includes('..') || filePath.startsWith('/')) {
    throw new Error('Invalid file path');
  }
  
  // Sanitize file path
  const sanitizedPath = filePath.replace(/[^a-zA-Z0-9\-_./]/g, '');
  
  return encryptData(sanitizedPath, password);
};

// Enhanced file path decryption
export const decryptFilePath = (encryptedPath: string, password: string): string => {
  const decrypted = decryptData(encryptedPath, password);
  
  // Additional validation of decrypted path
  if (decrypted.includes('..') || decrypted.startsWith('/') || decrypted.includes('\\')) {
    throw new Error('Invalid decrypted file path');
  }
  
  return decrypted;
};

// Enhanced secure hash generation - simplified for internal access tokens
export const generateSecureHash = (password: string, timestamp: number): string => {
  // Input validation
  if (!password || typeof timestamp !== 'number') {
    throw new Error('Password and timestamp are required');
  }
  
  // For internal access tokens, create a simple but secure hash
  return CryptoJS.SHA256(password + timestamp.toString()).toString();
};

// Additional utility for generating secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// Enhanced password strength validation
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
