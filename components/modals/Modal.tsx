'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  className,
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEscapeKey(onClose, isOpen);

  // Focus close button on open
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className={cn(
              'relative w-full',
              SIZE_CLASSES[size],
              'max-h-[90vh] overflow-y-auto',
              'bg-white rounded-2xl shadow-2xl',
              className
            )}
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  'absolute top-4 right-4 z-10',
                  'p-2 rounded-lg',
                  'text-gray-400 hover:text-gray-600',
                  'hover:bg-gray-100 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-privacy-teal/50'
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Title */}
            {title && (
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 id="modal-title" className="text-xl font-semibold text-slate-dark">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className={cn(!title && 'pt-6')}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
