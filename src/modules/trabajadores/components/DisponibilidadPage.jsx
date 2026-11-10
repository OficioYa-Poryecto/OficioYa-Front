import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import ConfirmModal from '../../core/design-system/ConfirmModal';
import EmptyState from '../../core/design-system/EmptyState';
import Field from '../../core/design-system/Field';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { createSlot, deleteSlot, updateSlot } from '../services/trabajadoresService';
import EstadoPerfil from './EstadoPerfil';
import { DIAS, formatoFecha, nombreDia } from './formatos';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

const DIAS_SEMANA = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function diaDeFecha(fecha) {
  return DIAS_SEMANA[new Date(`${fecha}T00:00:00Z`).getUTCDay()];
}

// Igual que AvailabilitySlot en el backend: una franja fija usa solo startDate.
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

function validar({ recurrenceType, startDate, endDate, startTime, endTime }) {
  if (!startDate) return 'Selecciona una fecha';
  if (!startTime || !endTime) return 'Selecciona la hora de inicio y de fin';
  if (startTime >= endTime) return 'La hora de inicio debe ser anterior a la hora de fin';
  if (recurrenceType === 'RECURRING') {
    if (!endDate) return 'Selecciona la fecha de fin';
    if (endDate < startDate) return 'La fecha de fin no puede ser anterior a la de inicio';
  }
  return '';
}

function DisponibilidadPage() {
  const { data: perfil, loading, error: loadError, refresh } = useMyWorker();
  const [editing, setEditing] = useState(null);
  const [type, setType] = useState('FIXED');
  const [fixedDate, setFixedDate] = useState('2026-11-10');
  const [day, setDay] = useState('TUESDAY');
  const [startDate, setStartDate] = useState('2026-11-09');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(null);
  if (!perfil) return <EstadoPerfil error={loadError} loading={loading} />;

  const locked = perfil.status === 'PAUSED';

  const save = async (event) => {
    event.preventDefault();
    setSuccess(false);
    // Mismo cuerpo que AvailabilitySlotRequest en el back.
    const franja = type === 'FIXED'
      ? { recurrenceType: type, dayOfWeek: null, startDate: fixedDate, endDate: null, startTime, endTime }
      : { recurrenceType: type, dayOfWeek: day, startDate, endDate, startTime, endTime };
    const invalido = validar(franja);
    if (invalido) {
      setError(invalido);
      return;
    }
    if (perfil.slots.some((slot) => slot.id !== editing && seCruzan(slot, franja))) {
      setError('Esta franja se cruza con otra existente');
      return;
    }
    try {
      if (editing) {
        await updateSlot(perfil.id, editing, franja);
      } else {
        await createSlot(perfil.id, franja);
      }
      await refresh();
      setError('');
      setSuccess(true);
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (slot) => {
    setEditing(slot.id);
    setType(slot.recurrenceType);
    if (slot.recurrenceType === 'FIXED') {
      setFixedDate(slot.startDate);
    } else {
      setDay(slot.dayOfWeek);
      setStartDate(slot.startDate);
      setEndDate(slot.endDate);
    }
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setError('');
    setSuccess(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteSlot(perfil.id, deleting);
      await refresh();
      if (editing === deleting) setEditing(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeading
        eyebrow="Tu agenda"
        title="Disponibilidad"
        description="Indica cuándo pueden encontrarte disponible."
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Reactiva tu perfil desde el panel para editar tu disponibilidad.
        </StatusMessage>
      )}
      <div className={`${styles.availabilityLayout} ${locked ? styles.locked : ''}`} inert={locked}>
        <section className={ui.infoCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Tus franjas</h2>
              <p>Horarios fijos y repetitivos de tu semana.</p>
            </div>
          </div>
          {perfil.slots.length === 0 ? (
            <EmptyState title="Sin franjas" text="Crea tu primera franja de disponibilidad." />
          ) : perfil.slots.map((slot) => {
            const fija = slot.recurrenceType === 'FIXED';
            return (
              <div className={styles.slot} key={slot.id}>
                <span className={`${styles.slotType} ${fija ? styles.slotFixed : ''}`}>{fija ? 'Fija' : 'Repetitiva'}</span>
                <div>
                  <strong>{fija ? formatoFecha(slot.startDate) : nombreDia(slot.dayOfWeek)}</strong>
                  <small>
                    {slot.startTime}–{slot.endTime}
                    {!fija && ` · ${formatoFecha(slot.startDate)} a ${formatoFecha(slot.endDate)}`}
                  </small>
                </div>
                <div className={styles.slotActions}>
                  <Boton icon="edit" onClick={() => startEdit(slot)} variant="ghost">Editar</Boton>
                  <Boton icon="trash" onClick={() => setDeleting(slot.id)} variant="ghost">Eliminar</Boton>
                </div>
              </div>
            );
          })}
        </section>
        <form className={`${ui.infoCard} ${styles.slotForm}`} onSubmit={save}>
          <h2>{editing ? 'Editar franja' : 'Crear una franja'}</h2>
          <div className={styles.segmented}>
            <button className={type === 'FIXED' ? styles.segmentActive : ''} onClick={() => setType('FIXED')} type="button">Fija</button>
            <button className={type === 'RECURRING' ? styles.segmentActive : ''} onClick={() => setType('RECURRING')} type="button">Repetitiva</button>
          </div>
          {type === 'FIXED' ? (
            <Field label="Fecha" onChange={setFixedDate} type="date" value={fixedDate} />
          ) : (
            <>
              <SelectField label="Día de la semana" onChange={setDay} options={DIAS} value={day} />
              <div className={styles.twoCols}>
                <Field label="Fecha de inicio" onChange={setStartDate} type="date" value={startDate} />
                <Field label="Fecha de fin" onChange={setEndDate} type="date" value={endDate} />
              </div>
            </>
          )}
          <div className={styles.twoCols}>
            <Field label="Hora de inicio" onChange={setStartTime} type="time" value={startTime} />
            <Field label="Hora de fin" onChange={setEndTime} type="time" value={endTime} />
          </div>
          {error && <StatusMessage variant="error">{error}</StatusMessage>}
          {success && <StatusMessage>Franja guardada correctamente.</StatusMessage>}
          <div className={styles.slotActions}>
            {editing && <Boton onClick={() => setEditing(null)} variant="ghost">Cancelar</Boton>}
            <Boton type="submit">Guardar franja</Boton>
          </div>
        </form>
      </div>
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

export default DisponibilidadPage;
