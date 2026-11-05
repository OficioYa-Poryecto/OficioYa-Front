
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
        body: body ? JSON.stringify(body) : undefined,
    });
    } catch {
    throw new Error('No se pudo conectar con el servidor');
    }

    if (!response.ok) {
    const apiError = await response.json().catch(() => ({}));
    const error = new Error(
        apiError.message ?? apiError.mensaje ?? apiError.error ?? `Error ${response.status}`,
    );
    error.status = response.status;
    throw error;
    }

    return response.status === 204 ? null : response.json();
}