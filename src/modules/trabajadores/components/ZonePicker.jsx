import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import styles from './trabajador.module.css';

// Selector de barrios en forma de chips. Las zonas las define la administración (RF-05);
// el trabajador solo elige dónde trabaja (RF-06).
function ZonePicker({ zonas, selected, onChange, error }) {
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((zoneId) => zoneId !== id) : [...selected, id]);

  return (
    <fieldset className={`${ui.field} ${styles.fieldset}`}>
      <legend className={ui.fieldLabel}>
        Zonas de cobertura <span aria-hidden="true" className={ui.requiredMark}>*</span>
      </legend>
      <div className={styles.zonePicker}>
        {zonas.map((zona) => {
          const activo = selected.includes(zona.id);
          return (
            <button
              aria-pressed={activo}
              className={activo ? styles.zoneSelected : ''}
              key={zona.id}
              onClick={() => toggle(zona.id)}
              type="button"
            >
              {activo && <Icon name="check" size={13} />}
              {zona.name}
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
