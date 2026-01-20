import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-2xl dark:shadow-black/40 ${className}`}
    >
      {children}
    </div>
  );
}
