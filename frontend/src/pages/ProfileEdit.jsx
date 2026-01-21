import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import { getMyProfile, upsertMyProfile, uploadAvatar, resolveMediaUrl } from '../services/profile';
import { paymentOptions } from '../constants/paymentMethods';

export default function ProfileEdit() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated, token, profile, profileLoading, refreshProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localProfile, setLocalProfile] = useState(profile);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressStreet: '',
    addressNumber: '',
    addressZip: '',
    addressCity: '',
    addressCountry: '',
    paymentMethod: '',
    avatar: null,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (profile) {
      setLocalProfile(profile);
      setForm({
        fullName: profile.fullName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        addressStreet: profile.addressStreet || '',
        addressNumber: profile.addressNumber || '',
        addressZip: profile.addressZip || '',
        addressCity: profile.addressCity || '',
        addressCountry: profile.addressCountry || '',
        paymentMethod: profile.paymentMethod || '',
        avatar: profile.avatar?.id || null,
      });
      return;
    }
    if (!token) return;
    setLoading(true);
    getMyProfile(token)
      .then((data) => {
        setLocalProfile(data);
        setForm({
          fullName: data?.fullName || '',
          email: data?.email || user?.email || '',
          phone: data?.phone || '',
          addressStreet: data?.addressStreet || '',
          addressNumber: data?.addressNumber || '',
          addressZip: data?.addressZip || '',
          addressCity: data?.addressCity || '',
          addressCountry: data?.addressCountry || '',
          paymentMethod: data?.paymentMethod || '',
          avatar: data?.avatar?.id || null,
        });
      })
      .catch((err) => setError(err?.message || t('profile.error')))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, profile, user, t]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile/edit', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const avatarUrl = useMemo(() => {
    const url =
      localProfile?.avatar?.url || localProfile?.avatar?.data?.attributes?.url || user?.photoURL;
    return resolveMediaUrl(url);
  }, [localProfile, user]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;
    setSaving(true);
    setError('');
    try {
      const uploaded = await uploadAvatar(token, file);
      setLocalProfile((prev) => ({ ...(prev || {}), avatar: uploaded }));
      setForm((prev) => ({ ...prev, avatar: uploaded?.id ?? null }));
    } catch (err) {
      setError(err?.message || t('profile.errorUpload'));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setError('');
    setSuccess('');
    if (!form.fullName.trim() || !form.paymentMethod) {
      setError(t('profile.required'));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email || user?.email,
        phone: form.phone,
        addressStreet: form.addressStreet,
        addressNumber: form.addressNumber,
        addressZip: form.addressZip,
        addressCity: form.addressCity,
        addressCountry: form.addressCountry,
        paymentMethod: form.paymentMethod,
        avatar: form.avatar,
      };
      const updated = await upsertMyProfile(token, payload);
      setLocalProfile(updated);
      await refreshProfile(token);
      setSuccess(t('profile.saved'));
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err?.message || t('profile.error'));
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (profileLoading || loading) {
    return (
      <div className="py-16">
        <Spinner label={t('profile.loading')} />
      </div>
    );
  }

  return (
    <div className="py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
            {t('profile.editSubtitle')}
          </p>
          <h1 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">{t('profile.editTitle')}</h1>
        </div>
        <Button as={Link} to="/profile" variant="ghost" size="sm">
          {t('profile.menuProfile')}
        </Button>
      </div>

      <Card className="p-6 space-y-5">
        {!localProfile ? (
          <div className="rounded-xl bg-[#F59E0B]/15 px-4 py-3 text-sm text-[#111827] shadow-sm dark:text-slate-100">
            {t('profile.complete')}
          </div>
        ) : null}
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} name={form.fullName || user?.username} size={64} />
          <div className="space-y-1">
            <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('profile.avatar')}</p>
            <label className="text-sm text-[#6B7280] dark:text-slate-400 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <span className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#0B1220] px-3 py-1.5 text-sm shadow-sm hover:shadow-md">
                {saving ? t('profile.uploading') : t('profile.upload')}
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('profile.name')}
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            label={t('profile.email')}
            value={form.email}
            readOnly
            className="bg-[#FAFAFA] text-[#6B7280] dark:bg-[#0B1220] dark:text-slate-400"
          />
          <Input
            label={t('profile.phone')}
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Select
            label={t('profile.payment')}
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
          >
            <option value="">{t('profile.paymentPlaceholder')}</option>
            {paymentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(`paymentMethods.${opt.value}`)}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('profile.addressStreet')}
            value={form.addressStreet}
            onChange={(e) => setForm((prev) => ({ ...prev, addressStreet: e.target.value }))}
          />
          <Input
            label={t('profile.addressNumber')}
            value={form.addressNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, addressNumber: e.target.value }))}
          />
          <Input
            label={t('profile.addressZip')}
            value={form.addressZip}
            onChange={(e) => setForm((prev) => ({ ...prev, addressZip: e.target.value }))}
          />
          <Input
            label={t('profile.addressCity')}
            value={form.addressCity}
            onChange={(e) => setForm((prev) => ({ ...prev, addressCity: e.target.value }))}
          />
          <Input
            label={t('profile.addressCountry')}
            value={form.addressCountry}
            onChange={(e) => setForm((prev) => ({ ...prev, addressCountry: e.target.value }))}
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm text-[#F59E0B]">{success}</p> : null}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" as={Link} to="/profile">
            {t('profile.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t('profile.saving') : t('profile.save')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
