
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
    <section className="card">
        <h1>Página no encontrada</h1>
        <p>La ruta que buscas no existe.</p>
        <Link to="/">Volver al inicio</Link>
    </section>
    );
}

export default NotFoundPage;