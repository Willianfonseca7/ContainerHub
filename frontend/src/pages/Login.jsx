import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SocialButton from '../components/auth/SocialButton';
import { useI18n } from '../context/I18nContext';
import { validateRequired } from '../utils/validation';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

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
    if (validateRequired(email, t('auth.errors.required')) || validateRequired(password, t('auth.errors.required'))) {
      setError(t('auth.errors.required'));
      return;
    }
    try {
      await login(email, password);
      const intent = localStorage.getItem('containerhub_intent');
      if (intent) {
        try {
          const parsed = JSON.parse(intent);
          if (parsed?.type === 'reserve' && parsed?.returnTo) {
            localStorage.removeItem('containerhub_intent');
            navigate(parsed.returnTo, { replace: true });
            return;
          }
        } catch {
          localStorage.removeItem('containerhub_intent');
        }
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || t('auth.errors.failed'));
    }
  };

  const handleSocial = (provider) => {
    const callbackUrl = `${window.location.origin}/auth/${provider}/callback?redirect=${encodeURIComponent(
      redirectTo,
    )}`;
    const url = `${BASE_URL}/api/connect/${provider}?callback=${encodeURIComponent(callbackUrl)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">{t('auth.title')}</h1>
          <p className="text-sm text-[#6B7280] dark:text-slate-400">{t('auth.subtitle')}</p>
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

        <div className="text-sm text-[#6B7280] dark:text-slate-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-[#F59E0B] font-semibold hover:underline">
            {t('auth.register')}
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#6B7280] dark:text-slate-400">
          <div className="h-px flex-1 bg-[#6B7280]/20 dark:bg-slate-700" />
          <span>{t('auth.or')}</span>
          <div className="h-px flex-1 bg-[#6B7280]/20 dark:bg-slate-700" />
        </div>

        <div className="space-y-3">
          <SocialButton provider="google" onClick={() => handleSocial('google')} />
          <SocialButton provider="facebook" onClick={() => handleSocial('facebook')} />
        </div>
      </div>
    </div>
  );
}
