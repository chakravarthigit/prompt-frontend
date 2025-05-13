import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  User,
  Sparkles,
  Wand2,
  LayoutGrid,
  BookOpenCheck,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "./components/auth/AuthContext";
import CookieConsent from "./components/CookieConsent";
import useScrollDirection from "./hooks/useScrollDirection";

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isScrollingUp, isScrolledToTop } = useScrollDirection();
  
  // Show navbar if user is at top of page or scrolling up
  const showNavbar = isScrollingUp || isScrolledToTop;
  
  const pageLinks = [
    { name: "Home", path: "Home", icon: <Home className="w-5 h-5" /> },
    { name: "Playground", path: "Playground", icon: <Wand2 className="w-5 h-5" /> },
    { name: "Compare", path: "Compare", icon: <LayoutGrid className="w-5 h-5" /> },
    { name: "Templates", path: "Templates", icon: <BookOpenCheck className="w-5 h-5" /> }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 font-sans">
      <div 
        className="navbar-sentinel h-2 w-full fixed top-0 z-40" 
        aria-hidden="true"
      />
      {/* Navigation bar */}
      <nav 
        className={`
          bg-white/70 backdrop-blur-md shadow-md navbar-fixed navbar-transition
          ${showNavbar ? "navbar-visible" : "navbar-hidden"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={createPageUrl("Home")} className="flex items-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    repeatDelay: 5
                  }}
                >
                  <Sparkles className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  PromptWizard
                </span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {pageLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.path)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPageName === link.name ? 
                    'text-indigo-600 bg-indigo-50' : 
                    'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Link>
              ))}
              
              {user ? (
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPageName === 'Profile' ? 
                    'text-indigo-600 bg-indigo-50' : 
                    'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2">Profile</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPageName === 'Login' ? 
                    'text-indigo-600 bg-indigo-50' : 
                    'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  <span className="ml-2">Sign In</span>
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white/70 backdrop-blur-md border-t border-purple-100`}>
          <div className="pt-2 pb-3 space-y-1">
            {pageLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  currentPageName === link.name ? 
                  'text-indigo-600 bg-indigo-50' : 
                  'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                onClick={toggleMobileMenu}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
            
            {user ? (
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  currentPageName === 'Profile' ? 
                  'text-indigo-600 bg-indigo-50' : 
                  'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                onClick={toggleMobileMenu}
              >
                <User className="w-5 h-5" />
                <span className="ml-2">Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  currentPageName === 'Login' ? 
                  'text-indigo-600 bg-indigo-50' : 
                  'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                onClick={toggleMobileMenu}
              >
                <LogIn className="w-5 h-5" />
                <span className="ml-2">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main 
        className={`${isScrolledToTop ? 'pt-16' : 'pt-4'} transition-padding duration-300 ease-in-out`}
      >
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span className="ml-2 text-sm font-medium text-gray-600">
                Made by PromptWizards 🧙‍♂️
              </span>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center space-x-4">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-indigo-500 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="text-gray-500 hover:text-indigo-500 text-sm">
                Terms & Conditions
              </Link>
              <a 
                href="https://www.linkedin.com/in/chakravarthi-guduru-904802255/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-indigo-500 text-sm"
              >
                Contact Us
              </a>
              <a href="https://www.linkedin.com/in/chakravarthi-guduru-904802255/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://github.com/chakravarthigit" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}