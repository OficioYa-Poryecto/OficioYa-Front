
const BASE_URL = '/api/v1';
const TOKEN_KEY = 'oy_token';
const LOGIN_PATH = '/auth';

export async function request(path, { method = 'GET', body, token } = {}) {
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

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    if (window.location.pathname !== LOGIN_PATH) {
      window.location.assign(LOGIN_PATH);
    }
  }

  if (!response.ok) {
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
