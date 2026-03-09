import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth } from './tokenRefresh';


export function useAuthenticatedFetch() {
  const { accessToken, updateAccessToken } = useAuth();

  const makeRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return fetchWithAuth(url, options, accessToken, updateAccessToken);
  };

  return {

    get: async (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: 'GET' });
    },

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

    delete: async (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: 'DELETE' });
    },

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

    request: makeRequest,
  };
}

