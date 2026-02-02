'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipBoxProps {
  isCollapsed?: boolean;
}

interface Tip {
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
}

const TIPS: Tip[] = [
  {
    title: 'Privacy First',
    description: 'All PDF processing happens locally in your browser. Your files never touch our servers.',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Press "/" to quickly search for tools. Use Ctrl+Z to undo operations.',
  },
  {
    title: 'Batch Processing',
    description: 'Drag multiple files at once to process them in batch. Great for merging!',
    link: { label: 'Try Merge', href: '/tools/merge' },
  },
  {
    title: 'Offline Mode',
    description: 'PDFKit Pro works offline! Your tools are always available, even without internet.',
  },
  {
    title: 'No Watermarks',
    description: 'Unlike other tools, we never add watermarks to your documents. Your PDFs stay clean.',
  },
  {
    title: 'Secure Storage',
    description: 'Enable cloud backup for AES-256 encrypted storage of your processed files.',
    link: { label: 'Learn More', href: '/privacy' },
  },
];

export default function TipBox({ isCollapsed }: TipBoxProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTip = TIPS[currentTipIndex];

  const nextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
      setIsAnimating(false);
    }, 150);
  };

  // Auto-rotate tips every 30 seconds
  useEffect(() => {
    const interval = setInterval(nextTip, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Pro Tip
          </h3>
        </div>
        <button
          onClick={nextTip}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next tip"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      <div
        className={cn(
          'p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50',
          'transition-opacity duration-150',
          isAnimating && 'opacity-0'
        )}
      >
        <p className="text-sm font-medium text-slate-dark mb-1">
          {currentTip.title}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {currentTip.description}
        </p>
        {currentTip.link && (
          <a
            href={currentTip.link.href}
            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 hover:text-amber-700"
          >
            {currentTip.link.label}
            <ChevronRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Tip indicators */}
      <div className="flex justify-center gap-1 mt-3">
        {TIPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTipIndex(index)}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all duration-200',
              index === currentTipIndex
                ? 'bg-amber-500 w-3'
                : 'bg-gray-200 hover:bg-gray-300'
            )}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
