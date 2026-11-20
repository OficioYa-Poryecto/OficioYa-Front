import { request } from '../../core/lib/httpClient';

export const authService = {
  // Login provisional del back: ignora las credenciales y devuelve un token de prueba.
  login: (correo, password) =>
    request('/auth/login', { method: 'POST', body: { correo, password } }),
};