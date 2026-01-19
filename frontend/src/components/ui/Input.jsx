import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  const id = props.id || props.name;
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-[#1B2A47]" htmlFor={id}>
      {label}
      <input
        id={id}
        className={`rounded-xl border border-[#DDE7E4] bg-white px-3 py-2 text-sm text-[#0B132B] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
