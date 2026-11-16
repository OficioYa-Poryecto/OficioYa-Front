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
  return `$${new Intl.NumberFormat('es-CO').format(valor)}`;
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

// Misma regla que WorkerTradeRequest en el back: @Positive y @Digits(integer = 8, fraction = 2).
const TARIFA_VALIDA = /^\d{1,8}(\.\d{1,2})?$/;

export function validarTarifa(valor) {
  const texto = String(valor ?? '').trim();
  if (!texto) return 'Ingresa la tarifa';
  if (!TARIFA_VALIDA.test(texto)) return 'Usa solo números (máximo 8 cifras y 2 decimales)';
  if (!(Number(texto) > 0)) return 'La tarifa debe ser mayor que 0';
  return '';
}

// "andrea.salazar@gmail.com" -> "an•••••••••••@gmail.com"
export function enmascararCorreo(correo) {
  if (!correo) return '';
  const [usuario, dominio] = correo.split('@');
  if (!dominio) return '•••';
  const visible = usuario.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(usuario.length - visible.length, 3))}@${dominio}`;
}

// "3001234567" -> "••• ••• 4567"
export function enmascararTelefono(telefono) {
  if (!telefono) return '';
  const digitos = String(telefono).replace(/\D/g, '');
  return `••• ••• ${digitos.slice(-4)}`;
}
