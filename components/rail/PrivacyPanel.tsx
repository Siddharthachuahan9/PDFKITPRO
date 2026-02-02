'use client';

import { Shield, Cloud, Eye, Database, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyPanelProps {
  isCollapsed?: boolean;
  cloudEnabled?: boolean;
  onToggleCloud?: () => void;
}

interface PrivacyItem {
  icon: React.ElementType;
  label: string;
  status: 'on' | 'off' | 'none';
  description: string;
}

export default function PrivacyPanel({
  isCollapsed,
  cloudEnabled = false,
  onToggleCloud
}: PrivacyPanelProps) {
  const items: PrivacyItem[] = [
    {
      icon: Shield,
      label: 'Local Processing',
      status: 'on',
      description: 'Files processed in browser',
    },
    {
      icon: Cloud,
      label: 'Cloud Storage',
      status: cloudEnabled ? 'on' : 'off',
      description: cloudEnabled ? 'Encrypted backup enabled' : 'Files stay on device',
    },
    {
      icon: Eye,
      label: 'Tracking',
      status: 'none',
      description: 'No analytics or tracking',
    },
    {
      icon: Database,
      label: 'Local Storage',
      status: 'on',
      description: 'IndexedDB for temp files',
    },
  ];

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-10 h-10 rounded-xl bg-privacy-teal/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-privacy-teal" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-100/50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-privacy-teal" />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Privacy Status
        </h3>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/50 transition-colors"
          >
            <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-dark">{item.label}</p>
              <p className="text-xs text-gray-400 truncate">{item.description}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>

      {onToggleCloud && (
        <button
          onClick={onToggleCloud}
          className={cn(
            'mt-3 w-full py-2 px-3 rounded-lg text-xs font-medium',
            'transition-colors duration-200',
            cloudEnabled
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-privacy-teal/10 text-privacy-teal hover:bg-privacy-teal/20'
          )}
        >
          {cloudEnabled ? 'Disable Cloud Backup' : 'Enable Cloud Backup'}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: 'on' | 'off' | 'none' }) {
  const config = {
    on: { icon: Check, color: 'text-emerald-500 bg-emerald-50', label: 'ON' },
    off: { icon: X, color: 'text-gray-400 bg-gray-100', label: 'OFF' },
    none: { icon: Check, color: 'text-privacy-teal bg-privacy-teal/10', label: 'NONE' },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
