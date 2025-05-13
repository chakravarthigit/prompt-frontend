import React, { useState, useRef, useEffect } from "react";

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  
  // Extract items and find the selected label
  useEffect(() => {
    // Find SelectContent among children
    const contentChild = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.type.displayName === "SelectContent"
    );
    
    if (contentChild && React.isValidElement(contentChild)) {
      // Find the selected item
      const selectedItem = React.Children.toArray(contentChild.props.children).find(
        child => React.isValidElement(child) && child.props.value === value
      );
      
      if (selectedItem && React.isValidElement(selectedItem)) {
        setSelectedLabel(selectedItem.props.children);
      }
    }
  }, [children, value]);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Custom trigger with our own open state
  const customTrigger = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.displayName === "SelectTrigger") {
      // Clone the trigger with our props
      return React.cloneElement(child, {
        onClick: () => setIsOpen(!isOpen),
        isOpen
      });
    }
    return null;
  });
  
  // Custom content with our handlers
  const customContent = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.displayName === "SelectContent" && isOpen) {
      // Clone content with modified children
      const items = React.Children.map(child.props.children, item => {
        if (React.isValidElement(item) && item.type.displayName === "SelectItem") {
          return React.cloneElement(item, {
            onClick: () => {
              onValueChange(item.props.value);
              setIsOpen(false);
            },
            isSelected: item.props.value === value
          });
        }
        return item;
      });
      
      return React.cloneElement(child, {}, items);
    }
    return null;
  });
  
  return (
    <div className="relative w-full" ref={selectRef}>
      {customTrigger}
      {customContent}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className = "", children, isOpen, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={`flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      {children}
      <svg
        className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ className = "", placeholder, ...props }, ref) => {
  return (
    <span ref={ref} className={`block truncate ${className}`} {...props}>
      {props.children || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className = "", children, isSelected, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50 ${isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'} ${className}`}
      {...props}
    >
      <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
        {children}
      </span>
      
      {isSelected && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }; 