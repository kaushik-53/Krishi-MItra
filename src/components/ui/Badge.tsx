import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variantMap = {
  default: 'bg-surface-3 text-text-secondary border-glass-border',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  info: 'bg-info/15 text-info border-info/30',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${variantMap[variant]} ${sizeMap[size]} ${className}`}>
      {children}
    </span>
  );
}
