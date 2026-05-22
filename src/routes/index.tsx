import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PageLoader from '@/components/loaders/PageLoader';

// Lazy load all pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DiseaseDetection = lazy(() => import('@/pages/DiseaseDetection'));
const WeatherAdvisory = lazy(() => import('@/pages/WeatherAdvisory'));
const FertilizerRecommendation = lazy(() => import('@/pages/FertilizerRecommendation'));
const MarketPrediction = lazy(() => import('@/pages/MarketPrediction'));
const AIChatbot = lazy(() => import('@/pages/AIChatbot'));
const VoiceAssistant = lazy(() => import('@/pages/VoiceAssistant'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const FarmProfile = lazy(() => import('@/pages/FarmProfile'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/weather" element={<WeatherAdvisory />} />
          <Route path="/fertilizer" element={<FertilizerRecommendation />} />
          <Route path="/market" element={<MarketPrediction />} />
          <Route path="/chatbot" element={<AIChatbot />} />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/farm-profile" element={<FarmProfile />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
