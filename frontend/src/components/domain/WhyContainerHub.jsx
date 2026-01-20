import React from 'react';
import { Shield, Camera, Calendar, Smartphone } from 'lucide-react';

const items = [
  {
    icon: Shield,
    title: 'Sicher & zuverlässig',
    desc: 'PIN-Zugänge und klare Prozesse für maximale Sicherheit.',
  },
  {
    icon: Camera,
    title: '24/7 optionales Monitoring',
    desc: 'Premium-Option mit Kamera für volle Kontrolle.',
  },
  {
    icon: Calendar,
    title: 'Flexible Laufzeiten',
    desc: 'Monatlich kündbar, jederzeit verlängerbar.',
  },
  {
    icon: Smartphone,
    title: '100% online verwaltbar',
    desc: 'Verträge, Zahlungen und Support digital.',
  },
];

export default function WhyContainerHub() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#F59E0B]">Warum ContainerHub?</p>
        <h2 className="text-3xl font-semibold text-[#111827] dark:text-slate-100">
          Vertrauen, Flexibilität und digitale Kontrolle
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, desc }) => (
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
    </section>
  );
}
