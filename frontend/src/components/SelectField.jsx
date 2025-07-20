import React from 'react'

const SelectField = ({ label, name, value, options, icon, onChange }) => {
  return (
    <div className="form-control">
    <label className="label font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative ">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">{icon}</div>}
      <select
        className="input input-bordered w-full pl-10  bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        value={value}
        onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
      >
        <option value="">Select {label}</option>
      
        {options.map((option) => (
  <option key={option} value={option}>
    {option.charAt(0).toUpperCase() + option.slice(1)}
  </option>
))}

      </select>
    </div>
  </div>
  )
}

export default SelectField

