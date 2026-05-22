import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-all text-sm font-medium"
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
    </button>
  );
}
