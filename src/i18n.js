import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import global_es from './locales/es/global.json';
import global_en from './locales/en/global.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: 'en',
    defaultNS: 'global',
    ns: ['global'],
    resources: {
      es: { global: global_es },
      en: { global: global_en }
    },
  });

export default i18n;