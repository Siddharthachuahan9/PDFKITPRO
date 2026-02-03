'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  HardDrive,
  Cloud,
  Trash2,
  LogOut,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { storage, type StorageQuota } from '@/lib/storage/indexed-db';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [storageQuota, setStorageQuota] = useState<StorageQuota | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [isPurging, setIsPurging] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const quota = await storage.getStorageQuota();
        setStorageQuota(quota);
        const files = await storage.getAllFiles();
        setFileCount(files.length);
      } catch (error) {
        console.error('Failed to load storage data:', error);
      }
    };

    loadStorageData();
  }, []);

  const handlePurgeData = async () => {
    if (!confirm('This will permanently delete all local files and operation history. Continue?')) {
      return;
    }

    setIsPurging(true);
    try {
      await storage.purgeAllData();
      setFileCount(0);
      setStorageQuota((prev) => prev ? { ...prev, used: 0, percentage: 0 } : null);
    } catch (error) {
      console.error('Failed to purge data:', error);
    } finally {
      setIsPurging(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <WorkspaceLayout showOnboarding={false}>
      <div className="h-full overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-dark mb-2">Settings</h1>
            <p className="text-gray-500">Manage your account and preferences</p>
          </motion.div>

          <div className="space-y-6">
            {/* Account Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-slate-dark flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Account
                </h2>
              </div>

              <div className="p-4">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-dark">{user.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="font-medium text-slate-dark mb-1">Not signed in</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Sign in to access cloud backup and sync
                    </p>
                    <a
                      href="/auth/signin"
                      className="inline-block px-6 py-2.5 rounded-xl bg-privacy-teal text-white font-medium hover:bg-privacy-teal/90 transition-colors"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-slate-dark flex items-center gap-2">
                  <Sun className="w-5 h-5 text-gray-400" />
                  Appearance
                </h2>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-dark">Theme</p>
                    <p className="text-sm text-gray-500">Choose your preferred color scheme</p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
                          theme === t
                            ? 'bg-white text-slate-dark shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Security Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-slate-dark flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  Privacy & Security
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-dark">Local Processing</p>
                    <p className="text-sm text-gray-500">Files are processed on your device</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                    Always On
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-dark">Cloud Backup</p>
                    <p className="text-sm text-gray-500">Encrypted backup to cloud storage</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                    {isAuthenticated ? 'Available' : 'Sign in required'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Storage Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-slate-dark flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-gray-400" />
                  Local Storage
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {storageQuota && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Storage used</span>
                      <span className="text-sm font-medium text-slate-dark">
                        {formatBytes(storageQuota.used)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          storageQuota.percentage > 90
                            ? 'bg-red-500'
                            : storageQuota.percentage > 70
                            ? 'bg-amber-500'
                            : 'bg-privacy-teal'
                        )}
                        style={{ width: `${Math.min(storageQuota.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-dark">Files stored locally</p>
                    <p className="text-sm text-gray-500">PDFs and operation history</p>
                  </div>
                  <span className="text-sm font-medium text-slate-dark">{fileCount} files</span>
                </div>

                <button
                  onClick={handlePurgeData}
                  disabled={isPurging || fileCount === 0}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
                    'text-sm font-medium transition-colors',
                    isPurging || fileCount === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  )}
                >
                  {isPurging ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isPurging ? 'Purging...' : 'Clear All Local Data'}
                </button>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-slate-dark">About PDFKit Pro</h2>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Version</span>
                  <span className="text-sm font-medium text-slate-dark">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Build</span>
                  <span className="text-sm font-medium text-slate-dark">Production</span>
                </div>
                <a
                  href="/privacy"
                  className="flex items-center justify-between py-2 text-privacy-teal hover:underline"
                >
                  <span className="text-sm font-medium">Privacy Policy</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
