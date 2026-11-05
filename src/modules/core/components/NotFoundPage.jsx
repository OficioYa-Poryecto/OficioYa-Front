import { Link } from 'react-router-dom';
import ui from '../design-system/ui.module.css';

function NotFoundPage() {
  return (
    <div className={ui.page}>
      <section className="card">
        <h1>Página no encontrada</h1>
        <p>La ruta que buscas no existe.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
