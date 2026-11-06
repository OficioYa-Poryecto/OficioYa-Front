import Icon from '../design-system/Icon';
import ui from '../design-system/ui.module.css';

const ROLE_ICONS = { Trabajador: 'wrench', Administrador: 'shield' };

function ProfileHero({ editing = false, initials, name, roles }) {
  return (
    <div className={ui.profileHero}>
      <div className={ui.profileAvatarWrap}>
        <span className={`${ui.avatar} ${ui.avatarProfile}`}>{initials}</span>
        {editing && (
          <button aria-label="Cambiar foto" type="button">
            <Icon name="edit" size={15} />
          </button>
        )}
      </div>
      <div className={ui.profileTitle}>
        <div className={ui.onlineLine}><span /> Perfil activo</div>
        <h1>{name}</h1>
        <div className={ui.badges}>
          {roles.map((role, index) => (
            <span className={index > 0 ? ui.badgeNeutral : ''} key={role}>
              <Icon name={ROLE_ICONS[role] ?? 'user'} size={14} />
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHero;
