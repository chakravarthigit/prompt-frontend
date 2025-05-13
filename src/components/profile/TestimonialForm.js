import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Check } from 'lucide-react';
import Button from '../ui/button';
import { API_BASE_URL } from '../../utils/api';

export default function TestimonialForm({ user, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setMessage({ text: 'Please enter your testimonial text', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Add user data to the testimonial
      const testimonialData = {
        ...formData,
        author: user.name,
        email: user.email,
        role: user.role || 'PromptWizard User',
        date: new Date().toISOString(),
        recipientEmail: 'rama8978048@gmail.com'
      };
      
      console.log('Testimonial submitted:', testimonialData);
      
      // Send email instead of storing in localStorage
      const response = await fetch(`${API_BASE_URL}/api/testimonials/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(testimonialData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit testimonial');
      }
      
      // Clear form and show success message
      setFormData({ content: '', rating: 5 });
      setMessage({ 
        text: 'Thank you for your testimonial! Your feedback has been sent to our team.',
        type: 'success' 
      });
      setSubmitted(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(testimonialData);
      }
    } catch (error) {
      setMessage({ 
        text: error.message || 'Failed to submit testimonial. Please try again.',
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Share Your Experience</h3>
      
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      star <= formData.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Your Testimonial
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
              placeholder="Tell us about your experience with PromptWizard..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
            />
          </div>
          
          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </motion.div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Submit Testimonial
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-700 text-center">
            Thank you for sharing your experience! Your feedback has been sent to our team.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Submit another testimonial
          </button>
        </div>
      )}
    </div>
  );
} 