import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';

export default function HomeCTA() {
  const { t } = useI18n();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-gradient-to-r from-[#111827] to-[#1F2937] p-8 text-white shadow-2xl dark:bg-gradient-to-r dark:from-[#020617] dark:to-[#111827]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">{t('home.cta.title')}</h2>
          <p className="text-[#FAFAFA] dark:text-slate-300">
            {t('home.cta.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-full bg-white/95 px-6 py-3 text-[#111827] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl dark:bg-[#F59E0B] dark:text-[#111827]"
          >
            {t('home.cta.primary')}
          </Link>
          <Link
            to="/containers"
            className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 text-[#111827] shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:bg-gradient-to-r dark:from-[#1F2937] dark:to-[#111827] dark:text-slate-100"
          >
            {t('home.cta.secondary')}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
