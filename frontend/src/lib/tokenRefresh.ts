const API_URL = import.meta.env.VITE_API_URL || "";

let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string } | null> | null = null;

export async function refreshToken(): Promise<{ accessToken: string } | null> {
  try {
    const res = await fetch(`${API_URL}/api/users/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return { accessToken: data.accessToken };
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

/**
 * Make an authenticated fetch request with automatic token refresh on 401
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param accessToken - Current access token (from context/state) - optional for backwards compatibility
 * @param onTokenRefresh - Callback to update the access token in state - optional
 */

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  accessToken: string | null = null,
  onTokenRefresh?: (newToken: string) => void
): Promise<Response> {
  const headers: HeadersInit = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  if (options.body && typeof options.body === "string") {
    const hasContentType =
      options.headers &&
      Object.keys(options.headers).some(
        (key) => key.toLowerCase() === "content-type"
      );
    if (!hasContentType) {
      headers["Content-Type"] = "application/json";
    }
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
    }

    const refreshResult = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshResult) {
      if (onTokenRefresh) {
        onTokenRefresh(refreshResult.accessToken);
      }

      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${refreshResult.accessToken}`,
      };
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    } else {
      console.error("Session expired, redirecting to login");
      window.location.href = "/login";
    }
  }
  return response;
}
