'use client';

import { Shield, Lock, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrivacyMode } from '@/types';

interface PrivacyBarProps {
  mode: PrivacyMode;
  className?: string;
}

const PRIVACY_CONFIG = {
  local: {
    icon: Shield,
    label: 'Local Processing',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
  },
  encrypted: {
    icon: Lock,
    label: 'Encrypted',
    color: 'text-privacy-teal',
    bgColor: 'bg-privacy-teal/10',
    dotColor: 'bg-privacy-teal',
  },
  cloud: {
    icon: Cloud,
    label: 'Cloud Enabled',
    color: 'text-trust-blue',
    bgColor: 'bg-trust-blue/10',
    dotColor: 'bg-trust-blue',
  },
};

export default function PrivacyBar({ mode, className }: PrivacyBarProps) {
  const config = PRIVACY_CONFIG[mode];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full',
        config.bgColor,
        className
      )}
    >
      <span
        className={cn('w-2 h-2 rounded-full animate-pulse', config.dotColor)}
      />
      <Icon className={cn('w-4 h-4', config.color)} />
      <span className={cn('text-sm font-medium', config.color)}>
        {config.label}
      </span>
    </div>
  );
}

export function PrivacyToggle({
  mode,
  onChange,
}: {
  mode: PrivacyMode;
  onChange: (mode: PrivacyMode) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full">
      <button
        onClick={() => onChange('local')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          mode === 'local'
            ? 'bg-white shadow-soft text-emerald-600'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        <Shield className="w-4 h-4" />
        Local
      </button>
      <button
        onClick={() => onChange('cloud')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          mode === 'cloud'
            ? 'bg-white shadow-soft text-trust-blue'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        <Cloud className="w-4 h-4" />
        Cloud
      </button>
    </div>
  );
}
