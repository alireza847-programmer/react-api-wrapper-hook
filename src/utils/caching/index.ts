import { Caches } from "../../types/caches";
import { CacheData } from "../../types/useApi";

const getLocalStorageItem = (key: string): Caches => {
  try {
    const stringCaches = localStorage.getItem(key);
    return JSON.parse(stringCaches || "[]");
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return [];
  }
};

const setLocalStorageItem = (key: string, value: Caches) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing in localStorage:", error);
  }
};

export const addNewCache = (cacheData: CacheData, data: any) => {
  const caches = getLocalStorageItem("caches");
  const newCache = {
    key: cacheData.key,
    value: data,
    timeout: cacheData.timeout,
    fetchTime: new Date(),
  };
  setLocalStorageItem("caches", [...caches, newCache]);
};

export const isCacheExpired = (cacheKey: string) => {
  const cacheItem = getCacheItem(cacheKey);
  if (cacheItem) {
    const currentDate = new Date();
    const fetchTime = new Date(cacheItem?.fetchTime);
    const timeDifferenceInSeconds =
      (currentDate.getTime() - fetchTime.getTime()) / 1000;
    return timeDifferenceInSeconds >= cacheItem.timeout;
  }
  return false;
};

export const getCacheItem = (cacheKey: string) => {
  const caches = getLocalStorageItem("caches");
  return caches.find((item) => item.key === cacheKey);
};

export const isCacheExists = (cacheKey: string) => {
  const caches = getLocalStorageItem("caches");
  return caches.findIndex((item) => item.key === cacheKey) === -1;
};

export const getCacheDataWithCacheKey = (cacheKey: string) => {
  try {
    const caches = getLocalStorageItem("caches");
    const data = caches.find((item) => item.key === cacheKey);
    if (isCacheExpired(cacheKey)) {
      const updatedCaches = caches.filter((item) => item.key !== cacheKey);
      setLocalStorageItem("caches", updatedCaches);
      return undefined;
    }
    return data;
  } catch (error) {
    console.error("Error getting cache data:", error);
  }
};
