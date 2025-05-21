import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div
      className={`relative bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl p-6 shadow-2xl text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 ${className}`}
    >
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-400 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-800 rounded-full opacity-20 blur-2xl"></div>
      
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="space-y-3 text-white text-base leading-relaxed z-10 relative">
      {children}
    </div>
  );
};
