import { useState } from 'react';
import ErrorMessage from '../../core/components/ErrorMessage';
import Button from '../../core/design-system/Button';
import { useRequests } from '../hooks/useRequests';
import { authService } from '../services/authService';
import { decodeRole } from '../services/jwt';
import { tokenStorage } from '../services/tokenStorage';
import RequestCard from './RequestCard';
import styles from './MisSolicitudesPage.module.css';

const FINAL_STATES = ['COMPLETED', 'CANCELED', 'REJECTED', 'EXPIRED'];

// Acciones disponibles según rol y estado de la solicitud.
function actionsFor(role, state) {
  const actions = [];
  if (role === 'TRABAJADOR') {
    if (state === 'PENDING') {
      actions.push({ key: 'accept', label: 'Aceptar' });
      actions.push({ key: 'reject', label: 'Rechazar', variant: 'secondary' });
    }
    if (state === 'ACCEPTED') {
      actions.push({ key: 'complete', label: 'Marcar cumplida' });
      actions.push({ key: 'cancel', label: 'Cancelar', variant: 'secondary' });
    }
  }
  if (role === 'CONTRATANTE') {
    if (state === 'CONFLICT') {
      actions.push({ key: 'acceptConflict', label: 'Elegir esta' });
    }
    if (['PENDING', 'ACCEPTED', 'CONFLICT'].includes(state)) {
      actions.push({ key: 'cancel', label: 'Cancelar', variant: 'secondary' });
    }
    if (FINAL_STATES.includes(state)) {
      actions.push({ key: 'remove', label: 'Eliminar', variant: 'secondary' });
    }
  }
  return actions;
}

function LoginPanel({ onToken }) {
  const [pasted, setPasted] = useState('');
  const [error, setError] = useState('');

  const loginDemo = async () => {
    setError('');
    try {
      const data = await authService.login('demo@oficioya.com', 'demo');
      onToken(data.accessToken);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>Mis solicitudes</p>
      <h1>Inicia sesión de prueba</h1>
      <p>El login del back es provisional. Entra como contratante de prueba o pega un token.</p>
      <Button onClick={loginDemo}>Entrar como contratante de prueba</Button>
      <label>
        O pega un token JWT
        <textarea rows={3} value={pasted} onChange={(e) => setPasted(e.target.value)} />
      </label>
      <Button variant="secondary" disabled={!pasted.trim()} onClick={() => onToken(pasted.trim())}>
        Usar este token
      </Button>
      <ErrorMessage error={error} />
    </section>
  );
}

function RequestsList({ token, onLogout }) {
  const { requests, loading, error, act } = useRequests(token);
  const role = decodeRole(token);

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Mis solicitudes</p>
          <h1>Solicitudes de servicio</h1>
          <span className={styles.role}>{role || 'Rol desconocido'}</span>
        </div>
        <Button variant="secondary" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </header>
      <ErrorMessage error={error} />
      {loading && <p>Cargando solicitudes…</p>}
      {!loading && !error && requests.length === 0 && (
        <p className={styles.empty}>No tienes solicitudes todavía.</p>
      )}
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          actions={actionsFor(role, request.state)}
          onAction={act}
        />
      ))}
    </section>
  );
}

function MisSolicitudesPage() {
  const [token, setToken] = useState(() => tokenStorage.get());

  const handleToken = (value) => {
    tokenStorage.set(value);
    setToken(value);
  };

  const handleLogout = () => {
    tokenStorage.clear();
    setToken('');
  };

  return (
    <div className={styles.page}>
      {token ? (
        <RequestsList key={token} token={token} onLogout={handleLogout} />
      ) : (
        <LoginPanel onToken={handleToken} />
      )}
    </div>
  );
}

export default MisSolicitudesPage;
