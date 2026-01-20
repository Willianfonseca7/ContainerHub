import React from 'react';

export default function ImageSection({
  imageSrc,
  alt = '',
  className = '',
  overlayClassName = '',
  imageClassName = '',
  children,
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-xl ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover brightness-95 dark:brightness-90 ${imageClassName}`}
        loading="lazy"
      />
      <div
        className={`absolute inset-0 ${
          overlayClassName ||
          'bg-gradient-to-r from-white/85 via-white/60 to-white/20 dark:from-black/70 dark:via-black/55 dark:to-black/30'
        }`}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
