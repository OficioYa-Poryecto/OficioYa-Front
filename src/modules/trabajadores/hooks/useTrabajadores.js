import {
  listarFotosTrabajo,
  listarOficios,
  obtenerHorarioSemanal,
  obtenerTrabajador,
} from '../services/trabajadoresService';

export function useTrabajadores() {
  return {
    trabajador: obtenerTrabajador(),
    fotos: listarFotosTrabajo(),
    horario: obtenerHorarioSemanal(),
    oficios: listarOficios(),
  };
}
