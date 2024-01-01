var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import storage from "../storage";
const getLocalStorageItem = (key) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const stringCaches = yield ((_a = storage.default) === null || _a === void 0 ? void 0 : _a.getItem(key));
        return JSON.parse(stringCaches || "[]");
    }
    catch (error) {
        console.error("Error retrieving from localStorage:", error);
        return [];
    }
});
const setLocalStorageItem = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        yield ((_b = storage.default) === null || _b === void 0 ? void 0 : _b.setItem(key, JSON.stringify(value)));
    }
    catch (error) {
        console.error("Error storing in localStorage:", error);
    }
});
export const addNewCache = (cacheData, data) => __awaiter(void 0, void 0, void 0, function* () {
    const caches = yield getLocalStorageItem("caches");
    const newCache = {
        key: cacheData.key,
        value: data,
        timeout: cacheData.timeout,
        fetchTime: new Date(),
    };
    setLocalStorageItem("caches", [...caches, newCache]);
});
export const isCacheExpired = (cacheKey) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheItem = yield getCacheItem(cacheKey);
    if (cacheItem) {
        const currentDate = new Date();
        const fetchTime = new Date(cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.fetchTime);
        const timeDifferenceInSeconds = (currentDate.getTime() - fetchTime.getTime()) / 1000;
        return timeDifferenceInSeconds >= cacheItem.timeout;
    }
    return false;
});
export const getCacheItem = (cacheKey) => __awaiter(void 0, void 0, void 0, function* () {
    const caches = yield getLocalStorageItem("caches");
    return caches.find((item) => item.key === cacheKey);
});
export const isCacheExists = (cacheKey) => __awaiter(void 0, void 0, void 0, function* () {
    const caches = yield getLocalStorageItem("caches");
    return caches.findIndex((item) => item.key === cacheKey) === -1;
});
export const getCacheDataWithCacheKey = (cacheKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caches = yield getLocalStorageItem("caches");
        const data = caches.find((item) => item.key === cacheKey);
        if (yield isCacheExpired(cacheKey)) {
            const updatedCaches = caches.filter((item) => item.key !== cacheKey);
            setLocalStorageItem("caches", updatedCaches);
            return undefined;
        }
        return data;
    }
    catch (error) {
        console.error("Error getting cache data:", error);
    }
});
