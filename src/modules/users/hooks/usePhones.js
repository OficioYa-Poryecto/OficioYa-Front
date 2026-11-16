import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import * as profileService from '../services/profileService';

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

  async function guardar(peticion) {
    const lista = await peticion;
    setTelefonos(lista);
    return lista;
  }

  const agregar = (numero) => guardar(profileService.agregarTelefono(numero, ACCESS_TOKEN));
  const cambiar = (id, numero) => guardar(profileService.cambiarTelefono(id, numero, ACCESS_TOKEN));
  const eliminar = (id) => guardar(profileService.eliminarTelefono(id, ACCESS_TOKEN));

  return { telefonos, cargando, error, agregar, cambiar, eliminar };
}