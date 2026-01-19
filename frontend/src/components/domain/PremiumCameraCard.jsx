import React from 'react';
import { Camera } from 'lucide-react';

export default function PremiumCameraCard() {
  return (
    <section className="group rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#0F1F3A] to-[#0F766E] p-8 text-white shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(11,19,43,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
            Premium Feature
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold">
            Sieh in deinen Container – von überall.
          </h3>
          <p className="text-slate-200">
            Mit Premium: Kamera-Check in Echtzeit, mehr Sicherheit und Kontrolle.
          </p>
        </div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <span className="absolute h-20 w-20 rounded-full bg-white/20 opacity-0 transition-opacity duration-200 group-hover:opacity-60" />
          <Camera className="h-8 w-8 text-white" />
        </div>
      </div>
    </section>
  );
}
