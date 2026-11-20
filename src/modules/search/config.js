// Barrios de la demo: los mismos ids del Orchestrator simulado de Search.
// El catálogo real debe venir del dominio dueño de las zonas.
export const BARRIOS = [
  { id: 10, nombre: 'Chapinero' },
  { id: 11, nombre: 'Usaquén' },
  { id: 12, nombre: 'Suba' },
  { id: 13, nombre: 'Kennedy' },
];

export const DIAS = [
  { valor: 'MONDAY', nombre: 'Lunes' },
  { valor: 'TUESDAY', nombre: 'Martes' },
  { valor: 'WEDNESDAY', nombre: 'Miércoles' },
  { valor: 'THURSDAY', nombre: 'Jueves' },
  { valor: 'FRIDAY', nombre: 'Viernes' },
  { valor: 'SATURDAY', nombre: 'Sábado' },
  { valor: 'SUNDAY', nombre: 'Domingo' },
];

// Franjas de 6 horas en horario militar. El valor es el que espera Search.
export const FRANJAS = [
  { valor: 'MADRUGADA', nombre: '00:00 – 06:00' },
  { valor: 'MANANA', nombre: '06:00 – 12:00' },
  { valor: 'TARDE', nombre: '12:00 – 18:00' },
  { valor: 'NOCHE', nombre: '18:00 – 24:00' },
];

export const ORDENES = [
  { valor: 'MAYOR_A_MENOR', nombre: 'Calificación: mayor a menor' },
  { valor: 'MENOR_A_MAYOR', nombre: 'Calificación: menor a mayor' },
];
