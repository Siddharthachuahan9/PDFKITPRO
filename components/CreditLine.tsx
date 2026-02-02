'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditLineProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export default function CreditLine({ className, variant = 'default' }: CreditLineProps) {
  if (variant === 'minimal') {
    return (
      <p className={cn('text-xs text-gray-400 text-center', className)}>
        Built with <Heart className="w-3 h-3 inline-block text-rose-400 fill-rose-400" /> by Siddharth
      </p>
    );
  }

  return (
    <footer className={cn('py-8 border-t border-gray-100', className)}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PDFKit Pro. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            Built with{' '}
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />{' '}
            by{' '}
            <span className="font-medium text-slate-dark">Siddharth</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
