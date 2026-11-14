import { useNavigate } from 'react-router-dom';
import Button from '../design-system/Button';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <section className="card">
            <h1>Página no encontrada</h1>
            <p>La ruta que buscas no existe.</p>
            <Button type="button" onClick={() => navigate('/')}>Volver al inicio</Button>
        </section>
    );
}

export default NotFoundPage;