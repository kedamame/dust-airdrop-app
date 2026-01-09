'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '@/lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ja');

  // ローカルストレージから言語設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('gomi-nft-language') as Language | null;
    if (saved === 'ja' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  // 言語変更時にローカルストレージに保存
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gomi-nft-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}






