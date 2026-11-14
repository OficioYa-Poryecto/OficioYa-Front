import { useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from './Skeleton';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { NOMBRES_ROL } from '../config';
import styles from './UserTable.module.css';
import vista from './ProfileView.module.css';

const FILTROS = [
    { id: 'TODOS', label: 'Todas' },
    { id: 'ACTIVE', label: 'Activas' },
    { id: 'INACTIVE', label: 'Inactivas' },
];

function UserTable() {
    const { users, loading, error } = useAdminUsers();
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('TODOS');

    const activas = users.filter((u) => u.accountStatus === 'ACTIVE').length;
    const inactivas = users.length - activas;
    const texto = busqueda.trim().toLowerCase();
    const visibles = users.filter((u) =>
        (filtro === 'TODOS' || u.accountStatus === filtro)
        && (texto === '' || u.name.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto)));

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
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <div className={styles.filters} role="group" aria-label="Filtrar por estado">
                        {FILTROS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={filtro === f.id ? styles.filterActive : styles.filter}
                                onClick={() => setFiltro(f.id)}
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
                        {visibles.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <strong>{user.name}</strong>
                                    <small className={styles.roles}>{user.roles.map((r) => NOMBRES_ROL[r] ?? r).join(' · ')}</small>
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
            </div>
        </section>
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

// En el listado el correo se oculta; completo solo en el detalle
function enmascararCorreo(correo) {
    return '*****' + correo.slice(correo.indexOf('@'));
}

export default UserTable;