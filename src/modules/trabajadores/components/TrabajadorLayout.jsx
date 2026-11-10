import styles from './TrabajadorLayout.module.css';

// Contenedor de las pantallas del trabajador. Las secciones ya no van en una barra
// lateral: están en el desplegable de "Mi cuenta" del Navbar (ver routes.jsx).
function TrabajadorLayout({ children }) {
  return <div className={styles.content}>{children}</div>;
}

export default TrabajadorLayout;
