// AdminInput.jsx
import React from "react";

const AdminInput = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 
        bg-white text-gray-900 border-gray-300 
        dark:bg-gray-800 dark:text-white dark:border-gray-600
        ${className}`}
    />
  );
};

export default AdminInput;
