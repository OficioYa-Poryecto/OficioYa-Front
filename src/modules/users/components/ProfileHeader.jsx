import { NOMBRES_ROL } from '../config';
import styles from './ProfileView.module.css';

// Avatar con iniciales, estado, nombre con el apellido resaltado e insignias de rol.
// Lo usan el perfil (ProfileView), la edición (ProfileForm) y el detalle del admin (UserDetail).
function ProfileHeader({ nombre, roles, activo, esPropio, etiqueta }) {
  const partes = nombre.trim().split(/\s+/);
  const resaltado = partes.length > 1 ? partes.pop() : null;
  const iniciales = (partes[0][0] + (resaltado ?? partes[0][1] ?? '')[0]).toUpperCase();

  return (
      <div className={styles.hero}>
        <span className={styles.avatar}>{iniciales}</span>
        <div>
          <span className="eyebrow">{etiqueta ?? (esPropio ? 'Mi perfil' : 'Perfil público')}</span>
          {activo && (
              <div className={styles.online}>
                <span /> Perfil activo
              </div>
          )}
          <h1 className={styles.name}>
            {partes.join(' ')} {resaltado && <span className={styles.accent}>{resaltado}</span>}
          </h1>
          <div className={styles.badges}>
            {roles.map((rol, i) => (
                <span key={rol} className={i > 0 ? styles.badgeNeutral : styles.badge}>
              {NOMBRES_ROL[rol] ?? rol}
            </span>
            ))}
          </div>
        </div>
      </div>
  );
}

export default ProfileHeader;