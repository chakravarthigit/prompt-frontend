import React, { useState } from "react";

const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};

const TooltipContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const Tooltip = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);
  
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props,
    });
  }
  
  return (
    <button
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className = "", ...props }, ref) => {
  const { open } = React.useContext(TooltipContext);
  
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={`absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded shadow-lg ${className}`}
      {...props}
    />
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }; 