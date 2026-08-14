import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { language, setLanguage } = useUIStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        setIsOpen(false);
    };
    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (<div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-all text-sm font-medium" aria-expanded={isOpen} aria-label="Select language">
        <Globe className="w-4 h-4 text-primary-400"/>
        <span className="hidden sm:inline">{language === 'en' ? 'English' : 'हिंदी'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence>
        {isOpen && (<motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-1.5 w-36 glass rounded-xl p-1 border border-glass-border shadow-xl z-50">
            <button onClick={() => selectLanguage('en')} className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg font-medium transition-colors ${language === 'en'
                ? 'bg-primary-500/10 text-primary-400 font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'}`}>
              <span>English</span>
              {language === 'en' && <Check className="w-3.5 h-3.5"/>}
            </button>
            <button onClick={() => selectLanguage('hi')} className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg font-medium transition-colors ${language === 'hi'
                ? 'bg-primary-500/10 text-primary-400 font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'}`}>
              <span>हिंदी</span>
              {language === 'hi' && <Check className="w-3.5 h-3.5"/>}
            </button>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
