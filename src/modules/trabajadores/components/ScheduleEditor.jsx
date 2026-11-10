import ui from '../../core/design-system/ui.module.css';
// Maqueta: grilla fija lunes-domingo. Pendiente pasar a franjas (tarea de Mateo).
import { HORARIO_EJEMPLO } from '../services/mockWorkerApi';

function ScheduleEditor({ readOnly = false }) {
  const horario = HORARIO_EJEMPLO;

  return (
    <div className={`${ui.schedule} ${readOnly ? ui.scheduleRead : ''}`}>
      {horario.map(([day, time], index) => (
        <div className={ui.scheduleRow} key={day}>
          {!readOnly && (
            <input aria-label={`Disponible el ${day}`} defaultChecked={index < 6} type="checkbox" />
          )}
          <strong>{day}</strong>
          <span className={index === 6 ? ui.muted : ''}>{time}</span>
          {!readOnly && index < 6 && <button type="button">Editar</button>}
        </div>
      ))}
    </div>
  );
}

export default ScheduleEditor;
