import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glowing?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({ children, className = '', hoverable = false, glowing = false, padding = 'md', onClick }: CardProps) {
  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? { whileHover: { y: -4, transition: { duration: 0.3 } }, whileTap: onClick ? { scale: 0.98 } : {} }
    : {};

  return (
    <Component
      className={`
        glass-card ${paddingMap[padding]}
        ${hoverable ? 'cursor-pointer glass-hover' : ''}
        ${glowing ? 'animate-glow-pulse' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
