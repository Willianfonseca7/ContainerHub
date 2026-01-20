import React from 'react';

export default function Select({ label, error, className = '', children, ...props }) {
  const id = props.id || props.name;
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-[#111827]" htmlFor={id}>
      {label}
      <select
        id={id}
        className={`rounded-xl bg-white px-3 py-2 text-sm text-[#111827] shadow-sm ring-1 ring-[#6B7280]/20 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAFA] dark:bg-[#020617] dark:text-slate-100 dark:focus:ring-offset-[#020617] ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
