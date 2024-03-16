import axios from "axios";
import { UserAnimeObject, AnimeObject, User } from "./types";

const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export async function getUserAnimeList(): Promise<UserAnimeObject[]> {
  try {
    const response = await api.get(apiUrl + "/api/anime-list");
    const userAnimeList = response.data as UserAnimeObject[];
    return userAnimeList;
  } catch (error) {
    console.error("Error fetching user's anime list:", error);
    return [];
  }
}

export async function getUserBookmarks(): Promise<AnimeObject[]> {
  try {
    const response = await api.get(apiUrl + "/api/bookmarks");
    const userBookmarks = response.data as AnimeObject[];
    return userBookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function getRecommendations(): Promise<AnimeObject[]> {
  try {
    const response = await api.get(apiUrl + "/api/recommendations");
    const recommendations = response.data as AnimeObject[];
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

export async function removeUserAnime(id: number): Promise<boolean> {
  try {
    api.post(apiUrl + "/api/remove-anime-from-list", {
      anime_id: id,
    });
    return true;
  } catch (error) {
    console.error("Error removing anime from user's list:", error);
    return false;
  }
}

export async function addBookmark(id: number): Promise<boolean> {
  try {
    api.post(apiUrl + "/api/add-bookmark", { anime_id: id });
    return true;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return false;
  }
}

export async function removeBookmark(id: number): Promise<boolean> {
  try {
    api.post(apiUrl + "/api/remove-bookmark", {
      anime_id: id,
    });
    return true;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }
}

export async function getSearchTitles(query: string): Promise<AnimeObject[]> {
  try {
    const response = await api.get(apiUrl + "/api/titles", {
      params: { title: query },
    });
    const searchResults = response.data as AnimeObject[];
    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export async function getUser(): Promise<User> {
  try {
    const response = await api.get(apiUrl + "/api/user");
    const user = response.data as User;
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return {} as User;
  }
}

export default api;
