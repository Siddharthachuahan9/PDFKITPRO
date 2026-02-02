'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Cloud,
  ArrowRight,
  FileText,
  Lock,
  Cpu,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/tools';

const FEATURES = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. Your files never leave your device.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'No uploads, no waiting. Process PDFs instantly with client-side technology.',
  },
  {
    icon: Lock,
    title: 'Military-Grade Encryption',
    description: 'Optional encrypted cloud storage uses AES-256-GCM for maximum security.',
  },
  {
    icon: Cpu,
    title: 'Powerful Tools',
    description: 'Professional PDF tools including merge, split, compress, OCR, and AI chat.',
  },
];

const TOOL_PREVIEW = TOOLS.slice(0, 6);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cloud-gray">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-dark">PDFKit Pro</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-privacy-teal transition-colors hidden sm:block"
            >
              Tools
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-gradient-to-r from-trust-blue to-privacy-teal text-white',
                'hover:shadow-lg transition-shadow'
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-privacy-teal/10 text-privacy-teal text-sm font-medium mb-6"
          >
            <Shield className="w-4 h-4" />
            100% Local Processing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-slate-dark leading-tight"
          >
            Professional PDF Tools
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-blue to-privacy-teal">
              That Respect Your Privacy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto"
          >
            Merge, split, compress, and edit PDFs directly in your browser.
            No uploads. No tracking. Your files stay on your device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-medium',
                'bg-gradient-to-r from-trust-blue to-privacy-teal text-white',
                'hover:shadow-lg hover:scale-105 transition-all duration-200'
              )}
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 rounded-xl text-lg font-medium text-gray-600 hover:text-privacy-teal transition-colors"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Privacy indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No sign-up required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No file uploads
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              GDPR compliant
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-dark">
              Why Choose PDFKit Pro?
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We built PDFKit Pro with one goal: give you powerful PDF tools
              without compromising your privacy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-6 rounded-2xl bg-cloud-gray',
                  'hover:shadow-soft transition-shadow'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-trust-blue/10 to-privacy-teal/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-privacy-teal" />
                </div>
                <h3 className="font-semibold text-slate-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-dark">
              Powerful PDF Tools
            </h2>
            <p className="text-gray-600 mt-4">
              Everything you need to work with PDFs, all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOL_PREVIEW.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl bg-white',
                    'border border-gray-100 hover:border-privacy-teal/30',
                    'shadow-soft hover:shadow-medium',
                    'transition-all duration-200'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-privacy-teal/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-privacy-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-dark">{tool.name}</h3>
                    <p className="text-sm text-gray-500">{tool.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-privacy-teal font-medium hover:underline"
            >
              View all {TOOLS.length} tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-trust-blue to-privacy-teal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust PDFKit Pro for their PDF needs.
            No account required.
          </p>
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-medium',
              'bg-white text-trust-blue',
              'hover:shadow-lg hover:scale-105 transition-all duration-200'
            )}
          >
            Launch PDFKit Pro
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 lg:px-8 bg-slate-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">PDFKit Pro</span>
            </div>

            <div className="flex items-center gap-8 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} PDFKit Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
