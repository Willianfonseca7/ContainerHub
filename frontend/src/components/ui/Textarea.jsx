import React from 'react';

export default function Textarea({ label, error, className = '', ...props }) {
  const id = props.id || props.name;
  return (
    <label
      className="flex flex-col gap-1 text-sm font-medium text-[#111827] dark:text-slate-100"
      htmlFor={id}
    >
      {label}
      <textarea
        id={id}
        className={`rounded-xl bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#6B7280] shadow-sm ring-1 ring-[#6B7280]/20 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAFA] dark:bg-[#111827] dark:text-slate-100 dark:placeholder:text-slate-300 dark:focus:ring-offset-[#020617] ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
