import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import { resolveMediaUrl } from '../services/profile';

export default function Profile() {
  const { t } = useI18n();
  const { isAuthenticated, profile, profileLoading, user } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = useMemo(() => {
    const url = profile?.avatar?.url || profile?.avatar?.data?.attributes?.url || user?.photoURL;
    return resolveMediaUrl(url);
  }, [profile, user]);

  if (!isAuthenticated) {
    return (
      <div className="py-16">
        <Card className="p-6 space-y-3">
          <h1 className="text-xl font-semibold text-[#111827] dark:text-slate-100">{t('profile.title')}</h1>
          <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('profile.loginRequired')}</p>
          <Button as={Link} to="/login?redirect=/profile" variant="primary" size="sm">
            {t('auth.login')}
          </Button>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="py-16">
        <Spinner label={t('profile.loading')} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-16">
        <Card className="p-6 space-y-3">
          <h1 className="text-xl font-semibold text-[#111827] dark:text-slate-100">{t('profile.title')}</h1>
          <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('profile.missing')}</p>
          <Button onClick={() => navigate('/profile/edit')} size="sm">
            {t('profile.complete')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">{t('profile.subtitle')}</p>
          <h1 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">{t('profile.title')}</h1>
        </div>
        <Button as={Link} to="/profile/edit" variant="ghost" size="sm">
          {t('profile.menuEdit')}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar src={avatarUrl} name={profile.fullName} size={64} />
            <div>
              <p className="text-lg font-semibold text-[#111827] dark:text-slate-100">{profile.fullName}</p>
              <p className="text-sm text-[#6B7280] dark:text-slate-400">{profile.email || user?.email || '—'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-[#111827] dark:text-slate-100">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#6B7280] dark:text-slate-400">{t('profile.phone')}</p>
              <p>{profile.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#6B7280] dark:text-slate-400">{t('profile.payment')}</p>
              <Badge variant="info">
                {t(`paymentMethods.${profile.paymentMethod}`) || profile.paymentMethod}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6B7280] dark:text-slate-400">{t('profile.address')}</p>
          <div className="text-sm text-[#111827] dark:text-slate-100 space-y-1">
            <p>{profile.addressStreet || '—'} {profile.addressNumber || ''}</p>
            <p>{profile.addressZip || '—'} {profile.addressCity || ''}</p>
            <p>{profile.addressCountry || '—'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
