'use client';

import { BarChart3, FileText, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanType } from '@/types';

interface UsageMeterProps {
  isCollapsed?: boolean;
  plan: PlanType;
  usage?: {
    filesProcessed: number;
    storageUsed: number; // in MB
    operationsToday: number;
  };
}

const PLAN_LIMITS: Record<PlanType, { files: number; storage: number; daily: number }> = {
  free: { files: 50, storage: 100, daily: 10 },
  pro: { files: 500, storage: 1000, daily: 100 },
  business: { files: -1, storage: 10000, daily: -1 }, // -1 = unlimited
};

export default function UsageMeter({
  isCollapsed,
  plan,
  usage = { filesProcessed: 0, storageUsed: 0, operationsToday: 0 }
}: UsageMeterProps) {
  const limits = PLAN_LIMITS[plan];

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-violet-500" />
        </div>
      </div>
    );
  }

  const metrics = [
    {
      icon: FileText,
      label: 'Files Processed',
      value: usage.filesProcessed,
      limit: limits.files,
      color: 'bg-trust-blue',
    },
    {
      icon: Zap,
      label: 'Operations Today',
      value: usage.operationsToday,
      limit: limits.daily,
      color: 'bg-amber-500',
    },
    {
      icon: TrendingUp,
      label: 'Storage Used',
      value: usage.storageUsed,
      limit: limits.storage,
      unit: 'MB',
      color: 'bg-privacy-teal',
    },
  ];

  return (
    <div className="p-4 border-b border-gray-100/50">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-violet-500" />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Usage
        </h3>
      </div>

      <div className="space-y-3">
        {metrics.map((metric) => {
          const isUnlimited = metric.limit === -1;
          const percentage = isUnlimited ? 0 : Math.min((metric.value / metric.limit) * 100, 100);
          const isNearLimit = percentage > 80;

          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <metric.icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{metric.label}</span>
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isNearLimit && !isUnlimited ? 'text-rose-500' : 'text-gray-500'
                )}>
                  {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
                  {!isUnlimited && ` / ${metric.limit}${metric.unit ? ` ${metric.unit}` : ''}`}
                  {isUnlimited && ' (unlimited)'}
                </span>
              </div>
              {!isUnlimited && (
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isNearLimit ? 'bg-rose-500' : metric.color
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
