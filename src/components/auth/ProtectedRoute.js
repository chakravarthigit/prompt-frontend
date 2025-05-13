import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookies';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isAuthed, setIsAuthed] = useState(null);
  
  // Check authentication on mount and when auth state changes
  useEffect(() => {
    // Check multiple sources for authentication
    const cookieToken = getCookie('authToken');
    const sessionToken = sessionStorage.getItem('authToken');
    const localToken = localStorage.getItem('authToken');
    const authStatus = isAuthenticated();
    
    console.log('ProtectedRoute check - Cookie token:', cookieToken ? 'exists' : 'null');
    console.log('ProtectedRoute check - Session token:', sessionToken ? 'exists' : 'null');
    console.log('ProtectedRoute check - Local token:', localToken ? 'exists' : 'null');
    console.log('ProtectedRoute check - Auth status:', authStatus);
    console.log('ProtectedRoute check - User state:', user ? 'logged in' : 'not logged in');
    console.log('Current location:', location.pathname);
    
    setIsAuthed(authStatus);
    
    // Re-check authentication every 2 seconds to ensure it stays fresh
    const interval = setInterval(() => {
      const currentAuthStatus = isAuthenticated();
      
      // If auth status changes, update state
      if (currentAuthStatus !== isAuthed) {
        console.log('Auth status changed:', currentAuthStatus);
        setIsAuthed(currentAuthStatus);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user, location.pathname, isAuthed]);
  
  // Show loading or null state
  if (isAuthed === null) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthed) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute; 