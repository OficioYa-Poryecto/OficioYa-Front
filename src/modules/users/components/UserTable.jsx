import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from './Skeleton';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { NOMBRES_ROL } from '../config';
import { getProfilePhotoUrl } from '../../core/lib/imageService';
import { getSession } from '../../core/lib/session';
import styles from './UserTable.module.css';
import vista from './ProfileView.module.css';

const FILTROS = [
    { id: 'TODOS', label: 'Todas' },
    { id: 'ACTIVE', label: 'Activas' },
    { id: 'INACTIVE', label: 'Inactivas' },
];

const POR_PAGINA = 10;

// Fotos ya cargadas, para no volver a pedirlas al regresar a una página
const fotosCargadas = new Map();

// Si se elimina o cambia una foto (detalle del admin o edición del perfil), se vuelven a pedir
window.addEventListener('oy-profile-updated', () => fotosCargadas.clear());

function UserTable() {
    const { users, loading, error } = useAdminUsers();
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('TODOS');
    const [pagina, setPagina] = useState(1);

    const activas = users.filter((u) => u.accountStatus === 'ACTIVE').length;
    const inactivas = users.length - activas;
    const texto = busqueda.trim().toLowerCase();
    const visibles = users.filter((u) =>
        (filtro === 'TODOS' || u.accountStatus === filtro)
        && (texto === '' || u.name.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto)));
    const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));
    const actual = Math.min(pagina, totalPaginas);
    const inicio = (actual - 1) * POR_PAGINA;
    const enPagina = visibles.slice(inicio, inicio + POR_PAGINA);

    return (
        <section className={vista.page}>
            <div>
                <span className="eyebrow">Panel de administración</span>
                <h1 className={vista.name}>
                    Gestión de <span className={vista.accent}>usuarios</span>
                </h1>
                <p>Consulta las cuentas y activa o desactiva las que lo necesiten.</p>
            </div>

            {!loading && !error && (
                <div className={styles.summary}>
                    <Resumen titulo="Cuentas registradas" valor={users.length} />
                    <Resumen titulo="Activas" valor={activas} detalle={porcentaje(activas, users.length)} />
                    <Resumen titulo="Inactivas" valor={inactivas} detalle={porcentaje(inactivas, users.length)} alerta />
                </div>
            )}

            <div className="card">
                <div className={styles.toolbar}>
                    <input
                        type="search"
                        aria-label="Buscar usuario"
                        placeholder="Buscar por nombre o correo"
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPagina(1);
                        }}
                    />
                    <div className={styles.filters} role="group" aria-label="Filtrar por estado">
                        {FILTROS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={filtro === f.id ? styles.filterActive : styles.filter}
                                onClick={() => {
                                    setFiltro(f.id);
                                    setPagina(1);
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {(loading || error) && <Skeleton lines={5} error={error} />}
                {!loading && !error && visibles.length === 0 && (
                    <p>{users.length === 0 ? 'No hay usuarios registrados.' : 'Ninguna cuenta coincide con la búsqueda.'}</p>
                )}

                {visibles.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {enPagina.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.usuario}>
                                        <Avatar key={`${user.id}-${actual}`} userId={user.id} nombre={user.name} />
                                        <div>
                                            <strong>{user.name}</strong>
                                            <small className={styles.roles}>{user.roles.map((r) => NOMBRES_ROL[r] ?? r).join(' · ')}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{enmascararCorreo(user.email)}</td>
                                <td>
                    <span className={user.accountStatus === 'ACTIVE' ? styles.pillActive : styles.pillInactive}>
                      {user.accountStatus === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                    </span>
                                </td>
                                <td>
                                    <Link to={`/admin/users/${user.id}`} className={styles.link}>Revisar</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {visibles.length > POR_PAGINA && (
                    <div className={styles.pagination}>
                        <small>
                            Mostrando {inicio + 1}-{inicio + enPagina.length} de {visibles.length}
                        </small>
                        <div className={styles.filters}>
                            <button
                                type="button"
                                className={styles.filter}
                                onClick={() => setPagina(actual - 1)}
                                disabled={actual === 1}
                            >
                                Anterior
                            </button>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={n === actual ? styles.filterActive : styles.filter}
                                    onClick={() => setPagina(n)}
                                    aria-current={n === actual ? 'page' : undefined}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={styles.filter}
                                onClick={() => setPagina(actual + 1)}
                                disabled={actual === totalPaginas}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

// Foto de perfil del usuario (o sus iniciales si no tiene), igual que en ProfileHeader
function Avatar({ userId, nombre }) {
    const [foto, setFoto] = useState(fotosCargadas.get(userId) ?? null);
    const partes = (nombre || 'Usuario').trim().split(/\s+/);
    const iniciales = (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : partes[0][1] ?? '')).toUpperCase();

    useEffect(() => {
        if (fotosCargadas.has(userId)) return;
        let activo = true;
        getProfilePhotoUrl(userId, getSession()?.token).then((url) => {
            if (url) fotosCargadas.set(userId, url);
            if (activo) setFoto(url);
        });
        return () => {
            activo = false;
        };
    }, [userId]);

    function fallo() {
        fotosCargadas.delete(userId);
        setFoto(null);
    }

    return (
        <span className={styles.avatar}>
            {foto ? <img src={foto} alt="" onError={fallo} /> : iniciales}
        </span>
    );
}

function Resumen({ titulo, valor, detalle, alerta }) {
    return (
        <div className={`card ${styles.summaryCard}`}>
            <small>{titulo}</small>
            <strong>{valor}</strong>
            {detalle && <span className={alerta ? styles.detailAlert : styles.detail}>{detalle}</span>}
        </div>
    );
}

function porcentaje(parte, total) {
    return total === 0 ? '0 %' : `${Math.round((parte * 100) / total)} %`;
}

function enmascararCorreo(correo) {
    return '*****' + correo.slice(correo.indexOf('@'));
}

export default UserTable;