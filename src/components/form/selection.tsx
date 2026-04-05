"use client";
import React, { FC, SelectHTMLAttributes } from "react";

// Extend SelectHTMLAttributes to inherit all default HTML select props
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  className?: string;
  parentClassName?: string;
  labelClassName?: string;
  options: { value: string | number; label: string }[]; // Array of options for the select
  error?: string; // Add error prop to handle validation errors
}

const Select: FC<SelectProps> = ({
  label,
  className,
  parentClassName,
  labelClassName,
  options,
  error, // Accept the error prop
  ...props
}) => {
  return (
    <div
      className={`select-wrapper space-y-2 flex flex-col font-normal text-sm leading-5 text-text ${parentClassName}`}
    >
      {label && <label className={labelClassName || ""}>{label}</label>}
      <select
        {...props}
        className={`select bg-[#EAECF0] placeholder:text-[#667085] border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-4 text-sm leading-5 text-text focus:outline-none focus:border focus:ring-0 ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Conditionally render the error message */}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Select;
