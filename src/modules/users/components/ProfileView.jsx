import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';

const ROLES = ['CONTRATANTE', 'TRABAJADOR'];

function ProfileView() {
  const { id } = useParams();
  const esPropio = !id;
  const { perfil, cargando, error, agregarRol } = useProfile(id);
  const [rol, setRol] = useState('');
  const [errorRol, setErrorRol] = useState(null);

  async function manejarAgregarRol(evento) {
    evento.preventDefault();
    setErrorRol(null);
    try {
      await agregarRol(rol);
      setRol('');
    } catch (e) {
      setErrorRol(e.message);
    }
  }

  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const rolesDisponibles = ROLES.filter((r) => !perfil.roles?.includes(r));

  return (
    <section className="card" style={{ maxWidth: 480, display: 'grid', gap: 8 }}>
      <h1>{perfil.name}</h1>
      <p>Roles: {perfil.roles?.join(', ')}</p>

      {esPropio && (
        <>
          <p>Correo: {perfil.email}</p>
          <p>Teléfonos: {perfil.phones?.map((p) => p.number).join(', ') || 'Sin teléfono'}</p>
          <Link to="/users/me/edit">Editar perfil</Link>

          {rolesDisponibles.length > 0 && (
            <form onSubmit={manejarAgregarRol} style={{ display: 'grid', gap: 8 }}>
              <label>
                Agregar rol
                <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                  <option value="">Seleccione...</option>
                  {rolesDisponibles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <ErrorMessage error={errorRol} />
              <Button type="submit">Agregar</Button>
            </form>
          )}
        </>
      )}
    </section>
  );
}

export default ProfileView;
