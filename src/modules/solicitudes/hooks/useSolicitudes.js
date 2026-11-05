import { listarSolicitudes } from '../services/solicitudesService';

export function useSolicitudes() {
  return { solicitudes: listarSolicitudes() };
}
