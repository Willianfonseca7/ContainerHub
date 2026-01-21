import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import translations from '../i18n/translations';

// Achtung: einfache I18n-Implementierung mit Fallback auf Englisch.

const I18nContext = createContext(null);
const STORAGE_KEY = 'containerhub_lang';
const SUPPORTED = new Set(['de', 'en', 'pt']);

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function applyParams(value, params = {}) {
  if (typeof value !== 'string') return value;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v),
    value,
  );
}

export function I18nProvider({ children, defaultLang = 'de' }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return defaultLang;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && SUPPORTED.has(stored) ? stored : defaultLang;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    return (key, params = {}) => {
      const current = getNested(translations[lang] || {}, key);
      if (current !== undefined) return applyParams(current, params);
      const fallback = getNested(translations.en, key);
      return applyParams(fallback !== undefined ? fallback : key, params);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
