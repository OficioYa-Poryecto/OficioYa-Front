import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import * as profileService from '../services/profileService';

// Teléfonos propios sin enmascarar, para la pantalla de edición
export function usePhones() {
  const token = ACCESS_TOKEN;
  const [telefonos, setTelefonos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileService.obtenerMisTelefonos(token)
      .then(setTelefonos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  // Después de cada cambio se vuelve a consultar la lista guardada en la BD,
  // así la pantalla siempre muestra exactamente lo que quedó guardado
  async function recargar() {
    setTelefonos(await profileService.obtenerMisTelefonos(token));
  }

  async function agregar(numero) {
    await profileService.agregarTelefono(numero, token);
    await recargar();
  }

  async function cambiar(id, numero) {
    await profileService.cambiarTelefono(id, numero, token);
    await recargar();
  }

  async function eliminar(id) {
    await profileService.eliminarTelefono(id, token);
    await recargar();
  }

  return { telefonos, cargando, error, agregar, cambiar, eliminar };
}
