import React from 'react';

export default function Spinner({ label }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-[#52627A]">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#CFE7E2] border-t-[#0F766E]" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
