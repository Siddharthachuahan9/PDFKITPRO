'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools';
import { cn } from '@/lib/utils';
import type { ToolCategory } from '@/types';

const CATEGORY_ORDER: ToolCategory[] = ['essentials', 'edit', 'security', 'advanced'];

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const displayedTools = useMemo(() => {
    if (selectedCategory === 'all') return TOOLS;
    return getToolsByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-dark">
          PDF Tools
        </h1>
        <p className="text-gray-500 mt-1">
          Select a tool to get started. All processing happens locally.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <SearchBar />
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            selectedCategory === 'all'
              ? 'bg-privacy-teal text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          )}
        >
          All Tools
        </button>
        {CATEGORY_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              selectedCategory === key
                ? 'bg-privacy-teal text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            )}
          >
            {TOOL_CATEGORIES[key].label}
          </button>
        ))}
      </motion.div>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedTools.map((tool, index) => (
          <ToolCard key={tool.slug} tool={tool} index={index} />
        ))}
      </div>

      {/* Empty state */}
      {displayedTools.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No tools found in this category.
        </div>
      )}
    </div>
  );
}
