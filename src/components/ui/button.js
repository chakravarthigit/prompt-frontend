import React from "react";
import { motion } from "framer-motion";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  disabled = false,
  type = "button",
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
    outline: "bg-transparent hover:bg-gray-50 text-indigo-600 border border-indigo-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-md",
    lg: "px-6 py-3 text-lg rounded-lg"
  };

  // Combine all styles
  const buttonStyles = `
    inline-flex items-center justify-center font-medium
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    transition-colors duration-200 ease-in-out
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${className}
  `;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button; 