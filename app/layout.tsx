import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PDFKit Pro - Professional PDF Tools',
    template: '%s | PDFKit Pro',
  },
  description:
    'Professional PDF tools that run locally in your browser. No uploads. No tracking. Privacy-first PDF editing, merging, splitting, and more.',
  keywords: [
    'PDF',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'privacy',
    'local processing',
  ],
  authors: [{ name: 'PDFKit Pro' }],
  creator: 'PDFKit Pro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfkit.pro',
    siteName: 'PDFKit Pro',
    title: 'PDFKit Pro - Professional PDF Tools',
    description:
      'Professional PDF tools that run locally in your browser. No uploads. No tracking.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDFKit Pro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFKit Pro - Professional PDF Tools',
    description:
      'Professional PDF tools that run locally in your browser. No uploads. No tracking.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
