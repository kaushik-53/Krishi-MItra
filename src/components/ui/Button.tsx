import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'glass-button text-white',
  secondary: 'bg-surface-2 border border-glass-border text-text-primary hover:bg-surface-3',
  outline: 'bg-transparent border border-primary-400/30 text-primary-400 hover:bg-primary-400/10',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2',
  danger: 'bg-danger/20 border border-danger/30 text-danger hover:bg-danger/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, children, className = '', disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]} ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...(props as Record<string, unknown>)}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
