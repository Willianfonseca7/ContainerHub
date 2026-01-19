import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { registerLocal } from '../services/auth';

const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
const EyeIcon = ({ open }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.17-5.94" />
        <path d="M1 1l22 22" />
        <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12" />
        <path d="M14.12 9.88 9.88 14.12" />
        <path d="M9.5 4.75A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-3.46 4.11" />
      </>
    )}
  </svg>
);

export default function Register() {
  const { t } = useI18n();
  const { setSession, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/profile/edit';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    phone: '',
    language: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) return t('register.errors.nameRequired');
    if (!nameRegex.test(value.trim())) return t('register.errors.nameNoNumbers');
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim() || !value.includes('@')) return t('register.errors.emailInvalid');
    return '';
  };

  const getPasswordStrength = (value) => {
    if (value.length < 8) return 'weak';
    const hasLetters = /[A-Za-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    if (hasLetters && hasNumbers) return 'strong';
    return 'medium';
  };

  const validatePassword = (value) => {
    if (!value) return t('register.errors.passwordRequired');
    const hasLetters = /[A-Za-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    if (value.length < 8 || !hasLetters || !hasNumbers) {
      return t('register.errors.passwordInvalid');
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!password || !confirmPassword) return '';
    if (password !== confirmPassword) return t('register.errors.confirmMismatch');
    return '';
  };

  const validateTerms = (checked) => {
    if (!checked) return t('register.errors.termsRequired');
    return '';
  };

  const buildValidation = (values) => ({
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    acceptTerms: validateTerms(values.acceptTerms),
  });

  const validation = useMemo(() => buildValidation(form), [form, t]);

  const passwordStrength = getPasswordStrength(form.password);
  const isValid =
    Object.values(validation).every((value) => !value) &&
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  const showError = (field) => touched[field] && errors[field];

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validation[field] }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      if (touched[field] && field !== 'confirmPassword') {
        const nextValidation = buildValidation(nextForm);
        setErrors((current) => ({ ...current, [field]: nextValidation[field] }));
      }
      return nextForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setErrors(validation);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });
    if (!isValid) {
      return;
    }
    try {
      const data = await registerLocal({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSession({ jwt: data.jwt, user: data.user });
      setErrors({});
      setSuccess(t('register.success'));
      sessionStorage.setItem('skip_profile_redirect', '1');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      const message = String(err?.message || '');
      const friendly = message.toLowerCase().includes('taken')
        ? t('register.errors.emailExists')
        : t('register.errors.failed');
      setErrors((prev) => ({
        ...prev,
        form: friendly,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-5 border border-[#E2ECE9] rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#0B132B]">{t('register.title')}</h1>
          <p className="text-sm text-[#52627A]">{t('register.subtitle')}</p>
        </div>
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label={t('register.name')}
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={showError('name')}
            className={showError('name') ? 'border-red-500' : ''}
          />
          <Input
            label={t('register.email')}
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={showError('email')}
            className={showError('email') ? 'border-red-500' : ''}
          />
          <label className="flex flex-col gap-1 text-sm font-medium text-[#1B2A47]">
            {t('register.password')}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full rounded-xl border bg-white px-3 py-2 pr-10 text-sm text-[#0B132B] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 ${
                  showError('password') ? 'border-red-500' : 'border-[#DDE7E4]'
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60728E] hover:text-[#0B132B]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {showError('password') ? (
              <span className="text-sm text-red-500">{errors.password}</span>
            ) : null}
          </label>
          {form.password.length > 0 ? (
            <p
              className={`text-sm ${
                passwordStrength === 'strong'
                  ? 'text-green-600'
                  : passwordStrength === 'medium'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {t('register.passwordStrength')}:{' '}
              {passwordStrength === 'strong'
                ? t('register.passwordStrong')
                : passwordStrength === 'medium'
                ? t('register.passwordMedium')
                : t('register.passwordWeak')}
            </p>
          ) : null}
          <label className="flex flex-col gap-1 text-sm font-medium text-[#1B2A47]">
            {t('register.confirmPassword')}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full rounded-xl border bg-white px-3 py-2 pr-10 text-sm text-[#0B132B] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 ${
                  showError('confirmPassword') ? 'border-red-500' : 'border-[#DDE7E4]'
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60728E] hover:text-[#0B132B]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {showError('confirmPassword') ? (
              <span className="text-sm text-red-500">{errors.confirmPassword}</span>
            ) : null}
          </label>

          <label className="flex items-start gap-2 text-sm text-[#52627A]">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              onBlur={() => handleBlur('acceptTerms')}
              className="mt-1"
            />
            <span>{t('register.terms')}</span>
          </label>
          {showError('acceptTerms') ? (
            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
          ) : null}

          {errors.form ? <p className="text-sm text-red-500">{errors.form}</p> : null}

          <Button type="submit" disabled={!isValid || loading} className="w-full">
            {loading ? <Spinner label={t('register.loading')} /> : t('register.submit')}
          </Button>
        </form>

        <div className="text-sm text-[#52627A]">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-[#0F766E] font-semibold hover:underline">
            {t('register.login')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
