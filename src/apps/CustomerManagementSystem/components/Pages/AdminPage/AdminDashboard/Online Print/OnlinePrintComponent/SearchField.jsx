import React, { useId } from "react";
import { Search, X } from "lucide-react";

const SearchField = ({
  value,
  onChange,
  placeholder,
  resultCount,
  totalCount,
}) => {
  const inputId = useId();

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          Search
        </label>

        <div className="relative w-full md:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-11 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 md:min-w-32 md:text-right">
          Showing {resultCount} of {totalCount}
        </p>
      </div>
    </div>
  );
};

export default SearchField;
