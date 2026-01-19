import React from 'react';

const variantClasses = {
  neutral: 'bg-[#E6F4F1] text-[#0B132B] border border-[#CFE7E2]',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  info: 'bg-[#E6F4F1] text-[#0F766E] border border-[#CFE7E2]',
};

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
