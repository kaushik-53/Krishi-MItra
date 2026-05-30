import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Sun, Droplets, Bug } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Container from '@/components/layout/Container';

// Animated Hero Illustration — centered plant, percentage-width cards that never overlap
function HeroIllustration() {
  const { t } = useTranslation();

  const cards = [
    {
      icon: <Bug className="w-5 h-5 text-red-400" />,
      bg: 'bg-red-500/15',
      title: t('hero.cards.disease'),
      sub: t('hero.cards.diseaseSub'),
      yAnim: [0, -8, 0],
      duration: 4,
      delay: 0,
      pos: 'top-6 left-0 w-[46%]',
      entryX: -20,
      entryDelay: 0.5,
    },
    {
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      bg: 'bg-amber-500/15',
      title: t('hero.cards.weather'),
      sub: t('hero.cards.weatherSub'),
      yAnim: [0, -10, 0],
      duration: 5,
      delay: 1,
      pos: 'top-6 right-0 w-[46%]',
      entryX: 20,
      entryDelay: 0.7,
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      bg: 'bg-blue-500/15',
      title: t('hero.cards.irrigation'),
      sub: t('hero.cards.irrigationSub'),
      yAnim: [0, -6, 0],
      duration: 4.5,
      delay: 0.5,
      pos: 'bottom-6 left-0 w-[46%]',
      entryX: -20,
      entryDelay: 0.9,
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-400" />,
      bg: 'bg-green-500/15',
      title: t('hero.cards.fertilizer'),
      sub: t('hero.cards.fertilizerSub'),
      yAnim: [0, -9, 0],
      duration: 5.5,
      delay: 2,
      pos: 'bottom-6 right-0 w-[46%]',
      entryX: 20,
      entryDelay: 1.1,
    },
  ];

  // Lines from center to the inner-most point of each card quadrant
  const lineEndpoints = [
    { x2: '23%', y2: '20%' }, // disease — top-left
    { x2: '77%', y2: '20%' }, // weather — top-right
    { x2: '23%', y2: '80%' }, // irrigation — bottom-left
    { x2: '77%', y2: '80%' }, // fertilizer — bottom-right
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto h-[440px] select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-16 bg-primary-400/5 rounded-full blur-3xl -z-10" />

      {/* SVG connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {lineEndpoints.map((pt, i) => (
          <motion.line
            key={i}
            x1="50%" y1="50%"
            x2={pt.x2} y2={pt.y2}
            stroke="#52B788"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            transition={{ duration: 1.2, delay: 1.2 + i * 0.15, ease: 'easeOut' as const }}
          />
        ))}
      </svg>

      {/* Ring orbits — centered on the container */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="absolute w-52 h-52 rounded-full border border-primary-400/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' as const }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full border border-primary-400/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' as const }}
        />
        <motion.div
          className="absolute w-44 h-44 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      </div>

      {/* Center plant — pinned to exact container midpoint */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 2 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 border border-primary-400/30 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary-500/20">
            <span className="text-5xl">🌾</span>
          </div>
        </motion.div>
      </div>

      {/* Feature cards — w-[46%] wrappers ensure they never overlap */}
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className={`absolute ${card.pos}`}
          style={{ zIndex: 3 }}
          initial={{ opacity: 0, x: card.entryX }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: card.entryDelay, duration: 0.6 }}
        >
          <motion.div
            className="w-full flex items-center gap-2.5 px-3 py-3 rounded-2xl bg-surface-1/80 backdrop-blur-md border border-glass-border shadow-xl"
            animate={{ y: card.yAnim }}
            transition={{ duration: card.duration, repeat: Infinity, ease: 'easeInOut' as const, delay: card.delay }}
          >
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-snug">{card.title}</p>
              <p className="text-[9px] text-text-muted leading-snug line-clamp-2">{card.sub}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}




export default function Hero() {
  const { t, i18n } = useTranslation();
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
      <Container clean className="relative z-10 grid lg:grid-cols-2 gap-12 items-center" size="md">
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
            className={`font-bold font-display mb-4 ${
              i18n.language === 'hi'
                ? 'text-5xl sm:text-6xl lg:text-7xl leading-normal'
                : 'text-4xl sm:text-5xl lg:text-6xl leading-tight'
            }`}
          >
            <span className="text-text-primary">{t('hero.titlePart1')}</span>{' '}
            <span className="text-gradient">{t('hero.titlePart2')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className={`text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 ${
              i18n.language === 'hi' ? 'mb-5' : 'mb-8'
            }`}
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
            className={i18n.language === 'hi' ? 'mt-8 grid grid-cols-3 gap-4' : 'mt-12 grid grid-cols-3 gap-4'}
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
