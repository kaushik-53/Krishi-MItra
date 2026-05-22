import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';

export default function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden" id="cta">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-surface-0 to-primary-900/30" />
      <motion.div className="absolute inset-0 opacity-30">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.2), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      </motion.div>
      <Container size="sm" clean className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-text-primary mb-6">
            {t('cta.title', { count: '50,000+' })}
          </h2>
          <p className="text-lg text-text-secondary mb-8">{t('hero.subtitle')}</p>
          <Button size="lg" onClick={() => navigate('/auth/register')} rightIcon={<ArrowRight className="w-5 h-5" />}>
            {t('cta.button')}
          </Button>
          <div className="mt-8 flex items-center justify-center gap-6">
            {['ICAR', 'NABARD', 'PM-KISAN', 'eNAM'].map((org) => (
              <span key={org} className="text-xs text-text-muted font-mono px-3 py-1 rounded-full border border-glass-border">{org}</span>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
