import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ label, name, value, options, icon, onChange }) => {
  return (
    <div className="relative group mb-4">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </div>
      )}

      <select
        className={`w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5
          ${icon ? 'pl-12' : 'pl-4'}
          outline-none transition-all duration-300
          focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          text-slate-800 dark:text-white cursor-pointer
        `}
        value={value}
        onChange={(e) => {
             // Handle both state setters logic
             if(typeof onChange === 'function') onChange(prev => ({...prev, [name]: e.target.value}));
        }}
      >
        <option value="" disabled className="text-slate-400">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={16} />
      </div>

      {/* Static Label (Selects are harder to float effectively) */}
      <label className="absolute -top-2 left-3 text-xs text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 px-1 font-medium">
        {label}
      </label>
    </div>
  );
};

export default SelectField;