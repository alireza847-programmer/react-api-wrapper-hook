# react-api-wrapper-hook

A flexible React hook for handling API calls with support for different API wrappers like Axios or ApiSauce.

## Installation

```bash
npm install react-api-wrapper-hook
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

// Apply your custom interceptor if needed
yourCustomInterceptor(api);

// Configure the API wrapper
configureApiWrapper(api);
```

### Using the `useApi` hook

Now you can use the `useApi` hook in your components:

```jsx
import { useEffect } from "react";
import useApi from "react-api-wrapper-hook";

const MyComponent = () => {
  const { loading, error, data, fetch, setData } = useApi({
    method: "GET",
    url: "/api/data",
    // ... other configuration options
  });

  useEffect(() => {
    // Fetch data when the component mounts
    fetch();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
};

export default MyComponent;
```

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

#### Return Value

An object with the following properties:

- `loading`: A boolean indicating whether the request is in progress.
- `error`: An error object if the request encounters an error.
- `data`: The formatted response data.
- `fetch`: A function to manually trigger the API call.
- `setData`: A function to manually set data in the hook.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
