import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

const InputField = ({ label, name, value, icon, onChange,  }) => {
  const [showPassword, setShowPassword] = useState(false);

   const isPassword = name === "password";
  const inputType = isPassword && showPassword ? "text" : "password";

  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={isPassword ? inputType : "text"} 
          name={name}
          placeholder={label}
          value={value}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              [name]: e.target.value,
            }))
          }
          className="input input-bordered w-full pl-10 pr-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
