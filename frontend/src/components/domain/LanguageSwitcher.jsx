import React from 'react';
import { useI18n } from '../../context/I18nContext';

// Kommentar: einfacher Sprachumschalter (DE/EN/PT) ohne Persistenz.

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLang('de')}
        className={`px-2 py-1 rounded-full shadow-sm transition-colors ${
          lang === 'de'
            ? 'bg-[#111827] text-white dark:bg-[#F59E0B] dark:text-[#111827]'
            : 'bg-white text-[#6B7280] hover:text-[#111827] dark:bg-[#111827] dark:text-slate-400 dark:hover:text-slate-100'
        }`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-full shadow-sm transition-colors ${
          lang === 'en'
            ? 'bg-[#111827] text-white dark:bg-[#F59E0B] dark:text-[#111827]'
            : 'bg-white text-[#6B7280] hover:text-[#111827] dark:bg-[#111827] dark:text-slate-400 dark:hover:text-slate-100'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('pt')}
        className={`px-2 py-1 rounded-full shadow-sm transition-colors ${
          lang === 'pt'
            ? 'bg-[#111827] text-white dark:bg-[#F59E0B] dark:text-[#111827]'
            : 'bg-white text-[#6B7280] hover:text-[#111827] dark:bg-[#111827] dark:text-slate-400 dark:hover:text-slate-100'
        }`}
      >
        PT
      </button>
    </div>
  );
}
