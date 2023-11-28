import { renderHook, act, render, waitFor } from "@testing-library/react";
import { configureApiWrapper, useApi } from "../index";
import { describe, it, expect, jest } from "@jest/globals";

describe("useApi Hook with Caching", () => {
  beforeAll(() => {
    const mockApi = {
      any: jest.fn(() => Promise.resolve({ data: "test data" })),
    };
    configureApiWrapper(mockApi);
  });

  it("should fetch data successfully with caching", async () => {
    const { result, unmount } = renderHook(() =>
      useApi<string>({
        url: "/test",
        cache: { key: "test-cache", timeout: 60 }, // cache for 60 seconds
      })
    );

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data");
    });

    // Cleanup
    unmount();
  });

  it("should use cached data on subsequent requests", async () => {
    const { result, unmount } = renderHook(() =>
      useApi<string>({
        url: "/test",
        cache: { key: "test-cache", timeout: 60 },
      })
    );

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data");
    });

    // Now, make another request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should use cached data
    });

    // Cleanup
    unmount();
  });

  it("should refetch data after cache timeout", async () => {
    const { result, unmount } = renderHook(() =>
      useApi<string>({
        url: "/test",
        cache: { key: "test-cache", timeout: 1 }, // cache for 1 second
      })
    );

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data");
    });

    // Wait for the cache to expire
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Make another request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should refetch after cache timeout
    });

    // Cleanup
    unmount();
  });

  it("should handle cache expiration during a request", async () => {
    const { result, unmount } = renderHook(() =>
      useApi<string>({
        url: "/test",
        cache: { key: "test-cache", timeout: 2 },
      })
    );

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data");
    });

    // Wait for the cache to almost expire
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make another request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should still use cached data
    });

    // Wait for the cache to fully expire
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Make another request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should refetch after cache timeout
    });

    // Cleanup
    unmount();
  });

  it("should handle cache expiration during a lazy request", async () => {
    const { result, unmount } = renderHook(() =>
      useApi<string>({
        url: "/test",
        cache: { key: "test-cache", timeout: 2 },
        lazy: true,
      })
    );

    // Assert that loading is initially false
    expect(result.current.loading).toBe(false);

    // Make a lazy request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data");
    });

    // Wait for the cache to almost expire
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make another lazy request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should still use cached data
    });

    // Wait for the cache to fully expire
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Make another lazy request
    act(() => {
      result.current.fetch();
    });

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("test data"); // Should refetch after cache timeout
    });

    // Cleanup
    unmount();
  });
});
