'use client';

import { Crown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanType } from '@/types';

interface UserCardProps {
  email?: string;
  name?: string;
  plan: PlanType;
  isCollapsed?: boolean;
}

const PLAN_BADGES: Record<PlanType, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-gray-100 text-gray-600' },
  pro: { label: 'Pro', color: 'bg-amber-100 text-amber-700' },
  business: { label: 'Business', color: 'bg-violet-100 text-violet-700' },
};

export default function UserCard({ email, name, plan, isCollapsed }: UserCardProps) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : email
    ? email[0].toUpperCase()
    : 'U';

  const badge = PLAN_BADGES[plan];

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-100/50">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-dark truncate">
            {name || 'Welcome'}
          </p>
          <p className="text-xs text-gray-500 truncate">{email || 'Guest user'}</p>
        </div>

        {/* Plan badge */}
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex-shrink-0', badge.color)}>
          {plan !== 'free' && <Crown className="w-3 h-3 inline mr-1" />}
          {badge.label}
        </span>
      </div>
    </div>
  );
}
