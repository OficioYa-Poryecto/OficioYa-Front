import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';

function ProfileForm() {
  const { perfil, cargando, error, actualizar } = useProfile();

  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <Formulario perfil={perfil} onGuardar={actualizar} />;
}

function Formulario({ perfil, onGuardar }) {
  const [name, setName] = useState(perfil.name ?? '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const phones = phone ? [{ number: phone, principal: true }] : undefined;
      await onGuardar({ name, phones });
      navigate('/users/me');
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} style={{ maxWidth: 480, display: 'grid', gap: 12 }}>
      <h1>Editar perfil</h1>
      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Nuevo teléfono (opcional)
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <ErrorMessage error={error} />
      <Button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </Button>
      <Button type="button" variant="secondary" onClick={() => navigate('/users/me')}>
        Cancelar
      </Button>
    </form>
  );
}

export default ProfileForm;