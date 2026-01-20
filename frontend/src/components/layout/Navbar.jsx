import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';
import LanguageSwitcher from '../domain/LanguageSwitcher';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { resolveMediaUrl } from '../../services/profile';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { t } = useI18n();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur sticky top-0 z-20 shadow-sm dark:shadow-xl dark:shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-[#111827] dark:text-slate-100">
          ContainerHub
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-[#111827] dark:text-slate-100'
                    : 'text-[#6B7280] hover:text-[#111827] dark:text-slate-400 dark:hover:text-slate-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full bg-white dark:bg-[#111827] p-2 text-[#111827] dark:text-slate-100 shadow-sm hover:shadow-md transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:ring-offset-2 focus:ring-offset-[#FAFAFA] dark:focus:ring-offset-[#020617]"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={t('profile.menuProfile')}
              >
                <Avatar src={avatarUrl} name={displayName} size={36} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white dark:bg-[#111827] shadow-lg py-2 text-sm text-[#111827] dark:text-slate-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-left hover:bg-[#FAFAFA] dark:hover:bg-[#1F2937]"
                    onClick={closeMenu}
                  >
                    {t('profile.menuProfile')}
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-left hover:bg-[#FAFAFA] dark:hover:bg-[#1F2937]"
                    onClick={closeMenu}
                  >
                    {t('profile.menuEdit')}
                  </Link>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
