import { MAX_TELEFONOS } from '../config';
import reg from '../../auth/pages/RegisterPage.module.css';

let siguienteClave = 1000;

// Mismo comportamiento que en el registro; los cambios se guardan con "Guardar cambios"
function PhoneList({ phones, errores, onChange }) {
  function cambiarNumero(index, valor) {
    const limpio = valor.replace(/\D/g, '').slice(0, 10);
    onChange(phones.map((phone, i) => (i === index ? { ...phone, number: limpio } : phone)));
  }

  function marcarPrincipal(index) {
    onChange(phones.map((phone, i) => ({ ...phone, principal: i === index })));
  }

  function agregar() {
    if (phones.length >= MAX_TELEFONOS) return;
    onChange([...phones, { clave: siguienteClave++, number: '', principal: false }]);
  }

  function quitar(index) {
    const quitado = phones[index];
    const restantes = phones.filter((_, i) => i !== index);
    if (quitado.principal && restantes.length > 0) {
      restantes[0] = { ...restantes[0], principal: true };
    }
    onChange(restantes);
  }

  return (
    <div>
      <div className={reg.phoneHeader}>
        <span className={reg.label}>
          <span>
            Teléfonos de contacto <span className={reg.required}>*</span>
          </span>
        </span>
        <div className={reg.phoneMeta}>
          <span>Puedes agregar hasta {MAX_TELEFONOS} teléfonos.</span>
          {phones.length < MAX_TELEFONOS && (
            <button type="button" className={reg.addPhoneBtn} onClick={agregar}>
              + Agregar otro teléfono
            </button>
          )}
        </div>
      </div>

      {phones.map((phone, idx) => (
        <div key={phone.clave} className={reg.phoneItem}>
          <div className={reg.phoneRow}>
            <div className={reg.phoneInputWrap}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Número de teléfono"
                value={phone.number}
                onChange={(e) => cambiarNumero(idx, e.target.value)}
                maxLength={10}
                aria-label={`Número de teléfono ${idx + 1}`}
                className={errores[idx] ? reg.inputInvalid : undefined}
                aria-invalid={Boolean(errores[idx])}
              />
            </div>

            {phones.length > 1 && (
              <label className={reg.phonePrincipalLabel} title="Marcar como teléfono principal">
                <input
                  type="radio"
                  name="principalPhone"
                  checked={phone.principal}
                  onChange={() => marcarPrincipal(idx)}
                  className={reg.phoneRadio}
                />
                <span>Principal</span>
              </label>
            )}

            {phones.length > 1 && (
              <button
                type="button"
                className={reg.removePhoneBtn}
                onClick={() => quitar(idx)}
                aria-label={`Eliminar teléfono ${idx + 1}`}
                title="Eliminar teléfono"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {errores[idx] && (
            <span className={`${reg.fieldError} ${reg.phoneError}`}>{errores[idx]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default PhoneList;