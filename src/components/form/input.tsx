import React, { FC, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

// Extend InputHTMLAttributes and TextareaHTMLAttributes for input and textarea props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  parentClassName?: string;
  labelClassName?: string;
  as?: "input" | "textarea"; // Added 'as' prop to switch between input and textarea
  error?: string; // Add error prop to display validation error messages
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Input: FC<InputProps & TextAreaProps> = ({
  label,
  className,
  parentClassName,
  labelClassName,
  as = "input", // default is "input"
  error, // Destructure the error prop
  ...props
}) => {
  return (
    <div
      className={`input-wrapper space-y-2 flex flex-col font-normal text-sm leading-5 ${parentClassName}`}
    >
      {label && <label className={labelClassName || ""}>{label}</label>}
      {as === "textarea" ? (
        <textarea
          {...(props as TextAreaProps)} // Type casting for textarea props
          className={`textarea bg-[#EAECF0] placeholder:text-[#667085] border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-4 text-sm leading-5 focus:outline-none focus:border focus:ring-0 ${className}`}
        />
      ) : (
        <input
          {...props}
          className={`input bg-[#EAECF0] placeholder:text-[#667085] border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-4 text-sm leading-5 focus:outline-none focus:border focus:ring-0 ${className}`}
        />
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}{" "}
      {/* Error message */}
    </div>
  );
};

export default Input;
