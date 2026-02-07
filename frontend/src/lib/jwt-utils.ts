
export function decodeJWT(token: string): Record<string, any> | null {
  try {
    if (!token || token.split('.').length !== 3) {
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
    return null;
  }
}
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false;

  const expirationTime = payload.exp * 1000;
  return Date.now() > expirationTime;
}

export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.id || null;
}

export function getEmailFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.email || null;
}
