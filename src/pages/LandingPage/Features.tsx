import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bug, CloudSun, Sprout, TrendingUp, MessageCircle, Mic } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Container from '@/components/layout/Container';

const features = [
  { key: 'disease', icon: Bug, gradient: 'from-red-500/20 to-orange-500/10', iconColor: 'text-red-400' },
  { key: 'weather', icon: CloudSun, gradient: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400' },
  { key: 'fertilizer', icon: Sprout, gradient: 'from-green-500/20 to-emerald-500/10', iconColor: 'text-green-400' },
  { key: 'market', icon: TrendingUp, gradient: 'from-amber-500/20 to-yellow-500/10', iconColor: 'text-amber-400' },
  { key: 'chat', icon: MessageCircle, gradient: 'from-purple-500/20 to-pink-500/10', iconColor: 'text-purple-400' },
  { key: 'voice', icon: Mic, gradient: 'from-primary-500/20 to-teal-500/10', iconColor: 'text-primary-400' },
];

export default function Features() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative" id="features">
      <Container size="lg" clean>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-4">
            {t('features.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-amber-400 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-card p-6 group cursor-pointer"
              >
                {/* Icon container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-glass-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-text-primary mb-2 font-body">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>

                {/* Hover glow */}
                <div className="mt-4 flex items-center gap-1 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
