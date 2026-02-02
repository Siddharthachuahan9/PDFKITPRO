'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Edit3,
  Shield,
  Zap,
  ChevronDown,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
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
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools';
import type { ToolCategory } from '@/types';

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
  Layers,
  Edit3,
  Shield,
  Zap,
};

const CATEGORY_ICONS: Record<ToolCategory, React.ComponentType<{ className?: string }>> = {
  essentials: Layers,
  edit: Edit3,
  security: Shield,
  advanced: Zap,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<ToolCategory[]>([
    'essentials',
  ]);

  const toggleCategory = (category: ToolCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getToolIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon || FileText;
  };

  const categories = Object.entries(TOOL_CATEGORIES) as [
    ToolCategory,
    { label: string; icon: string }
  ][];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100',
          'shadow-soft z-50 flex flex-col',
          'lg:translate-x-0 lg:static lg:shadow-none'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-dark">PDFKit Pro</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
          {/* Home link */}
          <div className="px-3 mb-4">
            <Link
              href="/dashboard"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                pathname === '/dashboard'
                  ? 'bg-privacy-teal/10 text-privacy-teal'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* Tool categories */}
          <div className="px-3 space-y-1">
            {categories.map(([key, { label }]) => {
              const CategoryIcon = CATEGORY_ICONS[key];
              const isExpanded = expandedCategories.includes(key);
              const categoryTools = TOOLS.filter((t) => t.category === key);

              return (
                <div key={key}>
                  <button
                    onClick={() => toggleCategory(key)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl',
                      'text-gray-600 hover:bg-gray-50 transition-all duration-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="py-1 pl-4">
                          {categoryTools.map((tool) => {
                            const ToolIcon = getToolIcon(tool.icon);
                            const isActive = pathname === `/tools/${tool.slug}`;

                            return (
                              <Link
                                key={tool.slug}
                                href={`/tools/${tool.slug}`}
                                onClick={onClose}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2 rounded-lg',
                                  'transition-all duration-150 text-sm',
                                  isActive
                                    ? 'bg-privacy-teal/10 text-privacy-teal'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                )}
                              >
                                <ToolIcon className="w-4 h-4" />
                                <span>{tool.name}</span>
                                {tool.isPro && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500 ml-auto" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer links */}
        <div className="border-t border-gray-100 p-3 space-y-1">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            href="/help"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5 text-gray-600" />
    </button>
  );
}
