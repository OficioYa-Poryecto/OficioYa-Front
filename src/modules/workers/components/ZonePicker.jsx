import Icon from './ui/Icon';
import ui from './ui/ui.module.css';
import styles from './worker.module.css';

// Selector de barrios en forma de chips. Las zonas las define la administración (RF-05);
// el trabajador solo elige dónde trabaja (RF-06).
function ZonePicker({ zones, selected, onChange, error }) {
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((zoneId) => zoneId !== id) : [...selected, id]);

  return (
    <fieldset className={`${ui.field} ${styles.fieldset}`}>
      <legend className={ui.fieldLabel}>
        Zonas de cobertura <span aria-hidden="true" className={ui.requiredMark}>*</span>
      </legend>
      <div className={styles.zonePicker}>
        {zones.map((zone) => {
          const activo = selected.includes(zone.id);
          return (
            <button
              aria-pressed={activo}
              className={activo ? styles.zoneSelected : ''}
              key={zone.id}
              onClick={() => toggle(zone.id)}
              type="button"
            >
              {activo && <Icon name="check" size={13} />}
              {zone.name}
            </button>
          );
        })}
      </div>
      {error
        ? <span className={ui.errorText}>{error}</span>
        : <span className={ui.fieldHint}>Elige al menos un barrio. Puedes cambiarlos después en Cobertura.</span>}
    </fieldset>
  );
}

export default ZonePicker;
