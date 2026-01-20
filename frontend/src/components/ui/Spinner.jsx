import React from 'react';

export default function Spinner({ label }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#6B7280]/20 border-t-[#F59E0B]" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
