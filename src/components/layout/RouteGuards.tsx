import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * Route guard that requires active authentication.
 * Unauthenticated users are redirected to the common login page.
 */
export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  let isAuthed = isAuthenticated;
  if (!isAuthed) {
    const cached = localStorage.getItem('st2_cached_session');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.id && parsed?.role) {
          isAuthed = true;
        }
      } catch {
        // ignore
      }
    }
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Route guard that enforces role-based access.
 * E.g., prevents student accounts from accessing faculty desks.
 */
export const RoleRoute: React.FC<{
  allowedRoles: ('student' | 'faculty' | 'admin')[];
  redirectTo?: string;
  children?: React.ReactNode;
}> = ({ allowedRoles, redirectTo, children }) => {
  const { userRole, showToast } = useApp();

  let effectiveRole = userRole;
  if (!effectiveRole) {
    try {
      const cached = JSON.parse(localStorage.getItem('st2_cached_session') || '{}');
      if (cached.role) effectiveRole = cached.role;
    } catch {
      // ignore
    }
  }

  if (!allowedRoles.includes(effectiveRole)) {
    const fallback = redirectTo || (effectiveRole === 'faculty' ? '/faculty' : '/');
    showToast(
      'Access Restricted',
      `Your account (${effectiveRole ? effectiveRole.toUpperCase() : 'STUDENT'}) does not have permission for this portal.`,
      'error'
    );
    return <Navigate to={fallback} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Public-only route (e.g. Login page).
 * If user is already authenticated, redirects them to their respective portal.
 */
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userRole } = useApp();

  let isAuthed = isAuthenticated;
  let effectiveRole = userRole;

  if (!isAuthed) {
    try {
      const cached = JSON.parse(localStorage.getItem('st2_cached_session') || '{}');
      if (cached?.id && cached?.role) {
        isAuthed = true;
        effectiveRole = cached.role;
      }
    } catch {
      // ignore
    }
  }

  if (isAuthed) {
    const destination = effectiveRole === 'faculty' ? '/faculty' : '/';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
