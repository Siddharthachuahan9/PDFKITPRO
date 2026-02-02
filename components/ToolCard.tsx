'use client';

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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types';

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

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = ICON_MAP[tool.icon] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          'group block p-5 rounded-2xl bg-white',
          'border border-gray-100 hover:border-privacy-teal/30',
          'shadow-soft hover:shadow-medium',
          'transition-all duration-200 hover:-translate-y-1'
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-trust-blue/10 to-privacy-teal/10',
              'group-hover:from-trust-blue/20 group-hover:to-privacy-teal/20',
              'transition-colors duration-200'
            )}
          >
            <Icon className="w-5 h-5 text-privacy-teal" />
          </div>
          {tool.isPro && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
              <Crown className="w-3 h-3" />
              Pro
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-dark group-hover:text-privacy-teal transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {tool.description}
        </p>
      </Link>
    </motion.div>
  );
}
