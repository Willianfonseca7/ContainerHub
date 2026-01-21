import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';

export default function ReservationPreviewModal({ open, container, onClose, onContinue }) {
  const { t } = useI18n();
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
    typeof priceValue === 'number' && priceValue > 0
      ? t('cards.price', { value: priceValue })
      : t('cards.priceTbd');
  const totalValue =
    typeof priceValue === 'number' && priceValue > 0 ? priceValue * duration : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <Card className="w-full max-w-lg p-6 space-y-4 bg-white dark:bg-[#111827]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
              {t('reservation.preview.title')}
            </p>
            <h2 className="text-xl font-semibold text-[#111827] dark:text-slate-100">
              {container?.code ? `#${container.code}` : t('reservation.containerLabel')}
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-slate-400">
              {container?.city} • {t('reservation.sizeLabel')} {container?.size}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {container?.hasCamera ? (
              <Badge variant="success">{t('reservation.cameraBadge')}</Badge>
            ) : (
              <Badge variant="neutral">{t('reservation.pinBadge')}</Badge>
            )}
          </div>
        </div>

        <div className="space-y-1 text-sm text-[#111827] dark:text-slate-100">
          <p>
            <span className="font-semibold">{t('reservation.preview.price')}:</span> {priceText}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#111827] dark:text-slate-100">
              {t('reservation.preview.duration')}
            </p>
            <div className="flex flex-col gap-1">
              {[1, 6, 12].map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm text-[#111827] dark:text-slate-100">
                  <input
                    type="radio"
                    name="duration"
                    value={m}
                    checked={duration === m}
                    onChange={() => setDuration(m)}
                    className="text-[#111827] focus:ring-[#F59E0B]"
                  />
                  {m === 1 ? t('reservation.preview.monthly') : t('reservation.preview.months', { count: m })}
                </label>
              ))}
            </div>
            <p className="text-sm text-[#111827] dark:text-slate-100">
              <span className="font-semibold">{t('reservation.preview.total')}:</span>{' '}
              {totalValue !== null ? `€ ${totalValue.toFixed(2)}` : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {t('reservation.preview.cancel')}
          </Button>
          <Button onClick={() => onContinue?.(duration)}>{t('reservation.preview.continue')}</Button>
        </div>
      </Card>
    </div>
  );
}
