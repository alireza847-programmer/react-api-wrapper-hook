let apiWrapper: any = null;

export const configureApiWrapper = (api: any) => {
  apiWrapper = api;
};

export const getApiWrapper = () => {
  if (!apiWrapper) {
    throw new Error(
      'API wrapper not configured. Call configureApiWrapper first.',
    );
  }
  return apiWrapper;
};
