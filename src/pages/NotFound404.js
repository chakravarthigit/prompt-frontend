import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, Home as HomeIcon } from "lucide-react";
import Button from "../components/ui/button";
import { checkActiveConnection } from "../utils/connectivity";

const NotFound404 = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const navigate = useNavigate();

  // Monitor online/offline status and prevent navigation to other pages when offline
  useEffect(() => {
    const checkConnectivity = async () => {
      const connected = await checkActiveConnection();
      setIsOnline(connected);
    };
    
    // Check connection status immediately
    checkConnectivity();
    
    const handleOnline = async () => {
      const isConnected = await checkActiveConnection();
      setIsOnline(isConnected);
      if (isConnected) {
        // If we're back online, redirect to home after a short delay
        setTimeout(() => navigate("/", { replace: true }), 1500);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    // Set up event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Capture all link clicks to prevent navigation when offline
    const handleLinkClick = (e) => {
      if (!isOnline) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    document.addEventListener("click", handleLinkClick, true);
    
    // Periodically check connection status
    const intervalId = setInterval(checkConnectivity, 10000);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("click", handleLinkClick, true);
      clearInterval(intervalId);
    };
  }, [isOnline, navigate]);

  // Handle retry connection
  const handleRetryConnection = async () => {
    setIsCheckingConnection(true);
    try {
      const connected = await checkActiveConnection();
      setIsOnline(connected);
      if (connected) {
        setTimeout(() => navigate("/", { replace: true }), 1000);
      }
    } finally {
      setIsCheckingConnection(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-sm border border-purple-100 text-center"
      >
        <div className="four_zero_four_bg h-80 bg-center bg-no-repeat bg-cover relative" 
             style={{ 
               backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)'
             }}>
          <h1 className="text-8xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text absolute top-0 left-0 right-0">
            404
          </h1>
        </div>
        
        <div className="-mt-12 space-y-4">
          {!isOnline ? (
            <>
              <h3 className="text-2xl font-semibold text-gray-800">
                No Internet Connection
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Please check your network connection and try again.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleRetryConnection} 
                  variant="primary"
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 mt-4"
                  disabled={isCheckingConnection}
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${isCheckingConnection ? 'animate-spin' : ''}`} />
                  {isCheckingConnection ? 'Checking Connection...' : 'Retry Connection'}
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-gray-800">
                Looks like you're lost
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                The page you are looking for is not available!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/">
                  <Button 
                    variant="primary"
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 mt-4"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound404; 