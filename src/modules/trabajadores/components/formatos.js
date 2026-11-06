export const UNIDADES = [
  { value: 'PER_HOUR', label: 'por hora' },
  { value: 'PER_JOB', label: 'por trabajo' },
  { value: 'PER_DAY', label: 'por día' },
];

export const DIAS = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

export function nombreUnidad(valor) {
  return UNIDADES.find((unidad) => unidad.value === valor)?.label ?? '';
}

export function nombreDia(valor) {
  return DIAS.find((dia) => dia.value === valor)?.label ?? '';
}

export function formatoDinero(valor) {
  return `$${new Intl.NumberFormat('es-CO').format(valor)} COP`;
}

export function formatoFecha(valor) {
  if (!valor) return '';
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${valor}T00:00:00Z`));
}
