import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SocialAuthFallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get error info from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    console.error('Social auth error:', error, errorDescription);
    
    // Redirect back to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login', { 
        state: { 
          socialAuthError: errorDescription || 'Authentication failed. Please try again.'
        }
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-amber-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-6">
          There was a problem with the authentication process. 
          Redirecting you back to the login page...
        </p>
        <div className="relative">
          <div className="animate-pulse h-2 w-full rounded-full bg-indigo-100">
            <div className="h-2 rounded-full bg-indigo-500 animate-progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthFallback; 