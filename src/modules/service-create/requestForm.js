export const EMPTY_FORM = {
  description: '',
  photos: [],
  neighborhood: '',
  exactAddress: '',
  date: '',
  time: '',
  workers: [],
};

const pad = (value) => String(value).padStart(2, '0');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseSchedule(date, time) {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(time);
  if (!d || !t) {
    return null;
  }
  const [year, month, day] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const [hours, minutes] = [Number(t[1]), Number(t[2])];
  const result = new Date(year, month - 1, day, hours, minutes);
  const isReal =
    result.getFullYear() === year &&
    result.getMonth() === month - 1 &&
    result.getDate() === day &&
    result.getHours() === hours &&
    result.getMinutes() === minutes;
  return isReal ? result : null;
}

export function validateDetails(values, now = new Date()) {
  const errors = {};

  if (!values.description.trim()) {
    errors.description = 'Describe el servicio que necesitas.';
  }
  if (!values.neighborhood.trim()) {
    errors.neighborhood = 'Indica el barrio.';
  }
  if (!values.exactAddress.trim()) {
    errors.exactAddress = 'Indica la dirección exacta.';
  }

  if (!values.date) {
    errors.date = 'Selecciona la fecha del servicio.';
  } else if (!parseSchedule(values.date, '00:00')) {
    errors.date = 'La fecha no es válida.';
  } else if (values.date < todayISO(now)) {
    errors.date = 'La fecha no puede ser anterior a hoy.';
  }

  if (!values.time) {
    errors.time = 'Selecciona la hora del servicio.';
  } else if (!parseSchedule('2000-01-01', values.time)) {
    errors.time = 'La hora no es válida.';
  }

  if (!errors.date && !errors.time) {
    const when = parseSchedule(values.date, values.time);
    if (when <= now) {
      errors.time = 'La fecha y la hora deben ser posteriores al momento actual.';
    }
  }

  return errors;
}

export function deriveTitle(description, maxLength = 60) {
  const text = description.trim().replace(/\s+/g, ' ');
  const [firstSentence] = text.split(/[.!?]/);
  const base = firstSentence.trim() || text;
  if (base.length <= maxLength) {
    return capitalize(base);
  }
  const cut = base.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  const shortened = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut;
  return `${capitalize(shortened.trimEnd())}…`;
}

export function formatSchedule(date, time, { short = false } = {}) {
  const when = parseSchedule(date, time);
  if (!when) {
    return '';
  }
  const dayOptions = short
    ? { day: 'numeric', month: 'short' }
    : { weekday: 'long', day: 'numeric', month: 'long' };
  const day = capitalize(when.toLocaleDateString('es-CO', dayOptions));
  const hour = when.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${day} · ${hour}`;
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}