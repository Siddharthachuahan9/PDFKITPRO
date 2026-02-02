'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Zap,
  Shield,
  Cloud,
  Users,
  MessageSquare,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PlanCard from './PlanCard';
import { createCheckoutSession, getPlanInfo } from '@/lib/billing';
import type { PlanType } from '@/types';

interface UpgradeContentProps {
  currentPlan: PlanType;
  onSuccess?: () => void;
}

const PRO_FEATURES = [
  { icon: Zap, label: 'Unlimited PDF processing' },
  { icon: Cloud, label: '50MB file size limit' },
  { icon: Shield, label: 'Encrypted cloud storage' },
  { icon: MessageSquare, label: 'AI Chat with PDF' },
  { icon: Sparkles, label: 'Early access to new tools' },
];

const BUSINESS_FEATURES = [
  { icon: Check, label: 'Everything in Pro' },
  { icon: Cloud, label: '100MB file size limit' },
  { icon: Users, label: 'Team collaboration' },
  { icon: Shield, label: 'API access' },
  { icon: Crown, label: 'Priority support' },
];

export default function UpgradeContent({ currentPlan, onSuccess }: UpgradeContentProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proInfo = getPlanInfo('pro');
  const businessInfo = getPlanInfo('business');

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCheckoutSession(selectedPlan);
      if (result.ok) {
        window.location.href = result.data.url;
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-dark">Upgrade to PDFKit Pro</h2>
        <p className="text-gray-500 mt-2">Unlock powerful features and unlimited processing</p>
      </div>

      {/* Plan cards - equal height grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <PlanCard
          name="Pro"
          price={proInfo.price}
          description="Perfect for individuals"
          features={PRO_FEATURES}
          isSelected={selectedPlan === 'pro'}
          isPopular={true}
          onSelect={() => setSelectedPlan('pro')}
        />
        <PlanCard
          name="Business"
          price={businessInfo.price}
          description="For teams and organizations"
          features={BUSINESS_FEATURES}
          isSelected={selectedPlan === 'business'}
          onSelect={() => setSelectedPlan('business')}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleUpgrade}
        disabled={isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-semibold text-white text-lg',
          'bg-gradient-to-r from-trust-blue to-privacy-teal',
          'hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]',
          'transition-all duration-200',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-privacy-teal/50 focus:ring-offset-2'
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          `Upgrade to ${selectedPlan === 'pro' ? 'Pro' : 'Business'} — $${
            selectedPlan === 'pro' ? proInfo.price : businessInfo.price
          }/mo`
        )}
      </button>

      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Secure checkout
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          Instant access
        </span>
      </div>
    </div>
  );
}
