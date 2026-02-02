'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Crown,
  Check,
  Zap,
  Shield,
  Cloud,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createCheckoutSession, getPlanInfo } from '@/lib/billing';
import type { PlanType } from '@/types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
}

const PLAN_FEATURES = {
  pro: [
    { icon: Zap, label: 'Unlimited PDF processing' },
    { icon: Cloud, label: '50MB file size limit' },
    { icon: Shield, label: 'Encrypted cloud storage' },
    { icon: MessageSquare, label: 'AI-powered Chat with PDF' },
    { icon: Sparkles, label: 'Early access to new tools' },
  ],
  business: [
    { icon: Zap, label: 'Everything in Pro' },
    { icon: Cloud, label: '100MB file size limit' },
    { icon: Users, label: 'Team collaboration' },
    { icon: Shield, label: 'API access' },
    { icon: Crown, label: 'Priority support' },
  ],
};

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [isLoading, setIsLoading] = useState(false);

  const proInfo = getPlanInfo('pro');
  const businessInfo = getPlanInfo('business');

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(selectedPlan);
      if (result.ok) {
        // Redirect to Dodo Payments checkout
        window.location.href = result.data.url;
      } else {
        alert(result.error || 'Failed to create checkout session');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
              'bg-white rounded-2xl shadow-2xl',
              'p-6 md:p-8'
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-dark">
                Upgrade to PDFKit Pro
              </h2>
              <p className="text-gray-500 mt-2">
                Unlock powerful features and unlimited processing
              </p>
            </div>

            {/* Plan selector */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Pro Plan */}
              <button
                onClick={() => setSelectedPlan('pro')}
                className={cn(
                  'relative p-5 rounded-xl border-2 text-left transition-all',
                  selectedPlan === 'pro'
                    ? 'border-privacy-teal bg-privacy-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {selectedPlan === 'pro' && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-privacy-teal flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-slate-dark">Pro</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-slate-dark">
                    ${proInfo.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  {PLAN_FEATURES.pro.slice(0, 3).map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <feature.icon className="w-4 h-4 text-privacy-teal" />
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </button>

              {/* Business Plan */}
              <button
                onClick={() => setSelectedPlan('business')}
                className={cn(
                  'relative p-5 rounded-xl border-2 text-left transition-all',
                  selectedPlan === 'business'
                    ? 'border-privacy-teal bg-privacy-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {selectedPlan === 'business' && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-privacy-teal flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-slate-dark">Business</span>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-slate-dark">
                    ${businessInfo.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  {PLAN_FEATURES.business.slice(0, 3).map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <feature.icon className="w-4 h-4 text-privacy-teal" />
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </button>
            </div>

            {/* Full feature list */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-slate-dark mb-3">
                {selectedPlan === 'pro' ? 'Pro' : 'Business'} includes:
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {PLAN_FEATURES[selectedPlan].map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-white',
                'bg-gradient-to-r from-trust-blue to-privacy-teal',
                'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </span>
              ) : (
                `Upgrade to ${selectedPlan === 'pro' ? 'Pro' : 'Business'} - $${
                  selectedPlan === 'pro' ? proInfo.price : businessInfo.price
                }/mo`
              )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Instant access
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
