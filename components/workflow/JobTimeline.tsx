'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileText,
  Merge,
  Scissors,
  Minimize2,
  Image,
  Lock,
  Pen,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage, type OperationLog } from '@/lib/storage/indexed-db';

interface JobTimelineProps {
  className?: string;
  maxItems?: number;
}

const OPERATION_ICONS: Record<string, typeof FileText> = {
  merge: Merge,
  split: Scissors,
  compress: Minimize2,
  'pdf-to-jpg': Image,
  'jpg-to-pdf': FileText,
  encrypt: Lock,
  'add-text': Pen,
};

const STATUS_CONFIG: Record<
  OperationLog['status'],
  { color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  pending: { color: 'text-gray-500', bgColor: 'bg-gray-100', icon: Clock },
  processing: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Loader2 },
  completed: { color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: CheckCircle },
  failed: { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  cancelled: { color: 'text-amber-600', bgColor: 'bg-amber-100', icon: XCircle },
};

export default function JobTimeline({ className, maxItems = 10 }: JobTimelineProps) {
  const [operations, setOperations] = useState<OperationLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOperations = async () => {
      try {
        const ops = await storage.getRecentOperations(maxItems);
        setOperations(ops);
      } catch (error) {
        console.error('Failed to load operations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperations();

    // Refresh periodically
    const interval = setInterval(loadOperations, 5000);
    return () => clearInterval(interval);
  }, [maxItems]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return new Date(date).toLocaleDateString();
  };

  const clearHistory = async () => {
    if (!confirm('Clear all operation history?')) return;
    try {
      await storage.clearOperationHistory();
      setOperations([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  if (loading) {
    return (
      <div className={cn('bg-white rounded-2xl border border-gray-200 p-6', className)}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (operations.length === 0) {
    return (
      <div className={cn('bg-white rounded-2xl border border-gray-200 p-6', className)}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-slate-dark">No Recent Operations</p>
          <p className="text-xs text-gray-500 mt-1">
            Your operation history will appear here
          </p>
        </div>
      </div>
    );
  }

  const displayedOps = isExpanded ? operations : operations.slice(0, 3);

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-slate-dark text-sm">Recent Operations</h3>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {operations.length}
          </span>
        </div>
        {operations.length > 0 && (
          <button
            onClick={clearHistory}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {displayedOps.map((op, index) => {
            const StatusIcon = STATUS_CONFIG[op.status].icon;
            const OpIcon = OPERATION_ICONS[op.type] || FileText;
            const isProcessing = op.status === 'processing';

            return (
              <motion.div
                key={op.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      STATUS_CONFIG[op.status].bgColor
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        'w-4 h-4',
                        STATUS_CONFIG[op.status].color,
                        isProcessing && 'animate-spin'
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <OpIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-slate-dark capitalize">
                        {op.type.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {op.inputFiles.length} file{op.inputFiles.length !== 1 ? 's' : ''}
                      {op.status === 'completed' &&
                        op.outputFiles.length > 0 &&
                        ` → ${op.outputFiles.length} output`}
                    </p>

                    {op.error && (
                      <p className="text-xs text-red-600 mt-1 truncate">{op.error}</p>
                    )}

                    {/* Progress for active jobs */}
                    {isProcessing && op.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${op.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(op.startedAt)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse */}
      {operations.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show {operations.length - 3} more <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
