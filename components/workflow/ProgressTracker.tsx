'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  Download,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type JobStatus = 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface JobStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  message?: string;
}

interface ProgressTrackerProps {
  status: JobStatus;
  progress: number; // 0-100
  steps?: JobStep[];
  fileName?: string;
  error?: string;
  onRetry?: () => void;
  onDownload?: () => void;
  onCancel?: () => void;
  className?: string;
}

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  pending: {
    label: 'Waiting',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    icon: FileText,
  },
  validating: {
    label: 'Validating',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Loader2,
  },
  processing: {
    label: 'Processing',
    color: 'text-privacy-teal',
    bgColor: 'bg-privacy-teal/10',
    icon: Loader2,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: AlertCircle,
  },
};

export default function ProgressTracker({
  status,
  progress,
  steps,
  fileName,
  error,
  onRetry,
  onDownload,
  onCancel,
  className,
}: ProgressTrackerProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const isActive = status === 'validating' || status === 'processing';

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bgColor)}>
              <Icon
                className={cn('w-5 h-5', config.color, isActive && 'animate-spin')}
              />
            </div>
            <div>
              <p className="font-semibold text-slate-dark">{config.label}</p>
              {fileName && (
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{fileName}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isActive && onCancel && (
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
            {status === 'failed' && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            )}
            {status === 'completed' && onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-privacy-teal hover:bg-privacy-teal/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-medium text-slate-dark">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              status === 'failed'
                ? 'bg-red-500'
                : status === 'completed'
                ? 'bg-emerald-500'
                : 'bg-privacy-teal'
            )}
          />
        </div>
      </div>

      {/* Steps Timeline */}
      {steps && steps.length > 0 && (
        <div className="px-4 pb-4">
          <div className="space-y-3 mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      step.status === 'completed'
                        ? 'bg-emerald-100'
                        : step.status === 'active'
                        ? 'bg-privacy-teal/10'
                        : step.status === 'error'
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                    )}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-4 h-4 text-privacy-teal animate-spin" />
                    ) : step.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-0.5 h-6 mt-1',
                        step.status === 'completed' ? 'bg-emerald-200' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      step.status === 'completed'
                        ? 'text-emerald-700'
                        : step.status === 'active'
                        ? 'text-privacy-teal'
                        : step.status === 'error'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.message && (
                    <p className="text-xs text-gray-500 mt-0.5">{step.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
