/**
 * Design Tokens for PDFKit Pro
 * Production-grade design system for professional desktop-like experience
 */

export const tokens = {
  // Color System
  colors: {
    // Brand
    brand: {
      primary: '#0B3C5D',      // Trust Blue
      secondary: '#0FB9B1',     // Privacy Teal
      accent: '#6366F1',        // Indigo accent
    },
    // Semantic
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    // Neutrals
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    // Surface
    surface: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    // Dark mode surfaces
    dark: {
      surface: '#0F172A',
      elevated: '#1E293B',
      border: '#334155',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing Scale (8px base)
  spacing: {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Elevation (Box Shadows)
  elevation: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },

  // Motion / Animation Timings
  motion: {
    duration: {
      instant: '0ms',
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // Z-Index Scale
  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
  },

  // Layout
  layout: {
    topBar: {
      height: '64px',
    },
    sidebar: {
      width: '280px',
      collapsedWidth: '72px',
    },
    canvas: {
      minWidth: '600px',
    },
    maxContentWidth: '1400px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// CSS Custom Properties generator
export function generateCSSVariables(): string {
  return `
:root {
  /* Brand Colors */
  --color-brand-primary: ${tokens.colors.brand.primary};
  --color-brand-secondary: ${tokens.colors.brand.secondary};
  --color-brand-accent: ${tokens.colors.brand.accent};

  /* Semantic Colors */
  --color-success: ${tokens.colors.semantic.success};
  --color-warning: ${tokens.colors.semantic.warning};
  --color-error: ${tokens.colors.semantic.error};
  --color-info: ${tokens.colors.semantic.info};

  /* Surface Colors */
  --color-surface-primary: ${tokens.colors.surface.primary};
  --color-surface-secondary: ${tokens.colors.surface.secondary};
  --color-surface-tertiary: ${tokens.colors.surface.tertiary};
  --color-surface-elevated: ${tokens.colors.surface.elevated};

  /* Layout */
  --topbar-height: ${tokens.layout.topBar.height};
  --sidebar-width: ${tokens.layout.sidebar.width};
  --sidebar-collapsed-width: ${tokens.layout.sidebar.collapsedWidth};

  /* Motion */
  --duration-fast: ${tokens.motion.duration.fast};
  --duration-normal: ${tokens.motion.duration.normal};
  --duration-slow: ${tokens.motion.duration.slow};
  --easing-default: ${tokens.motion.easing.easeInOut};
}

.dark {
  --color-surface-primary: ${tokens.colors.dark.surface};
  --color-surface-secondary: ${tokens.colors.dark.elevated};
  --color-surface-tertiary: ${tokens.colors.dark.border};
}
`;
}

export type Tokens = typeof tokens;
