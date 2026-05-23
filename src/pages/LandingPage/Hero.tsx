import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Sun, Droplets, Bug } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Container from '@/components/layout/Container';

// Animated Hero Illustration — floating farm scene built with motion divs and icons
function HeroIllustration() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full max-w-xl mx-auto h-[460px]">
      {/* Central Elements Wrapper */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Central glowing orb */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
        />

        {/* Ring orbits */}
        <motion.div
          className="absolute w-72 h-72 rounded-full border border-primary-400/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' as const }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full border border-primary-400/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' as const }}
        />

        {/* Central Plant SVG */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 border border-primary-400/30 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary-500/20">
            <span className="text-5xl">🌾</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Feature Cards */}
      {/* Scan Crop */}
      <motion.div
        className="absolute top-8 left-2 sm:-left-4 lg:-left-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-1/80 backdrop-blur-md border border-glass-border shadow-xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary leading-snug">{t('hero.cards.disease')}</p>
            <p className="text-[11px] text-text-muted leading-snug">{t('hero.cards.diseaseSub')}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Weather */}
      <motion.div
        className="absolute top-8 right-2 sm:-right-4 lg:-right-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-1/80 backdrop-blur-md border border-glass-border shadow-xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary leading-snug">{t('hero.cards.weather')}</p>
            <p className="text-[11px] text-text-muted leading-snug">{t('hero.cards.weatherSub')}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Smart Irrigation */}
      <motion.div
        className="absolute bottom-16 left-0 sm:-left-6 lg:-left-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-1/80 backdrop-blur-md border border-glass-border shadow-xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary leading-snug">{t('hero.cards.irrigation')}</p>
            <p className="text-[11px] text-text-muted leading-snug">{t('hero.cards.irrigationSub')}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Fertilizer */}
      <motion.div
        className="absolute bottom-12 right-0 sm:-right-6 lg:-right-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-1/80 backdrop-blur-md border border-glass-border shadow-xl"
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary leading-snug">{t('hero.cards.fertilizer')}</p>
            <p className="text-[11px] text-text-muted leading-snug">{t('hero.cards.fertilizerSub')}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Connecting dotted lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <motion.line x1="50%" y1="50%" x2="15%" y2="15%" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
        <motion.line x1="50%" y1="50%" x2="85%" y2="15%" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.4 }} />
        <motion.line x1="50%" y1="50%" x2="15%" y2="85%" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.6 }} />
        <motion.line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.8 }} />
      </svg>

      {/* Background glow */}
      <div className="absolute -inset-16 bg-primary-400/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" id="hero">
      {/* SVG Grid Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#52B788" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated green glow spots */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.3), transparent 70%)', top: '10%', left: '10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(233,196,106,0.2), transparent 70%)', bottom: '20%', right: '15%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        />
      </div>

      {/* Particle field - fireflies */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: i % 3 === 0 ? '#E9C46A' : '#52B788',
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
            }}
            animate={{
              y: [0, -(window.innerHeight + 100)],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeOut' as const,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <Container clean className="relative z-10 grid lg:grid-cols-2 gap-12 items-center" size="lg">
        {/* Left: Text content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center lg:text-left"
        >
          {/* Tagline */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-400/10 border border-primary-400/20 text-primary-400 text-sm font-medium">
              🌾 {t('hero.tagline')}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6"
          >
            <span className="text-text-primary">{t('hero.title').split(' ').slice(0, 2).join(' ')}</span>{' '}
            <span className="text-gradient">{t('hero.title').split(' ').slice(2).join(' ')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA — single button, no demo */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              onClick={() => navigate('/auth/register')}
              leftIcon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              }
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('hero.cta_google')}
            </Button>
          </motion.div>

          {/* Live stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            {[
              { value: '50K+', label: t('stats.farmersHelped') },
              { value: '28', label: t('stats.statesCovered') },
              { value: '150+', label: t('stats.cropsSupported') },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-primary-400 font-mono">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          className="hidden lg:flex justify-center"
        >
          <HeroIllustration />
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
