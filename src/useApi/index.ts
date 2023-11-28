import { useEffect, useState } from "react";
import { ApiOkResponse, ApiStateType } from "../types/useApi";
import { Props, ReCallProps } from "../types/useApi";
import { getApiWrapper } from "../utils/configApiWrapper";
import { getCacheDataWithCacheKey, addNewCache } from "../utils/caching";

const useApi = <ResponseType, FormattedDataType = ResponseType>(
  props: Props<ResponseType, FormattedDataType>
) => {
  const {
    method = "GET",
    url,
    headers,
    payload,
    initialData,
    lazy,
    dataFormatter = (content) => content,
    onError = (err) => err,
    onSuccess = (data) => data,
    onFinish = () => {},
    baseURL,
    callCondition = true,
    cache,
  } = props;

  const [data, setData] = useState<ApiStateType<FormattedDataType>>({
    error: false,
    loading: false,
    data: initialData,
  });

  useEffect(() => {
    if (!lazy && callCondition) {
      getDataRequest();
    }
  }, [callCondition]);

  const getDataRequest = async (
    functionProps?: ReCallProps<FormattedDataType>
  ): Promise<any> => {
    try {
      // Check if the data is available in the cache
      if (cache) {
        const cacheData = await getCacheDataWithCacheKey(cache.key);
        if (cacheData) {
          setData({ ...data, data: cacheData.value });
          return;
        }
      }

      // Fetch data from the API
      setData((data) => ({
        ...data,
        error: false,
        loading: true,
      }));

      const apiWrapper = getApiWrapper();
      const response = (await apiWrapper.any({
        method,
        headers,
        url: functionProps?.url || url,
        data: functionProps?.payload || payload,
        baseURL,
      })) as any as ApiOkResponse<ResponseType>;

      // Update state with fetched data
      setData({
        loading: false,
        error: false,
        data: dataFormatter(response.data as ResponseType) as FormattedDataType,
      });

      // Add new data to the cache
      if (cache) {
        await addNewCache(
          cache,
          dataFormatter(response.data as ResponseType) as FormattedDataType
        );
      }

      // Trigger onSuccess callback
      if (functionProps?.onSuccess) {
        return functionProps.onSuccess(
          dataFormatter(response.data as ResponseType) as FormattedDataType
        );
      } else {
        return onSuccess(
          dataFormatter(response.data as ResponseType) as FormattedDataType
        );
      }
    } catch (error) {
      // Handle errors
      setData((data) => ({
        ...data,
        error: true,
        loading: false,
      }));

      if (functionProps?.onError) {
        return functionProps.onError(error);
      } else {
        return onError(error);
      }
    } finally {
      // Trigger onFinish callback
      onFinish();
    }
  };

  return {
    loading: data.loading,
    error: data.error,
    data: data.data,
    fetch: getDataRequest,
    setData: (data?: FormattedDataType) =>
      setData((prev) => ({ ...prev, data })),
  };
};

export default useApi;
