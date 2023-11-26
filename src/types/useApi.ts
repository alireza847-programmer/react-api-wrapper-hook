export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface Props<ResponseType, FormattedDataType = ResponseType> {
  url: string;
  method?: Method;
  payload?: any;
  headers?: any;
  initialData?: FormattedDataType;
  lazy?: boolean;
  dataFormatter?: (data: ResponseType) => FormattedDataType | ResponseType;
  onError?: (error: unknown) => void;
  onSuccess?: (data: FormattedDataType) => void;
  baseURL?: string;
  onFinish?: () => void;
  callCondition?: boolean;
  apiWrapper?: any;
}

export type ReCallProps<T> = Partial<
  Pick<Props<T>, 'url' | 'payload' | 'onSuccess' | 'onError' | 'onFinish'>
>;

export interface ApiStateType<T> {
  data?: T;
  loading: boolean;
  error: boolean;
}

export type HEADERS = {[key: string]: string};

export interface ApiOkResponse<T> {
  ok: true;
  problem: null;
  originalError: null;

  data?: T;
  status?: number;
  headers?: HEADERS;
  config?: any;
  duration?: number;
}
