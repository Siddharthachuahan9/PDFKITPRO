'use client';

import Link from 'next/link';
import { Zap, FileUp, Merge, Scissors, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  isCollapsed?: boolean;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Merge,
    label: 'Merge',
    href: '/tools/merge',
    color: 'text-trust-blue bg-trust-blue/10 hover:bg-trust-blue/20',
  },
  {
    icon: Scissors,
    label: 'Split',
    href: '/tools/split',
    color: 'text-violet-500 bg-violet-50 hover:bg-violet-100',
  },
  {
    icon: Minimize2,
    label: 'Compress',
    href: '/tools/compress',
    color: 'text-amber-500 bg-amber-50 hover:bg-amber-100',
  },
  {
    icon: FileUp,
    label: 'Convert',
    href: '/tools/convert',
    color: 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100',
  },
];

export default function QuickActions({ isCollapsed }: QuickActionsProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-100/50">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl',
              'transition-all duration-200',
              action.color
            )}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
