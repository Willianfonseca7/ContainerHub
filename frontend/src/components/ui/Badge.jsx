import React from 'react';

const variantClasses = {
  neutral: 'bg-[#F59E0B] text-white',
  success: 'bg-[#F59E0B] text-white',
  warning: 'bg-[#F59E0B] text-white',
  danger: 'bg-[#F59E0B] text-white',
  info: 'bg-[#F59E0B] text-white',
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
