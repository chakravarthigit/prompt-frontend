// Export all utils from other files
export * from './connectivity';
export * from './cookies';
export * from './api';

/**
 * Creates a URL for a page by name
 * @param {string} pageName - The name of the page
 * @returns {string} The URL for the page
 */
export const createPageUrl = (pageName) => {
  const pageRoutes = {
    'Home': '/',
    'Playground': '/playground',
    'Compare': '/compare',
    'Templates': '/templates',
    'Profile': '/profile',
    'Login': '/login',
    'Signup': '/signup',
    'ForgotPassword': '/forgot-password',
    'ResetPassword': '/reset-password',
  };

  return pageRoutes[pageName] || '/';
}; 