import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import * as profileService from '../services/profileService';

// Teléfonos propios sin enmascarar, para la pantalla de edición.
// Cada cambio responde con la lista tal como quedó guardada en la BD.
export function usePhones() {
  const [telefonos, setTelefonos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileService.obtenerMisTelefonos(ACCESS_TOKEN)
      .then(setTelefonos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const agregar = async (numero) => setTelefonos(await profileService.agregarTelefono(numero, ACCESS_TOKEN));
  const cambiar = async (id, numero) => setTelefonos(await profileService.cambiarTelefono(id, numero, ACCESS_TOKEN));
  const eliminar = async (id) => setTelefonos(await profileService.eliminarTelefono(id, ACCESS_TOKEN));

  return { telefonos, cargando, error, agregar, cambiar, eliminar };
}
