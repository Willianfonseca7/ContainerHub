import React from 'react';
import { Camera } from 'lucide-react';
import ImageSection from '../ui/ImageSection';
import corridorImage from '../../img/containertur.png';
import { useI18n } from '../../context/I18nContext';

export default function PremiumCameraCard() {
  const { t } = useI18n();

  return (
    <ImageSection
      imageSrc={corridorImage}
      alt={t('home.premiumAlt')}
      className="p-6 sm:p-8 shadow-2xl"
      overlayClassName="bg-gradient-to-r from-white/70 via-white/45 to-white/25 dark:from-black/80 dark:via-black/60 dark:to-black/35"
      imageClassName="brightness-90 dark:brightness-80"
    >
      <section className="group rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] p-8 text-white shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(17,24,39,0.4)] dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#111827] dark:to-[#020617]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-[#F59E0B] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#111827]">
              {t('home.premium.badge')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold">
              {t('home.premium.title')}
            </h3>
            <p className="text-[#FAFAFA]">
              {t('home.premium.subtitle')}
            </p>
          </div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <span className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-[#F59E0B]/15 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>
    </ImageSection>
  );
}
