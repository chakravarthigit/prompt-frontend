import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function TestimonialsSection() {
  const { user } = useAuth();
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Default testimonials that are always shown
  const defaultTestimonials = [
    {
      content: "PromptWizard helped me create prompts that get exactly what I need from AI assistants. No more back-and-forth trying to explain myself!",
      author: "Sarah K.",
      role: "Content Creator",
      rating: 5,
    },
    {
      content: "As a developer, I need precise instructions for AI. This tool transformed my vague ideas into structured prompts that give me clean, usable code.",
      author: "Miguel L.",
      role: "Software Engineer",
      rating: 5,
    },
    {
      content: "I teach students how to use AI effectively. PromptWizard is now my go-to recommendation for helping them craft better prompts.",
      author: "Prof. Zhang",
      role: "Digital Literacy Educator",
      rating: 5,
    },
    {
      content: "The prompt optimization saved me hours of tweaking. Now I get perfect AI responses on the first try!",
      author: "Thomas R.",
      role: "Marketing Strategist",
      rating: 5,
    },
    {
      content: "As someone new to AI, PromptWizard made it easy to create effective prompts. The comparison feature is invaluable!",
      author: "Jessica M.",
      role: "Small Business Owner",
      rating: 4,
    }
  ];

  // Fetch user testimonials
  useEffect(() => {
    const fetchUserTestimonials = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your backend API
        // For demo purposes, we'll simulate an API call with local storage
        const storedTestimonials = localStorage.getItem('userTestimonials');
        if (storedTestimonials) {
          const parsedTestimonials = JSON.parse(storedTestimonials);
          setUserTestimonials(parsedTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTestimonials();
  }, []);

  // Auto-play slider
  useEffect(() => {
    autoPlayRef.current = () => {
      if (carouselRef.current) {
        const totalSlides = Math.ceil(allTestimonials.length / itemsPerPage);
        const nextPage = (currentPage + 1) % totalSlides;
        setCurrentPage(nextPage);
      }
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  // Combine default and user testimonials
  const allTestimonials = [...defaultTestimonials, ...userTestimonials];

  // Calculate items per page based on screen size
  const itemsPerPage = 3; // Show 3 testimonials per page
  const totalPages = Math.ceil(allTestimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Get current page testimonials
  const getCurrentTestimonials = () => {
    const start = currentPage * itemsPerPage;
    return allTestimonials.slice(start, start + itemsPerPage);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loved by prompt engineers
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            See what our users have to say about PromptWizard
          </p>
          
          {user && (
            <Link to="/profile" className="inline-flex items-center mt-4 text-indigo-600 hover:text-indigo-700">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Share your testimonial</span>
            </Link>
          )}
        </motion.div>

        {/* Testimonial Carousel */}
        <div ref={carouselRef} className="relative mt-12">
          {/* Navigation Arrows */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
            <button 
              onClick={prevSlide}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-6 w-6 text-indigo-600" />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10">
            <button 
              onClick={nextSlide}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-6 w-6 text-indigo-600" />
            </button>
          </div>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid gap-8 md:grid-cols-3"
              >
                {getCurrentTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={`${currentPage}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1 
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white rounded-xl shadow-md overflow-hidden p-6 relative cursor-pointer h-full"
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                    
                    <div className="flex items-center mt-auto">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {testimonial.author ? testimonial.author.charAt(0) : '?'}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index ? "w-6 bg-indigo-600" : "w-2 bg-indigo-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {!isLoading && user && (
          <div className="text-center mt-8">
            <Link 
              to="/profile" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => window.localStorage.setItem('activeProfileTab', 'testimonials')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add your testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}