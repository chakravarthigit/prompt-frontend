import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { getCookie } from '../utils/cookies';
import Button from '../components/ui/button';
import Layout from '../Layout';
import TestimonialForm from '../components/profile/TestimonialForm';
import { API_BASE_URL } from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Check for active tab from localStorage (set when clicking from homepage)
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeProfileTab');
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
      // Clear it after using
      localStorage.removeItem('activeProfileTab');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);
    
    try {
      const updatedData = {
        name: formData.name,
      };
      
      await updateProfile(updatedData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = getCookie('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update password', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout currentPageName="Profile">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <User className="mr-2 h-6 w-6" />
                My Profile
              </h1>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 font-medium text-sm flex items-center ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-6 font-medium text-sm flex items-center ${
                    activeTab === 'security'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`py-4 px-6 font-medium text-sm flex items-center ${
                    activeTab === 'testimonials'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Testimonials
                </button>
              </nav>
            </div>

            <div className="p-6">
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-md ${
                    message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                        <div className="mt-5 border-t border-gray-200 pt-5">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-3 flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Name</dt>
                              <dd className="text-sm text-gray-900">{user?.name || '-'}</dd>
                            </div>
                            <div className="py-3 flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Email</dt>
                              <dd className="text-sm text-gray-900">{user?.email || '-'}</dd>
                            </div>
                            <div className="py-3 flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Member since</dt>
                              <dd className="text-sm text-gray-900">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="secondary"
                          size="md"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Edit Profile Information</h3>
                        <div className="mt-5 space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email (Cannot be changed)
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              disabled
                              className="bg-gray-100 cursor-not-allowed block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          variant="secondary"
                          size="md"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <form onSubmit={handlePasswordUpdate} className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sign out from all devices
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="md"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        icon={<LogOut className="h-4 w-4" />}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Your Testimonial</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Share your experience with PromptWizard. Your testimonial may be featured on our home page!
                    </p>
                  </div>
                  
                  <TestimonialForm 
                    user={user} 
                    onSubmitSuccess={(testimonial) => {
                      // In a real application, this would send the data to your backend
                      console.log('Testimonial submitted from profile:', testimonial);
                      
                      // Here you could also update local state to show user's testimonials
                      // For a complete implementation, you'd also fetch any existing testimonials
                    }} 
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 