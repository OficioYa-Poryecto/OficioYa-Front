export const STEPS = [
  {
    id: 1,
    label: 'Solicitud',
    eyebrow: 'Hacer solicitud',
    title: 'Cuéntanos qué necesitas',
    progressLabel: 'Detalles del servicio',
    cta: 'Continuar a trabajadores',
  },
  {
    id: 2,
    label: 'Trabajadores',
    eyebrow: 'Enviar solicitud',
    title: '¿A quién se la enviamos?',
    progressLabel: 'Selección de trabajadores',
    cta: 'Continuar para enviar',
  },
  {
    id: 3,
    label: 'Enviar',
    eyebrow: 'Enviar solicitud',
    title: 'Revisa antes de enviar',
    progressLabel: 'Resumen y confirmación',
    cta: 'Enviar solicitud',
  },
];

export const SENT_STEP = {
  label: 'Enviada',
  eyebrow: 'Solicitud enviada',
  title: 'Todo está en marcha',
  progressLabel: 'Solicitud completada',
  cta: 'Hacer otra solicitud',
};

export const PHOTO_RULES = {
  maxFiles: 3,
  maxBytes: 2 * 1024 * 1024,
  accepted: ['image/jpeg', 'image/png', 'image/webp'],
};

export const DETAILS_FORM_ID = 'request-details-form';

export const WORKERS_FORM_ID = 'request-workers-form';