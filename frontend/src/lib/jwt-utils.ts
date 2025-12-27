/**
 * Decode JWT payload WITHOUT verification (client-side only)
 * Safe to use since JWT is signed by server and payload is visible anyway
 */
export function decodeJWT(token: string): Record<string, any> | null {
  try {
    if (!token || token.split('.').length !== 3) {
      console.warn('[decodeJWT] Invalid token format');
      return null;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[decodeJWT] Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false;

  const expirationTime = payload.exp * 1000; // Convert to milliseconds
  return Date.now() > expirationTime;
}

/**
 * Get user ID from token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.id || null;
}

/**
 * Get email from token
 */
export function getEmailFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.email || null;
}
