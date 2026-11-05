import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneFields from '../../core/components/PhoneFields';
import PhotoUploader from '../../core/components/PhotoUploader';
import Boton from '../../core/design-system/Boton';
import Field from '../../core/design-system/Field';
import FormSection from '../../core/design-system/FormSection';
import Icon from '../../core/design-system/Icon';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import styles from './auth.module.css';

const PASSWORD_RULES = [
  '12 caracteres',
  'Una mayúscula',
  'Una minúscula',
  'Un número',
  'Un carácter especial',
];

function RegistroPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className={`${ui.page} ${styles.pageCentered}`}>
        <section className={styles.successCard}>
          <span className={styles.successIcon}><Icon name="check" size={32} /></span>
          <p className="eyebrow">Todo listo</p>
          <h1>¡Tu cuenta está lista!</h1>
          <p>Tu perfil de contratante fue creado. Ya puedes empezar a usar OficioYa.</p>
          <Boton onClick={() => navigate('/contratante/perfil')}>Ver mi perfil</Boton>
        </section>
      </div>
    );
  }

  return (
    <div className={`${ui.page} ${styles.registerPage}`}>
      <div className={styles.pageHeading}>
        <p className="eyebrow">Crea tu cuenta</p>
        <h1>Regístrate como contratante</h1>
        <p>Completa tus datos en pocos minutos. Sin vueltas, como debe ser.</p>
      </div>
      <section className={ui.formCard}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>1</span>
          <div>
            <h2>Arma tu perfil de contratante</h2>
            <p>Completa tus datos para solicitar servicios con confianza.</p>
          </div>
        </div>

        <FormSection title="Tus datos">
          <div className={ui.formGrid}>
            <Field label="Nombre completo" placeholder="Escribe tu nombre completo" />
            <Field label="Correo electrónico" placeholder="tu@correo.com" type="email" />
            <PhoneFields />
          </div>
        </FormSection>

        <FormSection title="Seguridad">
          <div className={styles.passwordLayout}>
            <Field
              label="Crea una contraseña"
              placeholder="Escribe una contraseña segura"
              type="password"
            />
            <div className={styles.requirements}>
              <strong>Tu contraseña debe tener:</strong>
              <div className={styles.requirementsGrid}>
                {PASSWORD_RULES.map((rule) => (
                  <span key={rule}><Icon name="check" size={13} /> {rule}</span>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Foto de perfil">
          <PhotoUploader />
        </FormSection>

        <StatusMessage variant="warning">
          <strong>Revisa el correo.</strong> Parece que ya existe una cuenta con esa dirección.
        </StatusMessage>
        <div className={ui.formActions}>
          <Boton onClick={() => navigate('/acceso')} variant="ghost">Volver</Boton>
          <Boton onClick={() => setSaved(true)}>Crear mi cuenta</Boton>
        </div>
      </section>
    </div>
  );
}

export default RegistroPage;
