'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  HardDrive,
  Wifi,
  WifiOff,
  Lock,
  Zap,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Play,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  iconBg: string;
  iconColor: string;
  features?: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PDFKit Pro',
    description:
      'A privacy-first PDF workstation that runs entirely in your browser. Your files never leave your device.',
    icon: Shield,
    iconBg: 'bg-gradient-to-br from-trust-blue to-privacy-teal',
    iconColor: 'text-white',
    features: [
      'Process PDFs locally in your browser',
      'No uploads to external servers',
      'Works offline after first load',
    ],
  },
  {
    id: 'local-processing',
    title: 'Local Processing',
    description:
      'All PDF operations happen right in your browser using WebAssembly technology. Nothing gets sent anywhere.',
    icon: HardDrive,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    features: [
      'Merge, split, compress PDFs locally',
      'Convert between formats instantly',
      'Add text, signatures, and more',
    ],
  },
  {
    id: 'offline-first',
    title: 'Works Offline',
    description:
      'Once loaded, PDFKit Pro works without an internet connection. Perfect for sensitive documents.',
    icon: WifiOff,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    features: [
      'Full functionality offline',
      'Files stored locally',
      'No network required',
    ],
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description:
      'Your documents stay on your device. We never see, store, or have access to your files.',
    icon: Lock,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    features: [
      'Zero-knowledge architecture',
      'No server-side processing',
      'GDPR compliant by design',
    ],
  },
  {
    id: 'get-started',
    title: 'Ready to Start',
    description:
      'Drop a PDF file onto the dashboard or select a tool to begin. Everything runs locally.',
    icon: Sparkles,
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    iconColor: 'text-white',
    features: [
      'Drag and drop files to start',
      'Use the sidebar to find tools',
      'Check Privacy Center anytime',
    ],
  },
];

const STORAGE_KEY = 'pdfkit-onboarding-completed';

interface OnboardingFlowProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export default function OnboardingFlow({ forceShow, onComplete }: OnboardingFlowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if onboarding was completed
  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Small delay before showing
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [forceShow]);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (isAnimating) return;
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true);
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (isAnimating) return;
    if (currentStep > 0) {
      setIsAnimating(true);
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {ONBOARDING_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      index === currentStep
                        ? 'w-8 bg-privacy-teal'
                        : index < currentStep
                        ? 'w-4 bg-privacy-teal/50'
                        : 'w-4 bg-gray-200'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center',
                      step.iconBg
                    )}
                  >
                    <Icon className={cn('w-10 h-10', step.iconColor)} />
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl font-bold text-slate-dark mb-3">{step.title}</h2>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">{step.description}</p>

                  {/* Features */}
                  {step.features && (
                    <div className="space-y-3 text-left max-w-xs mx-auto">
                      {step.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={nextStep}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all',
                  'bg-privacy-teal text-white hover:bg-privacy-teal/90',
                  'shadow-lg shadow-privacy-teal/20'
                )}
              >
                {isLastStep ? (
                  <>
                    <Play className="w-4 h-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manually trigger onboarding
export function useOnboarding() {
  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const isCompleted = () => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  };

  return { resetOnboarding, isCompleted };
}
