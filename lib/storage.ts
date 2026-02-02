// ============================================
// PDFKit Pro - IndexedDB Storage Module
// ============================================

import { openDB, type IDBPDatabase } from 'idb';
import type { Result, StoredFile } from '@/types';
import { STORAGE_KEYS } from './constants';

const DB_NAME = 'pdfkit-pro';
const DB_VERSION = 1;
const FILES_STORE = 'files';
const SETTINGS_STORE = 'settings';

type PdfKitDB = IDBPDatabase<{
  files: {
    key: string;
    value: StoredFile;
    indexes: { 'by-created': number };
  };
  settings: {
    key: string;
    value: unknown;
  };
}>;

let dbInstance: PdfKitDB | null = null;

/**
 * Initialize or get database instance
 */
async function getDB(): Promise<PdfKitDB> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<{
    files: {
      key: string;
      value: StoredFile;
      indexes: { 'by-created': number };
    };
    settings: {
      key: string;
      value: unknown;
    };
  }>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Files store
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        const filesStore = db.createObjectStore(FILES_STORE, { keyPath: 'id' });
        filesStore.createIndex('by-created', 'createdAt');
      }
      // Settings store
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE);
      }
    },
  });

  return dbInstance;
}

/**
 * Save a file to storage
 */
export async function saveFile(
  id: string,
  name: string,
  data: ArrayBuffer,
  ttlHours = 24
): Promise<Result<StoredFile>> {
  try {
    const db = await getDB();
    const file: StoredFile = {
      id,
      name,
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlHours * 60 * 60 * 1000,
    };
    await db.put(FILES_STORE, file);
    return { ok: true, data: file };
  } catch {
    return { ok: false, error: 'Failed to save file' };
  }
}

/**
 * Get a file from storage
 */
export async function getFile(id: string): Promise<Result<StoredFile>> {
  try {
    const db = await getDB();
    const file = await db.get(FILES_STORE, id);
    if (!file) {
      return { ok: false, error: 'File not found' };
    }
    if (file.expiresAt < Date.now()) {
      await deleteFile(id);
      return { ok: false, error: 'File has expired' };
    }
    return { ok: true, data: file };
  } catch {
    return { ok: false, error: 'Failed to retrieve file' };
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(id: string): Promise<Result<void>> {
  try {
    const db = await getDB();
    await db.delete(FILES_STORE, id);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: 'Failed to delete file' };
  }
}

/**
 * Get all files (sorted by creation date, newest first)
 */
export async function getAllFiles(): Promise<Result<StoredFile[]>> {
  try {
    const db = await getDB();
    const files = await db.getAllFromIndex(FILES_STORE, 'by-created');
    // Filter out expired files and reverse for newest first
    const validFiles = files
      .filter((f) => f.expiresAt > Date.now())
      .reverse();
    return { ok: true, data: validFiles };
  } catch {
    return { ok: false, error: 'Failed to retrieve files' };
  }
}

/**
 * Clear all files from storage
 */
export async function clearAllFiles(): Promise<Result<void>> {
  try {
    const db = await getDB();
    await db.clear(FILES_STORE);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: 'Failed to clear files' };
  }
}

/**
 * Clean up expired files
 */
export async function cleanupExpiredFiles(): Promise<Result<number>> {
  try {
    const db = await getDB();
    const files = await db.getAll(FILES_STORE);
    const now = Date.now();
    let count = 0;

    for (const file of files) {
      if (file.expiresAt < now) {
        await db.delete(FILES_STORE, file.id);
        count++;
      }
    }

    return { ok: true, data: count };
  } catch {
    return { ok: false, error: 'Failed to cleanup files' };
  }
}

/**
 * Save a setting
 */
export async function saveSetting<T>(key: string, value: T): Promise<Result<void>> {
  try {
    const db = await getDB();
    await db.put(SETTINGS_STORE, value, key);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: 'Failed to save setting' };
  }
}

/**
 * Get a setting
 */
export async function getSetting<T>(key: string): Promise<Result<T | undefined>> {
  try {
    const db = await getDB();
    const value = await db.get(SETTINGS_STORE, key);
    return { ok: true, data: value as T | undefined };
  } catch {
    return { ok: false, error: 'Failed to retrieve setting' };
  }
}

/**
 * Get storage usage estimate
 */
export async function getStorageUsage(): Promise<
  Result<{ used: number; quota: number }>
> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        ok: true,
        data: {
          used: estimate.usage ?? 0,
          quota: estimate.quota ?? 0,
        },
      };
    }
    return { ok: true, data: { used: 0, quota: 0 } };
  } catch {
    return { ok: false, error: 'Failed to estimate storage' };
  }
}
