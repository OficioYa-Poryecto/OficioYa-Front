import {
  listarFotosTrabajo,
  listarOficios,
  listarOficiosActivos,
  listarZonas,
  obtenerHorarioSemanal,
} from '../services/trabajadoresService';

export function useTrabajadores() {
  return {
    fotos: listarFotosTrabajo(),
    horario: obtenerHorarioSemanal(),
    oficios: listarOficios(),
    oficiosActivos: listarOficiosActivos(),
    zonas: listarZonas(),
  };
}
