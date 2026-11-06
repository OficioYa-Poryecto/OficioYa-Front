// Datos de ejemplo del mockup. Se reemplazan por llamadas con httpClient al conectar el microservicio Worker.

// El nombre viene de Identity: el backend de Worker solo guarda el userId.
const cuenta = { userId: 99, initials: 'AS', firstName: 'Andrea', name: 'Andrea Salazar' };

const categorias = {
  tecnicos: { id: 1, name: 'Técnicos', detail: 'Oficios técnicos para el hogar y los negocios' },
  profesores: { id: 2, name: 'Profesores', detail: 'Clases y acompañamiento educativo' },
  mascotas: { id: 3, name: 'Cuidadores de mascotas', detail: 'Cuidado y bienestar de animales de compañía' },
  hogar: { id: 4, name: 'Hogar', detail: 'Mantenimiento y mejora de espacios' },
};

const catalogoOficios = [
  { id: 1, name: 'Plomería', description: 'Instalaciones y reparaciones', active: true, category: categorias.tecnicos },
  { id: 2, name: 'Electricidad', description: 'Instalaciones y mantenimiento eléctrico', active: true, category: categorias.tecnicos },
  { id: 3, name: 'Carpintería', description: 'Muebles, puertas y reparaciones en madera', active: true, category: categorias.hogar },
  { id: 4, name: 'Pintura', description: 'Pintura interior y exterior', active: true, category: categorias.hogar },
  { id: 5, name: 'Clases de matemáticas', description: 'Clases particulares y refuerzos', active: true, category: categorias.profesores },
  { id: 6, name: 'Cuidado de mascotas', description: 'Visitas y cuidado en casa', active: true, category: categorias.mascotas },
  { id: 7, name: 'Reparación de electrodomésticos', description: 'Diagnóstico y reparación', active: false, category: categorias.tecnicos },
];

// El backend solo guarda los id de las zonas; los nombres dependen de otro dominio.
const zonas = [
  { id: 1, name: 'Chapinero' },
  { id: 2, name: 'Teusaquillo' },
  { id: 3, name: 'La Soledad' },
  { id: 4, name: 'Galerías' },
  { id: 5, name: 'La Candelaria' },
  { id: 6, name: 'Modelia' },
  { id: 7, name: 'Cedritos' },
  { id: 8, name: 'Quinta Paredes' },
  { id: 9, name: 'San Luis' },
  { id: 10, name: 'Normandía' },
];

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

export function obtenerCuenta() {
  return cuenta;
}

export function listarOficiosActivos() {
  return catalogoOficios.filter((oficio) => oficio.active);
}

export function listarZonas() {
  return zonas;
}

export function listarFotosTrabajo() {
  return fotosTrabajo;
}

export function obtenerHorarioSemanal() {
  return horarioSemanal;
}

export function listarOficios() {
  return listarOficiosActivos().map((oficio) => oficio.name);
}
