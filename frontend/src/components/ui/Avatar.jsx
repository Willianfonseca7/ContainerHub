import React from 'react';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function Avatar({ src, name, size = 36, className = '' }) {
  const initials = getInitials(name);
  const dimension = `${size}px`;
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#111827] overflow-hidden dark:bg-[#1F2937] dark:text-slate-100 ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label={name || 'User avatar'}
    >
      {src ? (
        <img src={src} alt={name || 'User avatar'} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold">{initials}</span>
      )}
    </div>
  );
}
