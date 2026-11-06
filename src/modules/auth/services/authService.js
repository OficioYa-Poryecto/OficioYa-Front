// Datos de ejemplo del mockup. Se reemplazan por llamadas con httpClient al conectar los microservicios.
const contratante = {
  initials: 'AC',
  firstName: 'Ana',
  name: 'Ana Cárdenas',
  maskedEmail: 'an••••@correo.com',
  email: 'ana.cardena@correo.com',
  maskedPhones: ['+57 300 ••• ••42'],
  phones: ['+57 300 456 7842'],
  zone: 'Belén, Medellín',
  about:
    'Ofrezco servicios responsables y de confianza para resolver las necesidades de mis vecinos.',
  stats: [
    { value: '12', label: 'Servicios solicitados' },
    { value: '9', label: 'Trabajos completados' },
    { value: '4,9', label: 'Calificación recibida' },
  ],
};

const administrador = {
  initials: 'LP',
  firstName: 'Laura',
  name: 'Laura Pérez',
  maskedEmail: 'la•••@oficioya.co',
  maskedPhones: ['+57 301 ••• ••18'],
  permissions: ['Moderar perfiles', 'Gestionar reportes', 'Verificar identidades'],
  summary: [
    { icon: 'user', label: 'Perfiles por verificar', value: '18', note: '+4 hoy' },
    { icon: 'clipboard', label: 'Reportes abiertos', value: '7', note: '2 prioritarios' },
    { icon: 'shield', label: 'Casos resueltos', value: '126', note: 'Este mes' },
  ],
  reviewQueue: [
    {
      name: 'Diego Ramírez',
      detail: 'Trabajador · Electricista',
      reason: 'Verificar identidad',
      status: 'Pendiente',
      tone: 'pillWarning',
    },
    {
      name: 'Sandra Gómez',
      detail: 'Contratante',
      reason: 'Reseña reportada',
      status: 'Prioritario',
      tone: 'pillError',
    },
    {
      name: 'Miguel Torres',
      detail: 'Trabajador · Técnico',
      reason: 'Datos inconsistentes',
      status: 'En análisis',
      tone: 'pillNeutral',
    },
  ],
};

export function obtenerContratante() {
  return contratante;
}

export function obtenerAdministrador() {
  return administrador;
}
