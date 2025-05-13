// Utility functions for handling cookies in the application
import Cookies from 'js-cookie';

// Set a cookie with customizable expiration and path
export const setCookie = (name, value, days = 7, path = '/') => {
  Cookies.set(name, value, {
    expires: days,
    path: path,
    sameSite: 'lax'
  });
};

// Get a cookie by name
export const getCookie = (name) => {
  return Cookies.get(name) || null;
};

// Remove a cookie
export const removeCookie = (name, path = '/') => {
  Cookies.remove(name, {
    path: path,
    sameSite: 'lax'
  });
};

// Check if a cookie exists
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

// Set JSON data as a cookie (serializes the data)
export const setJsonCookie = (name, value, days = 7, path = '/') => {
  setCookie(name, JSON.stringify(value), days, path);
};

// Get JSON data from a cookie (deserializes the data)
export const getJsonCookie = (name) => {
  const cookie = getCookie(name);
  if (cookie) {
    try {
      return JSON.parse(cookie);
    } catch (e) {
      console.error(`Error parsing JSON cookie ${name}:`, e);
      return null;
    }
  }
  return null;
}; 