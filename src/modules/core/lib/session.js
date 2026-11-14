const TOKEN_KEY = 'oy_token';
const USER_ID_KEY = 'oy_userId';
const ROLES_KEY = 'oy_roles';
const EXPIRES_AT_KEY = 'oy_expiresAt';

export function saveSession({ token, userId, roles, expiresInSeconds }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (userId !== undefined && userId !== null) {
    localStorage.setItem(USER_ID_KEY, String(userId));
  }
  if (roles !== undefined && roles !== null) {
    const rolesArray = Array.isArray(roles) ? roles : Array.from(roles);
    localStorage.setItem(ROLES_KEY, JSON.stringify(rolesArray));
  }
  if (expiresInSeconds !== undefined && expiresInSeconds !== null) {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }

  const rawExpiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  const expiresAt = rawExpiresAt ? Number(rawExpiresAt) : null;

  if (expiresAt && Date.now() >= expiresAt) {
    clearSession();
    return null;
  }

  const userId = localStorage.getItem(USER_ID_KEY);
  const rawRoles = localStorage.getItem(ROLES_KEY);
  let roles = [];
  if (rawRoles) {
    try {
      roles = JSON.parse(rawRoles);
    } catch {
      roles = [];
    }
  }

  return {
    token,
    userId,
    roles,
    expiresAt,
  };
}

export function getToken() {
  return getSession()?.token ?? null;
}


