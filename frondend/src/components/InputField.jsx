import React from 'react';

const InputField = ({ label, name, value, icon, onChange, type = "text" }) => {
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
          type={type}
          className="input input-bordered w-full pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder={label}
          value={value}
          onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default InputField;
