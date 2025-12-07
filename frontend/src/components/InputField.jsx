import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

const InputField = ({ label, name, value, icon, onChange, type = "text", placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = name === "password" || type === "password";
  const inputType = isPassword && showPassword ? "text" : (isPassword ? "password" : type);

  return (
    <div className="relative group mb-4">
      {/* Icon Wrapper */}
      {icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-primary-500' : 'text-slate-400'}`}>
          {icon}
        </div>
      )}

      {/* Input */}
      <input
        type={inputType}
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Adapting to your store's "onChange" pattern (value only vs event)
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" " // Important for floating label css trick
        className={`peer w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 
          ${icon ? 'pl-12' : 'pl-4'} 
          outline-none transition-all duration-300
          focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          text-slate-800 dark:text-white placeholder-transparent
        `}
        {...(typeof onChange === 'function' && { onChange: (e) => {
            // Handle both event object and direct setters logic from your legacy code
            if(onChange.length === 1) onChange(e); // likely a setter
            else onChange(prev => ({...prev, [name]: e.target.value})); // likely form state setter
        }})} 
      />

      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm transition-all duration-200 pointer-events-none
          ${icon ? 'peer-placeholder-shown:left-12' : 'peer-placeholder-shown:left-4'}
          peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-500 peer-focus:bg-white peer-focus:dark:bg-slate-900 peer-focus:px-1
          ${value ? '-top-2 left-3 text-xs bg-white dark:bg-slate-900 px-1' : ''}
        `}
      >
        {label}
      </label>

      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default InputField;