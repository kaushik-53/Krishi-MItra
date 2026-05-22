import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Notifications() {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 w-full">
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('notifications.title')}</h1>
          <p className="text-sm text-text-muted mt-1">Stay updated with weather alerts, market prices, and crop advisories.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary-400/10 border border-primary-400/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">No Notifications Yet</h2>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                When you receive weather alerts, market price updates, pest warnings, or government scheme notifications, they will appear here.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
