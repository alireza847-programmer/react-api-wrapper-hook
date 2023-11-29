let apiWrapper = null;
export const configureApiWrapper = (api) => {
  apiWrapper = api;
};
export const getApiWrapper = () => {
  if (!apiWrapper) {
    throw new Error(
      "API wrapper not configured. Call configureApiWrapper first."
    );
  }
  if (apiWrapper === null || apiWrapper === void 0 ? void 0 : apiWrapper.any) {
    return apiWrapper.any;
  }
  return apiWrapper;
};
