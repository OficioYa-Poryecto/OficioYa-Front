import { clearSession } from './session';

const API_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');
const BASE_URL = API_URL ? `${API_URL}/api/v1` : '/api/v1';
const TOKEN_KEY = 'oy_token';
const LOGIN_PATH = '/auth';

export async function request(path, { method = 'GET', body, token, responseType = 'json' } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const jwt = localStorage.getItem(TOKEN_KEY) || token;
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  if (response.status === 401 && jwt) {
    clearSession();
    if (window.location.pathname !== LOGIN_PATH) {
      window.location.assign('/auth?expired=1');
    }
  }

  if (!response.ok) {
    const apiError = await response.json().catch(() => ({}));
    const error = new Error(
      apiError.message ?? apiError.mensaje ?? apiError.detail ?? apiError.error ?? `Error ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
