import { useState } from 'react';
import { DETAILS_FORM_ID } from '../config';
import { todayISO, validateDetails } from '../requestForm';
import { CalendarIcon, ClockIcon, MapPinIcon } from './icons';
import PhotoPicker from './PhotoPicker';
import styles from './RequestDetailsStep.module.css';

function fieldProps(id, error) {
  return {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}

function Field({ id, label, error, icon, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={icon ? styles.withIcon : undefined}>
        {icon}
        {children}
      </div>
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
          <Field id="field-description" label="¿Qué necesitas resolver?" error={visible.description}>
            <textarea
              rows={4}
              placeholder="Ej: Necesito reparar una fuga debajo del lavaplatos."
              {...fieldProps('field-description', visible.description)}
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
              error={visible.neighborhood}
              icon={<MapPinIcon size={18} />}
            >
              <input
                type="text"
                placeholder="Ej: Laureles"
                {...fieldProps('field-neighborhood', visible.neighborhood)}
                {...bind('neighborhood')}
              />
            </Field>
            <Field id="field-exactAddress" label="Dirección exacta" error={visible.exactAddress}>
              <input
                type="text"
                placeholder="Ej: Cra. 74 # 39-25"
                {...fieldProps('field-exactAddress', visible.exactAddress)}
                {...bind('exactAddress')}
              />
            </Field>
          </div>

          <div className={`${styles.row} ${styles.rowEven}`}>
            <Field
              id="field-date"
              label="Fecha"
              error={visible.date}
              icon={<CalendarIcon size={18} />}
            >
              <input
                type="date"
                min={todayISO()}
                {...fieldProps('field-date', visible.date)}
                {...bind('date')}
              />
            </Field>
            <Field id="field-time" label="Hora" error={visible.time} icon={<ClockIcon size={18} />}>
              <input type="time" {...fieldProps('field-time', visible.time)} {...bind('time')} />
            </Field>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RequestDetailsStep;