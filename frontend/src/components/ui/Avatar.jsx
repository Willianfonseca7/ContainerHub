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
      className={`flex items-center justify-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 overflow-hidden ${className}`}
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
