const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let accessToken = null;

// The login feature calls this after sign-in and clears it on sign-out.
export function setApiAccessToken(token) {
  accessToken = token || null;
  window.dispatchEvent(new Event('fleet-auth-changed'));
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: response.status, details: data.details });
  return data;
}
