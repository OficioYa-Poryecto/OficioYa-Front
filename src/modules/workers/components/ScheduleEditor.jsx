import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ConfirmModal from './ui/ConfirmModal';
import EmptyState from './ui/EmptyState';
import Field from './ui/Field';
import Icon from './ui/Icon';
import SelectField from './ui/SelectField';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { createSlot, deleteSlot, updateSlot } from '../services/workersService';
import { DAYS, formatDate, dayName } from './formats';
import styles from './worker.module.css';

// Franjas de disponibilidad (RF-07 y RF-10): fijas (una fecha) o repetitivas (un día de la
// semana durante un periodo), más el estado "disponible ahora".
// readOnly = solo lectura (perfil público); si no, permite crear, editar y eliminar.

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const DAY_ORDER = DAYS.map((dia) => dia.value);

function today() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function weekdayOf(date) {
  return WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}

// Igual que AvailabilitySlotService en el back: una franja fija usa solo startDate.
function overlaps(a, b) {
  if (a.startTime >= b.endTime || b.startTime >= a.endTime) return false;
  if (a.recurrenceType === 'FIXED' && b.recurrenceType === 'FIXED') return a.startDate === b.startDate;
  if (a.recurrenceType === 'RECURRING' && b.recurrenceType === 'RECURRING') {
    return a.dayOfWeek === b.dayOfWeek && a.startDate <= b.endDate && b.startDate <= a.endDate;
  }
  const fixed = a.recurrenceType === 'FIXED' ? a : b;
  const recurring = a.recurrenceType === 'RECURRING' ? a : b;
  return weekdayOf(fixed.startDate) === recurring.dayOfWeek
    && fixed.startDate >= recurring.startDate
    && fixed.startDate <= recurring.endDate;
}

// Devuelve { campo: mensaje } con los obligatorios que faltan o son incoherentes.
function validar({ recurrenceType, dayOfWeek, startDate, endDate, startTime, endTime }) {
  const errors = {};
  if (!startDate) errors.startDate = 'Selecciona una fecha';
  if (!startTime) errors.startTime = 'Selecciona la hora de inicio';
  if (!endTime) errors.endTime = 'Selecciona la hora de fin';
  if (startTime && endTime && startTime >= endTime) errors.endTime = 'Debe ser posterior a la hora de inicio';
  if (recurrenceType === 'RECURRING') {
    if (!dayOfWeek) errors.dayOfWeek = 'Selecciona el día';
    // El back exige fecha de fin para las repetitivas.
    if (!endDate) errors.endDate = 'Selecciona la fecha de fin';
    else if (startDate && endDate < startDate) errors.endDate = 'No puede ser anterior a la de inicio';
  }
  return errors;
}

function sortSlots(slots) {
  const recurringSlots = slots
    .filter((slot) => slot.recurrenceType === 'RECURRING')
    .sort((a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime));
  const fixedSlots = slots
    .filter((slot) => slot.recurrenceType === 'FIXED')
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime));
  return { recurringSlots, fixedSlots };
}

function SlotItem({ slot, onEdit, onDelete }) {
  const fixed = slot.recurrenceType === 'FIXED';
  return (
    <div className={styles.slot}>
      <span className={`${styles.slotType} ${fixed ? styles.slotFixed : ''}`}>{fixed ? 'Fija' : 'Repetitiva'}</span>
      <div>
        <strong>{fixed ? formatDate(slot.startDate) : `Todos los ${dayName(slot.dayOfWeek).toLowerCase()}`}</strong>
        <small>
          {slot.startTime.slice(0, 5)}–{slot.endTime.slice(0, 5)}
          {!fixed && ` · del ${formatDate(slot.startDate)} al ${formatDate(slot.endDate)}`}
        </small>
      </div>
      {(onEdit || onDelete) && (
        <div className={styles.slotActions}>
          <Button type="button" onClick={onEdit} variant="ghost"><Icon name="edit" size={18} /> Editar</Button>
          <Button type="button" onClick={onDelete} variant="ghost"><Icon name="trash" size={18} /> Eliminar</Button>
        </div>
      )}
    </div>
  );
}

function SlotList({ slots, onEdit, onDelete, emptyText }) {
  if (slots.length === 0) return <EmptyState title="Sin franjas" text={emptyText} />;
  const { recurringSlots, fixedSlots } = sortSlots(slots);
  const daySlots = (heading, list) => list.length > 0 && (
    <div className={styles.slotGroup}>
      <h3>{heading}</h3>
      {list.map((slot) => (
        <SlotItem
          key={slot.id}
          onDelete={onDelete && (() => onDelete(slot.id))}
          onEdit={onEdit && (() => onEdit(slot))}
          slot={slot}
        />
      ))}
    </div>
  );
  return (
    <>
      {daySlots('Cada semana', recurringSlots)}
      {daySlots('Fechas puntuales', fixedSlots)}
    </>
  );
}

function AvailableNow({ availableNow }) {
  return (
    <div className={`${styles.nowBadge} ${availableNow ? styles.nowOn : ''}`}>
      <span /> {availableNow ? 'Disponible ahora' : 'No disponible en este momento'}
    </div>
  );
}

const EMPTY_FORM = () => ({
  recurrenceType: 'RECURRING',
  dayOfWeek: 'MONDAY',
  startDate: today(),
  endDate: '',
  startTime: '08:00',
  endTime: '12:00',
});

function ScheduleEditor({ slots = [], availableNow = false, readOnly = false, workerId, onChange }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  if (readOnly) {
    return (
      <div className={styles.scheduleRead}>
        <AvailableNow availableNow={availableNow} />
        <SlotList emptyText="Este trabajador aún no ha publicado su disponibilidad." slots={slots} />
      </div>
    );
  }

  const setField = (field) => (fieldValue) => {
    setForm((current) => ({ ...current, [field]: fieldValue }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM());
    setErrors({});
  };

  const save = async (event) => {
    event.preventDefault();
    setMessage(null);
    // Mismo cuerpo que AvailabilitySlotRequest en el back.
    const slotItem = form.recurrenceType === 'FIXED'
      ? { ...form, dayOfWeek: null, endDate: null }
      : form;
    const foundErrors = Object.fromEntries(Object.entries(validar(slotItem)).filter(([, labelText]) => labelText));
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) return;
    if (slots.some((slot) => slot.id !== editing && overlaps(slot, slotItem))) {
      setMessage({ type: 'error', text: 'Esta franja se cruza con otra que ya tienes.' });
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateSlot(workerId, editing, slotItem);
      else await createSlot(workerId, slotItem);
      await onChange();
      cancelEdit();
      setMessage({ type: 'success', text: 'Franja guardada correctamente.' });
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (slot) => {
    setEditing(slot.id);
    setForm({
      recurrenceType: slot.recurrenceType,
      dayOfWeek: slot.dayOfWeek ?? 'MONDAY',
      startDate: slot.startDate,
      endDate: slot.endDate ?? '',
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
    });
    setErrors({});
    setMessage(null);
  };

  const confirmDelete = async () => {
    setMessage(null);
    try {
      await deleteSlot(workerId, deleting);
      await onChange();
      if (editing === deleting) cancelEdit();
      setMessage({ type: 'success', text: 'Franja eliminada.' });
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setDeleting(null);
    }
  };

  const recurring = form.recurrenceType === 'RECURRING';

  return (
    <div className={styles.availabilityLayout}>
      <section className={ui.infoCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Tus franjas</h2>
            <p>Las repetitivas se mantienen cada semana; las fijas sirven para un día puntual.</p>
          </div>
        </div>
        <SlotList
          emptyText="Crea tu primera franja de disponibilidad."
          onDelete={setDeleting}
          onEdit={startEdit}
          slots={slots}
        />
      </section>
      <form className={`${ui.infoCard} ${styles.slotForm}`} noValidate onSubmit={save}>
        <h2>{editing ? 'Editar franja' : 'Nueva franja'}</h2>
        <div aria-label="Tipo de franja" className={styles.segmented} role="group">
          <button
            aria-pressed={recurring}
            className={recurring ? styles.segmentActive : ''}
            onClick={() => setField('recurrenceType')('RECURRING')}
            type="button"
          >
            Repetitiva
          </button>
          <button
            aria-pressed={!recurring}
            className={!recurring ? styles.segmentActive : ''}
            onClick={() => setField('recurrenceType')('FIXED')}
            type="button"
          >
            Fija
          </button>
        </div>
        <p className={styles.mutedText}>
          {recurring
            ? 'Se repite el mismo día cada semana durante el periodo que elijas.'
            : 'Solo aplica a una fecha. Úsala para un día distinto a tu horario habitual.'}
        </p>
        {recurring ? (
          <>
            <SelectField error={errors.dayOfWeek} label="Día de la semana" onChange={setField('dayOfWeek')} options={DAYS} required value={form.dayOfWeek} />
            <div className={styles.twoCols}>
              <Field error={errors.startDate} label="Desde" onChange={setField('startDate')} required type="date" value={form.startDate} />
              <Field error={errors.endDate} label="Hasta" min={form.startDate} onChange={setField('endDate')} required type="date" value={form.endDate} />
            </div>
          </>
        ) : (
          <Field error={errors.startDate} label="Fecha" onChange={setField('startDate')} required type="date" value={form.startDate} />
        )}
        <div className={styles.twoCols}>
          <Field error={errors.startTime} label="Hora de inicio" onChange={setField('startTime')} required type="time" value={form.startTime} />
          <Field error={errors.endTime} label="Hora de fin" onChange={setField('endTime')} required type="time" value={form.endTime} />
        </div>
        {message && <StatusMessage variant={message.type}>{message.text}</StatusMessage>}
        <div className={styles.slotActions}>
          {editing && <Button type="button" onClick={cancelEdit} variant="ghost">Cancelar</Button>}
          <Button disabled={saving} type="submit">{saving ? 'Guardando…' : 'Guardar franja'}</Button>
        </div>
      </form>
      {deleting && (
        <ConfirmModal
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
          text="Esta acción quitará la franja de tu disponibilidad."
          title="¿Eliminar esta franja?"
        />
      )}
    </div>
  );
}

export default ScheduleEditor;
