'use client';

import { Download, RefreshCw, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessingStatus } from '@/types';

interface ActionBarProps {
  status: ProcessingStatus;
  onProcess: () => void;
  onReset: () => void;
  onDownload: () => void;
  processLabel?: string;
  downloadLabel?: string;
  disabled?: boolean;
  className?: string;
}

export default function ActionBar({
  status,
  onProcess,
  onReset,
  onDownload,
  processLabel = 'Process',
  downloadLabel = 'Download',
  disabled = false,
  className,
}: ActionBarProps) {
  const isProcessing = status === 'processing' || status === 'loading';
  const isComplete = status === 'complete';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 lg:left-72',
        'bg-white/90 backdrop-blur-md border-t border-gray-100',
        'px-4 py-3 lg:px-6 z-20',
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Reset button */}
        <button
          onClick={onReset}
          disabled={isProcessing}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl',
            'text-gray-600 hover:bg-gray-100 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Main action button */}
        <div className="flex items-center gap-3">
          {isComplete ? (
            <button
              onClick={onDownload}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl',
                'bg-gradient-to-r from-trust-blue to-privacy-teal',
                'text-white font-medium shadow-medium',
                'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                'transition-all duration-200'
              )}
            >
              <Download className="w-4 h-4" />
              {downloadLabel}
            </button>
          ) : (
            <button
              onClick={onProcess}
              disabled={disabled || isProcessing}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl',
                'bg-gradient-to-r from-trust-blue to-privacy-teal',
                'text-white font-medium shadow-medium',
                'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {processLabel}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
