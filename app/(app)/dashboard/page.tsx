'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import FeaturedTools from '@/components/FeaturedTools';
import { AllToolSections } from '@/components/ToolSection';
import UpgradeModal from '@/components/UpgradeModal';
import CreditLine from '@/components/CreditLine';
import { ContextRail } from '@/components/rail';
import { cn } from '@/lib/utils';
import { searchTools } from '@/lib/tools';
import { useAuth } from '@/hooks/useAuth';
import type { Tool } from '@/types';

// Default usage stats for demo
const DEFAULT_USAGE = {
  filesProcessed: 0,
  storageUsed: 0,
  operationsToday: 0,
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const userPlan = user?.plan ?? 'free';

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      setSearchResults(searchTools(query));
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleUpgradeClick = () => {
    setIsUpgradeOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud-gray to-white flex">
      {/* Context Rail - Left Side */}
      <ContextRail
        user={user ? { email: user.email, name: user.name } : undefined}
        plan={userPlan}
        isAuthenticated={isAuthenticated}
        usage={DEFAULT_USAGE}
      />

      {/* Main Dashboard Content */}
      <div className="flex-1 min-h-screen overflow-x-hidden">
        {/* Command Center Header */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-dark mb-3">
                Command Center
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                Professional PDF tools that run locally in your browser.
                Your files never leave your device.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search tools..."
                  className={cn(
                    'w-full pl-12 pr-24 py-4 rounded-2xl',
                    'bg-white border border-gray-200',
                    'text-slate-dark placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-privacy-teal/20 focus:border-privacy-teal',
                    'shadow-soft hover:shadow-medium transition-all duration-200'
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium">
                    Press <span className="font-bold">/</span>
                  </kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
          {isSearching && searchResults.length > 0 ? (
            // Search Results
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-semibold text-slate-dark">
                  Search Results
                </h2>
                <span className="text-sm text-gray-400">
                  {searchResults.length} tools found
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((tool, index) => (
                  <motion.div
                    key={tool.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={`/tools/${tool.slug}`}
                      className={cn(
                        'block p-5 rounded-2xl bg-white/80 backdrop-blur-sm',
                        'border border-gray-100/80 hover:border-privacy-teal/30',
                        'shadow-soft hover:shadow-glass hover:-translate-y-1',
                        'transition-all duration-200'
                      )}
                    >
                      <h3 className="font-semibold text-slate-dark">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {tool.description}
                      </p>
                    </a>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => handleSearch('')}
                className="mt-6 text-sm text-privacy-teal hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          ) : isSearching && searchResults.length === 0 ? (
            // No Results
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-dark mb-2">
                No tools found
              </h3>
              <p className="text-gray-500 mb-4">
                Try searching for something else
              </p>
              <button
                onClick={() => handleSearch('')}
                className="text-sm text-privacy-teal hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            // Default View: Featured + Categories
            <>
              {/* Featured Tools Section */}
              <FeaturedTools
                userPlan={userPlan}
                onUpgradeClick={handleUpgradeClick}
              />

              {/* Categorized Tools Sections */}
              <AllToolSections
                userPlan={userPlan}
                onUpgradeClick={handleUpgradeClick}
              />
            </>
          )}
        </main>

        {/* Credit Line Footer */}
        <CreditLine />

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
          currentPlan={userPlan}
        />
      </div>
    </div>
  );
}
