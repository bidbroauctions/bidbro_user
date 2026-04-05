"use client";
import classNames from "classnames";
import React, {
  FC,
  ButtonHTMLAttributes,
  useState,
  MouseEvent,
  ReactNode,
} from "react";
import { Spinner } from "../Loading/Spinner";

// Extend ButtonHTMLAttributes to inherit all default HTML input props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  buttonType?: "primary" | "outline";
  icon?: ReactNode;
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  label,
  className,
  buttonType,
  icon,
  loading,
  ...props
}) => {
  const [rippleStyle, setRippleStyle] = useState({});
  const [rippleVisible, setRippleVisible] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Get the button's position and size
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Calculate the position of the click relative to the button
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const rippleSize = Math.max(rect.width, rect.height);

    // Set the ripple style dynamically
    setRippleStyle({
      top: rippleY - rippleSize / 2,
      left: rippleX - rippleSize / 2,
      width: rippleSize,
      height: rippleSize,
    });

    // Show the ripple
    setRippleVisible(true);

    // Hide the ripple after animation
    setTimeout(() => {
      setRippleVisible(false);
    }, 500);

    // Call the original onClick function if provided
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      className={classNames(
        "relative overflow-hidden bg-[#f68b36] text-white font-semibold text-base leading-6 py-3 text-center rounded-md focus:outline-none focus:ring-0 focus:border-0 w-full disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3",
        {
          "bg-[#f68b36]": buttonType === "primary",
          "bg-white text-[#f68b36] border-[#f68b36] border":
            buttonType === "outline",
        },
        `${className}`
      )}
      type={props.type || "button"}
      disabled={props.disabled}
      onClick={handleClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}{" "}
      {/* Render the icon if provided */}
      {loading ? <Spinner /> : <span>{label}</span>}
      {/* Ripple effect */}
      {rippleVisible && (
        <span
          className="absolute bg-white opacity-50 rounded-full transform scale-0 animate-ripple"
          style={rippleStyle}
        />
      )}
    </button>
  );
};

export default Button;
