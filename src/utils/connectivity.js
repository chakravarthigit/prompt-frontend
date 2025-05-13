/**
 * Utility functions for monitoring internet connectivity.
 */

// Check connection by pinging a small resource
export const checkActiveConnection = async () => {
  try {
    // Try fetching a small resource with cache-busting to verify actual connectivity
    // eslint-disable-next-line no-unused-vars
    const response = await fetch("/favicon.ico", {
      method: "HEAD",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      mode: "no-cors",
      // Add a cache-busting query parameter
      cache: "no-store"
    });
    return true;
  } catch (error) {
    console.error("Connection check failed:", error);
    return false;
  }
};

// Register connection status hooks across the app
export const registerConnectionListeners = (onlineCallback, offlineCallback) => {
  const handleOnline = () => {
    // Double-check with active test to make sure the connection is really back
    checkActiveConnection().then(isReally => {
      if (isReally) {
        onlineCallback();
      }
    });
  };
  
  const handleOffline = () => {
    offlineCallback();
  };

  // Add event listeners
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return a cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

// Periodically check connectivity in the background
export const startPeriodicConnectivityCheck = (onlineCallback, offlineCallback, intervalMs = 30000) => {
  const intervalId = setInterval(async () => {
    const isConnected = await checkActiveConnection();
    if (isConnected) {
      onlineCallback();
    } else {
      offlineCallback();
    }
  }, intervalMs);

  // Return function to stop periodic checks
  return () => clearInterval(intervalId);
}; 