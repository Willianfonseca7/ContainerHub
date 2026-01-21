import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getContainers } from '../services/api';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../services/reservations';
import { paymentOptions } from '../constants/paymentMethods';
import { useI18n } from '../context/I18nContext';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  startDate: '',
  endDate: '',
  paymentMethod: '',
  termsAccepted: false,
  message: '',
};

const LAST_RESERVATION_KEY = 'containerhub_last_reservation';

export default function ContainerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateContainer = location.state?.container;
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [container, setContainer] = useState(stateContainer || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitState, setSubmitState] = useState({ loading: false, success: '', error: '' });
  const [lastReservation, setLastReservation] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(LAST_RESERVATION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let mounted = true;
    // Se já veio via state, não refazer fetch desnecessário
    if (stateContainer && (String(stateContainer.id) === String(id) || String(stateContainer.code) === String(id))) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError('');
    getContainers()
      .then((list) => {
        const found = (list || []).find(
          (item) => String(item.id) === String(id) || String(item.code) === String(id),
        );
        if (mounted) setContainer(found || null);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || t('reservation.loadError'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, stateContainer]);

  const isAvailable =
    (container?.availabilityStatus || container?.status || 'available') === 'available';

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.username || user.fullName || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const nextValue = type === 'checkbox' ? checked : value;
      const nextForm = { ...prev, [name]: nextValue };
      if (name === 'startDate' && nextValue) {
        const start = new Date(nextValue);
        if (!Number.isNaN(start.getTime())) {
          const minEnd = new Date(start);
          minEnd.setMonth(minEnd.getMonth() + 1);
          const minEndIso = minEnd.toISOString().slice(0, 10);
          if (!nextForm.endDate || nextForm.endDate < minEndIso) {
            nextForm.endDate = minEndIso;
          }
        }
      }
      return nextForm;
    });
  };

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = t('reservation.errors.nameRequired');
    if (!form.email.trim()) errors.email = t('reservation.errors.emailRequired');
    if (!form.phone.trim()) errors.phone = t('reservation.errors.phoneRequired');
    if (!form.startDate) errors.startDate = t('reservation.errors.startRequired');
    if (!form.endDate) errors.endDate = t('reservation.errors.endRequired');
    if (form.endDate && form.startDate) {
      const start = new Date(form.startDate);
      const minEnd = new Date(start);
      minEnd.setMonth(minEnd.getMonth() + 1);
      const end = new Date(form.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        errors.endDate = t('reservation.errors.endInvalid');
      } else if (end < minEnd) {
        errors.endDate = t('reservation.errors.endMin');
      }
    }
    if (!form.paymentMethod) errors.paymentMethod = t('reservation.errors.paymentRequired');
    if (!form.termsAccepted) errors.termsAccepted = t('reservation.errors.termsRequired');
    return errors;
  };

  const errors = useMemo(() => validate(), [form]);
  const shouldShowError = (field) => (touched[field] || submitAttempted) && errors[field];
  const minEndDate = useMemo(() => {
    if (!form.startDate) return '';
    const start = new Date(form.startDate);
    if (Number.isNaN(start.getTime())) return '';
    const minEnd = new Date(start);
    minEnd.setMonth(minEnd.getMonth() + 1);
    return minEnd.toISOString().slice(0, 10);
  }, [form.startDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const validationErrors = validate();
    if (!isAuthenticated) {
      const returnTo = `/containers/${container?.id || id}?reserve=1`;
      localStorage.setItem(
        'containerhub_intent',
        JSON.stringify({
          type: 'reserve',
          containerId: container?.id || id,
          returnTo,
        }),
      );
      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (Object.keys(validationErrors).length) {
      setSubmitState({ loading: false, success: '', error: Object.values(validationErrors).join(' ') });
      return;
    }

    // TODO auth: se não autenticado, redirecionar para /login?redirect=/containers/:id
    // TODO auth: validar se usuário já tem pedido ativo antes de enviar

    setSubmitState({ loading: true, success: '', error: '' });

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      paymentMethod: form.paymentMethod,
      termsAccepted: Boolean(form.termsAccepted),
      message: form.message || null,
      status: 'pending',
      container: container?.id,
    };

    try {
      // eslint-disable-next-line no-console
      console.log('Reservation payload', payload);
      const created = await createReservation(payload, token);
      const createdData = created?.data?.attributes || created?.data || created;
      const reservationSnapshot = {
        id: created?.data?.id || createdData?.id || null,
        fullName: createdData?.fullName ?? payload.fullName,
        email: createdData?.email ?? payload.email,
        startDate: createdData?.startDate ?? payload.startDate,
        endDate: createdData?.endDate ?? payload.endDate,
        paymentMethod: createdData?.paymentMethod ?? payload.paymentMethod,
        status: createdData?.status ?? payload.status,
        containerCode: container?.code || container?.id,
      };
      localStorage.setItem(LAST_RESERVATION_KEY, JSON.stringify(reservationSnapshot));
      setLastReservation(reservationSnapshot);
      setSubmitState({
        loading: false,
        success: t('reservation.success'),
        error: '',
      });
      setForm(initialForm);
      setTouched({});
      setSubmitAttempted(false);
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } catch (err) {
      const status = err?.status;
      // eslint-disable-next-line no-console
      console.error('Reservation error', status, err?.data || err);
      let message = t('reservation.errors.submitFail');
      if (status === 401 || status === 403) {
        message = t('reservation.errors.loginRequired');
      } else if (status === 400) {
        message = t('reservation.errors.fillRequired');
      }
      setSubmitState({
        loading: false,
        success: '',
        error: message,
      });
    }
  };

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-[#6B7280] dark:text-slate-400">{t('reservation.loading')}</p>
      </div>
    );
  }

  if (error || !container) {
    return (
      <div className="py-10">
        <p className="text-rose-600">
          {error ? `${t('reservation.loadError')} ${error}` : t('reservation.notFound')}
        </p>
      </div>
    );
  }

  const priceValue =
    container.price ?? container.priceMonthly ?? container.price_monthly ?? container.price;
  const priceText =
    typeof priceValue === 'number' && priceValue > 0
      ? t('cards.price', { value: priceValue })
      : t('cards.priceTbd');

  return (
    <div className="py-10 space-y-6">
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
              {t('reservation.containerLabel')}
            </p>
            <h1 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">
              #{container.code || container.id}
            </h1>
            <p className="text-sm text-[#6B7280] dark:text-slate-400">
              {container.city} • {t('reservation.sizeLabel')} {container.size}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {container.hasCamera ? (
              <Badge variant="success">{t('reservation.cameraBadge')}</Badge>
            ) : (
              <Badge variant="neutral">{t('reservation.pinBadge')}</Badge>
            )}
            <Badge
              variant={isAvailable ? 'success' : 'neutral'}
            >
              {t('reservation.statusLabel', {
                value: container.availabilityStatus || container.status,
              })}
            </Badge>
          </div>
        </div>
        <p className="text-xl font-bold text-[#111827] dark:text-slate-100">{priceText}</p>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
            {t('reservation.badge')}
          </p>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-slate-100">
            {t('reservation.title')}
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-slate-400">
            {t('reservation.subtitle')}
          </p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label={t('reservation.name')}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
            error={shouldShowError('fullName')}
            required
          />
          <Input
            label={t('reservation.email')}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            error={shouldShowError('email')}
            required
          />
          <Input
            label={t('reservation.phone')}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            error={shouldShowError('phone')}
            required
          />
          <Input
            label={t('reservation.startDate')}
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            onFocus={(e) => e.target.showPicker?.()}
            onBlur={() => setTouched((prev) => ({ ...prev, startDate: true }))}
            error={shouldShowError('startDate')}
            required
          />
          <Input
            label={t('reservation.endDate')}
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            min={minEndDate || undefined}
            onFocus={(e) => e.target.showPicker?.()}
            onBlur={() => setTouched((prev) => ({ ...prev, endDate: true }))}
            error={shouldShowError('endDate')}
            required
          />
          <Select
            label={t('reservation.paymentMethod')}
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, paymentMethod: true }))}
            error={shouldShowError('paymentMethod')}
            required
          >
            <option value="">{t('reservation.paymentPlaceholder')}</option>
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`paymentMethods.${option.value}`)}
              </option>
            ))}
          </Select>
          <div className="md:col-span-2">
            <Textarea
              label={t('reservation.message')}
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <label className="md:col-span-2 flex items-start gap-2 text-sm text-[#6B7280] dark:text-slate-400">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, termsAccepted: true }))}
              className="mt-1 accent-[#F59E0B]"
            />
            <span>{t('reservation.terms')}</span>
          </label>
          {shouldShowError('termsAccepted') ? (
            <div className="md:col-span-2 text-xs text-rose-600">
              {errors.termsAccepted}
            </div>
          ) : null}

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={!isAvailable || submitState.loading}>
              {isAvailable
                ? submitState.loading
                  ? t('reservation.sending')
                  : t('reservation.submit')
                : t('reservation.unavailable')}
            </Button>
            {submitState.success ? (
              <span className="text-sm text-[#F59E0B]">{submitState.success}</span>
            ) : null}
            {submitState.error ? (
              <span className="text-sm text-rose-600">{submitState.error}</span>
            ) : null}
          </div>
        </form>
      </Card>

      {lastReservation ? (
        <Card className="p-6 space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
            {t('reservation.latest')}
          </p>
          <p className="text-lg font-semibold text-[#111827] dark:text-slate-100">
            #{lastReservation.containerCode || container?.code || container?.id}
          </p>
          <div className="text-sm text-[#6B7280] dark:text-slate-400 space-y-1">
            <p>{lastReservation.fullName}</p>
            <p>{lastReservation.email}</p>
            <p>
              {lastReservation.startDate}
              {lastReservation.endDate ? ` – ${lastReservation.endDate}` : ''}
            </p>
            <p>
              {t('reservation.statusLabel', {
                value: lastReservation.status || 'pending',
              })}
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
