import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import * as profileService from '../services/profileService';

export function useProfile(id) {
  const token = ACCESS_TOKEN;
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const peticion = id
      ? profileService.obtenerPerfilPublico(id, token)
      : profileService.obtenerMiPerfil(token);

    peticion
      .then(setPerfil)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id, token]);

  async function actualizar(datos) {
    setPerfil(await profileService.actualizarMiPerfil(datos, token));
  }

  async function agregarRol(rol) {
    setPerfil(await profileService.agregarRol(rol, token));
  }

  return { perfil, cargando, error, actualizar, agregarRol };
}
