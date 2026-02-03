'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  Shield,
  User,
  LogOut,
  Settings,
  CreditCard,
  ChevronDown,
  Wifi,
  WifiOff,
  HardDrive,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { searchTools } from '@/lib/tools';
import type { Tool } from '@/types';

interface TopBarProps {
  onSearch?: (results: Tool[]) => void;
  className?: string;
}

export default function TopBar({ onSearch, className }: TopBarProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowUserMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchTools(query);
      setSearchResults(results);
      onSearch?.(results);
    } else {
      setSearchResults([]);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header
      className={cn(
        'h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50',
        'flex items-center justify-between px-4 lg:px-6',
        'sticky top-0 z-50',
        className
      )}
    >
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-dark hidden sm:block">
            PDFKit Pro
          </span>
        </Link>

        {/* System Status Indicators */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              isOnline
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            )}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local</span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-4" ref={searchRef}>
        <div className="relative">
          <button
            onClick={() => setShowSearch(true)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl',
              'bg-gray-50 hover:bg-gray-100 border border-gray-200',
              'text-gray-500 text-sm transition-colors'
            )}
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search tools...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded bg-white border border-gray-200 text-xs text-gray-400">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for PDF tools..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-privacy-teal/20 focus:border-privacy-teal"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.slice(0, 8).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setShowSearch(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-dark">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No tools found for &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Start typing to search...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: User Section */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-xl',
                'hover:bg-gray-100 transition-colors'
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-dark max-w-[120px] truncate">
                {user.name || user.email}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-sm text-slate-dark truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-dark">Settings</span>
                    </Link>
                    <Link
                      href="/billing"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-dark">Billing</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-slate-dark hover:bg-gray-100 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-white bg-privacy-teal hover:bg-privacy-teal/90 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
