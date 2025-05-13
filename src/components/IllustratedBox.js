import React from "react";
import { motion } from "framer-motion";

export default function IllustratedBox({ 
  title, 
  description, 
  illustration, 
  className = "", 
  children, 
  animationDelay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: animationDelay,
        ease: "easeOut"
      }}
      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-purple-100 shadow-md ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-yellow-100/50"></div>
      <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-blue-100/50"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {illustration && (
            <div className="flex-shrink-0">
              {illustration}
            </div>
          )}
          
          <div className="flex-1">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>}
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 