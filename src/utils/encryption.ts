
import CryptoJS from 'crypto-js';

// Generate a key from password using PBKDF2
const generateKey = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
};

// Encrypt any data
export const encryptData = (data: string, password: string): string => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const key = generateKey(password, salt);
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return salt + ':' + encrypted;
};

// Decrypt any data
export const decryptData = (encryptedData: string, password: string): string => {
  const [salt, encrypted] = encryptedData.split(':');
  const key = generateKey(password, salt);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// Encrypt file path for secure requests
export const encryptFilePath = (filePath: string, password: string): string => {
  return encryptData(filePath, password);
};

// Decrypt file path
export const decryptFilePath = (encryptedPath: string, password: string): string => {
  return decryptData(encryptedPath, password);
};

// Generate secure hash for password verification without sending actual password
export const generateSecureHash = (password: string, timestamp: number): string => {
  const saltedPassword = password + timestamp.toString();
  return CryptoJS.SHA256(saltedPassword).toString();
};
