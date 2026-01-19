import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ReservationPreviewModal({ open, container, onClose, onContinue }) {
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  const priceValue = container?.priceMonthly ?? container?.price ?? container?.price_monthly ?? null;
  const priceText =
    typeof priceValue === 'number' && priceValue > 0 ? `€ ${priceValue} / Monat` : 'Preis auf Anfrage';
  const totalValue =
    typeof priceValue === 'number' && priceValue > 0 ? priceValue * duration : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <Card className="w-full max-w-lg p-6 space-y-4 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0F766E]">Reservierung prüfen</p>
            <h2 className="text-xl font-semibold text-[#0B132B]">
              {container?.code ? `#${container.code}` : 'Container'}
            </h2>
            <p className="text-sm text-[#52627A]">
              {container?.city} • Size {container?.size}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {container?.hasCamera ? <Badge variant="success">Kamera 24/7</Badge> : <Badge variant="neutral">PIN</Badge>}
          </div>
        </div>

        <div className="space-y-1 text-sm text-[#1B2A47]">
          <p>
            <span className="font-semibold">Preis:</span> {priceText}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#0B132B]">Dauer wählen</p>
            <div className="flex flex-col gap-1">
              {[1, 6, 12].map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm text-[#1B2A47]">
                  <input
                    type="radio"
                    name="duration"
                    value={m}
                    checked={duration === m}
                    onChange={() => setDuration(m)}
                    className="text-[#0B132B] focus:ring-[#0F766E]"
                  />
                  {m === 1 ? 'Monatlich (1 Monat)' : `${m} Monate`}
                </label>
              ))}
            </div>
            <p className="text-sm text-[#1B2A47]">
              <span className="font-semibold">Gesamt:</span>{' '}
              {totalValue !== null ? `€ ${totalValue.toFixed(2)}` : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={() => onContinue?.(duration)}>Weiter</Button>
        </div>
      </Card>
    </div>
  );
}
