import { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import * as profileService from '../services/profileService';

export function useProfile(id) {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const peticion = id
      ? profileService.obtenerPerfilPublico(id, ACCESS_TOKEN)
      : profileService.obtenerMiPerfil(ACCESS_TOKEN);

    peticion
      .then(setPerfil)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  async function actualizar(datos) {
    setPerfil(await profileService.actualizarMiPerfil(datos, ACCESS_TOKEN));
  }

  async function agregarRol(rol) {
    setPerfil(await profileService.agregarRol(rol, ACCESS_TOKEN));
  }

  return { perfil, cargando, error, actualizar, agregarRol };
}
