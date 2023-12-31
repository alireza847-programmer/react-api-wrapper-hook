# react-api-wrapper-hook

A flexible React hook for handling API calls with support for axios and apisauce API wrappers.

## Installation

```bash
npm install react-api-wrapper-hook
```

```bash
yarn add react-api-wrapper-hook
```

## This package support both web and react native projects :

If you are using React Native make sure React Native async storage is installed

```bash
npm install @react-native-async-storage/async-storage
```

OR

```bash
yarn add @react-native-async-storage/async-storage
```

## Usage

### Configuration

Before using the `useApi` hook, you need to configure the API wrapper in your main application file (`app.tsx`). Use the `configureApiWrapper` function and provide your chosen API wrapper (e.g., Axios or ApiSauce):

```jsx
// app.tsx

import { configureApiWrapper } from "react-api-wrapper-hook";
import axios from "axios"; // or import { create } from 'apisauce';
import { yourCustomInterceptor } from "path/to/your/interceptor";

const api = axios.create({
  // Your Axios configuration or ApiSauce create method here
});

// Configure the API wrapper
configureApiWrapper(api);
```

### Using the `useApi` hook

Now you can use the `useApi` hook in your components:

```jsx
import { useEffect } from "react";
import useApi from "react-api-wrapper-hook";
import { YourResponseDataType } from "path/to/your/types";

const MyComponent = () => {
  const { loading, error, data, fetch, setData } = useApi<YourResponseDataType>(
    {
      method: "GET",
      url: "/api/data",
      lazy: true,
      // ... other configuration options
    };
  )

  useEffect(() => {
    // Fetch data when the component mounts
    fetch();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
};

export default MyComponent;
```

OR

```jsx
import { useEffect } from "react";
import useApi from "react-api-wrapper-hook";
import { YourResponseDataType , YourResponseDataTypeAfterFormat }  from 'path/to/your/types'

const MyComponent = () => {
  const { loading, error, data, fetch, setData } = useApi<YourResponseDataType,YourResponseDataTypeAfterFormat>({
    method: "GET",
    url: "/api/data",
    dataFormatter : (data) => data.stringify()
    // ... other configuration options
  });

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error and <p>Error: {error}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
};

export default MyComponent;
```

### Caching

The library supports caching of API responses. To enable caching, you can provide the `cache` configuration option in the `useApi` hook:

```jsx
const MyComponent = () => {
  const { loading, error, data, fetch, setData } =
    useApi <
    YourResponseDataType >
    {
      method: "GET",
      url: "/api/data",
      cache: {
        key: "unique-cache-key", // Provide a unique key for this cache
        timeout: 60, // Cache timeout in seconds
      },
      // ... other configuration options
    };

  // Rest of the component code...
};
```

In this example, the API response will be cached using the specified key (`unique-cache-key`) for 60 seconds. Subsequent requests with the same key will use the cached data until the cache expires.

## API

### `useApi` Hook

#### Parameters

- `method` (optional): HTTP method (default: 'GET').
- `url`: API endpoint URL.
- `headers` (optional): HTTP headers.
- `payload` (optional): Request payload.
- `initialData` (optional): Initial data for the data state in the hook.
- `lazy` (optional): If `true`, the request will be triggered manually (default: `false`).
- `dataFormatter` (optional): A function to format the API response data.
- `onError` (optional): Callback function to handle errors.
- `onSuccess` (optional): Callback function to handle successful responses.
- `onFinish` (optional): Callback function executed after the request is complete.
- `baseURL` (optional): Base URL for the API.
- `callCondition` (optional): Condition to determine whether the API call should be made.
- `cache` (optional): Configuration for caching the API response. Provide an object with `key` (unique cache key) and `timeout` (cache timeout in seconds).

#### Return Value

An object with the following properties:

- `loading`: A boolean indicating whether the request is in progress.
- `error`: An error object if the request encounters an error.
- `data`: The formatted response data.
- `fetch`: A function to manually trigger

the API call.

- `setData`: A function to manually set data in the hook.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
