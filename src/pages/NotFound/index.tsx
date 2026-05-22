import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-6xl font-bold font-display text-text-primary mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-2">Page Not Found</p>
        <p className="text-sm text-text-muted mb-8 max-w-md mx-auto">
          The field you're looking for doesn't exist. Let's get you back to fertile ground.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>Go Back</Button>
          <Button onClick={() => navigate('/')} leftIcon={<Home className="w-4 h-4" />}>Home</Button>
        </div>
      </motion.div>
    </div>
  );
}
