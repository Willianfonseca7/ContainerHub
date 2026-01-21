import React from 'react';
import Card from '../ui/Card';
import PlanBadge from './PlanBadge';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';
import containerS from '../../img/containerS.png';
import containerM from '../../img/containerM.png';
import containerL from '../../img/containerL.png';

const sizeMeta = {
  S: { label: '≈ 7,5 m² · 10 ft', image: containerS },
  M: { label: '≈ 14,8 m² · 20 ft', image: containerM },
  L: { label: '≈ 29,8 m² · 40 ft', image: containerL },
};

export default function ContainerCard({ container, onBook }) {
  const { t } = useI18n();
  const { size, city, price, hasCamera, plan, status, code } = container;
  const meta = sizeMeta[size] || {};
  const isAvailable = status === 'available' || status === 'available';
  const handleBook = () => {
    if (typeof onBook === 'function') {
      onBook(container);
    }
  };
  const displayPrice =
    typeof price === 'number' && price > 0 ? t('cards.price', { value: price }) : t('cards.priceTbd');

  return (
    <Card className="p-4 flex flex-col gap-4">
      {meta.image ? (
        <div className="rounded-xl bg-[#0B1220] p-3 flex items-center justify-center">
          <img
            src={meta.image}
            alt={`Container ${size}`}
            className="h-20 w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#6B7280] dark:text-slate-400">#{code || container.id}</p>
          <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">
            Container {meta.label || size}
          </h3>
          <p className="text-sm text-[#6B7280] dark:text-slate-400">{city}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PlanBadge plan={plan} />
          {hasCamera ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#111827] dark:text-slate-100">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />{' '}
              {t('cards.camera')}
            </span>
          ) : (
            <span className="text-[11px] text-[#6B7280] dark:text-slate-400">{t('cards.pinOnly')}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-[#111827] dark:text-slate-100">
          {displayPrice}
        </div>
        <Button
          size="sm"
          variant={isAvailable ? 'primary' : 'ghost'}
          disabled={!isAvailable}
          onClick={handleBook}
          className={
            isAvailable
              ? 'rounded-xl bg-gradient-to-r from-[#111827] to-[#1F2937] text-white shadow-lg shadow-[#111827]/10 hover:scale-[1.01] hover:shadow-[#111827]/20 transition-transform'
              : ''
          }
        >
          {isAvailable ? 'Reservieren' : 'Nicht verfügbar'}
        </Button>
        {/* TODO auth: se usuário não estiver logado, redirecionar para /login?redirect=/containers/:id antes do submit */}
      </div>
    </Card>
  );
}
