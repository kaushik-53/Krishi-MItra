import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function AlertsFeed() {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{t('dashboard.alerts')}</h3>
      </div>

      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-400/10 border border-primary-400/20 flex items-center justify-center mx-auto mb-3">
          <Bell className="w-6 h-6 text-primary-400" />
        </div>
        <p className="text-sm font-medium text-text-primary mb-1">{t('dashboard.noAlerts')}</p>
        <p className="text-xs text-text-muted">Weather alerts and market updates will appear here.</p>
      </div>
    </Card>
  );
}
