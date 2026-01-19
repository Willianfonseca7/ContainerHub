import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import LanguageSwitcher from '../domain/LanguageSwitcher';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { resolveMediaUrl } from '../../services/profile';

export default function Navbar() {
  const { t } = useI18n();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/containers', label: t('nav.containers') },
    { to: '/sobre', label: t('nav.about') },
    { to: '/contato', label: t('nav.contact') },
  ];

  useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('mousedown', handler);
    }
    return () => window.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const avatarUrl = useMemo(() => {
    const url = profile?.avatar?.url || profile?.avatar?.data?.attributes?.url || user?.photoURL;
    return resolveMediaUrl(url) || '';
  }, [profile, user]);

  const displayName =
    profile?.fullName || user?.username || user?.email || t('profile.defaultName');

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-20 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          ContainerHub
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={t('profile.menuProfile')}
              >
                <Avatar src={avatarUrl} name={displayName} size={36} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg py-2 text-sm text-slate-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-left hover:bg-slate-50"
                    onClick={closeMenu}
                  >
                    {t('profile.menuProfile')}
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-left hover:bg-slate-50"
                    onClick={closeMenu}
                  >
                    {t('profile.menuEdit')}
                  </Link>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50"
                    onClick={handleLogout}
                  >
                    {t('profile.menuLogout')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button as={Link} to="/login" variant="ghost" size="sm">
              {t('auth.login')}
            </Button>
          )}
          
        </div>
      </div>
    </header>
  );
}
