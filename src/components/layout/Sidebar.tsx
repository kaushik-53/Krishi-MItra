import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bug, CloudSun, Sprout, TrendingUp, MessageCircle, Mic, Bell, UserCircle, Settings, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/lib/constants';

const sidebarLinks = [
  { href: APP_ROUTES.dashboard, icon: Home, labelKey: 'nav.dashboard' },
  { href: APP_ROUTES.diseaseDetection, icon: Bug, labelKey: 'nav.diseaseDetection' },
  { href: APP_ROUTES.weather, icon: CloudSun, labelKey: 'nav.weather' },
  { href: APP_ROUTES.fertilizer, icon: Sprout, labelKey: 'nav.fertilizer' },
  { href: APP_ROUTES.market, icon: TrendingUp, labelKey: 'nav.market' },
  { href: APP_ROUTES.chatbot, icon: MessageCircle, labelKey: 'nav.chatbot' },
  { href: APP_ROUTES.voiceAssistant, icon: Mic, labelKey: 'nav.voiceAssistant' },
  { href: APP_ROUTES.notifications, icon: Bell, labelKey: 'nav.notifications' },
  { href: APP_ROUTES.farmProfile, icon: UserCircle, labelKey: 'nav.farmProfile' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const allLinks = user?.role === 'admin'
    ? [...sidebarLinks, { href: APP_ROUTES.admin, icon: Shield, labelKey: 'nav.admin' }]
    : sidebarLinks;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-16 bottom-0 z-40 glass-sidebar hidden lg:flex flex-col"
    >
      <div className="flex-1 py-4 px-2 overflow-y-auto space-y-1">
        {allLinks.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-400/15 text-primary-400 border border-primary-400/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-3 border border-transparent'
              }`}
              title={!isSidebarOpen ? t(link.labelKey) : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'} transition-colors`} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {t(link.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Toggle button */}
      <div className="p-2 border-t border-glass-border">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
