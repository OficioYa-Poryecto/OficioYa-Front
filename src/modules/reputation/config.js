// Datos fijos de la demo que pertenecen a otros dominios (Worker y Service).
// Los ids son UUID, como en Identity, Worker y Service: uid(101) = 00000000-0000-0000-0000-000000000101.
export const uid = (numero) => `00000000-0000-0000-0000-${String(numero).padStart(12, '0')}`;

export const PERFILES = {
  [uid(101)]: { nombre: 'Carlos Martínez', oficio: 'Plomería' },
  [uid(102)]: { nombre: 'Lucía Fernández', oficio: 'Electricidad' },
  [uid(103)]: { nombre: 'Miguel Torres', oficio: 'Carpintería' },
  [uid(104)]: { nombre: 'Andrea Gómez', oficio: 'Plomería' },
  [uid(105)]: { nombre: 'Jorge Rodríguez', oficio: 'Técnico de electrodomésticos' },
  [uid(106)]: { nombre: 'Paula Ramírez', oficio: 'Profesor particular' },
  [uid(107)]: { nombre: 'Sofía Herrera', oficio: 'Cuidado de mascotas' },
  [uid(108)]: { nombre: 'Daniel Rojas', oficio: 'Plomería' },
};

export const SERVICIOS = {
  CONTRATANTE: [
    { solicitudId: uid(900001), titulo: 'Reparación de fuga en el lavamanos', contraparte: 'Carlos Martínez', trabajadorId: uid(101) },
    { solicitudId: uid(900002), titulo: 'Instalación de tomas eléctricas', contraparte: 'Lucía Fernández', trabajadorId: uid(102) },
  ],
  TRABAJADOR: [
    { solicitudId: uid(900001), titulo: 'Reparación de fuga en el lavamanos', contraparte: 'Ana Cárdenas', trabajadorId: uid(101) },
  ],
};

export const MOTIVOS_REPORTE = [
  { valor: 'FALSA', etiqueta: 'Es falsa' },
  { valor: 'INAPROPIADA', etiqueta: 'Es inapropiada' },
  { valor: 'OFENSIVA', etiqueta: 'Es ofensiva' },
  { valor: 'OTRO', etiqueta: 'Otro motivo' },
];
