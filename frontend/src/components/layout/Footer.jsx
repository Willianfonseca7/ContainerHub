import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B1220]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-[#6B7280] dark:text-slate-400">
        <div>
          <span className="font-semibold text-[#111827] dark:text-slate-100">ContainerHub</span> — self-storage
          digital.
        </div>
        <div className="flex gap-4">
          <Link to="/containers" className="hover:text-[#111827] dark:hover:text-slate-100">
            {t('nav.containers')}
          </Link>
          <Link to="/sobre" className="hover:text-[#111827] dark:hover:text-slate-100">
            {t('nav.about')}
          </Link>
          <Link to="/contato" className="hover:text-[#111827] dark:hover:text-slate-100">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
