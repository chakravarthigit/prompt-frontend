import React, { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../utils/cookies';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = getCookie('cookieConsent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookie('cookieConsent', 'true', 365); // Set cookie for a year
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0 text-sm">
          <p>
            This website uses cookies to enhance your experience. By continuing to use our site, 
            you agree to our use of cookies in accordance with our Privacy Policy.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Accept
          </button>
          <a
            href="/privacy-policy"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 