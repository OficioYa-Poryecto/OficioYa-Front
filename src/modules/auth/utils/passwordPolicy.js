export const PASSWORD_RULES = [
  {
    id: 'length',
    label: '12 caracteres',
    validate: (p) => (p || '').length >= 12,
  },
  {
    id: 'uppercase',
    label: 'Una mayúscula',
    validate: (p) => /[A-Z]/.test(p || ''),
  },
  {
    id: 'lowercase',
    label: 'Una minúscula',
    validate: (p) => /[a-z]/.test(p || ''),
  },
  {
    id: 'number',
    label: 'Un número',
    validate: (p) => /[0-9]/.test(p || ''),
  },
  {
    id: 'special',
    label: 'Un carácter especial',
    validate: (p) => /[^A-Za-z0-9\s]/.test(p || ''),
  },
];

export function validatePassword(password) {
  const p = password || '';
  return PASSWORD_RULES.every((rule) => rule.validate(p));
}

