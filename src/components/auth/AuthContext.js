import React, { createContext, useState, useEffect, useContext } from 'react';
import { setCookie, getCookie, removeCookie, setJsonCookie, getJsonCookie } from '../../utils/cookies';
import { API_BASE_URL } from '../../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in using cookies instead of localStorage
    const token = getCookie('authToken');
    const userData = getJsonCookie('user');
    
    if (token && userData) {
      try {
        setUser(userData);
        // Extend token life on each page load/refresh for better persistence
        setCookie('authToken', token, 30); // Extend to 30 days
        setJsonCookie('user', userData, 30);
      } catch (error) {
        console.error('Error parsing user data', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (emailOrMobile, password, countryCode) => {
    try {
      console.log('Login attempt with:', emailOrMobile);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for receiving cookies
        body: JSON.stringify({ emailOrMobile, password, countryCode }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data in both cookies and sessionStorage as backup
      setCookie('authToken', data.token, 30); // 30 days expiry instead of 7
      setJsonCookie('user', data.user, 30);
      // Backup in sessionStorage in case cookies aren't working properly
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token); // Add localStorage as additional backup
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      // Verify user is set properly after login
      console.log('User set after login:', data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password, mobileNumber, countryCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ name, email, password, mobileNumber, countryCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Important: Set user to null immediately to prevent race conditions
      setUser(null);
      
      // Force clean all storage
      // Local cookie cleanup
      removeCookie('authToken');
      removeCookie('user');
      
      // SessionStorage cleanup
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      
      // LocalStorage cleanup
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Add a delay to ensure state updates before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Add a console log to confirm tokens are cleared
      console.log('Auth tokens cleared, state:', { 
        cookieToken: getCookie('authToken'),
        sessionToken: sessionStorage.getItem('authToken'),
        localToken: localStorage.getItem('authToken'),
        user
      });
      
      // Then call the backend to clear HTTP-only cookies
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.warn('Backend logout call failed, but local tokens are cleared:', err);
      }
      
      // Force a hard reload to clear any cached state after backend call
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // No need to clear items again since we did it at the beginning
      // Force navigation to login on error
      window.location.href = '/login';
    }
  };

  const updateProfile = async (userData) => {
    try {
      // Get token from both cookies and sessionStorage
      const token = getCookie('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update user data in cookies and sessionStorage
      setJsonCookie('user', data.user, 7);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Add an isAuthenticated check method that uses multiple auth sources
  const isAuthenticated = () => {
    // First check current user state
    if (user !== null) return true;
    
    // Check cookies first (primary storage)
    const cookieToken = getCookie('authToken');
    const cookieUser = getJsonCookie('user');
    if (cookieToken && cookieUser) {
      // If found in cookies but not in state, reload to state
      if (!user) {
        setUser(cookieUser);
      }
      return true;
    }
    
    // Fallback to sessionStorage
    const sessionToken = sessionStorage.getItem('authToken');
    const sessionUser = sessionStorage.getItem('user');
    if (sessionToken && sessionUser) {
      try {
        // If found in session but not in state or cookies, restore to both
        if (!user) {
          const parsedUser = JSON.parse(sessionUser);
          setUser(parsedUser);
          setCookie('authToken', sessionToken, 30);
          setJsonCookie('user', parsedUser, 30);
        }
        return true;
      } catch (e) {
        console.error('Error parsing session user data', e);
      }
    }
    
    // Final fallback to localStorage
    const localToken = localStorage.getItem('authToken');
    const localUser = localStorage.getItem('user');
    if (localToken && localUser) {
      try {
        // If found in localStorage but nowhere else, restore to all
        if (!user) {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
          setCookie('authToken', localToken, 30);
          setJsonCookie('user', parsedUser, 30);
          sessionStorage.setItem('authToken', localToken);
          sessionStorage.setItem('user', localUser);
        }
        return true;
      } catch (e) {
        console.error('Error parsing local user data', e);
      }
    }
    
    return false;
  };

  const socialLogin = async (provider, userData) => {
    try {
      console.log(`${provider} login attempt with:`, userData.email);
      const response = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for receiving cookies
        body: JSON.stringify({
          provider,
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          photoURL: userData.photoURL
        }),
      });

      const data = await response.json();
      console.log(`${provider} login response:`, data);

      if (!response.ok) {
        throw new Error(data.message || `${provider} login failed`);
      }

      // Store auth data in both cookies and sessionStorage as backup
      setCookie('authToken', data.token, 30); // 30 days expiry
      setJsonCookie('user', data.user, 30);
      // Backup in sessionStorage in case cookies aren't working properly
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token); // Add localStorage as additional backup
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      // Verify user is set properly after login
      console.log('User set after social login:', data.user);
      return data;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated,
        socialLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 