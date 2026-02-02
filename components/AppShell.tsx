'use client';

import { useState } from 'react';
import Sidebar, { SidebarTrigger } from './Sidebar';
import PrivacyBar from './PrivacyBar';
import type { PrivacyMode } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [privacyMode] = useState<PrivacyMode>('local');

  return (
    <div className="min-h-screen bg-cloud-gray flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center px-4 lg:px-6">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} />
          <div className="flex-1" />
          <PrivacyBar mode={privacyMode} />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
