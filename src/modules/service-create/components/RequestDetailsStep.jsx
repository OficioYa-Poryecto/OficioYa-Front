import { useState } from 'react';
import { DETAILS_FORM_ID } from '../config';
import { todayISO, validateDetails } from '../requestForm';
import { CalendarIcon, ClockIcon, MapPinIcon } from './icons';
import PhotoPicker from './PhotoPicker';
import styles from './RequestDetailsStep.module.css';

const NEIGHBORHOODS = [
  'Laureles',
  'El Poblado',
  'Envigado',
  'Sabaneta',
  'Bello',
  'Itagüí',
  'Robledo',
  'Belén',
  'Manrique',
  'Aranjuez',
];

function fieldProps(id, error, { required = false, hint = false } = {}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');
  return {
    id,
    'aria-required': required || undefined,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy || undefined,
  };
}

function Field({ id, label, required, hint, error, icon, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className={icon ? styles.withIcon : undefined}>
        {icon}
        {children}
      </div>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

function RequestDetailsStep({ values, onChange, onSubmit }) {
  const [submitted, setSubmitted] = useState(false);
  const errors = validateDetails(values);
  const visible = submitted ? errors : {};

  const bind = (name) => ({
    value: values[name],
    onChange: (event) => onChange({ [name]: event.target.value }),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const [firstInvalid] = Object.keys(errors);
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit();
  };

  return (
    <form id={DETAILS_FORM_ID} className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.layout}>
        <div className={styles.column}>
          <Field
            id="field-description"
            label="¿Qué necesitas resolver?"
            required
            error={visible.description}
          >
            <textarea
              rows={4}
              placeholder="Ej: Necesito reparar una fuga debajo del lavaplatos."
              {...fieldProps('field-description', visible.description, { required: true })}
              {...bind('description')}
            />
          </Field>

          <PhotoPicker photos={values.photos} onChange={(photos) => onChange({ photos })} />
        </div>

        <div className={styles.column}>
          <div className={styles.row}>
            <Field
              id="field-neighborhood"
              label="Barrio"
              required
              hint="Lista provisional; la definitiva viene del dominio Worker."
              error={visible.neighborhood}
              icon={<MapPinIcon size={18} />}
            >
              <select
                {...fieldProps('field-neighborhood', visible.neighborhood, {
                  required: true,
                  hint: true,
                })}
                {...bind('neighborhood')}
              >
                <option value="">Selecciona</option>
                {NEIGHBORHOODS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id="field-exactAddress"
              label="Dirección exacta"
              required
              error={visible.exactAddress}
            >
              <input
                type="text"
                placeholder="Ej: Cra. 74 # 39-25"
                {...fieldProps('field-exactAddress', visible.exactAddress, { required: true })}
                {...bind('exactAddress')}
              />
            </Field>
          </div>

          <div className={`${styles.row} ${styles.rowEven}`}>
            <Field
              id="field-date"
              label="Fecha"
              required
              error={visible.date}
              icon={<CalendarIcon size={18} />}
            >
              <input
                type="date"
                min={todayISO()}
                {...fieldProps('field-date', visible.date, { required: true })}
                {...bind('date')}
              />
            </Field>
            <Field
              id="field-time"
              label="Hora"
              required
              error={visible.time}
              icon={<ClockIcon size={18} />}
            >
              <input
                type="time"
                {...fieldProps('field-time', visible.time, { required: true })}
                {...bind('time')}
              />
            </Field>
          </div>
        </div>
      </div>

      <p className={styles.legend}>
        <span className={styles.required} aria-hidden="true">
          *
        </span>{' '}
        Campo obligatorio
      </p>
    </form>
  );
}

export default RequestDetailsStep;