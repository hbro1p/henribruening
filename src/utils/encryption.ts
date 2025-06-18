
import CryptoJS from 'crypto-js';

// Enhanced key generation with stronger parameters
const generateKey = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000, // Increased iterations for better security
    hasher: CryptoJS.algo.SHA256
  }).toString();
};

// Enhanced salt generation with cryptographically secure random
const generateSecureSalt = (): string => {
  return CryptoJS.lib.WordArray.random(256 / 8).toString(); // 256-bit salt
};

// Enhanced encryption with stronger parameters
export const encryptData = (data: string, password: string): string => {
  // Input validation
  if (!data || !password) {
    throw new Error('Data and password are required');
  }
  
  // Generate secure salt
  const salt = generateSecureSalt();
  const key = generateKey(password, salt);
  
  // Generate secure IV
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  
  // Encrypt with AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  
  // Return format: salt:iv:encrypted
  return salt + ':' + iv.toString() + ':' + encrypted;
};

// Enhanced decryption with proper validation
export const decryptData = (encryptedData: string, password: string): string => {
  // Input validation
  if (!encryptedData || !password) {
    throw new Error('Encrypted data and password are required');
  }
  
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const [salt, ivString, encrypted] = parts;
  
  try {
    const key = generateKey(password, salt);
    const iv = CryptoJS.enc.Hex.parse(ivString);
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Validate decryption result
    if (!result) {
      throw new Error('Decryption failed - invalid password or corrupted data');
    }
    
    return result;
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

// Enhanced secure hash generation with salt and stronger parameters
export const generateSecureHash = (password: string, timestamp: number): string => {
  // Input validation
  if (!password || typeof timestamp !== 'number') {
    throw new Error('Password and timestamp are required');
  }
  
  // Use timestamp as part of salt for replay attack prevention
  const timeSalt = Math.floor(timestamp / 1000).toString(); // Second precision
  const saltedPassword = password + timestamp.toString() + timeSalt;
  
  // Multiple rounds of hashing for added security
  let hash = CryptoJS.SHA256(saltedPassword).toString();
  for (let i = 0; i < 1000; i++) {
    hash = CryptoJS.SHA256(hash + saltedPassword).toString();
  }
  
  return hash;
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
