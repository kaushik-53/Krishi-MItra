import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import CTASection from './CTASection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirect logged-in users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
