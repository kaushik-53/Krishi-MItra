import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './Button.css';

const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
};
const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
};
const Button = forwardRef(({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, children, className = '', disabled, ...props }, ref) => {
    return (<motion.button ref={ref} whileTap={{ scale: 0.97 }} className={`
          btn
          ${variants[variant]} ${sizes[size]}
          ${fullWidth ? 'btn-full-width' : ''}
          ${className}
        `} disabled={disabled || isLoading} {...props}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>);
});
Button.displayName = 'Button';
export default Button;
