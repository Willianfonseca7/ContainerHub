import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, KeyRound, CreditCard, MapPin } from 'lucide-react';
import ImageSection from '../ui/ImageSection';
import singleContainerImage from '../../img/container1.png';
import { useI18n } from '../../context/I18nContext';

const tileIcons = [Smartphone, KeyRound, CreditCard, MapPin];

export default function MobileManagement() {
  const { t } = useI18n();
  const tiles = Array.isArray(t('home.mobile.tiles')) ? t('home.mobile.tiles') : [];
  const pills = Array.isArray(t('home.mobile.appViewPills')) ? t('home.mobile.appViewPills') : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center"
    >
      <div className="order-2 lg:order-1">
        <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] p-8 text-white shadow-2xl dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#111827] dark:to-[#020617]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#FAFAFA]">
              {t('home.mobile.appViewLabel')}
            </p>
            <h3 className="text-2xl font-semibold">{t('home.mobile.appViewTitle')}</h3>
            <p className="text-sm text-[#FAFAFA]">
              {t('home.mobile.appViewDesc')}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {pills.map((pill) => (
              <div key={pill} className="rounded-2xl bg-white/10 p-4 text-sm text-white/90">
                {pill}
              </div>
            ))}
          </div>
        </div>
        <ImageSection
          imageSrc={singleContainerImage}
          alt={t('home.mobileAlt')}
          className="mt-6 h-44 sm:h-52"
          overlayClassName="bg-gradient-to-r from-white/80 via-white/55 to-white/25 dark:from-black/70 dark:via-black/55 dark:to-black/30"
          imageClassName="brightness-95 dark:brightness-85"
        >
          <div className="flex h-full flex-col justify-end p-4">
            <p className="text-sm font-semibold text-[#111827] dark:text-slate-100">
              {t('home.mobile.availabilityTitle')}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              {t('home.mobile.availabilitySubtitle')}
            </p>
          </div>
        </ImageSection>
      </div>

      <div className="order-1 lg:order-2 space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[#F59E0B]">
          {t('home.mobile.badge')}
        </p>
        <h2 className="text-3xl font-semibold text-[#111827] dark:text-slate-100">
          {t('home.mobile.title')}
        </h2>
        <p className="text-[#6B7280] dark:text-slate-400">
          {t('home.mobile.subtitle')}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {tileIcons.map((Icon, index) => {
            const label = tiles[index];
            if (!label) return null;
            return (
            <div
              key={label}
              className="group rounded-2xl bg-gradient-to-br from-white to-slate-50 p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl"
            >
              <div className="flex items-center gap-3 text-[#111827] dark:text-slate-100">
                <Icon className="h-5 w-5 text-[#6B7280] transition-colors duration-200 group-hover:text-[#F59E0B]" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
