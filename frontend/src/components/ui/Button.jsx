import React from 'react';
import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAFA]';

const variants = {
  primary:
    'bg-gradient-to-r from-[#111827] to-[#1F2937] text-white shadow-lg hover:scale-[1.03] hover:shadow-xl dark:bg-gradient-to-r dark:from-[#020617] dark:to-[#111827]',
  ghost:
    'bg-gradient-to-r from-slate-100 to-slate-200 text-[#111827] shadow hover:scale-[1.02] hover:shadow-md dark:bg-gradient-to-r dark:from-[#1F2937] dark:to-[#111827] dark:text-slate-100',
  accent:
    'bg-[#F59E0B] text-[#111827] shadow-md hover:brightness-105 hover:shadow-lg',
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
