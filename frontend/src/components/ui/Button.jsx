import React from 'react';
import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E]/40';

const variants = {
  primary: 'bg-[#0B132B] text-white hover:bg-[#0B132B]/90 focus:ring-[#0F766E]',
  ghost:
    'bg-transparent text-[#0B132B] border border-[#DDE7E4] hover:border-[#0F766E] focus:ring-[#0F766E]',
};

const sizes = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export default function Button({ as, to, children, variant = 'primary', size = 'md', ...props }) {
  const Component = as || (to ? Link : 'button');
  return (
    <Component className={`${base} ${variants[variant]} ${sizes[size]}`} to={to} {...props}>
      {children}
    </Component>
  );
}
