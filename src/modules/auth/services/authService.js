const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message ?? 'Error en la solicitud'), { status: res.status, body });
  }
  // 204 / responses with no body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** POST /api/v1/auth/login → { token, expiresInSeconds, userId, roles } */
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

/** POST /api/v1/auth/register → UserDto */
export async function register({ name, email, password, roles }) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, roles }),
  });
  return handleResponse(res);
}

/** POST /api/v1/auth/forgot → void */
export async function forgotPassword({ email }) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

/** POST /api/v1/auth/reset → void */
export async function resetPassword({ email, code, newPassword }) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  return handleResponse(res);
}

