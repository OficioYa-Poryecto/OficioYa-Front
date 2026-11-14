import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession, saveSession } from '../../core/lib/session';
import * as profileService from '../../users/services/profileService';
import styles from './HomePage.module.css';

/* ─── SVG Icons ─── */
function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function UserIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function normalizeRoles(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((r) => String(r).toUpperCase());
}

function getFirstName(fullName, fallback = 'Usuario') {
  if (!fullName || typeof fullName !== 'string') return fallback;
  const trimmed = fullName.trim();
  if (!trimmed) return fallback;
  return trimmed.split(/\s+/)[0];
}

export default function HomePage() {
  const session = getSession();
  const [roles, setRoles] = useState(() => normalizeRoles(session?.roles));
  const [profileName, setProfileName] = useState(() => localStorage.getItem('oy_userName') || '');
  const [addingRole, setAddingRole] = useState(false);

  useEffect(() => {
    let active = true;
    profileService
      .obtenerMiPerfil(session?.token)
      .then((data) => {
        if (!active || !data) return;
        if (data.name) {
          setProfileName(data.name);
          localStorage.setItem('oy_userName', data.name);
          window.dispatchEvent(new Event('oy-profile-updated'));
        }
        if (Array.isArray(data.roles) && data.roles.length > 0) {
          const normalized = normalizeRoles(data.roles);
          setRoles(normalized);
        }
      })
      .catch(() => {
        // Si falla la carga silenciosa del perfil, conservamos los roles de la sesión
      });
    return () => {
      active = false;
    };
  }, [session?.token]);

  const isAdmin = roles.includes('ADMIN');
  const isContratante = roles.includes('CONTRATANTE');
  const isTrabajador = roles.includes('TRABAJADOR');
  const isBoth = isContratante && isTrabajador;

  const firstName = getFirstName(
    profileName,
    isAdmin ? 'Laura' : isTrabajador && !isContratante ? 'Julián' : 'Ana'
  );

  async function handleAddContratanteRole() {
    if (addingRole) return;
    setAddingRole(true);
    try {
      const updated = await profileService.agregarRol('CONTRATANTE', session?.token);
      const nextRoles = normalizeRoles(
        updated?.roles?.length ? updated.roles : [...roles, 'CONTRATANTE']
      );
      setRoles(nextRoles);
      const current = getSession();
      if (current) {
        saveSession({
          token: current.token,
          userId: current.userId,
          roles: nextRoles,
        });
      }
    } catch {
      const nextRoles = Array.from(new Set([...roles, 'CONTRATANTE']));
      setRoles(nextRoles);
    } finally {
      setAddingRole(false);
    }
  }

  /* ─────────────────────────────────────────────────────────────────
   * 1. HOME ADMINISTRADOR
   * ───────────────────────────────────────────────────────────────── */
  if (isAdmin) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrowPill}>PANEL DE ADMINISTRACIÓN</span>
            <h1 className={styles.heroTitle}>Hola, {firstName}</h1>
            <p className={styles.heroSubtitle}>Esto es lo que necesita atención hoy.</p>
            <span className={styles.adminBadgeInline}>
              <ShieldCheckIcon size={14} />
              Administrador
            </span>
          </div>
        </section>

        {/* KPIs */}
        <section className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconBox}>
              <UserIcon size={22} />
            </div>
            <div className={styles.kpiBody}>
              <span className={styles.kpiLabel}>Perfiles por verificar</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>18</span>
                <span className={styles.kpiNote}>+4 hoy</span>
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIconBox}>
              <ClipboardIcon />
            </div>
            <div className={styles.kpiBody}>
              <span className={styles.kpiLabel}>Reportes abiertos</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>7</span>
                <span className={styles.kpiNote}>2 prioritarios</span>
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIconBox}>
              <ShieldCheckIcon size={22} />
            </div>
            <div className={styles.kpiBody}>
              <span className={styles.kpiLabel}>Casos resueltos</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>126</span>
                <span className={styles.kpiNote}>Este mes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Acciones de Administración */}
        <section className={styles.grid3}>
          <Link to="/admin/users" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <UserIcon size={22} />
              </div>
              <h2 className={styles.cardTitle}>Verificar perfiles</h2>
              <p className={styles.cardDesc}>
                Revisa identidad y datos de nuevos trabajadores.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/maintenance" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <ClipboardIcon />
              </div>
              <h2 className={styles.cardTitle}>Gestionar reportes</h2>
              <p className={styles.cardDesc}>
                Atiende reseñas y perfiles reportados.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/admin/users" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <SearchIcon />
              </div>
              <h2 className={styles.cardTitle}>Buscar usuario</h2>
              <p className={styles.cardDesc}>
                Consulta los datos completos de cualquier cuenta.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>
        </section>

        {/* Casos prioritarios */}
        <section className={styles.priorityCard}>
          <div className={styles.priorityHeader}>
            <div className={styles.priorityTitleWrap}>
              <span className={styles.eyebrowPill}>URGENTE</span>
              <h2 className={styles.priorityTitle}>Casos prioritarios</h2>
            </div>
            <button type="button" className={styles.outlinePillBtn}>
              Ver cola completa
            </button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>MOTIVO</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={styles.userName}>Sandra Gómez</span>
                  <span className={styles.userRoleSub}>Contratante</span>
                </td>
                <td className={styles.reasonCell}>Reseña reportada</td>
                <td>
                  <span className={styles.badgePriority}>Prioritario</span>
                </td>
                <td>
                  <button type="button" className={styles.reviewAction}>
                    Revisar
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.userName}>Diego Ramírez</span>
                  <span className={styles.userRoleSub}>Trabajador · Electricista</span>
                </td>
                <td className={styles.reasonCell}>Verificar identidad</td>
                <td>
                  <span className={styles.badgePending}>Pendiente</span>
                </td>
                <td>
                  <button type="button" className={styles.reviewAction}>
                    Revisar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
   * 2. HOME CONTRATANTE + TRABAJADOR (AMBOS ROLES)
   * ───────────────────────────────────────────────────────────────── */
  if (isBoth) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrowPill}>INICIO</span>
            <h1 className={styles.heroTitle}>
              Hola, <span className={styles.heroNameHighlight}>{firstName}</span>
            </h1>
            <p className={styles.heroSubtitle}>¿Qué quieres hacer hoy?</p>
          </div>
          <div className={styles.roleBadges}>
            <span className={styles.roleBadgePrimary}>Contratante</span>
            <span className={styles.roleBadgeSecondary}>Trabajador</span>
          </div>
        </section>

        <section className={styles.grid4}>
          <Link to="/maintenance" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <SearchIcon />
              </div>
              <h2 className={styles.cardTitle}>Buscar un oficio</h2>
              <p className={styles.cardDesc}>
                Encuentra personas de confianza cerca de ti.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/maintenance" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <ClipboardIcon />
              </div>
              <h2 className={styles.cardTitle}>Mis servicios</h2>
              <p className={styles.cardDesc}>
                Revisa tus solicitudes y su estado.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/users/me" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <WrenchIcon />
              </div>
              <h2 className={styles.cardTitle}>Mi perfil de trabajo</h2>
              <p className={styles.cardDesc}>
                Así te ven quienes buscan tu oficio.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/maintenance" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <ClockIcon />
              </div>
              <h2 className={styles.cardTitle}>Disponibilidad</h2>
              <p className={styles.cardDesc}>
                Actualiza tus horarios de la semana.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>
        </section>

        <section className={styles.accountCard}>
          <div className={styles.accountInfo}>
            <span className={styles.eyebrowPill}>MI CUENTA</span>
            <h2 className={styles.accountTitle}>Tu perfil</h2>
            <p className={styles.accountDesc}>
              Revisa o actualiza tus datos personales, teléfonos y foto.
            </p>
          </div>
          <div className={styles.accountActions}>
            <Link to="/users/me" className={styles.outlinePillBtn}>
              <UserIcon size={17} />
              Ver mi perfil
            </Link>
            <Link to="/users/me/edit" className={styles.outlinePillBtn}>
              <EditIcon />
              Editar perfil
            </Link>
          </div>
        </section>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
   * 3. HOME SOLO TRABAJADOR
   * ───────────────────────────────────────────────────────────────── */
  if (isTrabajador) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrowPill}>INICIO</span>
            <h1 className={styles.heroTitle}>
              Hola, <span className={styles.heroNameHighlight}>{firstName}</span>
            </h1>
            <p className={styles.heroSubtitle}>¿Qué quieres hacer hoy?</p>
          </div>
          <div className={styles.roleBadges}>
            <span className={styles.roleBadgePrimary}>Trabajador</span>
          </div>
        </section>

        <section className={styles.grid2}>
          <Link to="/users/me" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <WrenchIcon />
              </div>
              <h2 className={styles.cardTitle}>Mi perfil de trabajo</h2>
              <p className={styles.cardDesc}>
                Así te ven quienes buscan tu oficio.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>

          <Link to="/maintenance" className={styles.actionCard}>
            <div>
              <div className={styles.iconBox}>
                <ClockIcon />
              </div>
              <h2 className={styles.cardTitle}>Disponibilidad</h2>
              <p className={styles.cardDesc}>
                Actualiza tus horarios de la semana.
              </p>
            </div>
            <span className={styles.cardLink}>
              Abrir <ChevronRightIcon />
            </span>
          </Link>
        </section>

        <section className={styles.upsellBanner}>
          <div className={styles.upsellLeft}>
            <div className={styles.upsellIconBox}>
              <SearchIcon />
            </div>
            <div>
              <h3 className={styles.upsellTitle}>
                ¿También necesitas contratar un servicio?
              </h3>
              <p className={styles.upsellDesc}>
                Agrega el rol de contratante y solicita trabajos con la misma cuenta.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.upsellBtn}
            onClick={handleAddContratanteRole}
            disabled={addingRole}
          >
            <span>+</span>
            <span>{addingRole ? 'Agregando...' : 'Agregar rol de contratante'}</span>
          </button>
        </section>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
   * 4. HOME SOLO CONTRATANTE (default)
   * ───────────────────────────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrowPill}>INICIO</span>
          <h1 className={styles.heroTitle}>
            Hola, <span className={styles.heroNameHighlight}>{firstName}</span>
          </h1>
          <p className={styles.heroSubtitle}>¿Qué quieres hacer hoy?</p>
        </div>
        <div className={styles.roleBadges}>
          <span className={styles.roleBadgePrimary}>Contratante</span>
        </div>
      </section>

      <section className={styles.grid2}>
        <Link to="/maintenance" className={styles.actionCard}>
          <div>
            <div className={styles.iconBox}>
              <SearchIcon />
            </div>
            <h2 className={styles.cardTitle}>Buscar un oficio</h2>
            <p className={styles.cardDesc}>
              Encuentra personas de confianza cerca de ti.
            </p>
          </div>
          <span className={styles.cardLink}>
            Abrir <ChevronRightIcon />
          </span>
        </Link>

        <Link to="/maintenance" className={styles.actionCard}>
          <div>
            <div className={styles.iconBox}>
              <ClipboardIcon />
            </div>
            <h2 className={styles.cardTitle}>Mis servicios</h2>
            <p className={styles.cardDesc}>
              Revisa tus solicitudes y su estado.
            </p>
          </div>
          <span className={styles.cardLink}>
            Abrir <ChevronRightIcon />
          </span>
        </Link>
      </section>
    </div>
  );
}

