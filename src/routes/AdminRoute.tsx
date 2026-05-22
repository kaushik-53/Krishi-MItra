import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLoader from '@/components/loaders/PageLoader';

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
