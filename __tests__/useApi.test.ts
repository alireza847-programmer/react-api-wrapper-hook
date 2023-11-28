import { renderHook, act, render, waitFor } from "@testing-library/react";
import { configureApiWrapper, useApi } from "../src/index";
import { describe, it, expect, jest } from "@jest/globals";

describe("useApi Hook", () => {
  beforeAll(() => {
    const mockApi = {
      any: jest.fn(() => Promise.resolve({ data: "test data" })),
    };
    configureApiWrapper(mockApi);
  });

  it("should fetch data successfully", async () => {
    // Set up the hook
    const { result, unmount } = renderHook(() =>
      useApi<string>({ url: "/test" })
    );

    // Assert that loading is initially true
    expect(result.current.loading).toBe(true);

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      // Assert that loading is now false
      expect(result.current.loading).toBe(false);

      // Assert other expectations
      expect(result.current.data).toBe("test data");
    });

    // Cleanup
    unmount();
  });

  it("should handle API call failure", async () => {
    // Set up the hook with a mock that fails
    const mockApi = {
      any: jest.fn(() => Promise.reject("API error")),
    };
    configureApiWrapper(mockApi);

    // Set up the hook
    const { result, unmount } = renderHook(() =>
      useApi<string>({ url: "/test" })
    );

    // Assert that loading is initially true
    expect(result.current.loading).toBe(true);

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      // Assert that loading is now false
      expect(result.current.loading).toBe(false);

      // Assert that error is true
      expect(result.current.error).toBe(true);
    });

    // Cleanup
    unmount();
  });

  it("should handle lazy loading", async () => {
    // Set up the hook with lazy loading
    const { result, unmount } = renderHook(() =>
      useApi<string>({ url: "/test", lazy: true, initialData: "test" })
    );

    // Assert that loading is initially false
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("test");

    // Cleanup
    unmount();
  });
});
