import { useEffect, useState } from 'react';
import { getProfilePhotoUrl } from '../../core/lib/imageService';
import { getSession } from '../../core/lib/session';
import { NOMBRES_ROL } from '../config';
import styles from './ProfileView.module.css';
import Icon from './Icon';
const ICONO_ROL = { CONTRATANTE: 'user', TRABAJADOR: 'wrench', ADMIN: 'shield' };

// Avatar con iniciales (o foto de perfil), estado, nombre con el apellido resaltado e insignias de rol.
// Lo usan el perfil (ProfileView), la edición (ProfileForm) y el detalle del admin (UserDetail).
function ProfileHeader({ nombre, roles, activo, esPropio, etiqueta, userId, avatarUrl, children }) {
  const [loadedPhotoUrl, setLoadedPhotoUrl] = useState(null);
  const partes = (nombre || 'Usuario').trim().split(/\s+/);
  const resaltado = partes.length > 1 ? partes.pop() : null;
  const iniciales = (partes[0][0] + (resaltado ?? partes[0][1] ?? '')[0]).toUpperCase();

  useEffect(() => {
    if (!userId) return;
    function syncPhoto() {
      const session = getSession();
      getProfilePhotoUrl(userId, session?.token).then((url) => {
        setLoadedPhotoUrl(url);
      });
    }
    syncPhoto();
    window.addEventListener('oy-profile-updated', syncPhoto);
    return () => window.removeEventListener('oy-profile-updated', syncPhoto);
  }, [userId]);

  const finalPhotoUrl = avatarUrl || loadedPhotoUrl;

  return (
    <div className={styles.hero}>
      <span className={styles.avatar}>
        {finalPhotoUrl ? (
          <img src={finalPhotoUrl} alt={nombre} className={styles.avatarImg} />
        ) : (
          iniciales
        )}
      </span>
      <div>
        <div className={styles.headerTop}>
          <span className={`eyebrow ${styles.etiqueta}`}>{etiqueta ?? (esPropio ? 'Mi perfil' : 'Perfil público')}</span>
          {activo && (
            <div className={styles.online}>
              <span /> Perfil activo
            </div>
          )}
        </div>
        <h1 className={styles.name}>
          {partes.join(' ')} {resaltado && <span className={styles.accent}>{resaltado}</span>}
        </h1>
        {children}
        <div className={styles.badges}>
          {roles.map((rol, i) => (
            <span key={rol} className={i > 0 ? styles.badgeNeutral : styles.badge}>
              <Icon name={ICONO_ROL[rol] ?? 'user'} size={14} /> {NOMBRES_ROL[rol] ?? rol}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;