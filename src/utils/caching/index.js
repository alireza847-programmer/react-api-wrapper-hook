const getLocalStorageItem = (key) => {
    try {
        const stringCaches = localStorage.getItem(key);
        return JSON.parse(stringCaches || "[]");
    }
    catch (error) {
        console.error("Error retrieving from localStorage:", error);
        return [];
    }
};
const setLocalStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error("Error storing in localStorage:", error);
    }
};
export const addNewCache = (cacheData, data) => {
    const caches = getLocalStorageItem("caches");
    const newCache = {
        key: cacheData.key,
        value: data,
        timeout: cacheData.timeout,
        fetchTime: new Date(),
    };
    setLocalStorageItem("caches", [...caches, newCache]);
};
export const isCacheExpired = (cacheKey) => {
    const cacheItem = getCacheItem(cacheKey);
    if (cacheItem) {
        const currentDate = new Date();
        const fetchTime = new Date(cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.fetchTime);
        const timeDifferenceInSeconds = (currentDate.getTime() - fetchTime.getTime()) / 1000;
        return timeDifferenceInSeconds >= cacheItem.timeout;
    }
    return false;
};
export const getCacheItem = (cacheKey) => {
    const caches = getLocalStorageItem("caches");
    return caches.find((item) => item.key === cacheKey);
};
export const isCacheExists = (cacheKey) => {
    const caches = getLocalStorageItem("caches");
    return caches.findIndex((item) => item.key === cacheKey) === -1;
};
export const getCacheDataWithCacheKey = (cacheKey) => {
    try {
        const caches = getLocalStorageItem("caches");
        const data = caches.find((item) => item.key === cacheKey);
        if (isCacheExpired(cacheKey)) {
            const updatedCaches = caches.filter((item) => item.key !== cacheKey);
            setLocalStorageItem("caches", updatedCaches);
            return undefined;
        }
        return data;
    }
    catch (error) {
        console.error("Error getting cache data:", error);
    }
};
