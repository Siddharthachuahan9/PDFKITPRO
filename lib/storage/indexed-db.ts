/**
 * IndexedDB Storage Engine for PDFKit Pro
 * Local-first file storage with operation history
 */

const DB_NAME = 'pdfkit-pro';
const DB_VERSION = 1;

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

interface OperationLog {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  inputFiles: string[];
  outputFiles: string[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  progress?: number;
  metadata?: Record<string, unknown>;
}

interface StorageQuota {
  used: number;
  total: number;
  percentage: number;
}

class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Files store
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id' });
          filesStore.createIndex('name', 'name', { unique: false });
          filesStore.createIndex('createdAt', 'createdAt', { unique: false });
          filesStore.createIndex('type', 'type', { unique: false });
        }

        // Operations log store
        if (!db.objectStoreNames.contains('operations')) {
          const opsStore = db.createObjectStore('operations', { keyPath: 'id' });
          opsStore.createIndex('status', 'status', { unique: false });
          opsStore.createIndex('startedAt', 'startedAt', { unique: false });
          opsStore.createIndex('type', 'type', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  private async ensureDb(): Promise<IDBDatabase> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }

  // File Operations
  async saveFile(file: File, id?: string): Promise<StoredFile> {
    const db = await this.ensureDb();
    const fileId = id || crypto.randomUUID();
    const buffer = await file.arrayBuffer();

    const storedFile: StoredFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: buffer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const request = store.put(storedFile);

      request.onsuccess = () => resolve(storedFile);
      request.onerror = () => reject(request.error);
    });
  }

  async saveArrayBuffer(
    buffer: ArrayBuffer,
    name: string,
    type: string,
    id?: string
  ): Promise<StoredFile> {
    const db = await this.ensureDb();
    const fileId = id || crypto.randomUUID();

    const storedFile: StoredFile = {
      id: fileId,
      name,
      type,
      size: buffer.byteLength,
      data: buffer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const request = store.put(storedFile);

      request.onsuccess = () => resolve(storedFile);
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(id: string): Promise<StoredFile | null> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFiles(): Promise<StoredFile[]> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const request = store.getAll();

      request.onsuccess = () => {
        const files = request.result.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentFiles(limit: number = 10): Promise<StoredFile[]> {
    const files = await this.getAllFiles();
    return files.slice(0, limit);
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllFiles(): Promise<void> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Operation Log
  async logOperation(operation: Omit<OperationLog, 'id'>): Promise<OperationLog> {
    const db = await this.ensureDb();
    const op: OperationLog = {
      ...operation,
      id: crypto.randomUUID(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('operations', 'readwrite');
      const store = tx.objectStore('operations');
      const request = store.put(op);

      request.onsuccess = () => resolve(op);
      request.onerror = () => reject(request.error);
    });
  }

  async updateOperation(id: string, updates: Partial<OperationLog>): Promise<void> {
    const db = await this.ensureDb();
    const existing = await this.getOperation(id);
    if (!existing) throw new Error('Operation not found');

    const updated = { ...existing, ...updates };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('operations', 'readwrite');
      const store = tx.objectStore('operations');
      const request = store.put(updated);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOperation(id: string): Promise<OperationLog | null> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('operations', 'readonly');
      const store = tx.objectStore('operations');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentOperations(limit: number = 20): Promise<OperationLog[]> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('operations', 'readonly');
      const store = tx.objectStore('operations');
      const request = store.getAll();

      request.onsuccess = () => {
        const ops = request.result
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, limit);
        resolve(ops);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearOperationHistory(): Promise<void> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('operations', 'readwrite');
      const store = tx.objectStore('operations');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings
  async setSetting(key: string, value: unknown): Promise<void> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting<T>(key: string): Promise<T | null> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  // Storage Quota
  async getStorageQuota(): Promise<StorageQuota> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const total = estimate.quota || 0;
      return {
        used,
        total,
        percentage: total > 0 ? (used / total) * 100 : 0,
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  }

  // Purge all data
  async purgeAllData(): Promise<void> {
    await this.clearAllFiles();
    await this.clearOperationHistory();

    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const storage = new IndexedDBStorage();

export type { StoredFile, OperationLog, StorageQuota };
