import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';
import { APP_ROUTES } from '@/lib/constants';

export default function NotificationBell() {
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(APP_ROUTES.notifications)}
      className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-5 h-5" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
