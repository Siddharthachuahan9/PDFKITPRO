'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Cloud, CloudOff, Database, Eye, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyStatus {
  isLocal: boolean;
  isEncrypted: boolean;
  cloudEnabled: boolean;
}

interface PrivacyBadgeProps {
  status?: PrivacyStatus;
  className?: string;
}

const defaultStatus: PrivacyStatus = {
  isLocal: true,
  isEncrypted: true,
  cloudEnabled: false,
};

export default function PrivacyBadge({
  status = defaultStatus,
  className,
}: PrivacyBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const privacyItems = [
    {
      icon: status.isLocal ? Check : Eye,
      label: 'Local Processing',
      value: status.isLocal ? 'Active' : 'Inactive',
      description: 'Files processed in your browser',
      status: status.isLocal ? 'active' : 'inactive',
    },
    {
      icon: status.isEncrypted ? Lock : Shield,
      label: 'Encryption',
      value: status.isEncrypted ? 'AES-256' : 'Optional',
      description: 'Military-grade encryption available',
      status: status.isEncrypted ? 'active' : 'neutral',
    },
    {
      icon: status.cloudEnabled ? Cloud : CloudOff,
      label: 'Cloud Storage',
      value: status.cloudEnabled ? 'Enabled' : 'Disabled',
      description: status.cloudEnabled
        ? 'Encrypted cloud backup active'
        : 'Files stay on your device',
      status: status.cloudEnabled ? 'active' : 'neutral',
    },
    {
      icon: Eye,
      label: 'Tracking',
      value: 'None',
      description: 'No analytics, no cookies',
      status: 'active' as const,
    },
    {
      icon: Database,
      label: 'Storage',
      value: 'IndexedDB',
      description: 'Local browser database',
      status: 'active' as const,
    },
  ];

  return (
    <div className={cn('relative', className)}>
      {/* Badge Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-emerald-50 hover:bg-emerald-100',
          'border border-emerald-200/50',
          'transition-colors duration-200'
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm font-medium text-emerald-700">
          Local Processing
        </span>
        <Shield className="w-4 h-4 text-emerald-600" />
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2 z-50',
              'w-80 p-4 rounded-2xl',
              'bg-white/95 backdrop-blur-xl',
              'border border-gray-100',
              'shadow-xl shadow-gray-200/50'
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-dark">Privacy Status</h3>
                <p className="text-xs text-gray-500">Your data stays protected</p>
              </div>
            </div>

            {/* Privacy Items */}
            <div className="space-y-3">
              {privacyItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      item.status === 'active'
                        ? 'bg-emerald-100 text-emerald-600'
                        : item.status === 'inactive'
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-50 text-blue-500'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-dark">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'inactive'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-50 text-blue-600'
                        )}
                      >
                        {item.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                PDFKit Pro respects your privacy by default
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
