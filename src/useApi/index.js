var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState } from "react";
import { getApiWrapper } from "../utils/configApiWrapper";
import { getCacheDataWithCacheKey, addNewCache } from "../utils/caching";
const useApi = (props) => {
    const { method = "GET", url, headers, payload, initialData, lazy, dataFormatter = (content) => content, onError = (err) => err, onSuccess = (data) => data, onFinish = () => { }, baseURL, callCondition = true, cache, } = props;
    const [data, setData] = useState({
        error: false,
        loading: false,
        data: initialData,
    });
    useEffect(() => {
        if (!lazy && callCondition) {
            getDataRequest();
        }
    }, [callCondition]);
    const getDataRequest = (functionProps) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if the data is available in the cache
            if (cache) {
                const cacheData = yield getCacheDataWithCacheKey(cache.key);
                if (cacheData) {
                    setData(Object.assign(Object.assign({}, data), { data: cacheData.value }));
                    return;
                }
            }
            // Fetch data from the API
            setData((data) => (Object.assign(Object.assign({}, data), { error: false, loading: true })));
            const apiWrapper = getApiWrapper();
            const response = (yield apiWrapper.any({
                method,
                headers,
                url: (functionProps === null || functionProps === void 0 ? void 0 : functionProps.url) || url,
                data: (functionProps === null || functionProps === void 0 ? void 0 : functionProps.payload) || payload,
                baseURL,
            }));
            // Update state with fetched data
            setData({
                loading: false,
                error: false,
                data: dataFormatter(response.data),
            });
            // Add new data to the cache
            if (cache) {
                yield addNewCache(cache, dataFormatter(response.data));
            }
            // Trigger onSuccess callback
            if (functionProps === null || functionProps === void 0 ? void 0 : functionProps.onSuccess) {
                return functionProps.onSuccess(dataFormatter(response.data));
            }
            else {
                return onSuccess(dataFormatter(response.data));
            }
        }
        catch (error) {
            // Handle errors
            setData((data) => (Object.assign(Object.assign({}, data), { error: true, loading: false })));
            if (functionProps === null || functionProps === void 0 ? void 0 : functionProps.onError) {
                return functionProps.onError(error);
            }
            else {
                return onError(error);
            }
        }
        finally {
            // Trigger onFinish callback
            onFinish();
        }
    });
    return {
        loading: data.loading,
        error: data.error,
        data: data.data,
        fetch: getDataRequest,
        setData: (data) => setData((prev) => (Object.assign(Object.assign({}, prev), { data }))),
    };
};
export default useApi;
