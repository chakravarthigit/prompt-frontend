// API configuration
export const API_BASE_URL = 'https://prompt-backend-03rd.onrender.com';

// Helper function for making authenticated API requests
export const fetchWithAuth = async (endpoint, options = {}) => {
  // Get token from cookies or storage
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] ||
               sessionStorage.getItem('authToken') ||
               localStorage.getItem('authToken');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge options
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  // Make the request
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }
      
      return data;
    } else {
      // Return non-JSON response
      if (!response.ok) {
        throw new Error('API request failed');
      }
      return await response.text();
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}; 