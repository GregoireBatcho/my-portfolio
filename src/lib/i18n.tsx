"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';

type Locale = 'fr' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Dynamic translations
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { en, fr };

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Try to load initial locale from localStorage or browser preferences
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('gregoire-portfolio-locale');
      if (saved === 'fr' || saved === 'en') return saved;
    } catch (_) {}
    
    try {
      const browserLanguage = navigator.language.toLowerCase();
      if (browserLanguage.startsWith('fr')) return 'fr';
    } catch (_) {}
    
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('gregoire-portfolio-locale', newLocale);
    } catch (_) {}
  };

  // Keep HTML document lang attribute in sync
  useEffect(() => {
    document.documentElement.lang = locale;
    
    // Also dispatch custom event so standard components can respond or sync titles
    const event = new CustomEvent('localeChange', { detail: locale });
    window.dispatchEvent(event);
  }, [locale]);

  const t = (path: string): string => {
    const dict = dictionaries[locale] as any;
    const parts = path.split('.');
    
    let current = dict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to path name if not found
        return path;
      }
    }
    
    if (typeof current === 'string') {
      return current;
    }
    return path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
