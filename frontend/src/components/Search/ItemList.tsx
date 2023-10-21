import React, { useState, useEffect } from "react";
import api from "../Shared/api";
import { Anime } from "../Shared/Types";
import { FaSpinner, FaCheck } from "react-icons/fa";

interface ItemListProps {
  items: Anime[];
  loading: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ items, loading }) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    api
      .get(apiUrl + "/api/anime-list")
      .then((response) => {
        setAnimeList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching anime list:", error);
      });
  }, []);

  useEffect(() => {
    if (loading) {
      setSearched(true);
    } else if (items.length === 0 && !loading && searched) {
      setSearchMessage("No results found. Please try another search.");
    } else {
      setSearchMessage("");
    }
  }, [items, loading]);

  const onItemClick = (item: Anime) => {
    console.log("Item clicked:", item);
    const apiUrl = process.env.REACT_APP_API_URL;
    const itemData = { anime_id: item.id, title: item.title };

    api
      .post(apiUrl + "/api/add-anime-to-list", itemData)
      .then((response) => {
        console.log("Item created:", response.data);
        setAnimeList([...animeList, item]);
      })
      .catch((error) => {
        console.error("Error fetching item created details:", error);
      });
  };

  const isAnimeAdded = (anime: Anime) => {
    return animeList.some((item) => item.id === anime.id);
  };

  return loading ? (
    <FaSpinner
      className="w-12 h-12 text-blue-500 absolute inset-0 m-auto animate-spin"
      style={{ display: loading ? "block" : "none" }}
    />
  ) : (
    <div className="w-full max-w-md mx-auto">
      {searchMessage ? (
        <div className="text-gray-500 text-xl text-center my-8">
          {searchMessage}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item: Anime) => (
            <li key={item.id} className="py-4 flex">
              <div className="ml-4">
                <div className="text-lg font-medium text-gray-900">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500">{"test"}</div>
              </div>
              <div className="ml-auto flex relative">
                {isAnimeAdded(item) ? (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center h-10 w-10"
                    disabled
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    onClick={() => onItemClick(item)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center h-10 w-10"
                  >
                    +
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;
