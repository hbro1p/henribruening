
import CryptoJS from 'crypto-js';

// Simple XOR-based encryption for basic file path protection
const generateSecureKey = (password: string, salt: string): string => {
  const encoder = new TextEncoder();
  const keyMaterial = password + salt;
  
  let hash = '';
  for (let i = 0; i < keyMaterial.length; i++) {
    hash += keyMaterial.charCodeAt(i).toString(16).padStart(2, '0');
  }
  
  return hash.padEnd(64, '0').substring(0, 64);
};

// Simple encryption
export const encryptData = (data: string, password: string): string => {
  if (!data || !password) {
    throw new Error('Data and password are required');
  }
  
  const salt = Math.random().toString(36).substring(2, 15);
  const key = generateSecureKey(password, salt);
  
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const dataChar = data.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(dataChar ^ keyChar);
  }
  
  const encryptedBase64 = btoa(encrypted);
  return salt + ':' + encryptedBase64;
};

// Simple decryption
export const decryptData = (encryptedData: string, password: string): string => {
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

// Secure hash generation for server-side validation
export const generateSecureHash = (password: string, timestamp: number): string => {
  if (!password || typeof timestamp !== 'number') {
    throw new Error('Password and timestamp are required');
  }
  
  return CryptoJS.SHA256(password + timestamp.toString()).toString();
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// Password strength validation
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
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
