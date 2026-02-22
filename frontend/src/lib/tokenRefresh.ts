const API_URL = import.meta.env.VITE_API_URL || "";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function refreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(url, { ...options, headers });

  // If 401 and we have a refresh token, try to refresh
  if (response.status === 401 && localStorage.getItem("refreshToken")) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
    }

    const refreshResult = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshResult) {
      // Retry the original request with new token
      headers.Authorization = `Bearer ${refreshResult.accessToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed, clear tokens and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
  }

  return response;
}
