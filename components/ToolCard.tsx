'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Crown,
  Merge,
  Minimize2,
  Image,
  Scissors,
  FileText,
  Images,
  Type,
  PenTool,
  Crop,
  LayoutGrid,
  Droplet,
  Hash,
  Lock,
  Unlock,
  EyeOff,
  FileX,
  GitCompare,
  MessageSquare,
  ScanText,
  Code,
  Globe,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool, ToolStatus, PlanType } from '@/types';
import { getToolStatus, canAccessTool } from '@/lib/features';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Merge,
  Minimize2,
  Image,
  Scissors,
  FileText,
  Images,
  Type,
  PenTool,
  Crop,
  LayoutGrid,
  Droplet,
  Hash,
  Lock,
  Unlock,
  EyeOff,
  FileX,
  GitCompare,
  MessageSquare,
  ScanText,
  Code,
  Globe,
};

// Status badges
const STATUS_CONFIG: Record<
  ToolStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; colors: string }
> = {
  ready: { label: '', icon: ArrowRight, colors: '' },
  beta: {
    label: 'Beta',
    icon: Sparkles,
    colors: 'bg-violet-50 text-violet-600 border-violet-200',
  },
  pro: {
    label: 'Pro',
    icon: Crown,
    colors: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  soon: {
    label: 'Preview',
    icon: Zap,
    colors: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

interface ToolCardProps {
  tool: Tool;
  index?: number;
  userPlan?: PlanType;
  variant?: 'default' | 'featured';
  onUpgradeClick?: () => void;
}

export default function ToolCard({
  tool,
  index = 0,
  userPlan = 'free',
  variant = 'default',
  onUpgradeClick,
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = ICON_MAP[tool.icon] || FileText;
  const effectiveStatus = getToolStatus(userPlan, tool);
  const isAccessible = canAccessTool(userPlan, tool);
  const statusConfig = STATUS_CONFIG[effectiveStatus];
  const isFeatured = variant === 'featured';

  // For "soon" status, show preview mode
  const isSoon = effectiveStatus === 'soon';
  const isLocked = effectiveStatus === 'pro' && userPlan === 'free';

  const handleClick = (e: React.MouseEvent) => {
    if (isSoon) {
      e.preventDefault();
      return;
    }
    if (isLocked && onUpgradeClick) {
      e.preventDefault();
      onUpgradeClick();
    }
  };

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-white/80 backdrop-blur-sm',
        'border border-gray-100/80',
        'transition-all duration-200',
        isFeatured ? 'p-6' : 'p-5',
        !isSoon && 'hover:shadow-glass hover:-translate-y-1 hover:border-privacy-teal/30',
        isSoon && 'opacity-80 cursor-default',
        isLocked && 'cursor-pointer'
      )}
    >
      {/* Gradient accent line */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          'bg-gradient-to-r from-trust-blue via-privacy-teal to-trust-blue',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isSoon && 'opacity-30 group-hover:opacity-30'
        )}
      />

      {/* Icon glow effect */}
      <motion.div
        animate={{ scale: isHovered && !isSoon ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
          'bg-gradient-to-br from-trust-blue/10 to-privacy-teal/10',
          !isSoon && 'group-hover:from-trust-blue/20 group-hover:to-privacy-teal/20',
          'transition-colors duration-200',
          isFeatured && 'w-14 h-14'
        )}
      >
        <Icon
          className={cn(
            'text-privacy-teal transition-all duration-200',
            isFeatured ? 'w-7 h-7' : 'w-6 h-6',
            !isSoon && 'group-hover:scale-110',
            isSoon && 'text-gray-400'
          )}
        />
        {/* Glow */}
        {isHovered && !isSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute inset-0 rounded-xl bg-privacy-teal/20 blur-xl"
          />
        )}
      </motion.div>

      {/* Status badge */}
      {effectiveStatus !== 'ready' && (
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full',
              'text-xs font-medium border',
              statusConfig.colors
            )}
          >
            <statusConfig.icon className="w-3 h-3" />
            {statusConfig.label}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={cn(isSoon && 'opacity-70')}>
        <h3
          className={cn(
            'font-semibold text-slate-dark transition-colors',
            !isSoon && 'group-hover:text-privacy-teal',
            isFeatured && 'text-lg'
          )}
        >
          {tool.name}
        </h3>
        <p
          className={cn(
            'text-gray-500 mt-1.5 line-clamp-2',
            isFeatured ? 'text-sm' : 'text-sm'
          )}
        >
          {tool.description}
        </p>
      </div>

      {/* Action line */}
      <div className="mt-4 pt-3 border-t border-gray-100/50">
        {isSoon ? (
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-600">Preview Mode</span>
            <span className="mx-1">·</span>
            <span>Join Pro for early access</span>
          </div>
        ) : isLocked ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 font-medium">
              Unlock with Pro
            </span>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 group-hover:text-privacy-teal transition-colors">
              Click to open
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-privacy-teal group-hover:translate-x-1 transition-all" />
          </div>
        )}
      </div>

      {/* Blur overlay for "soon" status */}
      {isSoon && (
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );

  if (isSoon) {
    return CardContent;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={handleClick}
      className="block"
    >
      {CardContent}
    </Link>
  );
}
