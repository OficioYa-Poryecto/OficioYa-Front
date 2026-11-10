import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import ConfirmModal from '../../core/design-system/ConfirmModal';
import EmptyState from '../../core/design-system/EmptyState';
import Field from '../../core/design-system/Field';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { createSlot, deleteSlot, updateSlot } from '../services/trabajadoresService';
import { DIAS, formatoFecha, nombreDia } from './formatos';
import styles from './trabajador.module.css';

// Franjas de disponibilidad (RF-07 y RF-10): fijas (una fecha) o repetitivas (un día de la
// semana durante un periodo), más el estado "disponible ahora".
// readOnly = solo lectura (perfil público); si no, permite crear, editar y eliminar.

const DIAS_SEMANA = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const ORDEN_DIAS = DIAS.map((dia) => dia.value);

function hoy() {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  return fecha.toISOString().slice(0, 10);
}

function diaDeFecha(fecha) {
  return DIAS_SEMANA[new Date(`${fecha}T00:00:00Z`).getUTCDay()];
}

// Igual que AvailabilitySlotService en el back: una franja fija usa solo startDate.
function seCruzan(a, b) {
  if (a.startTime >= b.endTime || b.startTime >= a.endTime) return false;
  if (a.recurrenceType === 'FIXED' && b.recurrenceType === 'FIXED') return a.startDate === b.startDate;
  if (a.recurrenceType === 'RECURRING' && b.recurrenceType === 'RECURRING') {
    return a.dayOfWeek === b.dayOfWeek && a.startDate <= b.endDate && b.startDate <= a.endDate;
  }
  const fija = a.recurrenceType === 'FIXED' ? a : b;
  const repetitiva = a.recurrenceType === 'RECURRING' ? a : b;
  return diaDeFecha(fija.startDate) === repetitiva.dayOfWeek
    && fija.startDate >= repetitiva.startDate
    && fija.startDate <= repetitiva.endDate;
}

// Devuelve { campo: mensaje } con los obligatorios que faltan o son incoherentes.
function validar({ recurrenceType, dayOfWeek, startDate, endDate, startTime, endTime }) {
  const errores = {};
  if (!startDate) errores.startDate = 'Selecciona una fecha';
  if (!startTime) errores.startTime = 'Selecciona la hora de inicio';
  if (!endTime) errores.endTime = 'Selecciona la hora de fin';
  if (startTime && endTime && startTime >= endTime) errores.endTime = 'Debe ser posterior a la hora de inicio';
  if (recurrenceType === 'RECURRING') {
    if (!dayOfWeek) errores.dayOfWeek = 'Selecciona el día';
    // El back exige fecha de fin para las repetitivas.
    if (!endDate) errores.endDate = 'Selecciona la fecha de fin';
    else if (startDate && endDate < startDate) errores.endDate = 'No puede ser anterior a la de inicio';
  }
  return errores;
}

function ordenar(slots) {
  const repetitivas = slots
    .filter((slot) => slot.recurrenceType === 'RECURRING')
    .sort((a, b) => ORDEN_DIAS.indexOf(a.dayOfWeek) - ORDEN_DIAS.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime));
  const fijas = slots
    .filter((slot) => slot.recurrenceType === 'FIXED')
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime));
  return { repetitivas, fijas };
}

function SlotItem({ slot, onEdit, onDelete }) {
  const fija = slot.recurrenceType === 'FIXED';
  return (
    <div className={styles.slot}>
      <span className={`${styles.slotType} ${fija ? styles.slotFixed : ''}`}>{fija ? 'Fija' : 'Repetitiva'}</span>
      <div>
        <strong>{fija ? formatoFecha(slot.startDate) : `Todos los ${nombreDia(slot.dayOfWeek).toLowerCase()}`}</strong>
        <small>
          {slot.startTime.slice(0, 5)}–{slot.endTime.slice(0, 5)}
          {!fija && ` · del ${formatoFecha(slot.startDate)} al ${formatoFecha(slot.endDate)}`}
        </small>
      </div>
      {(onEdit || onDelete) && (
        <div className={styles.slotActions}>
          <Boton icon="edit" onClick={onEdit} variant="ghost">Editar</Boton>
          <Boton icon="trash" onClick={onDelete} variant="ghost">Eliminar</Boton>
        </div>
      )}
    </div>
  );
}

function SlotList({ slots, onEdit, onDelete, emptyText }) {
  if (slots.length === 0) return <EmptyState title="Sin franjas" text={emptyText} />;
  const { repetitivas, fijas } = ordenar(slots);
  const grupo = (titulo, lista) => lista.length > 0 && (
    <div className={styles.slotGroup}>
      <h3>{titulo}</h3>
      {lista.map((slot) => (
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
      {grupo('Cada semana', repetitivas)}
      {grupo('Fechas puntuales', fijas)}
    </>
  );
}

function DisponibleAhora({ availableNow }) {
  return (
    <div className={`${styles.nowBadge} ${availableNow ? styles.nowOn : ''}`}>
      <span /> {availableNow ? 'Disponible ahora' : 'No disponible en este momento'}
    </div>
  );
}

const FORM_VACIO = () => ({
  recurrenceType: 'RECURRING',
  dayOfWeek: 'MONDAY',
  startDate: hoy(),
  endDate: '',
  startTime: '08:00',
  endTime: '12:00',
});

function ScheduleEditor({ slots = [], availableNow = false, readOnly = false, workerId, onChange }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [editing, setEditing] = useState(null);
  const [errores, setErrores] = useState({});
  const [message, setMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  if (readOnly) {
    return (
      <div className={styles.scheduleRead}>
        <DisponibleAhora availableNow={availableNow} />
        <SlotList emptyText="Este trabajador aún no ha publicado su disponibilidad." slots={slots} />
      </div>
    );
  }

  const cambiar = (campo) => (valor) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: '' }));
    setMessage(null);
  };

  const cancelar = () => {
    setEditing(null);
    setForm(FORM_VACIO());
    setErrores({});
  };

  const save = async (event) => {
    event.preventDefault();
    setMessage(null);
    // Mismo cuerpo que AvailabilitySlotRequest en el back.
    const franja = form.recurrenceType === 'FIXED'
      ? { ...form, dayOfWeek: null, endDate: null }
      : form;
    const encontrados = Object.fromEntries(Object.entries(validar(franja)).filter(([, texto]) => texto));
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    if (slots.some((slot) => slot.id !== editing && seCruzan(slot, franja))) {
      setMessage({ type: 'error', text: 'Esta franja se cruza con otra que ya tienes.' });
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateSlot(workerId, editing, franja);
      else await createSlot(workerId, franja);
      await onChange();
      cancelar();
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
    setErrores({});
    setMessage(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteSlot(workerId, deleting);
      await onChange();
      if (editing === deleting) cancelar();
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setDeleting(null);
    }
  };

  const repetitiva = form.recurrenceType === 'RECURRING';

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
            aria-pressed={repetitiva}
            className={repetitiva ? styles.segmentActive : ''}
            onClick={() => cambiar('recurrenceType')('RECURRING')}
            type="button"
          >
            Repetitiva
          </button>
          <button
            aria-pressed={!repetitiva}
            className={!repetitiva ? styles.segmentActive : ''}
            onClick={() => cambiar('recurrenceType')('FIXED')}
            type="button"
          >
            Fija
          </button>
        </div>
        <p className={styles.mutedText}>
          {repetitiva
            ? 'Se repite el mismo día cada semana durante el periodo que elijas.'
            : 'Solo aplica a una fecha. Úsala para un día distinto a tu horario habitual.'}
        </p>
        {repetitiva ? (
          <>
            <SelectField error={errores.dayOfWeek} label="Día de la semana" onChange={cambiar('dayOfWeek')} options={DIAS} required value={form.dayOfWeek} />
            <div className={styles.twoCols}>
              <Field error={errores.startDate} label="Desde" onChange={cambiar('startDate')} required type="date" value={form.startDate} />
              <Field error={errores.endDate} label="Hasta" min={form.startDate} onChange={cambiar('endDate')} required type="date" value={form.endDate} />
            </div>
          </>
        ) : (
          <Field error={errores.startDate} label="Fecha" onChange={cambiar('startDate')} required type="date" value={form.startDate} />
        )}
        <div className={styles.twoCols}>
          <Field error={errores.startTime} label="Hora de inicio" onChange={cambiar('startTime')} required type="time" value={form.startTime} />
          <Field error={errores.endTime} label="Hora de fin" onChange={cambiar('endTime')} required type="time" value={form.endTime} />
        </div>
        {message && <StatusMessage variant={message.type}>{message.text}</StatusMessage>}
        <div className={styles.slotActions}>
          {editing && <Boton onClick={cancelar} variant="ghost">Cancelar</Boton>}
          <Boton disabled={saving} type="submit">{saving ? 'Guardando…' : 'Guardar franja'}</Boton>
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
