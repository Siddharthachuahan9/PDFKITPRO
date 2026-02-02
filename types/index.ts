// ============================================
// PDFKit Pro - Core Type Definitions
// ============================================

// Result pattern for UI (no throwing)
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// PDF File representation
export interface PdfFile {
  id: string;
  name: string;
  size: number;
  data: ArrayBuffer;
  pageCount: number;
  thumbnail?: string;
  createdAt: number;
}

// Tool status
export type ToolStatus = 'ready' | 'beta' | 'pro' | 'soon';

// Tool definition
export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  isPro: boolean;
  status: ToolStatus;
  isFeatured?: boolean;
}

// Feature flags
export type Feature = 'ai' | 'cloud' | 'teams' | 'redact' | 'compare' | 'ocr';

// Feature access by plan
export const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  pro: ['ai', 'cloud', 'redact', 'compare', 'ocr'],
  business: ['ai', 'cloud', 'teams', 'redact', 'compare', 'ocr'],
};

export type ToolCategory =
  | 'essentials'
  | 'edit'
  | 'security'
  | 'advanced';

// Privacy status
export type PrivacyMode = 'local' | 'encrypted' | 'cloud';

export interface PrivacyStatus {
  mode: PrivacyMode;
  isEncrypted: boolean;
  cloudEnabled: boolean;
}

// User plan
export type PlanType = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: PlanType;
  createdAt: Date;
}

// Storage types
export interface StoredFile {
  id: string;
  name: string;
  data: ArrayBuffer;
  createdAt: number;
  expiresAt: number;
}

// Processing status
export type ProcessingStatus =
  | 'idle'
  | 'loading'
  | 'processing'
  | 'complete'
  | 'error';

// Tool page props
export interface ToolPageProps {
  params: { slug: string };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Billing types
export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface Subscription {
  id: string;
  plan: PlanType;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
}
