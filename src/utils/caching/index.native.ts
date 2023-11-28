import { CacheItem, Caches } from "../../types/caches";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addNewCache = async (cacheKey: string, data: any) => {
  const stringCaches = await AsyncStorage.getItem("caches");
  let caches: Caches = [];
  caches = JSON.parse(stringCaches || "");
  if (caches.findIndex((item) => item.key === cacheKey) === -1) {
    caches = [...caches, { key: cacheKey, value: data }];
  }
  localStorage.setItem("caches", JSON.stringify(caches));
};

export const getCacheDataWithCacheKey = async (cacheKey: string) => {
  const stringCaches = await AsyncStorage.getItem("caches");
  let data: CacheItem | undefined = undefined;
  if (stringCaches) {
    const caches: Caches = JSON.parse(stringCaches);
    data = caches.find((item) => item.key === cacheKey);
    console.log(caches);
  }
  return data;
};
