import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { ROLES_AGREGABLES } from '../config';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import Skeleton from './Skeleton';
import ProfileHeader from './ProfileHeader';
import ContactCard from './ContactCard';
import RoleSections from './RoleSections';
import Icon from './Icon';
import styles from './ProfileView.module.css';

function ProfileView() {
  const { id } = useParams();
  const esPropio = !id;
  const { perfil, cargando, error, agregarRol } = useProfile(id);
  const [rolGuardando, setRolGuardando] = useState(null);
  const [rolAgregado, setRolAgregado] = useState(null);
  const [errorRol, setErrorRol] = useState(null);
  const navigate = useNavigate();

  async function activarRol(rol) {
    setErrorRol(null);
    setRolGuardando(rol);
    try {
      await agregarRol(rol);
      setRolAgregado(rol);
    } catch (e) {
      setErrorRol(e.message);
    } finally {
      setRolGuardando(null);
    }
  }

  // El token viejo no trae el rol nuevo: hay que volver a iniciar sesión
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
  const rolesFaltantes = esPropio && !esAdmin
      ? Object.keys(ROLES_AGREGABLES).filter((r) => !roles.includes(r))
      : [];
  // El perfil público solo devuelve cuentas activas
  const activo = !esPropio || perfil.accountStatus === 'ACTIVE';

  return (
      <section className={styles.page}>
        <div className={styles.top}>
          <ProfileHeader
              nombre={perfil.name}
              roles={roles}
              activo={activo}
              esPropio={esPropio}
              userId={perfil.id}
          />
          {esPropio && (
              <div className={styles.actions}>
                {rolesFaltantes.map((rol) => (
                    <Button
                        key={rol}
                        type="button"
                        variant="secondary"
                        onClick={() => activarRol(rol)}
                        disabled={rolGuardando !== null}
                    >
                <span className={styles.btnContent}>
                  <Icon name="plus" />
                  {rolGuardando === rol ? 'Guardando...' : ROLES_AGREGABLES[rol].boton}
                </span>
                    </Button>
                ))}
                <Button type="button" variant="secondary" onClick={() => navigate('/users/me/edit')}>
              <span className={styles.btnContent}>
                <Icon name="edit" />
                Editar perfil
              </span>
                </Button>
              </div>
          )}
        </div>

        {rolAgregado && (
            <div className={styles.success}>
              <span className={styles.successIcon}>✓</span>
              <p>
                <strong>{ROLES_AGREGABLES[rolAgregado].agregado}</strong> {ROLES_AGREGABLES[rolAgregado].detalle}
              </p>
              {rolAgregado === 'TRABAJADOR' && (
                  <Button type="button" onClick={irAlLogin}>Iniciar sesión</Button>
              )}
            </div>
        )}
        <ErrorMessage error={errorRol} />

        {/* Contacto a la izquierda; a la derecha, accesos a Trabajadores, Servicios o Administración según los roles */}
        {esPropio && (
            <div className={styles.layout}>
              <aside>
                <ContactCard
                    email={perfil.email}
                    phones={perfil.phones ?? []}
                    birthDate={perfil.birthDate}
                    nota="Datos protegidos. Solo administración puede consultarlos completos."
                />
              </aside>
              <RoleSections roles={roles} />
            </div>
        )}
      </section>
  );
}

export default ProfileView;