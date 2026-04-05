import React, { FC } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BxCalendar from "@/assets/icons/Secondary/Outline/bx-calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker styles

interface DatePickerInputProps {
  label?: string;
  parentClassName?: string;
  className?: string;
  labelClassName?: string;
  error?: string;
  placeholder?: string;
  startDate: Date | null;
  handleChange: (date: Date | null) => void;
}

const DatePickerInput: FC<DatePickerInputProps> = ({
  label,
  parentClassName,
  className,
  labelClassName,
  error,
  placeholder = "Select Date",
  handleChange,
  startDate,
}) => {
  return (
    <div
      className={`input-wrapper space-y-2 flex flex-col font-normal text-sm leading-5 ${parentClassName} `}
    >
      {label && <label className={labelClassName || ""}>{label}</label>}

      <div className="relative bg-[#EAECF0] placeholder:text-[#667085] border">
        <div
          className={`p-3 space-x-2 flex items-center border rounded-lg ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        >
          <BxCalendar />
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            dateFormat="dd MMMM yyyy"
            placeholderText={placeholder}
            className="cursor-pointer focus:outline-none w-full text-sm text-[#363435]"
            wrapperClassName="w-full"
          />
          <ChevronDownIcon className="w-5 h-5 text-[#363435]" />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
      <style jsx global>{`
        .react-datepicker__input-container > input {
          background-color: #eaecf0 !important;
        }
      `}</style>
    </div>
  );
};

export default DatePickerInput;
