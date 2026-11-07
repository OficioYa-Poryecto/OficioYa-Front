import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
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
  const [rolPendiente, setRolPendiente] = useState(null);
  const [errorRol, setErrorRol] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  async function confirmarRol() {
    setErrorRol(null);
    setGuardando(true);
    try {
      await agregarRol(rolPendiente);
      setRolPendiente(null);
    } catch (e) {
      setErrorRol(e.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const roles = perfil.roles ?? [];
  const esAdmin = roles.includes('ADMIN');
  const rolesFaltantes = Object.keys(INVITACIONES).filter((r) => !roles.includes(r));

  return (
    <section className={`card ${styles.page}`}>
      <span className="eyebrow">{esPropio ? 'Mi perfil' : 'Perfil público'}</span>
      <h1>{perfil.name}</h1>

      <dl className={detail.data}>
        <dt>Roles</dt>
        <dd>{roles.join(', ')}</dd>
        {esPropio && (
          <>
            <dt>Correo</dt>
            <dd>{perfil.email}</dd>
            <dt>Teléfonos</dt>
            <dd>{perfil.phones?.map((p) => p.number).join(', ') || 'Sin teléfono'}</dd>
          </>
        )}
      </dl>

      {esPropio && (
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={() => navigate('/users/me/edit')}>
            Editar perfil
          </Button>
        </div>
      )}

      {esPropio && !esAdmin && rolesFaltantes.map((rol) => (
        <div key={rol} className={styles.invite}>
          <h3>{INVITACIONES[rol].pregunta}</h3>
          <p className={styles.note}>{INVITACIONES[rol].texto}</p>
          {rolPendiente === rol ? (
            <div className={styles.actions}>
              <Button type="button" onClick={confirmarRol} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Confirmar'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setRolPendiente(null)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setRolPendiente(rol)}>
              {INVITACIONES[rol].boton}
            </Button>
          )}
        </div>
      ))}
      <ErrorMessage error={errorRol} />
    </section>
  );
}

export default ProfileView;
