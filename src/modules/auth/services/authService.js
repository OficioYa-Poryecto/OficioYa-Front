import { request } from '../../core/lib/httpClient';

/** POST /api/v1/auth/login → { token, expiresInSeconds, userId, roles } */
export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

/** POST /api/v1/auth/register → UserDto */
export function register({ name, email, password, roles }) {
  return request('/auth/register', {
    method: 'POST',
    body: { name, email, password, roles },
  });
}

/** POST /api/v1/auth/forgot → void */
export function forgotPassword({ email }) {
  return request('/auth/forgot', {
    method: 'POST',
    body: { email },
  });
}

/** POST /api/v1/auth/reset → void */
export function resetPassword({ email, code, newPassword }) {
  return request('/auth/reset', {
    method: 'POST',
    body: { email, code, newPassword },
  });
}
