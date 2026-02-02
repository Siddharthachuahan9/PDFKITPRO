'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import { Suspense } from 'react';

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification link may have expired or already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was an error signing in with the OAuth provider.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error processing the OAuth callback.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'There was an error creating your account.',
  },
  EmailCreateAccount: {
    title: 'Email Account Error',
    description: 'There was an error creating your email account.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error processing the authentication callback.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This email is already associated with another account. Please sign in using the original method.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'There was an error sending the sign-in email.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'The credentials you provided are incorrect.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'Please sign in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const { title, description } = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <>
      <h1 className="text-xl font-bold text-slate-dark mb-2">
        {title}
      </h1>
      <p className="text-gray-500 mb-6">
        {description}
      </p>
    </>
  );
}

function ErrorFallback() {
  return (
    <>
      <h1 className="text-xl font-bold text-slate-dark mb-2">
        Authentication Error
      </h1>
      <p className="text-gray-500 mb-6">
        Loading error details...
      </p>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud-gray to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-dark">PDFKit Pro</span>
        </Link>

        {/* Error Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-soft p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>

          <Suspense fallback={<ErrorFallback />}>
            <ErrorContent />
          </Suspense>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full py-3 px-4 rounded-xl bg-trust-blue text-white font-medium hover:bg-trust-blue/90 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
