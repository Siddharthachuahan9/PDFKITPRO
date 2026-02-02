'use client';

import { motion } from 'framer-motion';
import { Layers, Edit3, Shield, Zap } from 'lucide-react';
import ToolCard from './ToolCard';
import { getToolsByCategory, TOOL_CATEGORIES } from '@/lib/tools';
import { cn } from '@/lib/utils';
import type { ToolCategory, PlanType } from '@/types';

const CATEGORY_ICONS: Record<ToolCategory, React.ComponentType<{ className?: string }>> = {
  essentials: Layers,
  edit: Edit3,
  security: Shield,
  advanced: Zap,
};

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  essentials: 'from-blue-500 to-indigo-500',
  edit: 'from-emerald-500 to-teal-500',
  security: 'from-rose-500 to-pink-500',
  advanced: 'from-violet-500 to-purple-500',
};

interface ToolSectionProps {
  category: ToolCategory;
  userPlan: PlanType;
  onUpgradeClick: () => void;
  index?: number;
}

export default function ToolSection({
  category,
  userPlan,
  onUpgradeClick,
  index = 0,
}: ToolSectionProps) {
  const tools = getToolsByCategory(category);
  const categoryInfo = TOOL_CATEGORIES[category];
  const CategoryIcon = CATEGORY_ICONS[category];
  const colorGradient = CATEGORY_COLORS[category];

  // Filter out featured tools to avoid duplication
  const nonFeaturedTools = tools.filter((tool) => !tool.isFeatured);

  if (nonFeaturedTools.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
      className="mb-10"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-gradient-to-br',
            colorGradient
          )}
        >
          <CategoryIcon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-dark uppercase tracking-wide">
          {categoryInfo.label}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        <span className="text-xs text-gray-400 font-medium">
          {nonFeaturedTools.length} tools
        </span>
      </div>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nonFeaturedTools.map((tool, toolIndex) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            index={toolIndex}
            userPlan={userPlan}
            onUpgradeClick={onUpgradeClick}
          />
        ))}
      </div>
    </motion.section>
  );
}

// Component to render all tool sections
interface AllToolSectionsProps {
  userPlan: PlanType;
  onUpgradeClick: () => void;
}

export function AllToolSections({ userPlan, onUpgradeClick }: AllToolSectionsProps) {
  const categories: ToolCategory[] = ['essentials', 'edit', 'security', 'advanced'];

  return (
    <div className="space-y-2">
      {categories.map((category, index) => (
        <ToolSection
          key={category}
          category={category}
          userPlan={userPlan}
          onUpgradeClick={onUpgradeClick}
          index={index}
        />
      ))}
    </div>
  );
}
