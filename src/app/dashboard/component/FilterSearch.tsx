import BxCalendar from "@/assets/icons/Secondary/Outline/bx-calendar";
import Select from "@/components/form/selection";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import React, { useEffect } from "react";
import SearchIcon from "@/assets/icons/search-lg.svg";
import Image from "next/image";

import BxFilter from "@/assets/icons/Buttons/Secondary/Outline/bx-filter";
import DatePickerComponent, { useDatePicker } from "./DatePicker";
import { useDebounce } from "@/hooks/useDebouncer";

const FilterSearch = ({
  handleDate,
  handleLimit,
  handleSearch,
  handleFilter,
}: {
  handleSearch?: (search: string) => void;
  handleDate?: (date: Date) => void;
  handleLimit: (limit: number) => void;
  handleFilter?: (filter: string) => void;
}) => {
  const limitOptions = [
    {
      value: 10,
      label: "10",
    },
    {
      value: 20,
      label: "20",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 100,
      label: "100",
    },
  ];
  const [limit, setLimit] = React.useState(10);
  useEffect(() => {
    //   Fires when limit changes
    handleLimit(limit);
  }, [handleLimit, limit]);

  const { startDate, handleChange } = useDatePicker();
  useEffect(() => {
    if (!handleDate) return;
    if (!startDate) return;
    //   Fires when date changes
    handleDate(startDate);
  }, [handleDate, startDate]);

  const [search, setSearch] = React.useState("");
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  const debouncedSearch = useDebounce(search, 500); // Use the debounced value with a delay of 500ms

  useEffect(() => {
    if (!handleSearch) return;
    // Fires when debounced search value changes (i.e., after user stops typing)
    if (debouncedSearch.length > 2) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch, handleSearch]);

  return (
    <div className="flex w-full items-center justify-between py-4 px-6">
      <div className="flex items-center space-x-3">
        <p>Show</p>
        <Select
          options={limitOptions}
          onChange={(e) => setLimit(Number(e.target.value))}
          parentClassName=""
          className="py-2"
        />
        <p>Entries</p>
      </div>
      <div className="flex items-center space-x-6">
        {/* DATE */}
        {handleDate && (
          <div className="p-3 space-x-2 rounded-lg border border-[#D4D5D7] flex items-center cursor-pointer relative">
            <BxCalendar /> <p>Date: </p>
            <DatePickerComponent
              startDate={startDate}
              handleChange={handleChange}
            />
            <ChevronDownIcon className="w-5 h-5 text-[#363435]" />
          </div>
        )}

        {/* SEARCH */}
        {handleSearch && (
          <div className="py-2 px-4 border border-[#DBDCDD] rounded-full flex items-center space-x-2">
            <Image src={SearchIcon} alt="Search Icon" width={24} height={24} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full focus:outline-none min-w-7"
              onChange={handleSearchChange}
            />
          </div>
        )}

        {/* Filter */}
        {handleFilter && (
          <div className="p-3 space-x-2 rounded-lg border border-[#D4D5D7] flex items-center cursor-pointer">
            <BxFilter />
            <p>Filter By: </p>
            <p>All</p>
            <ChevronDownIcon className="w-5 h-5 text-[#363435]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSearch;
