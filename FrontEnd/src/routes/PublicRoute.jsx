import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Public route wrapper - redirects to dashboard if already authenticated
 */
function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Get the page they were trying to visit
  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    // Already logged in, redirect to dashboard or previous page
    return <Navigate to={from} replace />;
  }

  // Render child routes
  return <Outlet />;
}

export default PublicRoute;