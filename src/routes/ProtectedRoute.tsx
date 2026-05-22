import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLoader from '@/components/loaders/PageLoader';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const MIN_LOADER_MS = 2800;

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), MIN_LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = isLoading || !minTimePassed;

  return (
    <>
      <AnimatePresence>
        {showLoader && <PageLoader />}
      </AnimatePresence>
      {!showLoader && (
        isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
      )}
    </>
  );
}
