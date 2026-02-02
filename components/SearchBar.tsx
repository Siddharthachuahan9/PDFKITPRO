'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchTools } from '@/lib/tools';
import type { Tool } from '@/types';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTools(query).slice(0, 6);
  }, [query]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation with arrow keys
  useEffect(() => {
    if (!isOpen || results.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          router.push(`/tools/${selected.slug}`);
          setIsOpen(false);
          setQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelect = (tool: Tool) => {
    router.push(`/tools/${tool.slug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search tools..."
          className={cn(
            'w-full pl-12 pr-20 py-3 rounded-xl',
            'bg-white border border-gray-200',
            'text-slate-dark placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-privacy-teal/20 focus:border-privacy-teal',
            'transition-all duration-200'
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-gray-100 text-xs font-medium">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-white rounded-xl shadow-glass border border-gray-100',
              'overflow-hidden'
            )}
          >
            <ul className="py-2">
              {results.map((tool, index) => (
                <li key={tool.slug}>
                  <button
                    onClick={() => handleSelect(tool)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                      'transition-colors',
                      index === selectedIndex
                        ? 'bg-privacy-teal/10 text-privacy-teal'
                        : 'text-slate-dark hover:bg-gray-50'
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">
                        {tool.description}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
