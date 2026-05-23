import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bug, CloudSun, Sprout, TrendingUp, MessageCircle, Mic, Bell, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { APP_ROUTES } from '@/lib/constants';
import { getGreeting, getSeason } from '@/lib/utils';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import WeatherWidget from './WeatherWidget';
import QuickActions from './QuickActions';
import AlertsFeed from './AlertsFeed';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Welcome Header */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              {greeting}, {user?.displayName?.split(' ')[0] || t('app.name')}! 👋
            </h1>
            <p className="text-text-secondary mt-1">
              {t('app.tagline')} • <span className="text-primary-400 font-mono text-sm">{getSeason()} Season</span>
            </p>
          </div>
          <Badge variant="success" size="md">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </Badge>
        </motion.div>

        {/* Weather + Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <WeatherWidget />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <QuickActions />
          </motion.div>
        </div>

        {/* Module Cards Grid */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-body">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: Bug, label: t('nav.diseaseDetection'), route: APP_ROUTES.diseaseDetection, color: 'from-red-500/20 to-orange-500/10', iconColor: 'text-red-400' },
              { icon: CloudSun, label: t('nav.weather'), route: APP_ROUTES.weather, color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400' },
              { icon: Sprout, label: t('nav.fertilizer'), route: APP_ROUTES.fertilizer, color: 'from-green-500/20 to-emerald-500/10', iconColor: 'text-green-400' },
              { icon: TrendingUp, label: t('nav.market'), route: APP_ROUTES.market, color: 'from-amber-500/20 to-yellow-500/10', iconColor: 'text-amber-400' },
              { icon: MessageCircle, label: t('nav.chatbot'), route: APP_ROUTES.chatbot, color: 'from-purple-500/20 to-pink-500/10', iconColor: 'text-purple-400' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.route} hoverable padding="sm" onClick={() => navigate(item.route)} className="text-center">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border border-glass-border flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <p className="text-xs font-medium text-text-primary">{item.label}</p>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Alerts Feed */}
        <motion.div variants={fadeInUp}>
          <AlertsFeed />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
