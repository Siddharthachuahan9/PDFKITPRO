// ============================================
// PDFKit Pro - Constants
// ============================================

// Brand Colors
export const COLORS = {
  TRUST_BLUE: '#0B3C5D',
  PRIVACY_TEAL: '#0FB9B1',
  CLOUD_GRAY: '#F3F6F9',
  SLATE_DARK: '#1F2933',
} as const;

// Animation durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 250,
} as const;

// File limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILES: 50,
  MAX_PAGES: 500,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  FILES_DB: 'pdfkit-files',
  SETTINGS: 'pdfkit-settings',
  RECENT: 'pdfkit-recent',
} as const;

// Plan pricing
export const PRICING = {
  FREE: 0,
  PRO: 7,
  BUSINESS: 29,
} as const;

// Plan features
export const PLAN_FEATURES = {
  free: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerBatch: 5,
    cloudStorage: false,
    aiFeatures: false,
  },
  pro: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFilesPerBatch: 25,
    cloudStorage: true,
    aiFeatures: true,
  },
  business: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFilesPerBatch: 50,
    cloudStorage: true,
    aiFeatures: true,
  },
} as const;

// Supported MIME types
export const SUPPORTED_TYPES = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const;
