import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import Skeleton from './Skeleton';
import styles from './Form.module.css';
import detail from './UserDetail.module.css';

// Invitación para cada rol que el usuario todavía no tiene
const INVITACIONES = {
  TRABAJADOR: {
    pregunta: '¿Ofreces algún oficio?',
    texto: 'Activa tu perfil de trabajador para recibir solicitudes de servicio.',
    boton: 'Quiero ser trabajador',
  },
  CONTRATANTE: {
    pregunta: '¿Necesitas contratar un servicio?',
    texto: 'Activa tu perfil de contratante para buscar y contratar trabajadores.',
    boton: 'Quiero contratar servicios',
  },
};

function ProfileView() {
  const { id } = useParams();
  const esPropio = !id;
  const { perfil, cargando, error, agregarRol } = useProfile(id);
  const [rolGuardando, setRolGuardando] = useState(null);
  const [errorRol, setErrorRol] = useState(null);
  const [debeReingresar, setDebeReingresar] = useState(false);
  const navigate = useNavigate();

  async function activarRol(rol) {
    setErrorRol(null);
    setRolGuardando(rol);
    try {
      await agregarRol(rol);
      if (rol === 'TRABAJADOR') {
        setDebeReingresar(true);
      }
    } catch (e) {
      setErrorRol(e.message);
    } finally {
      setRolGuardando(null);
    }
  }

  function irAlLogin() {
    localStorage.removeItem('oy_token');
    navigate('/auth');
  }

  if (cargando || error) {
    return (
      <section className={`card ${styles.page}`}>
        <span className="eyebrow">{esPropio ? 'Mi perfil' : 'Perfil público'}</span>
        <Skeleton lines={3} error={error} />
      </section>
    );
  }

  const roles = perfil.roles ?? [];
  const esAdmin = roles.includes('ADMIN');
  const rolesFaltantes = Object.keys(INVITACIONES).filter((r) => !roles.includes(r));

  return (
    <section className={`card ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">{esPropio ? 'Mi perfil' : 'Perfil público'}</span>
          <h1>{perfil.name}</h1>
        </div>
        {esPropio && (
          <Button type="button" variant="secondary" onClick={() => navigate('/users/me/edit')}>
            Editar perfil
          </Button>
        )}
      </div>

      <dl className={detail.data}>
        <dt>Roles</dt>
        <dd>{roles.join(', ')}</dd>
        {esPropio && (
          <>
            <dt>Correo</dt>
            <dd>{perfil.email}</dd>
            <dt>Teléfono principal</dt>
            <dd>{perfil.phones?.find((p) => p.principal)?.number ?? 'Sin teléfono'}</dd>
            <dt>Teléfonos adicionales</dt>
            <dd>
              {perfil.phones?.some((p) => !p.principal)
                ? perfil.phones.filter((p) => !p.principal).map((p) => <div key={p.id}>{p.number}</div>)
                : 'Sin teléfonos adicionales'}
            </dd>
          </>
        )}
      </dl>

      {esPropio && debeReingresar && (
        <div className={styles.invite}>
          <h3>Ya tienes el rol de trabajador</h3>
          <p className={styles.note}>Inicia sesión de nuevo para completar tu perfil de trabajador.</p>
          <div className={styles.actions}>
            <Button type="button" onClick={irAlLogin}>Iniciar sesión</Button>
          </div>
        </div>
      )}

      {esPropio && !esAdmin && rolesFaltantes.map((rol) => (
        <div key={rol} className={styles.invite}>
          <h3>{INVITACIONES[rol].pregunta}</h3>
          <p className={styles.note}>{INVITACIONES[rol].texto}</p>
          <div className={styles.actions}>
            <Button type="button" onClick={() => activarRol(rol)} disabled={rolGuardando !== null}>
              {rolGuardando === rol ? 'Guardando...' : INVITACIONES[rol].boton}
            </Button>
          </div>
        </div>
      ))}
      <ErrorMessage error={errorRol} />
    </section>
  );
}

export default ProfileView;
