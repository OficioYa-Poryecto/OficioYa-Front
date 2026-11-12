import { useEffect, useState } from 'react';
import { getToken } from '../../core/lib/session';
import * as profileService from '../services/profileService';

export function useProfile(id) {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    const peticion = id
      ? profileService.obtenerPerfilPublico(id, token)
      : profileService.obtenerMiPerfil(token);

    peticion
      .then(setPerfil)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  async function actualizar(datos) {
    setPerfil(await profileService.actualizarMiPerfil(datos, getToken()));
  }

  async function agregarRol(rol) {
    setPerfil(await profileService.agregarRol(rol, getToken()));
  }

  return { perfil, cargando, error, actualizar, agregarRol };
}
