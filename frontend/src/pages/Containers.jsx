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

const sizeIllustrations = ['S', 'M', 'L'].reduce((acc, size) => {
  const svg = `<svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" rx="18" fill="#E6F4F1"/>
  <rect x="18" y="36" width="284" height="108" rx="12" fill="url(#g)"/>
  <rect x="36" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="112" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="188" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="264" y="54" width="16" height="72" fill="rgba(255,255,255,0.15)"/>
  <text x="160" y="105" font-family="Space Grotesk, sans-serif" font-size="34" font-weight="700" fill="#f8fafc" text-anchor="middle">Size ${size}</text>
  <text x="160" y="132" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="600" fill="#D1E9E3" text-anchor="middle">PIN-Zugang • Optionale 24/7-Kamera</text>
</svg>`;
  acc[size] = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return acc;
}, {});

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
      className="overflow-hidden cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 transition hover:-translate-y-[1px]"
    >
      <div className="h-44 w-full bg-[#E6F4F1]">
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
            <p className="text-xs uppercase tracking-[0.18em] text-[#60728E]">{t('containers.badge')}</p>
            <h3 className="text-xl font-semibold text-[#0B132B]">
              Container {meta?.label || size}
            </h3>
          </div>
          <Badge variant="neutral">{t('cards.units', { count: total })}</Badge>
        </div>
        <div className="space-y-1 text-sm text-[#52627A]">
          <p className="text-[#0B132B] font-semibold">{priceText}</p>
          <p>{t('containers.locations', { value: locations || '—' })}</p>
          <p>{t('containers.available', { value: available > 0 ? available : '—' })}</p>
          <p>{t('containers.plans', { basic, premium })}</p>
          <p className="text-xs text-[#60728E]">{t('containers.info')}</p>
        </div>
        {!total && !loading ? (
          <div className="rounded-xl border border-dashed border-[#CFE7E2] bg-[#F5FBFA] p-3 text-sm text-[#60728E]">
            {t('containers.emptySize')}
          </div>
        ) : null}
        {total ? (
          <div className="pt-2">
            <Button
              size="sm"
              variant="primary"
              className="w-full rounded-xl bg-gradient-to-r from-[#0B132B] to-[#0F766E] text-white shadow-lg shadow-[#0B132B]/10 hover:scale-[1.01] hover:shadow-[#0B132B]/20 transition-transform"
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
        <p className="text-xs uppercase tracking-[0.18em] text-[#0F766E]">{t('containers.badge')}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#0B132B]">{t('containers.title')}</h1>
          <Button variant="ghost" size="sm" onClick={reload}>
            {t('containers.reload')}
          </Button>
        </div>
        <p className="text-sm text-[#52627A]">{t('containers.description')}</p>
      </header>

      <FiltersBar filters={filters} onChange={setFilter} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
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
          <div className="md:col-span-3 rounded-2xl border border-dashed border-[#CFE7E2] bg-white p-4 text-[#52627A]">
            {t('containers.emptyAll')}
          </div>
        ) : null}
      </div>

      <section className="rounded-3xl border border-[#E2ECE9] bg-white p-6 card-shadow space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[#0F766E]">
          {t('containers.fidelizationTitle')}
        </p>
        <h2 className="text-2xl font-semibold text-[#0B132B]">{t('containers.fidelizationSubtitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-white border border-[#E2ECE9] text-[#0B132B]">
            <p className="text-sm uppercase tracking-[0.18em] text-[#60728E]">{t('containers.sixMonths')}</p>
            <h3 className="text-xl font-semibold text-[#0B132B]">{t('containers.sixMonths')}</h3>
            <p className="text-sm text-[#52627A]">{t('containers.sixDesc')}</p>
          </Card>
          <Card className="p-4 bg-[#F5FBFA] border-[#E2ECE9]">
            <p className="text-sm uppercase tracking-[0.18em] text-[#60728E]">{t('containers.twelveTitle')}</p>
            <h3 className="text-xl font-semibold text-[#0B132B]">{t('containers.twelveTitle')}</h3>
            <p className="text-sm text-[#52627A]">{t('containers.twelveDesc')}</p>
          </Card>
        </div>
      </section>

      {isAdmin() ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#0F766E]">
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
        <div className="rounded-2xl border border-dashed border-[#CFE7E2] bg-[#F5FBFA] p-4 text-sm text-[#52627A]">
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
            // TODO: implementar /login com redirect
            navigate(`/login?redirect=${encodeURIComponent('/containers')}`);
            return;
          }
          navigate(targetPath, { state: { container: selectedContainer } });
        }}
      />
    </div>
  );
}
