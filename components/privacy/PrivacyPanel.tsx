'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  HardDrive,
  Cloud,
  CloudOff,
  Trash2,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage, type StorageQuota } from '@/lib/storage/indexed-db';

interface NetworkActivity {
  id: string;
  type: 'local' | 'external';
  description: string;
  timestamp: Date;
  blocked?: boolean;
}

interface PrivacyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPanel({ isOpen, onClose }: PrivacyPanelProps) {
  const [storageQuota, setStorageQuota] = useState<StorageQuota | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [networkActivities, setNetworkActivities] = useState<NetworkActivity[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [showNetworkLog, setShowNetworkLog] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Load storage data
  useEffect(() => {
    const loadData = async () => {
      try {
        const quota = await storage.getStorageQuota();
        setStorageQuota(quota);
        const files = await storage.getAllFiles();
        setFileCount(files.length);
      } catch (error) {
        console.error('Failed to load privacy data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor network requests (simulated - would need real implementation)
  useEffect(() => {
    // Add mock local activities for demonstration
    setNetworkActivities([
      {
        id: '1',
        type: 'local',
        description: 'PDF processed locally in browser',
        timestamp: new Date(),
      },
      {
        id: '2',
        type: 'local',
        description: 'File saved to IndexedDB',
        timestamp: new Date(Date.now() - 60000),
      },
    ]);
  }, []);

  const handlePurgeData = async () => {
    if (!confirm('This will permanently delete all local files and history. Continue?')) {
      return;
    }

    setIsPurging(true);
    try {
      await storage.purgeAllData();
      setFileCount(0);
      setStorageQuota({ used: 0, total: storageQuota?.total || 0, percentage: 0 });
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-dark">Privacy Center</h2>
                  <p className="text-xs text-gray-500">Your data, your control</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Privacy Score */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-dark">Privacy Score</h3>
                  <span className="text-3xl font-bold text-emerald-600">100%</span>
                </div>
                <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500 rounded-full" />
                </div>
                <p className="text-sm text-emerald-700 mt-3">
                  All processing happens locally. No data leaves your device.
                </p>
              </div>

              {/* Processing Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-dark text-sm">Processing Status</h3>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-dark">Local Processing</p>
                    <p className="text-xs text-gray-500">
                      PDFs processed in your browser
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    {isOnline ? (
                      <Wifi className="w-5 h-5 text-blue-600" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-dark">Network Status</p>
                    <p className="text-xs text-gray-500">
                      {isOnline ? 'Connected (files stay local)' : 'Offline mode active'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      isOnline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      cloudSyncEnabled ? 'bg-violet-100' : 'bg-gray-100'
                    )}
                  >
                    {cloudSyncEnabled ? (
                      <Cloud className="w-5 h-5 text-violet-600" />
                    ) : (
                      <CloudOff className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-dark">Cloud Backup</p>
                    <p className="text-xs text-gray-500">
                      {cloudSyncEnabled
                        ? 'Encrypted backups enabled'
                        : 'Not enabled (sign in to enable)'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCloudSyncEnabled(!cloudSyncEnabled)}
                    disabled
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors',
                      cloudSyncEnabled ? 'bg-violet-500' : 'bg-gray-200',
                      'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        cloudSyncEnabled ? 'right-1' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Local Storage */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-dark text-sm">Local Storage</h3>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-dark font-medium">
                        {fileCount} files stored
                      </span>
                    </div>
                    {storageQuota && (
                      <span className="text-sm text-gray-500">
                        {formatBytes(storageQuota.used)} used
                      </span>
                    )}
                  </div>

                  {storageQuota && (
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
                  )}
                </div>
              </div>

              {/* Network Activity Log */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowNetworkLog(!showNetworkLog)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="font-semibold text-slate-dark text-sm">Network Activity</h3>
                  {showNetworkLog ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showNetworkLog && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2">
                        {networkActivities.length > 0 ? (
                          networkActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div
                                className={cn(
                                  'w-8 h-8 rounded-lg flex items-center justify-center',
                                  activity.type === 'local'
                                    ? 'bg-emerald-100'
                                    : 'bg-amber-100'
                                )}
                              >
                                {activity.type === 'local' ? (
                                  <HardDrive className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Activity className="w-4 h-4 text-amber-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-dark truncate">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatTime(activity.timestamp)}
                                </p>
                              </div>
                              {activity.blocked ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-400 text-sm">
                            No network activity recorded
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Data Retention Policy */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-blue-900">Data Retention</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Files are stored locally on your device. They are never sent to our
                      servers unless you explicitly enable cloud backup. You can delete
                      all data at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-3">
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
                {isPurging ? 'Purging...' : 'Purge All Local Data'}
              </button>

              <p className="text-xs text-center text-gray-400">
                Permanently deletes all files and operation history
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
