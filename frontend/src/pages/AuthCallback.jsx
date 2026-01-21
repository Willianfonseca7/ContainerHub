import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

const PROVIDERS = new Set(['google', 'facebook']);

export default function AuthCallback() {
  const { completeSocialLogin, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const redirectTo =
    searchParams.get('redirect') || hashParams.get('redirect') || '/containers';
  const accessToken =
    searchParams.get('access_token') || hashParams.get('access_token');
  const providerError = searchParams.get('error') || hashParams.get('error');

  useEffect(() => {
    if (!provider || !PROVIDERS.has(provider)) {
      setError('Provedor nao suportado.');
      return;
    }
    if (providerError) {
      setError(providerError);
      return;
    }
    if (!accessToken) {
      setError('Token de acesso nao encontrado.');
      return;
    }

    completeSocialLogin(provider, accessToken)
      .then(() => {
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
      })
      .catch((err) => {
        setError(err?.message || 'Falha no login social.');
      });
  }, [provider, providerError, accessToken, completeSocialLogin, navigate, redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1F2937] dark:shadow-xl">
        <h1 className="text-xl font-semibold text-[#111827] dark:text-slate-100">{t('auth.title')}</h1>
        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : (
          <p className="text-sm text-[#6B7280] dark:text-slate-400">
            {loading ? t('auth.loading') : 'Conectando com provedor...'}
          </p>
        )}
      </div>
    </div>
  );
}
