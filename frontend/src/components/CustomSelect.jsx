import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, children, className, disabled, name, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse children (options)
  const options = React.Children.toArray(children)
    .filter(child => child.type === 'option')
    .map(child => ({
      value: child.props.value !== undefined ? child.props.value : child.props.children,
      label: child.props.children,
      disabled: child.props.disabled,
    }));

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (option.disabled || disabled) return;
    
    setIsOpen(false);
    
    // Simulate native event structure so drop-in replacement works seamlessly
    if (onChange) {
      onChange({
        target: {
          value: option.value,
          name: name
        }
      });
    }
  };

  // Strip native select classes that conflict with custom styling
  const cleanClassName = (className || "")
    .replace('appearance-none', '')
    .replace('select', '')
    .replace('select-md', '')
    .trim();

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left transition-all duration-200 outline-none
          ${cleanClassName} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-brand-teal/50 dark:hover:border-brand-mint/50 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal'}
        `}
        style={{ minHeight: '42px' }}
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-h-60 overflow-auto py-1 backdrop-blur-xl">
          <ul className="flex flex-col gap-0.5 px-1.5">
            {options.map((option, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm rounded-lg transition-colors duration-150
                  ${option.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-brand-mint/10 dark:hover:bg-[#153e3a] text-gray-700 dark:text-gray-200"}
                  ${String(value) === String(option.value) ? "bg-brand-mint/10 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint font-semibold" : ""}
                `}
              >
                <span className="truncate">{option.label}</span>
                {String(value) === String(option.value) && <Check className="w-4 h-4 text-brand-teal dark:text-brand-mint flex-shrink-0" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
