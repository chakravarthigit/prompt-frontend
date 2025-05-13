import React from "react";

const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-100 border-gray-300 text-gray-800",
    destructive: "bg-red-50 border-red-300 text-red-800",
    success: "bg-green-50 border-green-300 text-green-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`rounded-md border p-4 flex gap-3 items-start ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`text-sm ${className}`}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription }; 