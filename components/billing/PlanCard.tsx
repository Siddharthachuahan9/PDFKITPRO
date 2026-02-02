'use client';

import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface PlanCardProps {
  name: string;
  price: number;
  period?: string;
  description?: string;
  features: PlanFeature[];
  isSelected: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}

export default function PlanCard({
  name,
  price,
  period = '/month',
  description,
  features,
  isSelected,
  isPopular,
  onSelect,
}: PlanCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col h-full p-5 rounded-xl border-2 text-left',
        'transition-all duration-200',
        isSelected
          ? 'border-privacy-teal bg-privacy-teal/5 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-privacy-teal flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Popular badge */}
      {isPopular && (
        <span className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          Popular
        </span>
      )}

      {/* Plan name */}
      <div className="flex items-center gap-2 mb-2 mt-1">
        <Crown className={cn('w-5 h-5', isSelected ? 'text-privacy-teal' : 'text-gray-400')} />
        <span className="text-lg font-bold text-slate-dark">{name}</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-slate-dark">${price}</span>
        <span className="text-gray-500 text-sm">{period}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      {/* Features */}
      <ul className="space-y-2 flex-1">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2 text-sm text-gray-600">
            <feature.icon className={cn('w-4 h-4 flex-shrink-0', isSelected ? 'text-privacy-teal' : 'text-gray-400')} />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
