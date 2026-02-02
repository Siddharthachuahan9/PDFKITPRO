// ============================================
// PDFKit Pro - Dodo Payments Billing (Skeleton)
// ============================================

import type { Result, PlanType, CheckoutSession, Subscription } from '@/types';
import { PRICING } from './constants';

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  plan: 'pro' | 'business',
  email?: string
): Promise<Result<CheckoutSession>> {
  try {
    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'Failed to create checkout' };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Failed to connect to billing service' };
  }
}

/**
 * Get current subscription status
 */
export async function getSubscription(): Promise<Result<Subscription | null>> {
  try {
    const response = await fetch('/api/billing/subscription');

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'Failed to fetch subscription' };
    }

    const data = await response.json();
    return { ok: true, data: data.subscription };
  } catch {
    return { ok: false, error: 'Failed to connect to billing service' };
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(): Promise<Result<void>> {
  try {
    const response = await fetch('/api/billing/cancel', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'Failed to cancel subscription' };
    }

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: 'Failed to connect to billing service' };
  }
}

/**
 * Get plan display info
 */
export function getPlanInfo(plan: PlanType): {
  name: string;
  price: number;
  features: string[];
} {
  switch (plan) {
    case 'pro':
      return {
        name: 'Pro',
        price: PRICING.PRO,
        features: [
          'Unlimited PDF processing',
          '50MB file size limit',
          'Cloud storage (encrypted)',
          'AI-powered features',
          'Priority support',
        ],
      };
    case 'business':
      return {
        name: 'Business',
        price: PRICING.BUSINESS,
        features: [
          'Everything in Pro',
          '100MB file size limit',
          'Team collaboration',
          'API access',
          'Custom branding',
          'Dedicated support',
        ],
      };
    default:
      return {
        name: 'Free',
        price: PRICING.FREE,
        features: [
          'Basic PDF tools',
          '10MB file size limit',
          '5 files per batch',
          'Local processing only',
        ],
      };
  }
}

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(
  plan: PlanType,
  feature: 'cloudStorage' | 'aiFeatures' | 'redact' | 'compare' | 'chat' | 'ocr'
): boolean {
  const proFeatures = ['cloudStorage', 'aiFeatures', 'redact', 'compare', 'chat', 'ocr'];

  if (plan === 'free') {
    return !proFeatures.includes(feature);
  }

  return true;
}
