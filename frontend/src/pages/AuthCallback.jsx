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

  const redirectTo = searchParams.get('redirect') || '/containers';
  const accessToken = searchParams.get('access_token');
  const providerError = searchParams.get('error');

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
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        setError(err?.message || 'Falha no login social.');
      });
  }, [provider, providerError, accessToken, completeSocialLogin, navigate, redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-3 border border-[#E2ECE9] rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[#0B132B]">{t('auth.title')}</h1>
        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : (
          <p className="text-sm text-[#52627A]">
            {loading ? t('auth.loading') : 'Conectando com provedor...'}
          </p>
        )}
      </div>
    </div>
  );
}
