// Datos de ejemplo del mockup. Se reemplazan por llamadas con httpClient al conectar el microservicio.
const solicitudes = [
  {
    title: 'Reparación de fuga',
    detail: 'Con Julián Martínez · 14 de mayo',
    icon: 'wrench',
    status: 'Cumplida',
    tone: 'pillSuccess',
  },
  {
    title: 'Instalación de repisa',
    detail: 'Con Carlos Rojas · 22 de mayo',
    icon: 'clipboard',
    status: 'Pendiente',
    tone: 'pillWarning',
  },
];

export function listarSolicitudes() {
  return solicitudes;
}
