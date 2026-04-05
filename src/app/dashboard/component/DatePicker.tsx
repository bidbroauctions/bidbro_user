import React, { useState } from "react";
import DatePicker from "react-datepicker";

import { format } from "date-fns";

const DatePickerComponent = ({
  startDate,
  handleChange,
}: {
  startDate: Date | null;
  handleChange: (date: Date | null) => void;
}) => {
  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        placeholderText="Select Date"
        className="cursor-pointer focus:outline-none w-full text-sm text-[#363435]"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export const useDatePicker = (initialDate: Date | null = null) => {
  const [startDate, setStartDate] = useState<Date | null>(initialDate);

  const handleChange = (date: Date | null) => {
    setStartDate(date);
  };

  const formattedDate = startDate ? format(startDate, "MMMM yyyy") : null;

  return { startDate, setStartDate, handleChange, formattedDate };
};

export default DatePickerComponent;
