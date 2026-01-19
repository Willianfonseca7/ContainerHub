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
        className={`px-2 py-1 rounded-full border ${lang === 'de' ? 'border-[#0B132B] bg-[#0B132B] text-white' : 'border-[#DDE7E4] text-[#52627A] hover:border-[#0F766E]'}`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-full border ${lang === 'en' ? 'border-[#0B132B] bg-[#0B132B] text-white' : 'border-[#DDE7E4] text-[#52627A] hover:border-[#0F766E]'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('pt')}
        className={`px-2 py-1 rounded-full border ${lang === 'pt' ? 'border-[#0B132B] bg-[#0B132B] text-white' : 'border-[#DDE7E4] text-[#52627A] hover:border-[#0F766E]'}`}
      >
        PT
      </button>
    </div>
  );
}
