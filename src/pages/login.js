import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKeyhole, Mail, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { getCookie } from '../utils/cookies';
import Button from '../components/ui/button';
import Layout from '../Layout';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import starLogo from '../assets/logo.png';

// Country codes data
const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+7', country: 'Russia' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+27', country: 'South Africa' },
  { code: '+234', country: 'Nigeria' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
];

// Flip animation variants
const flipVariants = {
  hidden: { 
    rotateY: 90,
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    rotateY: -90,
    opacity: 0,
    scale: 0.95,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Email form component
const EmailForm = React.memo(({ value, onChange }) => (
  <motion.div 
    key="email-form"
    variants={flipVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="w-full mb-2"
  >
    <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700 mb-1">
      Email address
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Mail className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="emailOrMobile"
        name="emailOrMobile"
        type="email"
        autoComplete="email"
        required
        value={value}
        onChange={onChange}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md"
        placeholder="you@example.com"
      />
    </div>
  </motion.div>
));

// Mobile form component
const MobileForm = React.memo(({ value, countryCode, onChange }) => (
  <motion.div 
    key="mobile-form"
    variants={flipVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="w-full mb-2"
  >
    <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700 mb-1">
      Mobile Number
    </label>
    <div className="relative flex">
      <div className="flex-shrink-0">
        <select
          name="countryCode"
          value={countryCode}
          onChange={onChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-2 px-2 sm:text-sm border border-gray-300 rounded-l-md w-[90px]"
        >
          {countryCodes.map(country => (
            <option key={country.code} value={country.code}>
              {country.code} {country.country}
            </option>
          ))}
        </select>
      </div>
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="emailOrMobile"
          name="emailOrMobile"
          type="tel"
          autoComplete="tel"
          required
          value={value}
          onChange={onChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-r-md border-l-0"
          placeholder="Phone number"
        />
      </div>
    </div>
  </motion.div>
));

const LoginFormContainer = React.memo(({ loginMethod, formData, handleChange }) => (
  <div className="min-h-90 perspective-1000">
    <AnimatePresence initial={false} mode="wait">
      {loginMethod === 'email' ? 
        <EmailForm 
          key="email-form" 
          value={formData.emailOrMobile} 
          onChange={handleChange} 
        /> : 
        <MobileForm 
          key="mobile-form" 
          value={formData.emailOrMobile} 
          countryCode={formData.countryCode} 
          onChange={handleChange} 
        />
      }
    </AnimatePresence>
  </div>
));

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, socialLogin } = useAuth();
  const [loginMethod, setLoginMethod] = useState('email'); // Separate state for login method
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    countryCode: '+1',
    rememberMe: true, // Default to true for better user experience
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState('');

  const from = location.state?.from?.pathname || '/playground';

  // Check if there's a success message in location state (e.g., after signup)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/playground', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const toggleLoginMethod = () => {
    // Only update login method and clear the input field
    setLoginMethod(prevMethod => prevMethod === 'email' ? 'mobile' : 'email');
    setFormData({
      ...formData,
      emailOrMobile: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const userData = await login(
        formData.emailOrMobile, 
        formData.password, 
        loginMethod === 'mobile' ? formData.countryCode : undefined
      );
      
      // Verify auth data was properly saved before redirecting
      const sessionToken = sessionStorage.getItem('authToken');
      const cookieToken = getCookie('authToken');
      console.log('Post-login check - Session token:', sessionToken ? 'exists' : 'null');
      console.log('Post-login check - Cookie token:', cookieToken ? 'exists' : 'null');
      
      setSuccessMessage('Login successful! Redirecting...');
      
      // Add a slight delay to ensure cookies are set before navigation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      console.error('Login error in component:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessMessage('');
      setIsSocialLoading('google');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Pass the user data to your backend
      await socialLogin('google', {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL
      });
      
      setSuccessMessage('Login successful! Redirecting...');
      
      // Add a slight delay to ensure cookies are set before navigation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsSocialLoading('');
    }
  };

  return (
    <Layout currentPageName="Login">
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <img src={starLogo} alt="PromptWizard Logo" className="h-10 w-auto mr-2" />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                PromptWizard
              </h2>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Become a Wizard
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          <div className="flex justify-center space-x-6 mb-4">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => toggleLoginMethod()}
                className={`p-3 rounded-full transition-colors duration-300 flex items-center justify-center ${
                  loginMethod === 'email'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Use Email"
              >
                <Mail className="h-5 w-5" />
              </button>
              <span className="text-xs mt-1 text-gray-500">Email</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => toggleLoginMethod()}
                className={`p-3 rounded-full transition-colors duration-300 flex items-center justify-center ${
                  loginMethod === 'mobile'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Use Mobile"
              >
                <Phone className="h-5 w-5" />
              </button>
              <span className="text-xs mt-1 text-gray-500">Mobile</span>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <LoginFormContainer 
                loginMethod={loginMethod}
                formData={formData}
                handleChange={handleChange}
              />
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={!!isSocialLoading}
                className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
              >
                {isSocialLoading === 'google' ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Google
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
} 