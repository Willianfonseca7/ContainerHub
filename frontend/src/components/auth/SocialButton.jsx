import React from 'react';
import Button from '../ui/Button';

const labels = {
  google: 'Continuar com Google',
  facebook: 'Continuar com Facebook',
};

export default function SocialButton({ provider, onClick, disabled }) {
  const label = labels[provider] || 'Login Social';
  return (
    <Button
      variant="ghost"
      className="w-full text-[#111827] justify-start"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-sm">{label}</span>
    </Button>
  );
}
