"use client";
import classNames from "classnames";
import React, { FC, ButtonHTMLAttributes, ReactNode } from "react";

// Extend ButtonHTMLAttributes to inherit all default HTML input props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;

  children?: ReactNode;
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={classNames(
        `px-3 py-3 rounded-lg text-sm font-semibold border flex gap-1 bg-[#F68B36] text-white justify-center focus:outline-none item items-center border-[#F68B36] disabled:opacity-50 disabled:cursor-not-allowed ${className}`
      )}
      style={{
        boxShadow: "0px 1px 2px 0px #1018280D",
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
