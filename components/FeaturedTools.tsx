'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ToolCard from './ToolCard';
import { getFeaturedTools } from '@/lib/tools';
import type { PlanType } from '@/types';

interface FeaturedToolsProps {
  userPlan: PlanType;
  onUpgradeClick: () => void;
}

export default function FeaturedTools({ userPlan, onUpgradeClick }: FeaturedToolsProps) {
  const featuredTools = getFeaturedTools();

  return (
    <section className="mb-12">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-dark">Featured Tools</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </motion.div>

      {/* Featured tools grid - larger cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredTools.map((tool, index) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            index={index}
            userPlan={userPlan}
            variant="featured"
            onUpgradeClick={onUpgradeClick}
          />
        ))}
      </div>
    </section>
  );
}
