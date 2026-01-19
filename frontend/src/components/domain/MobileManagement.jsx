import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, KeyRound, CreditCard, MapPin } from 'lucide-react';

const tiles = [
  { icon: Smartphone, label: 'Verträge verwalten' },
  { icon: KeyRound, label: 'PIN sofort erhalten' },
  { icon: CreditCard, label: 'Zahlungen & Verlängerung online' },
  { icon: MapPin, label: 'Standort & Details jederzeit einsehen' },
];

export default function MobileManagement() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center"
    >
      <div className="order-2 lg:order-1">
        <div className="rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#111F3C] to-[#0F766E] p-8 text-white shadow-2xl">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">App View</p>
            <h3 className="text-2xl font-semibold">Alles per Smartphone</h3>
            <p className="text-sm text-white/80">
              Verwalte deine Einheiten, Zugänge und Zahlungen direkt im Browser – schnell und
              sicher.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/90">
              Live-Status
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/90">PIN Zugang</div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/90">Zahlungen</div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/90">Support</div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2 space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[#0F766E]">Alles per Smartphone</p>
        <h2 className="text-3xl font-semibold text-[#0B132B]">
          Kontrolle ohne App-Stress. Alles im Browser.
        </h2>
        <p className="text-[#52627A]">
          Erhalte volle Transparenz und verwalte jeden Schritt in Sekunden – egal ob unterwegs oder
          im Büro.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-2xl bg-gradient-to-br from-[#E6F4F1] to-[#DDF0EC] p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 text-[#1B2A47]">
                <Icon className="h-5 w-5 text-[#0F766E] transition-opacity duration-200 hover:opacity-80" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
