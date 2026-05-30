import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import hi from '../locales/hi.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: localStorage.getItem('krishi-lang') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Sync html[lang] whenever language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng; // 'en' or 'hi'
});

// Also set it on init
document.documentElement.lang = i18n.language;

export default i18n;
