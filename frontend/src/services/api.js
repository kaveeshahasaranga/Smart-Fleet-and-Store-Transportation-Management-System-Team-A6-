const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'fleetflow.auth.session';

function readStoredSession() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored);
    if (
      session
      && typeof session === 'object'
      && !Array.isArray(session)
      && typeof session.token === 'string'
      && session.token
      && session.user
      && typeof session.user === 'object'
      && !Array.isArray(session.user)
      && ['admin', 'store'].includes(session.user.role)
    ) {
      return session;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.warn('Could not restore the saved sign-in session.', error);
  }
  return null;
}

const savedSession = readStoredSession();
let accessToken = savedSession?.token || null;
let currentUser = savedSession?.user || null;

// The login feature persists the session; passing a null token signs out.
export function setApiAccessToken(token, user = null) {
  const nextToken = token || null;
  const nextUser = nextToken ? user : null;
  if (nextToken && (!nextUser || !['admin', 'store'].includes(nextUser.role))) {
    throw new Error('The sign-in response did not include a valid user profile.');
  }
  try {
    if (nextToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    throw new Error('Could not save your sign-in session in this browser. Check browser storage settings and try again.');
  }
  accessToken = nextToken;
  currentUser = nextUser;
  window.dispatchEvent(new Event('fleet-auth-changed'));
}

export function getApiAccessToken() {
  return accessToken;
}

export function getApiCurrentUser() {
  return currentUser;
}

export function subscribeToApiAuth(onAuthChanged) {
  window.addEventListener('fleet-auth-changed', onAuthChanged);
  function handleStorageChange(event) {
    if (event.key !== AUTH_STORAGE_KEY) return;
    const session = readStoredSession();
    accessToken = session?.token || null;
    currentUser = session?.user || null;
    onAuthChanged();
  }
  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('fleet-auth-changed', onAuthChanged);
    window.removeEventListener('storage', handleStorageChange);
  };
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && accessToken) setApiAccessToken(null);
    throw Object.assign(new Error(data.message || 'Request failed'), { status: response.status, details: data.details });
  }
  return data;
}
