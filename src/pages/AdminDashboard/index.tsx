import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Activity, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { formatNumber } from '@/lib/formatters';

const userGrowth = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1800 }, { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3100 }, { month: 'May', users: 4200 },
];
const moduleUsage = [
  { name: 'Disease', value: 35, color: '#E76F51' }, { name: 'Chat', value: 28, color: '#52B788' },
  { name: 'Weather', value: 20, color: '#4CC9F0' }, { name: 'Market', value: 17, color: '#E9C46A' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('admin.title')}</h1>
        </motion.div>
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '52,400', icon: Users, change: '+12%' },
            { label: 'New (7d)', value: '340', icon: Users, change: '+8%' },
            { label: 'API Calls', value: '18.5K', icon: Activity, change: '+15%' },
            { label: 'AI Accuracy', value: '94.2%', icon: Brain, change: '+0.3%' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-primary-400" />
                  <Badge variant="success" size="sm">{s.change}</Badge>
                </div>
                <p className="text-2xl font-bold text-text-primary font-mono">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </Card>
            );
          })}
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeInUp}>
            <Card>
              <h3 className="text-sm font-medium text-text-secondary mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={userGrowth}>
                  <XAxis dataKey="month" tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#162419', border: '1px solid rgba(82,183,136,0.15)', borderRadius: '12px', color: '#F0FFF4' }} />
                  <Bar dataKey="users" fill="#52B788" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card>
              <h3 className="text-sm font-medium text-text-secondary mb-4">Module Usage</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart><Pie data={moduleUsage} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                    {moduleUsage.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {moduleUsage.map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-xs text-text-secondary">{m.name} {m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
