import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/config/queryClient';
import '@/config/i18n';
import AppRoutes from '@/routes';
import { useAuth } from '@/hooks/useAuth';
import VoiceFAB from '@/components/common/VoiceFAB';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function AuthListener() {
  useAuth();
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthListener />
          <AppRoutes />
          <VoiceFAB />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#162419',
                color: '#F0FFF4',
                border: '1px solid rgba(82, 183, 136, 0.15)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#52B788', secondary: '#F0FFF4' } },
              error: { iconTheme: { primary: '#E76F51', secondary: '#F0FFF4' } },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
