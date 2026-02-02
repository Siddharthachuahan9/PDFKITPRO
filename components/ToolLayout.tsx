'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function ToolLayout({
  children,
  title,
  description,
  className,
}: ToolLayoutProps) {
  return (
    <div className={cn('h-full', className)}>
      {/* Tool header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-dark">
          {title}
        </h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </motion.div>

      {/* Content */}
      {children}
    </div>
  );
}

interface ToolColumnsProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function ToolColumns({ left, center, right, className }: ToolColumnsProps) {
  return (
    <div
      className={cn(
        'grid gap-4 lg:gap-6 pb-24',
        right
          ? 'lg:grid-cols-[280px_1fr_280px]'
          : 'lg:grid-cols-[280px_1fr]',
        className
      )}
    >
      {/* Left panel - Files */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="order-2 lg:order-1"
      >
        <div className="bg-white rounded-2xl shadow-soft p-4 lg:sticky lg:top-24">
          {left}
        </div>
      </motion.div>

      {/* Center panel - Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="order-1 lg:order-2"
      >
        <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 min-h-[400px]">
          {center}
        </div>
      </motion.div>

      {/* Right panel - Settings */}
      {right && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3"
        >
          <div className="bg-white rounded-2xl shadow-soft p-4 lg:sticky lg:top-24">
            {right}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ title, action, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between mb-4 pb-3 border-b border-gray-100',
        className
      )}
    >
      <h3 className="font-semibold text-slate-dark">{title}</h3>
      {action}
    </div>
  );
}
