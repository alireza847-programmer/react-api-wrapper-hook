let apiWrapper = null;
export const configureApiWrapper = (api) => {
    apiWrapper = api;
};
export const getApiWrapper = () => {
    if (!apiWrapper) {
        throw new Error('API wrapper not configured. Call configureApiWrapper first.');
    }
    return apiWrapper;
};
