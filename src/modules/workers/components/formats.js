export const UNITS = [
  { value: 'PER_HOUR', label: 'por hora' },
  { value: 'PER_JOB', label: 'por trabajo' },
  { value: 'PER_DAY', label: 'por día' },
];

export const DAYS = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

export function unitName(input) {
  return UNITS.find((unidad) => unidad.value === input)?.label ?? '';
}

export function dayName(input) {
  return DAYS.find((dia) => dia.value === input)?.label ?? '';
}

export function formatMoney(input) {
  return `$${new Intl.NumberFormat('es-CO').format(input)}`;
}

export function formatDate(input) {
  if (!input) return '';
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${input}T00:00:00Z`));
}

// Misma regla que WorkerTradeRequest en el back: @Positive y @Digits(integer = 8, fraction = 2).
const VALID_RATE = /^\d{1,8}(\.\d{1,2})?$/;

export function validateRate(input) {
  const rawText = String(input ?? '').trim();
  if (!rawText) return 'Ingresa la tarifa';
  if (!VALID_RATE.test(rawText)) return 'Usa solo números (máximo 8 cifras y 2 decimales)';
  if (!(Number(rawText) > 0)) return 'La tarifa debe ser mayor que 0';
  return '';
}

// "andrea.salazar@gmail.com" -> "an•••••••••••@gmail.com"
export function maskEmail(correo) {
  if (!correo) return '';
  const [usuario, dominio] = correo.split('@');
  if (!dominio) return '•••';
  const visible = usuario.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(usuario.length - visible.length, 3))}@${dominio}`;
}

// "3001234567" -> "••• ••• 4567"
export function maskPhone(telefono) {
  if (!telefono) return '';
  const digits = String(telefono).replace(/\D/g, '');
  return `••• ••• ${digits.slice(-4)}`;
}

export function getInitials(name) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  const text = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return text.toUpperCase();
}
