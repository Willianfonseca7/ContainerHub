import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Containers from './pages/Containers';
import About from './pages/About';
import Contact from './pages/Contact';
import ContainerDetail from './pages/ContainerDetail';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';

export default function App() {
  const { isAuthenticated, profile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || profileLoading) return;
    const isProfileEdit = location.pathname.startsWith('/profile/edit');
    const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/auth/');
    const skipProfileRedirect = sessionStorage.getItem('skip_profile_redirect');
    if (skipProfileRedirect) {
      sessionStorage.removeItem('skip_profile_redirect');
      return;
    }
    if (!profile && !isProfileEdit && !isAuthRoute) {
      navigate('/profile/edit', { replace: true });
    }
  }, [isAuthenticated, profile, profileLoading, location.pathname, navigate]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/:provider/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/containers/:id" element={<ContainerDetail />} />
      </Routes>
    </AppShell>
  );
}
