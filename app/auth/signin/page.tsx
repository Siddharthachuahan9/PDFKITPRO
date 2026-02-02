'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Providers = Awaited<ReturnType<typeof getProviders>>;

export default function SignInPage() {
  const [providers, setProviders] = useState<Providers>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    await signIn(providerId, { callbackUrl: '/dashboard' });
  };

  const providerIcons: Record<string, React.ElementType> = {
    github: Github,
    google: Mail,
  };

  const providerColors: Record<string, string> = {
    github: 'bg-gray-900 hover:bg-gray-800 text-white',
    google: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud-gray to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-dark">PDFKit Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-dark mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500">
            Sign in to access your PDF tools
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-soft p-6">
          <div className="space-y-3">
            {providers &&
              Object.values(providers).map((provider) => {
                const Icon = providerIcons[provider.id] || Mail;
                const colorClass = providerColors[provider.id] || providerColors.google;

                return (
                  <button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading !== null}
                    className={cn(
                      'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl',
                      'font-medium transition-all duration-200',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      colorClass
                    )}
                  >
                    {isLoading === provider.id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    Continue with {provider.name}
                  </button>
                );
              })}
          </div>

          {/* Privacy Note */}
          <div className="mt-6 p-3 rounded-xl bg-privacy-teal/5 border border-privacy-teal/10">
            <p className="text-xs text-gray-600 text-center">
              We only store your email for account identification.
              Your PDF files are never uploaded to our servers.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-privacy-teal hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-privacy-teal hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
