'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanType } from '@/types';
import UserCard from './UserCard';
import PrivacyPanel from './PrivacyPanel';
import QuickActions from './QuickActions';
import UsageMeter from './UsageMeter';
import TipBox from './TipBox';

interface ContextRailProps {
  user?: {
    email?: string;
    name?: string;
  };
  plan: PlanType;
  isAuthenticated?: boolean;
  usage?: {
    filesProcessed: number;
    storageUsed: number;
    operationsToday: number;
  };
  className?: string;
}

export default function ContextRail({
  user,
  plan,
  isAuthenticated,
  usage,
  className,
}: ContextRailProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cloudEnabled, setCloudEnabled] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'hidden lg:flex flex-col',
        'bg-white/50 backdrop-blur-xl',
        'border-r border-gray-100/50',
        'h-screen sticky top-0',
        'overflow-hidden',
        className
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -right-3 top-6 z-10',
          'w-6 h-6 rounded-full',
          'bg-white border border-gray-200 shadow-sm',
          'flex items-center justify-center',
          'hover:bg-gray-50 transition-colors'
        )}
        aria-label={isCollapsed ? 'Expand rail' : 'Collapse rail'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* User Card */}
        <UserCard
          email={user?.email}
          name={user?.name}
          plan={plan}
          isCollapsed={isCollapsed}
          isAuthenticated={isAuthenticated}
        />

        {/* Privacy Panel */}
        <PrivacyPanel
          isCollapsed={isCollapsed}
          cloudEnabled={cloudEnabled}
          onToggleCloud={() => setCloudEnabled(!cloudEnabled)}
        />

        {/* Quick Actions */}
        <QuickActions isCollapsed={isCollapsed} />

        {/* Usage Meter */}
        <UsageMeter
          isCollapsed={isCollapsed}
          plan={plan}
          usage={usage}
        />

        {/* Tip Box */}
        <TipBox isCollapsed={isCollapsed} />
      </div>

      {/* Bottom branding when collapsed */}
      {isCollapsed && (
        <div className="p-3 border-t border-gray-100/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
