import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import FiltersBar from '../components/domain/FiltersBar';
import ContainerGrid from '../components/domain/ContainerGrid';
import { normalizeText, useContainerHub } from '../context/ContainerHubContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import ReservationPreviewModal from '../components/domain/ReservationPreviewModal';
import containerS from '../img/containerS.png';
import containerM from '../img/containerM.png';
import containerL from '../img/containerL.png';

const sizeMeta = {
  S: {
    label: '≈ 7,5 m² · 10 ft',
    base: 110,
    example6: 99,
    econ6: 66,
  },
  M: {
    label: '≈ 14,8 m² · 20 ft',
    base: 170,
    example6: 153,
    econ6: 102,
  },
  L: {
    label: '≈ 29,8 m² · 40 ft',
    base: 250,
    example6: 225,
    econ6: 150,
  },
};

const sizeIllustrations = {
  S: containerS,
  M: containerM,
  L: containerL,
};

function getPriceValue(item) {
  const raw = item?.price ?? item?.priceMonthly ?? item?.price_monthly;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function formatPriceText(noCam, cam, lang, t) {
  const noCamText = noCam !== null ? `€${noCam}` : '—';
  const camText = cam !== null ? `€${cam}` : '—';
  return lang === 'de'
    ? `Ab ${noCamText}/Monat • Kamera ab ${camText}/Monat`
    : `From ${noCamText}/month • Camera from ${camText}/month`;
}

function SizeCard({ size, items, loading, t, lang, onClick, disabled }) {
  const imgSrc = sizeIllustrations[size];
  const total = items.length;
  const available = items.filter((i) => (i.status || i.availabilityStatus || 'available') === 'available').length;
  const premium = items.filter((i) => (i.plan || (i.hasCamera ? 'premium' : 'basic')) === 'premium').length;
  const basic = items.filter((i) => (i.plan || (i.hasCamera ? 'premium' : 'basic')) === 'basic').length;
  const locations = Array.from(
    new Set(items.map((i) => i.city || i.location || '—')),
  ).join(' • ');
  const meta = sizeMeta[size];

  const pricesNoCam = items
    .filter((i) => !(i.hasCamera ?? i.has_camera))
    .map(getPriceValue)
    .filter((v) => v !== null);
  const pricesCam = items
    .filter((i) => i.hasCamera ?? i.has_camera)
    .map(getPriceValue)
    .filter((v) => v !== null);

  const minNoCam = pricesNoCam.length ? Math.min(...pricesNoCam) : null;
  const minCam = pricesCam.length ? Math.min(...pricesCam) : null;
  const priceText = formatPriceText(minNoCam, minCam, lang, t);

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && onClick?.()}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="overflow-hidden cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 transition hover:-translate-y-[1px]"
    >
      <div className="h-44 w-full bg-[#FAFAFA] dark:bg-[#020617]">
        <img
          src={imgSrc}
          alt={`Container ${size}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280] dark:text-slate-400">{t('containers.badge')}</p>
          <h3 className="text-xl font-semibold text-[#111827] dark:text-slate-100">
            Container {meta?.label || size}
          </h3>
          </div>
          <Badge variant="neutral">{t('cards.units', { count: total })}</Badge>
        </div>
        <div className="space-y-1 text-sm text-[#6B7280] dark:text-slate-400">
          <p className="text-[#111827] font-semibold dark:text-slate-100">{priceText}</p>
          <p>{t('containers.locations', { value: locations || '—' })}</p>
          <p>{t('containers.available', { value: available > 0 ? available : '—' })}</p>
          <p>{t('containers.plans', { basic, premium })}</p>
          <p className="text-xs text-[#6B7280] dark:text-slate-400">{t('containers.info')}</p>
        </div>
        {!total && !loading ? (
          <div className="rounded-xl bg-[#FAFAFA] p-3 text-sm text-[#6B7280] shadow-sm dark:bg-[#111827] dark:text-slate-400">
            {t('containers.emptySize')}
          </div>
        ) : null}
        {total ? (
          <div className="pt-2">
            <Button
              size="sm"
              variant="primary"
              className="w-full rounded-xl bg-gradient-to-r from-[#111827] to-[#1F2937] text-white shadow-lg shadow-[#111827]/10 hover:scale-[1.01] hover:shadow-[#111827]/20 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              disabled={disabled}
            >
              Reservieren
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

// TODO: replace with real auth
function isAdmin() {
  return typeof localStorage !== 'undefined' && localStorage.getItem('role') === 'admin';
}

export default function Containers() {
  const { filteredContainers, filters, setFilter, loading, error, reload, containers } = useContainerHub();
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);

  const selectedLocation = filters.location;

  const grouped = ['S', 'M', 'L'].map((size) => {
    const items = filteredContainers.filter((c) => {
      const sizeMatch = normalizeText(c.size || c.sizeM2) === normalizeText(size);
      const cityValue = c.city || c.location;
      const locationMatch =
        selectedLocation === 'all' ||
        normalizeText(cityValue) === normalizeText(selectedLocation) ||
        normalizeText(cityValue) === normalizeText(
          selectedLocation === 'Köln' ? 'Koln' : selectedLocation,
        );
      return sizeMatch && locationMatch;
    });

    if (process.env.NODE_ENV !== 'production' && items.length === 0 && containers.length > 0) {
      const uniqueCities = Array.from(
        new Set(containers.map((c) => normalizeText(c.city || c.location))),
      );
      // eslint-disable-next-line no-console
      console.debug(
        '[containers] contagem 0 para tamanho',
        size,
        'loc',
        selectedLocation,
        'cidades API:',
        uniqueCities,
      );
    }

    return { size, items };
  });

  const hasNoData = containers.length === 0;

  const pickFirstAvailableBySize = (all, size) => {
    const list = Array.isArray(all) ? all : [];
    return list.find((c) => {
      const s = c.size || c.sizeM2 || c.sizeValue;
      const st = c.status || c.availabilityStatus || c.availability_status;
      return String(s || '').toUpperCase() === String(size || '').toUpperCase() && String(st) === 'available';
    });
  };

  useEffect(() => {
    const qsSize = searchParams.get('size');
    if (qsSize) {
      setFilter('size', qsSize.toUpperCase());
      const el = document.getElementById('inventory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams, setFilter]);

  const handleSelectSize = async (size) => {
    try {
      const fromState = filteredContainers?.length ? filteredContainers : containers;
      let all = fromState;
      if (!Array.isArray(all) || all.length === 0) {
        const { getContainers: fetchContainers } = await import('../services/api');
        all = await fetchContainers();
      }
      const first = pickFirstAvailableBySize(all, size);
      if (!first?.id) {
        alert('Nenhum container disponível para este tamanho agora.');
        return;
      }
      setSelectedContainer(first);
      setSelectedDuration(1);
      setIsPreviewOpen(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('handleSelectSize failed:', e);
      alert('Falha ao abrir o detalhe do container. Veja o console.');
    }
  };

  return (
    <div className="space-y-6 py-10" id="inventory">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">{t('containers.badge')}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#111827] dark:text-slate-100">{t('containers.title')}</h1>
        </div>
        <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('containers.description')}</p>
      </header>

      <FiltersBar filters={filters} onChange={setFilter} />

      {error ? (
        <div className="rounded-2xl bg-rose-50 p-4 text-rose-700 shadow-sm dark:bg-rose-950/30">
          {t('containers.emptyAll')} {error.message || ''}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {grouped.map(({ size, items }) => (
          <SizeCard
            key={size}
            size={size}
            items={items}
            loading={loading}
            t={t}
            lang={lang}
            onClick={() => handleSelectSize(size)}
            disabled={!items.length}
          />
        ))}
        {hasNoData ? (
          <div className="md:col-span-3 rounded-2xl bg-white p-4 text-[#6B7280] shadow-sm dark:bg-[#111827] dark:text-slate-400">
            {t('containers.emptyAll')}
          </div>
        ) : null}
      </div>

      <section className="rounded-3xl bg-white p-6 card-shadow space-y-3 dark:bg-[#111827]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
          {t('containers.fidelizationTitle')}
        </p>
        <h2 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">{t('containers.fidelizationSubtitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-white text-[#111827] dark:bg-[#0B1220] dark:text-slate-100">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6B7280] dark:text-slate-400">{t('containers.sixMonths')}</p>
            <h3 className="text-xl font-semibold text-[#111827] dark:text-slate-100">{t('containers.sixMonths')}</h3>
            <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('containers.sixDesc')}</p>
          </Card>
          <Card className="p-4 bg-[#FAFAFA] dark:bg-[#0B1220]">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6B7280] dark:text-slate-400">{t('containers.twelveTitle')}</p>
            <h3 className="text-xl font-semibold text-[#111827] dark:text-slate-100">{t('containers.twelveTitle')}</h3>
            <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('containers.twelveDesc')}</p>
          </Card>
        </div>
      </section>

      {isAdmin() ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
            {t('containers.listTitle')}
          </p>
          <ContainerGrid
            containers={filteredContainers}
            loading={loading}
            onBook={(container) => {
              setSelectedContainer(container);
              setSelectedDuration(1);
              setIsPreviewOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-[#FAFAFA] p-4 text-sm text-[#6B7280] shadow-sm dark:bg-[#111827] dark:text-slate-400">
          {t('containers.adminOnly')}
        </div>
      )}

      <ReservationPreviewModal
        open={isPreviewOpen}
        container={selectedContainer}
        onClose={() => setIsPreviewOpen(false)}
        onContinue={(duration) => {
          if (!selectedContainer?.id) return;
          const draft = {
            containerId: selectedContainer.id,
            code: selectedContainer.code,
            size: selectedContainer.size || selectedContainer.sizeM2,
            city: selectedContainer.city || selectedContainer.location,
            hasCamera: selectedContainer.hasCamera ?? selectedContainer.has_camera,
            priceMonthly: selectedContainer.priceMonthly ?? selectedContainer.price,
            durationMonths: duration || selectedDuration,
          };
          sessionStorage.setItem('reservationDraft', JSON.stringify(draft));
          const targetPath = `/containers/${selectedContainer.id}`;
          if (!isAuthenticated) {
            const intent = {
              type: 'reserve',
              containerId: selectedContainer.id,
              returnTo: `${targetPath}?reserve=1`,
            };
            localStorage.setItem('containerhub_intent', JSON.stringify(intent));
            navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
            return;
          }
          navigate(targetPath, { state: { container: selectedContainer } });
        }}
      />
    </div>
  );
}
