// ============================================
// PDFKit Pro - Feature Gate System
// ============================================

import type { PlanType, Feature, Tool, ToolStatus } from '@/types';

// Features available by plan
const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  pro: ['ai', 'cloud', 'redact', 'compare', 'ocr'],
  business: ['ai', 'cloud', 'teams', 'redact', 'compare', 'ocr'],
};

// Tools requiring specific features
const TOOL_FEATURES: Record<string, Feature> = {
  chat: 'ai',
  compare: 'compare',
  redact: 'redact',
  ocr: 'ocr',
};

/**
 * Check if a plan has access to a feature
 */
export function hasFeature(plan: PlanType, feature: Feature): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

/**
 * Check if a plan can access a tool
 */
export function canAccessTool(plan: PlanType, tool: Tool): boolean {
  // Ready tools are accessible to everyone
  if (tool.status === 'ready') return true;

  // Beta tools accessible to all
  if (tool.status === 'beta') return true;

  // Coming soon tools - no access yet
  if (tool.status === 'soon') return false;

  // Pro tools require pro/business plan
  if (tool.status === 'pro' || tool.isPro) {
    return plan === 'pro' || plan === 'business';
  }

  // Check feature-specific requirements
  const requiredFeature = TOOL_FEATURES[tool.slug];
  if (requiredFeature) {
    return hasFeature(plan, requiredFeature);
  }

  return true;
}

/**
 * Get the effective status for a tool based on user's plan
 */
export function getToolStatus(plan: PlanType, tool: Tool): ToolStatus {
  // If tool is coming soon, always show that
  if (tool.status === 'soon') return 'soon';

  // If tool requires pro and user is free, show as pro-locked
  if ((tool.status === 'pro' || tool.isPro) && plan === 'free') {
    return 'pro';
  }

  return tool.status;
}

/**
 * Get upgrade message for a locked feature
 */
export function getUpgradeMessage(feature: Feature): string {
  const messages: Record<Feature, string> = {
    ai: 'Unlock AI-powered PDF analysis with Pro',
    cloud: 'Enable encrypted cloud storage with Pro',
    teams: 'Collaborate with your team on Business',
    redact: 'Securely redact sensitive content with Pro',
    compare: 'Compare PDF documents side-by-side with Pro',
    ocr: 'Extract text from scanned documents with Pro',
  };
  return messages[feature];
}

/**
 * Get all features a user is missing
 */
export function getMissingFeatures(plan: PlanType): Feature[] {
  const allFeatures: Feature[] = ['ai', 'cloud', 'teams', 'redact', 'compare', 'ocr'];
  return allFeatures.filter((f) => !hasFeature(plan, f));
}

/**
 * Get the recommended upgrade plan
 */
export function getRecommendedPlan(currentPlan: PlanType): PlanType | null {
  if (currentPlan === 'free') return 'pro';
  if (currentPlan === 'pro') return 'business';
  return null;
}
