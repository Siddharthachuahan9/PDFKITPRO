// ============================================
// PDFKit Pro - Client-Side Encryption (AES-256-GCM)
// ============================================

import type { Result } from '@/types';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const TAG_LENGTH = 128;

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a key from a password
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: ArrayBuffer
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export a key to base64 string
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Import a key from base64 string
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'raw',
    keyData.buffer as ArrayBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with AES-256-GCM
 */
export async function encrypt(
  data: ArrayBuffer,
  key: CryptoKey
): Promise<Result<{ encrypted: ArrayBuffer; iv: ArrayBuffer }>> {
  try {
    const ivArray = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const iv = ivArray.buffer.slice(0) as ArrayBuffer;
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      data
    );
    return { ok: true, data: { encrypted, iv } };
  } catch {
    return { ok: false, error: 'Encryption failed' };
  }
}

/**
 * Decrypt data with AES-256-GCM
 */
export async function decrypt(
  encrypted: ArrayBuffer,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<Result<ArrayBuffer>> {
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      encrypted
    );
    return { ok: true, data: decrypted };
  } catch {
    return { ok: false, error: 'Decryption failed. Invalid key or corrupted data.' };
  }
}

/**
 * Encrypt file with password (includes salt and IV in output)
 */
export async function encryptWithPassword(
  data: ArrayBuffer,
  password: string
): Promise<Result<ArrayBuffer>> {
  try {
    const saltArray = crypto.getRandomValues(new Uint8Array(16));
    const salt = saltArray.buffer.slice(0) as ArrayBuffer;
    const key = await deriveKeyFromPassword(password, salt);
    const ivArray = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const iv = ivArray.buffer.slice(0) as ArrayBuffer;

    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      data
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(16 + IV_LENGTH + encrypted.byteLength);
    combined.set(new Uint8Array(salt), 0);
    combined.set(new Uint8Array(iv), 16);
    combined.set(new Uint8Array(encrypted), 16 + IV_LENGTH);

    return { ok: true, data: combined.buffer.slice(0) as ArrayBuffer };
  } catch {
    return { ok: false, error: 'Encryption failed' };
  }
}

/**
 * Decrypt file with password (extracts salt and IV from input)
 */
export async function decryptWithPassword(
  data: ArrayBuffer,
  password: string
): Promise<Result<ArrayBuffer>> {
  try {
    const combined = new Uint8Array(data);
    const salt = combined.slice(0, 16).buffer.slice(0) as ArrayBuffer;
    const iv = combined.slice(16, 16 + IV_LENGTH).buffer.slice(0) as ArrayBuffer;
    const encrypted = combined.slice(16 + IV_LENGTH).buffer.slice(0) as ArrayBuffer;

    const key = await deriveKeyFromPassword(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      encrypted
    );

    return { ok: true, data: decrypted };
  } catch {
    return { ok: false, error: 'Decryption failed. Wrong password or corrupted file.' };
  }
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length = 32): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => charset[v % charset.length]).join('');
}
