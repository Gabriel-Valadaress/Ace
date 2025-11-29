import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import Layout from '../components/layout/Layout';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import ResendVerification from '../pages/ResendVerification';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Protected Pages
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateProfile from '../pages/CreateProfile';
import EditProfile from '../pages/EditProfile';
import Players from '../pages/Players';
import PlayerDetail from '../pages/PlayerDetail';

// Components
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Loading from '../components/common/Loading';

function AppRoutes() {
  const { loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Routes>
      {/* Public Routes (redirect to dashboard if logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes (redirect to login if not logged in) */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/create" element={<CreateProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:userId" element={<PlayerDetail />} />
        </Route>
      </Route>

      {/* Home page - accessible by all */}
      <Route path="/" element={<Home />} />

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;