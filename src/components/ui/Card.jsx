import { motion } from 'framer-motion';
import './Card.css';

const paddingMap = {
    none: 'card-p-none',
    sm: 'card-p-sm',
    md: 'card-p-md',
    lg: 'card-p-lg',
};
export default function Card({ children, className = '', hoverable = false, glowing = false, padding = 'md', onClick }) {
    const Component = hoverable ? motion.div : 'div';
    const motionProps = hoverable
        ? { whileHover: { y: -4, transition: { duration: 0.3 } }, whileTap: onClick ? { scale: 0.98 } : {} }
        : {};
    return (<Component className={`
        glass-card ${paddingMap[padding]}
        ${hoverable ? 'cursor-pointer glass-hover' : ''}
        ${glowing ? 'animate-glow-pulse' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `} onClick={onClick} {...motionProps}>
      {children}
    </Component>);
}
