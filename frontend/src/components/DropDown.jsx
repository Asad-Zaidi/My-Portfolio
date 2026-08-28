import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown as ChevronDown, LuCheck as Check } from "react-icons/lu";

/**
 * Custom Theme-Aware DropDown Component
 *
 * @param {Object} props
 * @param {string|number} props.value - Currently selected value
 * @param {Function} props.onChange - Selection callback: (value) => void
 * @param {Array<{ label?: string, name?: string, value: string|number }|string>} props.options - Array of options
 * @param {string} [props.placeholder='Select...'] - Placeholder text
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.title] - Tooltip / accessible title
 * @param {string} [props.className=''] - Wrapper container class
 * @param {string} [props.buttonClassName=''] - Custom trigger button styling
 * @param {string} [props.menuClassName=''] - Custom dropdown menu styling
 * @param {string} [props.size='sm'] - Size variant ('xs', 'sm', 'md')
 */
export default function DropDown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  title,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  size = "sm",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to { label, value }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        label: opt.label || opt.name || String(opt.value),
        value: opt.value,
      };
    }
    return { label: String(opt), value: opt };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optVal) => {
    if (onChange) {
      onChange(optVal);
    }
    setIsOpen(false);
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs min-h-[28px]",
    sm: "px-2.5 py-1.5 text-xs sm:text-sm min-h-[34px]",
    md: "px-3.5 py-2 text-sm min-h-[40px]",
  }[size] || "px-2.5 py-1.5 text-xs sm:text-sm min-h-[34px]";

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        disabled={disabled}
        title={title}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/80 dark:text-slate-200 dark:hover:border-navy-500 ${sizeClasses} ${buttonClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 dark:text-slate-500 ${
            isOpen ? "rotate-180 text-accent dark:text-accent-light" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 top-full z-[99999] mt-1 max-h-60 min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl outline-none transition-all scrollbar-none dark:border-navy-700 dark:bg-navy-800 ${menuClassName}`}
          style={{ minWidth: "max-content" }}
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-center text-xs text-slate-400">
              No options
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-left text-xs sm:text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-accent/10 font-semibold text-accent dark:bg-accent/15 dark:text-accent-light"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-700 dark:hover:text-white"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent dark:text-accent-light" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
