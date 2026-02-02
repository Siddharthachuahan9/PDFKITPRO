'use client';

import Link from 'next/link';
import { Crown, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanType } from '@/types';

interface UserCardProps {
  email?: string;
  name?: string;
  plan: PlanType;
  isCollapsed?: boolean;
  isAuthenticated?: boolean;
}

const PLAN_BADGES: Record<PlanType, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-gray-100 text-gray-600' },
  pro: { label: 'Pro', color: 'bg-amber-100 text-amber-700' },
  business: { label: 'Business', color: 'bg-violet-100 text-violet-700' },
};

export default function UserCard({ email, name, plan, isCollapsed, isAuthenticated }: UserCardProps) {
  const isGuest = !isAuthenticated || !email || email === 'guest@example.com';

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : email && !isGuest
    ? email[0].toUpperCase()
    : 'G';

  const badge = PLAN_BADGES[plan];

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        {isGuest ? (
          <Link
            href="/auth/signin"
            className="w-10 h-10 rounded-xl bg-privacy-teal flex items-center justify-center text-white hover:bg-privacy-teal/90 transition-colors"
          >
            <LogIn className="w-5 h-5" />
          </Link>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        )}
      </div>
    );
  }

  // Guest user - show sign in prompt
  if (isGuest) {
    return (
      <div className="p-4 border-b border-gray-100/50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-slate-dark mb-1">Welcome!</p>
          <p className="text-xs text-gray-500 mb-3">Sign in to save your work</p>
          <Link
            href="/auth/signin"
            className="block w-full py-2.5 px-4 rounded-xl bg-privacy-teal text-white text-sm font-medium hover:bg-privacy-teal/90 transition-colors"
          >
            Sign In
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Free tools work without an account
          </p>
        </div>
      </div>
    );
  }

  // Authenticated user
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
          <p className="text-xs text-gray-500 truncate">{email}</p>
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
