'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Search, Command, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import PrivacyBadge from './PrivacyBadge';
import SearchBar from './SearchBar';

interface TopBarProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
}

export default function TopBar({ onMenuClick, showSearch = true }: TopBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        'bg-white/80 backdrop-blur-xl',
        'border-b border-gray-100/50'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center shadow-md"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-slate-dark hidden sm:block">
                PDFKit Pro
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <SearchBar />
            </div>
          )}

          {/* Right: Privacy Badge */}
          <div className="flex items-center gap-3">
            <PrivacyBadge />
          </div>
        </div>
      </div>
    </header>
  );
}
