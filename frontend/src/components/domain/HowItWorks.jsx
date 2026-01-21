import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, KeyRound, CreditCard } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const iconList = [CheckCircle, KeyRound, CreditCard];

export default function HowItWorks() {
  const { t } = useI18n();
  const steps = Array.isArray(t('home.how.steps')) ? t('home.how.steps') : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#F59E0B]">
          {t('home.how.label')}
        </p>
        <h2 className="text-3xl font-semibold text-[#111827] dark:text-slate-100">
          {t('home.how.title')}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = iconList[index] || CheckCircle;
          return (
          <div
            key={step.title || step.desc || index}
            className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]/10">
                <Icon className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">
                {step.title}
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#6B7280] dark:text-slate-400">{step.desc}</p>
          </div>
          );
        })}
      </div>
    </motion.section>
  );
}
