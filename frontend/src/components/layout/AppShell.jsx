import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111827] dark:bg-gradient-to-b dark:from-[#020617] dark:via-[#020617] dark:to-[#020617] dark:text-slate-100">
      <Navbar />
      <main className="flex-1 px-4 pb-16 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
