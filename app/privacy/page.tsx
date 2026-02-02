import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Shield, Lock, Eye, Server, Trash2, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PDFKit Pro privacy policy - Learn how we protect your data with local-first processing and zero tracking.',
};

const LAST_UPDATED = 'February 1, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud-gray to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-dark">PDFKit Pro</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-slate-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-privacy-teal/10 text-privacy-teal text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Privacy-First by Design
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-dark mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-slate-dark mb-1">Local Processing</h3>
            <p className="text-sm text-gray-500">Your files are processed entirely in your browser</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-slate-dark mb-1">Zero Tracking</h3>
            <p className="text-sm text-gray-500">We don&apos;t track, profile, or sell your data</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <Server className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-slate-dark mb-1">No Uploads</h3>
            <p className="text-sm text-gray-500">Files never leave your device by default</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-soft p-8 lg:p-12 prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">1</span>
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              PDFKit Pro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our PDF tools and services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Our core principle:</strong> Your files are processed locally in your browser. We never upload, store, or access your PDF content unless you explicitly enable optional cloud features.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">2</span>
              Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-slate-dark mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Account Information:</strong> Email address and name when you create an account</li>
              <li><strong>Payment Information:</strong> Processed securely by our payment provider (Dodo Payments) - we never store credit card numbers</li>
              <li><strong>Support Communications:</strong> Messages you send to our support team</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-dark mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Usage Analytics:</strong> Basic, anonymized usage statistics (feature usage counts, not file content)</li>
              <li><strong>Error Reports:</strong> Crash reports to improve stability (no file content included)</li>
              <li><strong>Device Information:</strong> Browser type and version for compatibility</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-dark mt-6 mb-3">2.3 Information We Do NOT Collect</h3>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <ul className="list-disc list-inside text-emerald-700 space-y-2">
                <li>Your PDF file contents (processed locally in your browser)</li>
                <li>Your document metadata or text</li>
                <li>Personal identifiers from your documents</li>
                <li>Browsing history outside our application</li>
                <li>Location data</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">3</span>
              How We Process Your Files
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-4">
              <h3 className="text-lg font-semibold text-slate-dark mb-3">Local-First Architecture</h3>
              <p className="text-gray-600 mb-4">
                All PDF processing operations (merge, split, compress, convert, etc.) happen entirely within your web browser using WebAssembly and JavaScript. Your files are:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Never uploaded to our servers for basic operations</li>
                <li>Processed using your device&apos;s memory and CPU</li>
                <li>Automatically cleared from memory after processing</li>
                <li>Stored temporarily in IndexedDB only if you choose to save them locally</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-slate-dark mb-3">Optional Cloud Features (Pro/Business)</h3>
              <p className="text-gray-600 mb-4">
                If you enable cloud storage or AI features:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Files are encrypted with AES-256-GCM before upload</li>
                <li>Encryption keys are derived from your password - we cannot decrypt your files</li>
                <li>Cloud storage is opt-in and can be disabled at any time</li>
                <li>Files can be permanently deleted on request</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">4</span>
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use the limited information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates (you can opt out of marketing)</li>
              <li>Improve our products based on anonymized usage patterns</li>
              <li>Respond to support requests</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">5</span>
              Data Sharing and Third Parties
            </h2>
            <p className="text-gray-600 mb-4">We do not sell your data. We share information only with:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Payment Processors:</strong> Dodo Payments for subscription billing</li>
              <li><strong>Authentication Providers:</strong> GitHub/Google for OAuth login (if you choose)</li>
              <li><strong>Cloud Infrastructure:</strong> Supabase for account data storage</li>
              <li><strong>Error Tracking:</strong> Anonymized crash reports only</li>
            </ul>
            <p className="text-gray-600 mt-4">
              All third-party providers are contractually obligated to protect your data and use it only for the services they provide to us.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">6</span>
              Your Rights and Choices
            </h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your account data</li>
              <li><strong>Correction:</strong> Update your account information</li>
              <li><strong>Deletion:</strong> Delete your account and all associated data</li>
              <li><strong>Portability:</strong> Export your data in a standard format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Withdraw Consent:</strong> Disable optional features like cloud storage</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@pdfkit.pro" className="text-privacy-teal hover:underline">
                privacy@pdfkit.pro
              </a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">7</span>
              Data Retention
            </h2>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Trash2 className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-600">
                  <strong>Local files:</strong> Cleared when you close your browser or clear storage<br />
                  <strong>Account data:</strong> Retained while your account is active<br />
                  <strong>Cloud files:</strong> Deleted within 30 days of account deletion or on request<br />
                  <strong>Backup copies:</strong> Removed from backups within 90 days
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">8</span>
              Security
            </h2>
            <p className="text-gray-600 mb-4">We implement industry-standard security measures:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>AES-256-GCM encryption for cloud-stored files</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure, SOC 2 compliant infrastructure providers</li>
              <li>No plain-text storage of sensitive data</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">9</span>
              Children&apos;s Privacy
            </h2>
            <p className="text-gray-600">
              PDFKit Pro is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">10</span>
              Changes to This Policy
            </h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on our website. Your continued use of PDFKit Pro after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-trust-blue/10 flex items-center justify-center text-trust-blue text-sm font-bold">11</span>
              Contact Us
            </h2>
            <div className="flex items-start gap-3 bg-privacy-teal/5 rounded-xl p-4 border border-privacy-teal/20">
              <Mail className="w-5 h-5 text-privacy-teal mt-0.5" />
              <div>
                <p className="text-gray-600">
                  For privacy-related questions or concerns:<br />
                  <a href="mailto:privacy@pdfkit.pro" className="text-privacy-teal hover:underline font-medium">
                    privacy@pdfkit.pro
                  </a>
                </p>
                <p className="text-gray-600 mt-2">
                  For general support:<br />
                  <a href="mailto:support@pdfkit.pro" className="text-privacy-teal hover:underline font-medium">
                    support@pdfkit.pro
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Built with privacy in mind by{' '}
            <a href="https://twitter.com/siddharth" className="text-privacy-teal hover:underline">
              Siddharth
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
