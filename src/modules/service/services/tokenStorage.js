const KEY = 'oficioya.token';

// El token vive en sessionStorage: se borra al cerrar la pestaña.
export const tokenStorage = {
  get: () => {
    try {
      return sessionStorage.getItem(KEY) ?? '';
    } catch {
      return '';
    }
  },
  set: (token) => {
    try {
      sessionStorage.setItem(KEY, token);
    } catch {
      // sin almacenamiento disponible: se ignora
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // sin almacenamiento disponible: se ignora
    }
  },
};