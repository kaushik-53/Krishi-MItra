import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, Bell, User, LogOut, Globe, Sun, Moon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useUIStore } from '@/store/uiStore';
import { APP_ROUTES } from '@/lib/constants';
import NotificationBell from '@/components/common/NotificationBell';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

import Container from './Container';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  const navLinks = isAuthenticated
    ? [
        { href: APP_ROUTES.dashboard, label: t('nav.dashboard') },
        { href: APP_ROUTES.diseaseDetection, label: t('nav.diseaseDetection') },
        { href: APP_ROUTES.weather, label: t('nav.weather') },
        { href: APP_ROUTES.market, label: t('nav.market') },
        { href: APP_ROUTES.chatbot, label: t('nav.chatbot') },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar" role="navigation" aria-label="Main navigation">
      <Container clean className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
              🌾
            </div>
            <span className="text-lg font-bold font-display text-text-primary group-hover:text-primary-400 transition-colors">
              {t('app.name')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-primary-400/15 text-primary-400'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary-600" />}
            </button>
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-3 transition-colors"
                  aria-expanded={isProfileOpen}
                  aria-label="User menu"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover border border-glass-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.displayName?.[0] || <User className="w-4 h-4" />}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-xl p-2 border border-glass-border"
                    >
                      <div className="px-3 py-2 border-b border-glass-border mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.displayName}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                      </div>
                      <Link to={APP_ROUTES.farmProfile} className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-lg" onClick={() => setIsProfileOpen(false)}>
                        <User className="w-4 h-4" /> {t('nav.farmProfile')}
                      </Link>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg w-full" onClick={async () => { setIsProfileOpen(false); if (auth) await signOut(auth); logout(); navigate('/'); }}>
                        <LogOut className="w-4 h-4" /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !isLanding ? (
              <Link to={APP_ROUTES.login} className="glass-button px-4 py-2 rounded-xl text-sm font-semibold">
                {t('nav.login')}
              </Link>
            ) : null}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-sidebar border-t border-glass-border"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary-400/15 text-primary-400'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
