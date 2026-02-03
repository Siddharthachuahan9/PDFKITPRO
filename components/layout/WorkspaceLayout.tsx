'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PrivacyPanel from '@/components/privacy/PrivacyPanel';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { ToastProvider } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  showOnboarding?: boolean;
}

export default function WorkspaceLayout({ children, showOnboarding = true }: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [privacyPanelOpen, setPrivacyPanelOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Bar */}
        <TopBar />

        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Sidebar */}
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>

          {/* Privacy FAB */}
          <motion.button
            onClick={() => setPrivacyPanelOpen(true)}
            className={cn(
              'fixed bottom-6 right-6 z-30',
              'w-14 h-14 rounded-full',
              'bg-gradient-to-br from-emerald-500 to-teal-600',
              'text-white shadow-lg shadow-emerald-500/30',
              'flex items-center justify-center',
              'hover:scale-105 transition-transform'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Privacy Center"
          >
            <Shield className="w-6 h-6" />
          </motion.button>

          {/* Privacy Panel */}
          <PrivacyPanel isOpen={privacyPanelOpen} onClose={() => setPrivacyPanelOpen(false)} />
        </div>

        {/* Onboarding Flow */}
        {showOnboarding && <OnboardingFlow />}
      </div>
    </ToastProvider>
  );
}
