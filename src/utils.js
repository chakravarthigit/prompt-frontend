/**
 * Creates a URL for a page with the given name
 * @param {string} pageName - The name of the page
 * @returns {string} - The URL for the page
 */
export function createPageUrl(pageName) {
  if (!pageName) return '/';
  
  // Handle Home page as a special case
  if (pageName.toLowerCase() === 'home') return '/';
  
  // Convert page name to lowercase for consistency
  return `/${pageName.toLowerCase()}`;
} 