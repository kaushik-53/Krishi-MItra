import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Camera, MessageCircle, TrendingUp, Sprout } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';
import Card from '@/components/ui/Card';

const actions = [
  { icon: Camera, label: 'Scan Crop', route: APP_ROUTES.diseaseDetection, color: 'text-red-400', bg: 'bg-red-500/15' },
  { icon: MessageCircle, label: 'Ask AI', route: APP_ROUTES.chatbot, color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { icon: TrendingUp, label: 'Prices', route: APP_ROUTES.market, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: Sprout, label: 'Fertilizer', route: APP_ROUTES.fertilizer, color: 'text-green-400', bg: 'bg-green-500/15' },
];

export default function QuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <h3 className="text-sm font-medium text-text-secondary mb-4">{t('dashboard.quickActions')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-2/50 border border-glass-border hover:border-primary-400/30 hover:bg-surface-3 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-xs font-medium text-text-primary">{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
