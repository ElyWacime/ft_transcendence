import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: send cookies with every request
});

// Track if we're currently refreshing to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Function to refresh the access token
async function refreshAccessToken(): Promise<string> {
  const response = await axios.post(
    `${API_URL}/api/users/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data.accessToken;
}

// Request interceptor: Add access token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from auth context (will be set via closure or passed in)
    const token = (config as any).accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors with automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Only one refresh at a time
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
        }

        const newAccessToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        (originalRequest as any).accessToken = newAccessToken;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;

        // Refresh failed - redirect to login
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to make authenticated requests
// This should be called with the current access token from context
export function createAuthenticatedRequest(accessToken: string | null) {
  return {
    get: (url: string, config = {}) =>
      apiClient.get(url, { ...config, accessToken } as any),
    post: (url: string, data?: any, config = {}) =>
      apiClient.post(url, data, { ...config, accessToken } as any),
    put: (url: string, data?: any, config = {}) =>
      apiClient.put(url, data, { ...config, accessToken } as any),
    delete: (url: string, config = {}) =>
      apiClient.delete(url, { ...config, accessToken } as any),
    patch: (url: string, data?: any, config = {}) =>
      apiClient.patch(url, data, { ...config, accessToken } as any),
  };
}

// Export a hook-friendly version
export { apiClient as default };
