import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white/95 border border-[#E2ECE9] rounded-2xl card-shadow ${className}`}
    >
      {children}
    </div>
  );
}
