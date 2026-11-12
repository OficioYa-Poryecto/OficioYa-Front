
import { clearSession } from './session';

const BASE_URL = '/api/v1';

export async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
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

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearSession();
      window.location.assign('/auth?expired=1');
    }

    const apiError = await response.json().catch(() => ({}));
    const error = new Error(
      apiError.message ?? apiError.mensaje ?? apiError.error ?? `Error ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}