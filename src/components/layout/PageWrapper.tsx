import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

import Container from './Container';

interface PageWrapperProps {
  children: ReactNode;
  showSidebar?: boolean;
  showNavbar?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function PageWrapper({ children, showSidebar = true, showNavbar = true, fullWidth = false, className = '' }: PageWrapperProps) {
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen } = useUIStore();

  const shouldShowSidebar = showSidebar && isAuthenticated;

  return (
    <div className="min-h-screen bg-surface-0">
      {showNavbar && <Navbar />}
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        <motion.main
          {...pageTransition}
          className={`flex-1 ${showNavbar ? 'pt-16' : ''} ${
            shouldShowSidebar ? (isSidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]') : ''
          } transition-[margin] duration-300 ${className}`}
        >
          {fullWidth ? (
            <div className="py-6">{children}</div>
          ) : (
            <Container>{children}</Container>
          )}
        </motion.main>
      </div>
    </div>
  );
}
