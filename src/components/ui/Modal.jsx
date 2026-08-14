import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
};
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const overlayRef = useRef(null);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    return (<AnimatePresence>
      {isOpen && (<div className="modal-overlay-wrapper">
          <motion.div ref={overlayRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onClose} aria-hidden="true"/>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }} exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }} className={`relative glass modal-content ${sizeMap[size]}`} role="dialog" aria-modal="true" aria-label={title}>
            {title && (<div className="modal-header">
                <h2 className="modal-title font-display">{title}</h2>
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                  <X className="w-5 h-5"/>
                </button>
              </div>)}
            {children}
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
