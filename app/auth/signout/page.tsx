'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, LogOut } from 'lucide-react';

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
  };

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

        {/* Sign Out Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-soft p-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-gray-500" />
          </div>

          <h1 className="text-xl font-bold text-slate-dark mb-2">
            Sign Out
          </h1>
          <p className="text-gray-500 mb-6">
            Are you sure you want to sign out?
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-dark text-white font-medium hover:bg-slate-dark/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="block w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
