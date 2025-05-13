import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Playground from './pages/playground';
import Compare from './pages/compare';
import Templates from './pages/templates';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import PrivacyPolicy from './pages/privacy-policy';
import TermsConditions from './pages/terms-conditions';
import NotFound404 from './pages/NotFound404';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SocialAuthFallback from './components/auth/SocialAuthFallback';
import { useAuth } from './components/auth/AuthContext';
import { checkActiveConnection } from './utils/connectivity';

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);
  
  // Check internet connection and redirect to 404 if offline
  useEffect(() => {
    let isFirstLoad = true;
    
    const checkConnectionStatus = async () => {
      try {
        const online = await checkActiveConnection();
        setIsOnline(online);
        
        // If offline and not already on 404 page, redirect to 404
        if (!online && location.pathname !== '/404') {
          navigate('/404', { replace: true });
        }
        // If back online and on 404 page, go to home
        else if (online && location.pathname === '/404' && !isFirstLoad) {
          navigate('/', { replace: true });
        }
        
        isFirstLoad = false;
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsOnline(false);
      }
    };
    
    // Check connection initially
    checkConnectionStatus();
    
    // Set up event listeners
    const handleOnline = () => checkConnectionStatus();
    const handleOffline = () => {
      setIsOnline(false);
      if (location.pathname !== '/404') {
        navigate('/404', { replace: true });
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection status periodically
    const intervalId = setInterval(checkConnectionStatus, 10000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [navigate, location.pathname]);
  
  // Redirect unauthenticated users to login when accessing protected routes directly via URL
  useEffect(() => {
    if (isOnline) {
      const protectedPaths = ['/playground', '/compare', '/templates', '/profile'];
      if (!isAuthenticated() && protectedPaths.includes(location.pathname)) {
        navigate('/login', { state: { from: location } });
      }
    }
  }, [isAuthenticated, location, navigate, isOnline]);

  return (
    <Routes>
      {/* If offline, redirect everything to 404 except the 404 page itself */}
      {!isOnline ? (
        <>
          <Route path="/404" element={<NotFound404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Handle social auth fallbacks */}
          <Route path="/auth/callback" element={<SocialAuthFallback />} />
          
          {/* 404 page for unmatched routes */}
          <Route path="/404" element={<NotFound404 />} />
          <Route path="*" element={<NotFound404 />} />
        </>
      )}
    </Routes>
  );
}

export default App; 