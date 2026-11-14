import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { MAX_TELEFONOS, validarTelefono } from '../config';
import styles from './Form.module.css';

const NUEVO = 'nuevo';

// Teléfonos del perfil propio. Cada cambio se guarda al momento.
function PhoneList({ phones, onAgregar, onCambiar, onEliminar }) {
  const [editando, setEditando] = useState(null); // id del teléfono que se cambia o NUEVO
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState(null);

  async function ejecutar(accion) {
    setError(null);
    setOcupado(true);
    try {
      await accion();
      setEditando(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado(false);
    }
  }

  const principal = phones.find((phone) => phone.principal);
  const adicionales = phones.filter((phone) => !phone.principal);

  // Fuera de edición el número se ve enmascarado; al darle "Cambiar" se edita completo
  function fila(phone) {
    if (editando === phone.id) {
      return (
          <NumeroForm
              key={phone.id}
              etiqueta={phone.principal ? 'Teléfono principal' : 'Teléfono alterno'}
              valorInicial={phone.number}
              ocupado={ocupado}
              onGuardar={(numero) => ejecutar(() => onCambiar(phone.id, numero))}
              onCancelar={() => setEditando(null)}
          />
      );
    }
    return (
        <div key={phone.id} className={`${styles.phoneRow} ${styles.compact}`}>
          <span>{enmascarar(phone.number)}</span>
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => setEditando(phone.id)} disabled={ocupado}>
              Modificar
            </Button>
            {!phone.principal && (
                <Button type="button" variant="secondary" onClick={() => ejecutar(() => onEliminar(phone.id))} disabled={ocupado}>
                  Eliminar
                </Button>
            )}
          </div>
        </div>
    );
  }

  return (
      <div className={styles.form}>
        <div className={styles.field}>
        <span className={styles.label}>
          Teléfono principal<span className={styles.required}>*</span>
        </span>
          {principal && fila(principal)}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Teléfonos alternos</span>
          {adicionales.map(fila)}
          {adicionales.length === 0 && editando !== NUEVO && <p className={styles.note}>Sin teléfonos alternos</p>}
          {editando === NUEVO && (
              <NumeroForm
                  etiqueta="Teléfono alterno"
                  valorInicial=""
                  ocupado={ocupado}
                  onGuardar={(numero) => ejecutar(() => onAgregar(numero))}
                  onCancelar={() => setEditando(null)}
              />
          )}
          {phones.length >= MAX_TELEFONOS && <p className={styles.note}>Máximo {MAX_TELEFONOS} teléfonos</p>}
          {editando !== NUEVO && phones.length < MAX_TELEFONOS && (
              <div className={`${styles.actions} ${styles.compact}`}>
                <Button type="button" variant="secondary" onClick={() => setEditando(NUEVO)} disabled={ocupado}>
                  + Agregar teléfono
                </Button>
              </div>
          )}
        </div>
        <ErrorMessage error={error} />
      </div>
  );
}

function enmascarar(numero) {
  const visibles = Math.min(4, numero.length);
  return '*'.repeat(numero.length - visibles) + numero.slice(-visibles);
}

function NumeroForm({ etiqueta, valorInicial, ocupado, onGuardar, onCancelar }) {
  const [numero, setNumero] = useState(valorInicial);
  const [tocado, setTocado] = useState(false);
  const error = validarTelefono(numero);

  function enviar(evento) {
    evento.preventDefault();
    setTocado(true);
    if (!error) {
      onGuardar(numero);
    }
  }

  return (
      <form onSubmit={enviar} className={styles.field} noValidate>
        <div className={`${styles.phoneRow} ${styles.compact}`}>
          <input
              aria-label={etiqueta}
              type="tel"
              inputMode="numeric"
              placeholder="Número de teléfono"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                setTocado(true);
              }}
              maxLength={10}
              autoFocus
          />
          <div className={styles.actions}>
            <Button type="submit" disabled={ocupado}>{ocupado ? 'Guardando...' : 'Guardar'}</Button>
            <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
          </div>
        </div>
        {tocado && error && <p className={styles.fieldError}>{error}</p>}
      </form>
  );
}

export default PhoneList;