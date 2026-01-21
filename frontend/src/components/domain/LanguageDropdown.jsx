import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../context/I18nContext';

const LANGUAGES = [
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
];

export default function LanguageDropdown() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const current = useMemo(
    () => LANGUAGES.find((item) => item.value === lang) || LANGUAGES[0],
    [lang],
  );

  useEffect(() => {
    const handleClick = (event) => {
      if (!wrapperRef.current || wrapperRef.current.contains(event.target)) return;
      setOpen(false);
    };
    if (open) {
      window.addEventListener('mousedown', handleClick);
    }
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = (value) => {
    setLang(value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAFA] dark:bg-[#111827] dark:focus:ring-offset-[#020617]"
        aria-label={`Idioma atual: ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span aria-hidden="true">{current.flag}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 flex w-12 flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg dark:bg-[#111827]"
        >
          {LANGUAGES.filter((item) => item.value !== current.value).map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect(item.value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-base transition hover:bg-[#FAFAFA] dark:hover:bg-[#1F2937]"
              aria-label={`Mudar idioma para ${item.label}`}
            >
              <span aria-hidden="true">{item.flag}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
