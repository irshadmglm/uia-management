import { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Automatically filters results as user types
  };

  return (
    <div className="flex items-center justify-center mt-10 mb-6">
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={handleSearch}
          className="mt-10 w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-green-500 outline-none transition"
        />
        <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default SearchBar;
