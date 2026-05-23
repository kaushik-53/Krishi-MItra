import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/constants';
import { ENV } from '@/config/env';

export default function VoiceFAB() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  if (!ENV.features.voice) return null;

  const hideOnRoutes = ['/', '/auth/login', '/auth/register', '/dashboard'];
  if (hideOnRoutes.includes(location.pathname)) return null;

  return (
    <motion.button
      onClick={() => navigate(APP_ROUTES.voiceAssistant)}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-600/30 flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 0 0px rgba(82, 183, 136, 0.3)',
          '0 0 20px rgba(82, 183, 136, 0.4)',
          '0 0 0px rgba(82, 183, 136, 0.3)',
        ],
      }}
      transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
      aria-label={t('voice.tapToSpeak')}
    >
      <Mic className="w-6 h-6" />
      <span className="sr-only">{t('voice.tapToSpeak')}</span>
    </motion.button>
  );
}
