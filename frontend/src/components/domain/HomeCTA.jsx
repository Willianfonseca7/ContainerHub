import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomeCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-gradient-to-r from-[#0B132B] to-[#0F766E] p-8 text-white shadow-2xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">
            Bereit, deinen Container in Minuten zu mieten?
          </h2>
          <p className="text-white/80">
            Registriere dich und verwalte alles online.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-full bg-white/95 px-6 py-3 text-[#0B132B] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
          >
            Jetzt registrieren
          </Link>
          <Link
            to="/containers"
            className="rounded-full bg-white/10 px-6 py-3 text-white shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            Container ansehen
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
