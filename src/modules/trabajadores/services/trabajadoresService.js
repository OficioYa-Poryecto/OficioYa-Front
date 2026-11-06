// Datos de ejemplo del mockup. Se reemplazan por llamadas con httpClient al conectar el microservicio Worker.
const trabajador = {
  initials: 'JM',
  firstName: 'Julián',
  name: 'Julián Martínez',
  maskedEmail: 'ju••••@mail.com',
  email: 'julian@mail.com',
  maskedPhones: ['+57 310 ••• ••90', '+57 315 ••• ••00'],
  phones: ['+57 310 456 7890'],
  zone: 'Laureles, Medellín',
  trade: 'Plomería e instalaciones',
  rate: '$80.000',
  skills: ['Plomería', 'Instalaciones', 'Mantenimiento'],
  summary:
    'Soluciono fugas, instalaciones y mantenimientos con cuidado y cumplimiento. Trabajo limpio, explico cada arreglo y dejo todo en orden.',
  stats: [
    { icon: 'briefcase', value: '47', label: 'Trabajos completados' },
    { icon: 'star', value: '4,8', label: 'Calificación promedio · 39 reseñas' },
  ],
};

const fotosTrabajo = [
  {
    src: 'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?auto=format&fit=crop&w=900&q=85',
    alt: 'Instalación de tubería en una pared',
  },
  {
    src: 'https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?auto=format&fit=crop&w=900&q=85',
    alt: 'Reparación de tubería bajo un lavaplatos',
  },
  {
    src: 'https://images.unsplash.com/photo-1676210134190-3f2c0d5cf58d?auto=format&fit=crop&w=900&q=85',
    alt: 'Mantenimiento de calentador de agua',
  },
  {
    src: 'https://images.unsplash.com/photo-1454988501794-2992f706932e?auto=format&fit=crop&w=900&q=85',
    alt: 'Herramientas de trabajo organizadas',
  },
];

const horarioSemanal = [
  ['Lun', '8:00 a. m. – 5:00 p. m.'],
  ['Mar', '8:00 a. m. – 5:00 p. m.'],
  ['Mié', '8:00 a. m. – 5:00 p. m.'],
  ['Jue', '8:00 a. m. – 5:00 p. m.'],
  ['Vie', '8:00 a. m. – 3:00 p. m.'],
  ['Sáb', '9:00 a. m. – 1:00 p. m.'],
  ['Dom', 'No disponible'],
];

const oficios = [
  'Plomería',
  'Electricista',
  'Costura y arreglos',
  'Soporte técnico',
  'Profesor particular',
];

export function obtenerTrabajador() {
  return trabajador;
}

export function listarFotosTrabajo() {
  return fotosTrabajo;
}

export function obtenerHorarioSemanal() {
  return horarioSemanal;
}

export function listarOficios() {
  return oficios;
}
