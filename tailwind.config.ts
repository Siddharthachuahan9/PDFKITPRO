import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'trust-blue': '#0B3C5D',
        'privacy-teal': '#0FB9B1',
        'cloud-gray': '#F3F6F9',
        'slate-dark': '#1F2933',
        // Extended palette
        'glass-white': 'rgba(255, 255, 255, 0.8)',
        'glass-dark': 'rgba(31, 41, 51, 0.8)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
