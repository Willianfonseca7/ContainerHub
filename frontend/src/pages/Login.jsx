import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SocialButton from '../components/auth/SocialButton';
import { useI18n } from '../context/I18nContext';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/containers';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, redirectTo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('auth.errors.required'));
      return;
    }
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || t('auth.errors.failed'));
    }
  };

  const handleSocial = (provider) => {
    alert(t('auth.socialSoon', { provider }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">{t('auth.title')}</h1>
          <p className="text-sm text-slate-600">{t('auth.subtitle')}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('auth.loading') : t('auth.login')}
          </Button>
        </form>

        <div className="text-sm text-slate-600">
          {t('auth.noAccount')}{' '}
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              alert(t('auth.registerSoon'));
            }}
            className="text-slate-900 font-semibold hover:underline"
          >
            {t('auth.register')}
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>{t('auth.or')}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-3">
          <SocialButton provider="google" onClick={() => handleSocial('Google')} />
          <SocialButton provider="facebook" onClick={() => handleSocial('Facebook')} />
        </div>
      </div>
    </div>
  );
}
