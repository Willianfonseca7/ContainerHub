import React from 'react';
import { Shield, Camera, Calendar, Smartphone } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const iconList = [Shield, Camera, Calendar, Smartphone];

export default function WhyContainerHub() {
  const { t } = useI18n();
  const items = Array.isArray(t('home.why.items')) ? t('home.why.items') : [];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#F59E0B]">
          {t('home.why.label')}
        </p>
        <h2 className="text-3xl font-semibold text-[#111827] dark:text-slate-100">
          {t('home.why.title')}
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = iconList[index] || Shield;
          return (
          <div
            key={item.title || item.desc || index}
            className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]/10">
                <Icon className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#6B7280] dark:text-slate-400">{item.desc}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}
