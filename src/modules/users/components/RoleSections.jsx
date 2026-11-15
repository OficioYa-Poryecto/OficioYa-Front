import { Link } from 'react-router-dom';
import Icon from './Icon';
import styles from './ProfileView.module.css';

const SECCIONES = {
    TRABAJADOR: {
        eyebrow: 'Mi trabajo',
        titulo: 'Perfil de trabajador',
        texto: 'Oficio, tarifa, zona de cobertura, disponibilidad y galería de trabajos.',
        enlaces: [
            { to: '/worker/profile', icon: 'wrench', label: 'Ver mi perfil de trabajador' },
            { to: '/worker/availability', icon: 'clock', label: 'Disponibilidad' },
            { to: '/worker/gallery', icon: 'image', label: 'Galería' },
        ],
    },
    CONTRATANTE: {
        eyebrow: 'Mi actividad',
        titulo: 'Mis servicios',
        texto: 'Revisa tus solicitudes y su estado, o pide un servicio nuevo.',
        enlaces: [
            { to: '/solicitudes', icon: 'clipboard', label: 'Mis solicitudes' },
            { to: '/nueva-solicitud', icon: 'plus', label: 'Nueva solicitud' },
        ],
    },
    ADMIN: {
        eyebrow: 'Administración',
        titulo: 'Gestión de usuarios',
        texto: 'Consulta las cuentas y activa o desactiva las que lo necesiten.',
        enlaces: [
            { to: '/admin/users', icon: 'shield', label: 'Ir al listado de usuarios' },
        ],
    },
};

function RoleSections({ roles }) {
    const esAdmin = roles.includes('ADMIN');

    return (
        <div className={styles.content}>
            {Object.keys(SECCIONES).filter((rol) => roles.includes(rol)).map((rol) => {
                const seccion = SECCIONES[rol];
                return (
                    <section key={rol} className={`card ${styles.roleCard}`}>
                        <span className={styles.chip}>{seccion.eyebrow}</span>
                        <h2>{seccion.titulo}</h2>
                        <p className={styles.muted}>{seccion.texto}</p>
                        <div className={styles.links}>
                            {seccion.enlaces.map((enlace) => (
                                <Link key={enlace.to} to={enlace.to} className={styles.linkRow}>
                                    <span className={styles.icon}><Icon name={enlace.icon} /></span>
                                    <strong>{enlace.label}</strong>
                                    <Icon name="chevron" size={16} className={styles.chevron} />
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            <section className={`card ${styles.trust}`}>
                <span className={styles.icon}><Icon name="shield" size={20} /></span>
                <div>
                    {esAdmin ? (
                        <>
                            <h2>Datos bajo tu cuidado</h2>
                            <p className={styles.muted}>
                                Ves el correo y los teléfonos completos de todas las cuentas. Úsalos solo para tareas de administración.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>Tu privacidad va primero</h2>
                            <p className={styles.muted}>
                                Tu contacto y dirección exacta permanecen ocultos hasta que una solicitud sea aceptada.
                            </p>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default RoleSections;