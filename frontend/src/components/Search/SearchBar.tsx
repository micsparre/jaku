import React, { useState } from "react";
import api from "../Shared/api";
import { Anime } from "../Shared/Types";

interface SearchBarProps {
  setData: React.Dispatch<React.SetStateAction<Anime[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setData, setLoading }) => {
  const [query, setQuery] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Searching for:", query);
    setLoading(true);

    api
      .get(apiUrl + "/api/titles", {
        params: { title: query },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching titles:", error);
        setLoading(false);
      });
  };

  return (
    <div className="mt-16 flex justify-center pt-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title"
            id="searchTitle"
            name="searchTitle"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 block w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          />
          <button
            type="submit"
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
