'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/70 border-2 border-yellow-400 rounded-lg text-yellow-400 font-bold text-sm hover:bg-black/90 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      }}
    >
      {language === 'ja' ? '🇯🇵 日本語' : '🇺🇸 English'}
    </motion.button>
  );
}






