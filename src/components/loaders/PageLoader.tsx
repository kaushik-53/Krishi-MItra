import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MIN_DISPLAY_MS = 2800; // Minimum time the loader stays visible so the plant animation finishes

export default function PageLoader() {
  const [showText, setShowText] = useState(false);
  const [ready, setReady] = useState(false);
  const letters = 'Krishi Mitra'.split('');

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 400);
    const readyTimer = setTimeout(() => setReady(true), MIN_DISPLAY_MS);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  // If the parent removes this component before the minimum display, we still
  // show it because this component is only conditionally rendered by the parent.
  // The fix is applied in ProtectedRoute / Suspense to enforce the minimum via state.

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-surface-0 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Particle field background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
            }}
            animate={{
              y: [0, -window.innerHeight * 1.1],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeOut' as const,
            }}
          />
        ))}
      </div>

      {/* Wheat stalk SVG animation */}
      <motion.div className="relative mb-8">
        <motion.svg
          width="60"
          height="120"
          viewBox="0 0 60 120"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {/* Stem */}
          <motion.line
            x1="30" y1="120" x2="30" y2="30"
            stroke="#52B788" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          {/* Leaves */}
          {[
            { d: 'M30 90 Q45 80 50 85', delay: 0.6 },
            { d: 'M30 75 Q15 65 10 70', delay: 0.8 },
            { d: 'M30 60 Q45 50 50 55', delay: 1.0 },
            { d: 'M30 45 Q15 35 10 40', delay: 1.2 },
          ].map((leaf, i) => (
            <motion.path
              key={i}
              d={leaf.d}
              fill="none"
              stroke="#52B788"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: leaf.delay }}
            />
          ))}
          {/* Grain head */}
          <motion.ellipse
            cx="30" cy="25" rx="8" ry="15"
            fill="none" stroke="#E9C46A" strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          />
          {/* Grain lines */}
          {[15, 20, 25, 30, 35].map((y, i) => (
            <motion.line
              key={i}
              x1="26" y1={y} x2="34" y2={y}
              stroke="#E9C46A" strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + i * 0.08 }}
            />
          ))}
        </motion.svg>

        {/* Glow ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0px rgba(82, 183, 136, 0)',
              '0 0 40px rgba(82, 183, 136, 0.3)',
              '0 0 0px rgba(82, 183, 136, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Brand name - letter by letter */}
      {showText && (
        <div className="flex gap-0.5">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className={`text-2xl font-bold font-display ${letter === ' ' ? 'w-2' : ''} ${
                i < 6 ? 'text-primary-400' : 'text-amber-400'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      )}

      {/* Loading bar */}
      <motion.div
        className="mt-6 w-48 h-1 bg-surface-2 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 via-primary-400 to-amber-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, delay: 1.2, ease: 'easeInOut' as const }}
        />
      </motion.div>
    </motion.div>
  );
}
