import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Camera, Cpu, Lightbulb } from 'lucide-react';
import Container from '@/components/layout/Container';

const steps = [
  { key: 'step1', icon: Camera, color: 'from-primary-400 to-primary-600', num: '01' },
  { key: 'step2', icon: Cpu, color: 'from-amber-400 to-amber-600', num: '02' },
  { key: 'step3', icon: Lightbulb, color: 'from-info to-blue-600', num: '03' },
];

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-surface-1/50" id="how-it-works">
      <Container size="lg" clean>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-4">{t('howItWorks.title')}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-amber-400 mx-auto rounded-full" />
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400/30 via-amber-400/30 to-info/30 -translate-y-1/2" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.key} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.5 }} className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <motion.div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center z-10`} whileHover={{ scale: 1.1, rotate: 5 }}>
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-0 border-2 border-glass-border flex items-center justify-center text-xs font-bold text-primary-400 font-mono z-20">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{t(`howItWorks.${step.key}.title`)}</h3>
                  <p className="text-sm text-text-secondary max-w-xs mx-auto">{t(`howItWorks.${step.key}.description`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
