import { Caches } from "../../types/caches";
import { CacheData } from "../../types/useApi";
import storage from "../storage";

const getLocalStorageItem = async (key: string): Promise<Caches> => {
  try {
    const stringCaches = await storage.default?.getItem(key);
    return JSON.parse(stringCaches || "[]");
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return [];
  }
};

const setLocalStorageItem = async (key: string, value: Caches) => {
  try {
    await storage.default?.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing in localStorage:", error);
  }
};

export const addNewCache = async (cacheData: CacheData, data: any) => {
  const caches = await getLocalStorageItem("caches");
  const newCache = {
    key: cacheData.key,
    value: data,
    timeout: cacheData.timeout,
    fetchTime: new Date(),
  };
  setLocalStorageItem("caches", [...caches, newCache]);
};

export const isCacheExpired = async (cacheKey: string) => {
  const cacheItem = await getCacheItem(cacheKey);
  if (cacheItem) {
    const currentDate = new Date();
    const fetchTime = new Date(cacheItem?.fetchTime);
    const timeDifferenceInSeconds =
      (currentDate.getTime() - fetchTime.getTime()) / 1000;
    return timeDifferenceInSeconds >= cacheItem.timeout;
  }
  return false;
};

export const getCacheItem = async (cacheKey: string) => {
  const caches = await getLocalStorageItem("caches");
  return caches.find((item) => item.key === cacheKey);
};

export const isCacheExists = async (cacheKey: string) => {
  const caches = await getLocalStorageItem("caches");
  return caches.findIndex((item) => item.key === cacheKey) === -1;
};

export const getCacheDataWithCacheKey = async (cacheKey: string) => {
  try {
    const caches = await getLocalStorageItem("caches");
    const data = caches.find((item) => item.key === cacheKey);
    if (await isCacheExpired(cacheKey)) {
      const updatedCaches = caches.filter((item) => item.key !== cacheKey);
      setLocalStorageItem("caches", updatedCaches);
      return undefined;
    }
    return data;
  } catch (error) {
    console.error("Error getting cache data:", error);
  }
};
