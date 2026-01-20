import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, KeyRound, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: CheckCircle,
    title: 'Einheit wählen',
    desc: 'Einheit wählen (Ort, Größe, Plan).',
  },
  {
    icon: KeyRound,
    title: 'PIN erhalten',
    desc: 'PIN erhalten – bei Premium die Kamera nutzen.',
  },
  {
    icon: CreditCard,
    title: 'Online zahlen',
    desc: 'Monatlich zahlen und online verlängern.',
  },
];

export default function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#F59E0B]">Wie es funktioniert</p>
        <h2 className="text-3xl font-semibold text-[#111827] dark:text-slate-100">In drei Schritten startklar</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]/10">
                <Icon className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">{title}</h3>
            </div>
            <p className="mt-3 text-sm text-[#6B7280] dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
