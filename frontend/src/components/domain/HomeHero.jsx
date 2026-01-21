import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageSection from '../ui/ImageSection';
import heroImage from '../../img/containerlage.png';
import { useI18n } from '../../context/I18nContext';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomeHero() {
  const { t } = useI18n();
  const steps = Array.isArray(t('home.how.steps')) ? t('home.how.steps') : [];

  return (
    <ImageSection
      imageSrc={heroImage}
      alt={t('home.heroAlt')}
      className="p-8 sm:p-12"
      overlayClassName="bg-gradient-to-r from-white/85 via-white/70 to-white/35 dark:from-black/75 dark:via-black/60 dark:to-black/35"
      imageClassName="brightness-95 dark:brightness-90"
    >
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280] dark:text-slate-400"
          >
            ContainerHub
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-semibold leading-tight text-[#111827] dark:text-slate-100"
          >
            {t('home.title')}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-[#6B7280] dark:text-slate-400">
            {t('home.subtitle')}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-[#111827] to-[#1F2937] px-6 py-3 text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl dark:bg-gradient-to-r dark:from-[#020617] dark:to-[#111827]"
            >
              {t('home.heroPrimary')}
            </Link>
            <Link
              to="/containers"
              className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 text-[#111827] shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:bg-gradient-to-r dark:from-[#1F2937] dark:to-[#111827] dark:text-slate-100"
            >
              {t('home.heroSecondary')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-white/90 to-slate-50/90 p-6 shadow-xl backdrop-blur dark:bg-gradient-to-br dark:from-[#111827]/90 dark:to-[#1F2937]/90"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280] dark:text-slate-400">
            {t('home.how.label')}
          </p>
          <div className="mt-4 space-y-4">
            {steps.map((step, idx) => {
              const text = typeof step === 'string' ? step : step?.desc;
              if (!text) return null;
              return (
              <div key={`${text}-${idx}`} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white text-sm font-semibold dark:bg-[#020617]">
                  {idx + 1}
                </span>
                <p className="text-[#6B7280] dark:text-slate-400">{text}</p>
              </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </ImageSection>
  );
}
