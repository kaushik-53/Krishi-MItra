import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const messages = [
  { en: 'Analyzing crop data...', hi: 'फसल डेटा का विश्लेषण...' },
  { en: 'Consulting agri-database...', hi: 'कृषि डेटाबेस से परामर्श...' },
  { en: 'Preparing advice...', hi: 'सलाह तैयार कर रहे हैं...' },
];

export default function AIThinkingLoader({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const [msgIndex, setMsgIndex] = useState(0);
  const lang = i18n.language as 'en' | 'hi';

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center gap-6 py-8 ${className}`}>
      {/* Orbiting orbs around central icon */}
      <div className="relative w-24 h-24">
        {/* Central leaf/brain icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-600/30 border border-primary-400/30 flex items-center justify-center text-2xl">
            🌿
          </div>
        </motion.div>

        {/* Pulsing glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-400/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-400/10"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Orbiting orbs */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: i === 0 ? '#52B788' : i === 1 ? '#E9C46A' : '#4CC9F0',
              boxShadow: `0 0 10px ${i === 0 ? '#52B788' : i === 1 ? '#E9C46A' : '#4CC9F0'}60`,
              top: '50%',
              left: '50%',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.667,
            }}
            // This creates the orbit effect using transform-origin offset
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'inherit',
                boxShadow: 'inherit',
                transform: `translateX(${30 + i * 5}px) translateY(-50%)`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.667 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Rotating messages */}
      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-sm text-text-secondary font-medium"
      >
        {messages[msgIndex]?.[lang] ?? messages[msgIndex]?.en}
      </motion.p>

      {/* Typing dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-400"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
