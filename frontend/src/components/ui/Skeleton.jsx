import React from 'react';

export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-[#E6F4F1] ${className}`} />;
}
