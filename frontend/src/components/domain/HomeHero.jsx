import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  return (
    <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.span
          variants={itemVariants}
          className="text-xs font-semibold uppercase tracking-[0.22em] text-[#60728E]"
        >
          ContainerHub
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-semibold leading-tight text-[#0B132B]"
        >
          Sichere Container mit PIN-Zugang und optionaler 24/7-Kamera.
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg text-[#52627A]">
          Online mieten, PIN erhalten und alles per Smartphone verwalten – 100% webbasiert, ohne
          Bürokratie.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-[#0B132B] to-[#0F766E] px-6 py-3 text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
          >
            Jetzt registrieren
          </Link>
          <Link
            to="/containers"
            className="rounded-full bg-gradient-to-r from-[#E6F4F1] to-[#F7FBFA] px-6 py-3 text-[#0B132B] shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            Container ansehen
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-3xl bg-gradient-to-br from-white to-[#F1F7F6] p-6 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7B8AA1]">
          How it works
        </p>
        <div className="mt-4 space-y-4">
          {[
            'Einheit wählen (Ort, Größe, Plan).',
            'PIN erhalten – bei Premium die Kamera nutzen.',
            'Monatlich zahlen und online verlängern.',
          ].map((step, idx) => (
            <div key={step} className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B132B] text-white text-sm font-semibold">
                {idx + 1}
              </span>
              <p className="text-[#52627A]">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
