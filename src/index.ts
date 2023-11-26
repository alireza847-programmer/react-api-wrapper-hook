import {useEffect, useState} from 'react';
import {ApiOkResponse, ApiStateType} from './types/useApi';
import {Props, ReCallProps} from './types/useApi';
import {getApiWrapper} from './configApiWrapper';

const useApi = <ResponseType, FormattedDataType = ResponseType>(
  props: Props<ResponseType, FormattedDataType>,
) => {
  const {
    method = 'GET',
    url,
    headers,
    payload,
    initialData,
    lazy,
    dataFormatter = content => content,
    onError = err => err,
    onSuccess = data => data,
    onFinish = () => {},
    baseURL,
    callCondition = true,
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
    props?: ReCallProps<FormattedDataType>,
  ): Promise<any> => {
    try {
      setData(data => ({
        ...data,
        error: false,
        loading: true,
      }));
      const apiWrapper = getApiWrapper();
      const response = (await apiWrapper.any({
        method,
        headers,
        url: props?.url || url,
        data: props?.payload || payload,
        baseURL,
      })) as any as ApiOkResponse<ResponseType>;

      setData({
        loading: false,
        error: false,
        data: dataFormatter(response.data as ResponseType) as FormattedDataType,
      });

      if (props?.onSuccess) {
        return props.onSuccess(
          dataFormatter(response.data as ResponseType) as FormattedDataType,
        );
      } else {
        return onSuccess(
          dataFormatter(response.data as ResponseType) as FormattedDataType,
        );
      }
    } catch (error) {
      setData(data => ({
        ...data,
        error: true,
        loading: false,
      }));

      if (props?.onError) {
        return props.onError(error);
      } else {
        return onError(error);
      }
    } finally {
      onFinish();
    }
  };

  return {
    loading: data.loading,
    error: data.error,
    data: data.data,
    fetch: getDataRequest,
    setData: (data?: FormattedDataType) => setData(prev => ({...prev, data})),
  };
};

export default useApi;
