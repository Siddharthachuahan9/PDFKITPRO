'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Merge,
  Scissors,
  Image,
  Lock,
  Pen,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Shield,
  HardDrive,
  Cloud,
  CloudOff,
  Trash2,
  AlertCircle,
  CheckCircle,
  Folder,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage, type StoredFile, type StorageQuota } from '@/lib/storage/indexed-db';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const TOOL_SECTIONS = [
  {
    title: 'Transform',
    tools: [
      { name: 'Merge PDF', slug: 'merge', icon: Merge },
      { name: 'Split PDF', slug: 'split', icon: Scissors },
      { name: 'Compress', slug: 'compress', icon: Minimize2 },
    ],
  },
  {
    title: 'Convert',
    tools: [
      { name: 'PDF to Image', slug: 'pdf-to-jpg', icon: Image },
      { name: 'Image to PDF', slug: 'jpg-to-pdf', icon: FileText },
    ],
  },
  {
    title: 'Edit',
    tools: [
      { name: 'Add Text', slug: 'add-text', icon: Pen },
      { name: 'Encrypt', slug: 'encrypt', icon: Lock },
    ],
  },
];

export default function Sidebar({ isCollapsed = false, onToggle, className }: SidebarProps) {
  const pathname = usePathname();
  const [recentFiles, setRecentFiles] = useState<StoredFile[]>([]);
  const [storageQuota, setStorageQuota] = useState<StorageQuota | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Transform']));

  // Load recent files and storage quota
  useEffect(() => {
    const loadData = async () => {
      try {
        const files = await storage.getRecentFiles(5);
        setRecentFiles(files);
        const quota = await storage.getStorageQuota();
        setStorageQuota(quota);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      }
    };

    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-gray-200/50',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-[280px]',
        className
      )}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-3 border-b border-gray-100">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tool Sections */}
        <nav className="p-3">
          {TOOL_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
                >
                  <span>{section.title}</span>
                  <ChevronRight
                    className={cn(
                      'w-3.5 h-3.5 transition-transform',
                      expandedSections.has(section.title) && 'rotate-90'
                    )}
                  />
                </button>
              )}

              <AnimatePresence>
                {(isCollapsed || expandedSections.has(section.title)) && (
                  <motion.div
                    initial={!isCollapsed ? { height: 0, opacity: 0 } : false}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 mt-1"
                  >
                    {section.tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname === `/tools/${tool.slug}`;

                      return (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                            'text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-privacy-teal/10 text-privacy-teal'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-slate-dark',
                            isCollapsed && 'justify-center'
                          )}
                          title={isCollapsed ? tool.name : undefined}
                        >
                          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                          {!isCollapsed && <span>{tool.name}</span>}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Recent Files */}
        {!isCollapsed && recentFiles.length > 0 && (
          <div className="px-3 py-4 border-t border-gray-100">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recent Files
              </span>
            </div>

            <div className="space-y-1">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-dark truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(file.size)} · {formatDate(file.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Status Footer */}
      <div className={cn(
        'border-t border-gray-100 p-3',
        isCollapsed && 'flex flex-col items-center'
      )}>
        {/* Privacy Indicators */}
        <div className={cn(
          'space-y-2',
          isCollapsed && 'flex flex-col items-center gap-2'
        )}>
          {!isCollapsed ? (
            <>
              {/* Local Processing */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-50">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">
                  Local Processing Active
                </span>
              </div>

              {/* Cloud Sync Status */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50">
                <CloudOff className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Cloud Sync Off
                </span>
              </div>

              {/* Storage Usage */}
              {storageQuota && (
                <div className="px-2 py-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Storage</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {formatBytes(storageQuota.used)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        storageQuota.percentage > 80
                          ? 'bg-amber-500'
                          : storageQuota.percentage > 90
                          ? 'bg-red-500'
                          : 'bg-privacy-teal'
                      )}
                      style={{ width: `${Math.min(storageQuota.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Settings Link */}
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-dark transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
            </>
          ) : (
            <>
              <div className="p-2 rounded-lg bg-emerald-50" title="Local Processing Active">
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="p-2 rounded-lg bg-gray-50" title="Cloud Sync Off">
                <CloudOff className="w-4 h-4 text-gray-400" />
              </div>
              <Link
                href="/settings"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
