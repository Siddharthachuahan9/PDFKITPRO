'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Merge,
  Scissors,
  Minimize2,
  Image,
  FileText,
  Lock,
  Pen,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import FileDropZone, { type DroppedFile } from '@/components/workflow/FileDropZone';
import JobTimeline from '@/components/workflow/JobTimeline';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const QUICK_TOOLS = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one',
    slug: 'merge',
    icon: Merge,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or split documents',
    slug: 'split',
    icon: Scissors,
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Compress',
    description: 'Reduce PDF file size',
    slug: 'compress',
    icon: Minimize2,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'PDF to Image',
    description: 'Convert PDF pages to images',
    slug: 'pdf-to-jpg',
    icon: Image,
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Image to PDF',
    description: 'Convert images to PDF',
    slug: 'jpg-to-pdf',
    icon: FileText,
    color: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Add Text',
    description: 'Add text and signatures',
    slug: 'add-text',
    icon: Pen,
    color: 'from-cyan-500 to-blue-600',
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Files never leave your device. All processing happens locally.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'WebAssembly-powered processing for instant results.',
  },
  {
    icon: Globe,
    title: 'Works Offline',
    description: 'Full functionality without an internet connection.',
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);

  const handleFilesAdded = useCallback((files: File[]) => {
    const newFiles: DroppedFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setDroppedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileRemoved = useCallback((fileId: string) => {
    setDroppedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-dark mb-2">
              {isAuthenticated && user?.name
                ? `Welcome back, ${user.name.split(' ')[0]}`
                : 'Welcome to PDFKit Pro'}
            </h1>
            <p className="text-gray-500">
              Professional PDF tools that run locally in your browser
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Drop Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-slate-dark mb-4">Quick Start</h2>
                  <FileDropZone
                    onFilesAdded={handleFilesAdded}
                    onFileRemoved={handleFileRemoved}
                    files={droppedFiles}
                    compact={droppedFiles.length > 0}
                  />

                  {droppedFiles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-3">
                        What would you like to do with these files?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_TOOLS.slice(0, 4).map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-slate-dark transition-colors"
                          >
                            <tool.icon className="w-4 h-4 text-gray-500" />
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Tools Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-dark">Quick Actions</h2>
                  <Link
                    href="/tools"
                    className="text-sm font-medium text-privacy-teal hover:underline flex items-center gap-1"
                  >
                    View all tools <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {QUICK_TOOLS.map((tool, index) => (
                    <motion.div
                      key={tool.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={`/tools/${tool.slug}`}
                        className={cn(
                          'block p-5 rounded-2xl bg-white border border-gray-200',
                          'hover:border-gray-300 hover:shadow-md',
                          'transition-all duration-200 group'
                        )}
                      >
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                            tool.color
                          )}
                        >
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-dark group-hover:text-privacy-teal transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gradient-to-br from-trust-blue to-privacy-teal rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="font-semibold">Why PDFKit Pro?</h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    {FEATURES.map((feature) => (
                      <div key={feature.title}>
                        <feature.icon className="w-8 h-8 mb-3 opacity-90" />
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-white/80">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Card for non-authenticated */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-trust-blue to-privacy-teal flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-dark mb-2">Sign in to save your work</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Access cloud backup, sync across devices, and more
                    </p>
                    <Link
                      href="/auth/signin"
                      className="block w-full py-3 px-4 rounded-xl bg-privacy-teal text-white font-medium hover:bg-privacy-teal/90 transition-colors"
                    >
                      Sign In
                    </Link>
                    <p className="text-xs text-gray-400 mt-3">
                      Free tools work without an account
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Job Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <JobTimeline />
              </motion.div>

              {/* Privacy Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800 text-sm">
                      Privacy Protected
                    </h3>
                    <p className="text-xs text-emerald-700 mt-1">
                      All files are processed locally on your device. Nothing is uploaded to any server.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
