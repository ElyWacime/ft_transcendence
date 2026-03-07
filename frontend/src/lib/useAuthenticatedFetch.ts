import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth } from './tokenRefresh';

/**
 * Custom hook for making authenticated API requests
 * Automatically handles access token and token refresh
 * 
 * Usage:
 * const api = useAuthenticatedFetch();
 * const data = await api.get('/api/users/profile');
 */
export function useAuthenticatedFetch() {
  const { accessToken, updateAccessToken } = useAuth();

  const makeRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return fetchWithAuth(url, options, accessToken, updateAccessToken);
  };

  return {
    /**
     * Make a GET request
     */
    get: async (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: 'GET' });
    },

    /**
     * Make a POST request
     */
    post: async (url: string, data?: any, options: RequestInit = {}) => {
      return makeRequest(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    },

    /**
     * Make a PUT request
     */
    put: async (url: string, data?: any, options: RequestInit = {}) => {
      return makeRequest(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    },

    /**
     * Make a DELETE request
     */
    delete: async (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: 'DELETE' });
    },

    /**
     * Make a PATCH request
     */
    patch: async (url: string, data?: any, options: RequestInit = {}) => {
      return makeRequest(url, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    },

    /**
     * Make a custom request with full control
     */
    request: makeRequest,
  };
}

/**
 * Example usage in a component:
 * 
 * function MyComponent() {
 *   const api = useAuthenticatedFetch();
 *   
 *   const loadProfile = async () => {
 *     const response = await api.get('/api/users/profile');
 *     const data = await response.json();
 *     console.log(data);
 *   };
 *   
 *   const updateProfile = async (name: string) => {
 *     const response = await api.put('/api/users/profile', { name });
 *     const data = await response.json();
 *     console.log(data);
 *   };
 *   
 *   return <div>...</div>;
 * }
 */
