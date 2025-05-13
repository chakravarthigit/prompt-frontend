import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/components/auth/AuthContext";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Play entrance animation only once on mount
  useEffect(() => {
    setTimeout(() => {
      setIsFlipped(true);
      setShowResponse(true);
      setTimeout(() => {
        setIsFlipped(false);
        setShowResponse(false);
        setHasAnimated(true);
      }, 2000); // Show response for 2s
    }, 800); // Delay entrance for effect
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowResponse(!showResponse);
  };

  // Animation variants (no repeat)
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 1.2,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 1.2,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Hero content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 mb-10 md:mb-0 md:pr-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              <span className="block">Master the art of</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                AI prompting
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              Create powerful, optimized prompts for any AI assistant. Get better results with less back-and-forth.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
                onClick={() => navigate(user ? '/playground' : '/login')}
              >
                Try it now
              </Button>
              
              <Link to={createPageUrl("Templates")}>
                <Button 
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Browse templates
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 flex items-center">
              <span className="text-sm font-medium text-gray-500">
                Supports GPT, Claude, Gemini, and more
              </span>
            </div>
          </motion.div>
          
          {/* Hero image/illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              ...(!hasAnimated ? floatingAnimation : {})
            }}
            className="md:w-1/2"
          >
            <div className="relative w-full h-64 sm:h-80 lg:h-96 perspective-1000">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-2xl shadow-lg overflow-hidden"
                animate={!hasAnimated ? pulseAnimation : {}}
              >
                <motion.div 
                  className="absolute inset-0 bg-grid-pattern opacity-10"
                  animate={!hasAnimated ? { backgroundPosition: ["0% 0%", "100% 100%"] } : {}}
                  transition={!hasAnimated ? { duration: 4, ease: "linear" } : {}}
                ></motion.div>
                
                <motion.div 
                  className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-100 rounded-full opacity-50"
                  animate={!hasAnimated ? { scale: [1, 1.2, 1], x: [0, 5, 0], y: [0, -5, 0] } : {}}
                  transition={!hasAnimated ? { duration: 1.5, ease: "easeInOut" } : {}}
                ></motion.div>
                
                <motion.div 
                  className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"
                  animate={!hasAnimated ? { scale: [1, 1.3, 1], x: [0, -5, 0], y: [0, 5, 0] } : {}}
                  transition={!hasAnimated ? { duration: 1.7, ease: "easeInOut" } : {}}
                ></motion.div>
                
                <motion.div 
                  className="absolute right-1/4 bottom-1/4 w-20 h-20 bg-pink-100 rounded-full opacity-40"
                  animate={!hasAnimated ? { scale: [1, 1.5, 1], x: [0, 10, 0], y: [0, 10, 0] } : {}}
                  transition={!hasAnimated ? { duration: 2, ease: "easeInOut" } : {}}
                ></motion.div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-3/4 h-48 sm:h-60 cursor-pointer preserve-3d"
                    onClick={handleFlip}
                    initial={false}
                    animate={{ 
                      rotateY: isFlipped ? 180 : 0,
                      z: isHovered ? 20 : 0,
                      scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20 
                    }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Front of card */}
                    <motion.div 
                      className={`absolute inset-0 w-full h-full p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}
                      initial={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                      animate={{ 
                        boxShadow: isHovered 
                          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                          : "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          animate={!hasAnimated ? { rotate: [0, 10, 0, -10, 0] } : {}}
                          transition={!hasAnimated ? { duration: 2, ease: "easeInOut" } : {}}
                        >
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                        </motion.div>
                        <span className="ml-2 text-sm font-medium text-gray-700">AI Prompt</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-700 font-medium">
                        <p>Write me a haiku about debugging code where each line ends with an error message.</p>
                        <p className="text-xs text-gray-500 italic mt-3">Optimized for:</p>
                        <div className="flex items-center">
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                            animate={!hasAnimated ? { scale: [1, 1.05, 1] } : {}}
                            transition={!hasAnimated ? { duration: 1.2, ease: "easeInOut" } : {}}
                          >
                            Creative
                          </motion.span>
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            animate={!hasAnimated ? { scale: [1, 1.05, 1] } : {}}
                            transition={!hasAnimated ? { duration: 1.2, ease: "easeInOut", delay: 0.3 } : {}}
                          >
                            Claude
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Back of card */}
                    <motion.div 
                      className={`absolute inset-0 w-full h-full p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 backface-hidden rotate-y-180 ${!isFlipped ? 'pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center mb-4">
                        <motion.div
                          animate={!hasAnimated ? { scale: [1, 1.2, 1], rotate: [0, 10, 0, -10, 0] } : {}}
                          transition={!hasAnimated ? { duration: 2, ease: "easeInOut" } : {}}
                        >
                          <Sparkles className="h-5 w-5 text-purple-500" />
                        </motion.div>
                        <span className="ml-2 text-sm font-medium text-gray-700">AI Response</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-700 font-medium">
                        <motion.p 
                          className="italic text-purple-800"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ 
                            opacity: showResponse ? 1 : 0, 
                            y: showResponse ? 0 : 5, 
                            transition: { 
                              staggerChildren: 0.1,
                              delayChildren: 0.3
                            } 
                          }}
                        >
                          <motion.span 
                            className="block"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ 
                              opacity: showResponse ? 1 : 0, 
                              y: showResponse ? 0 : 5 
                            }}
                            transition={{ delay: 0.1 }}
                          >
                            Syntax undefined
                          </motion.span>
                          <motion.span 
                            className="block"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ 
                              opacity: showResponse ? 1 : 0, 
                              y: showResponse ? 0 : 5 
                            }}
                            transition={{ delay: 0.3 }}
                          >
                            Logic fails on line three null pointer
                          </motion.span>
                          <motion.span 
                            className="block"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ 
                              opacity: showResponse ? 1 : 0, 
                              y: showResponse ? 0 : 5 
                            }}
                            transition={{ delay: 0.5 }}
                          >
                            Code refuses segmentation fault
                          </motion.span>
                        </motion.p>
                        
                        <p className="text-xs text-gray-500 mt-4">Generated by Claude</p>
                        <p className="text-xs text-gray-500 mt-1">Click to see prompt again</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}